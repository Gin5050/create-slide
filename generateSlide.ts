import fs from 'fs';
import path from 'path';

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx generateSlide.ts <file>');
    process.exit(1);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set');
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const prompt = '与えられたファイルから、slidevでスライドを作成するためのmarkdownファイルを作成して';
  let body: any;

  if (ext === '.pdf') {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('purpose', 'assistants');

    const uploadRes = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const upload = await uploadRes.json();
    body = {
      model: 'o3',
      input: [
        { type: 'text', text: prompt },
        { type: 'file', file: { file_id: upload.id } },
      ],
    };
  } else {
    const text = fs.readFileSync(filePath, 'utf-8');
    body = {
      model: 'o3',
      input: `${prompt}\n\n${text}`,
    };
  }

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  const markdown = data.output_text ?? '';
  fs.writeFileSync('slides.md', markdown, 'utf-8');
  console.log('Generated slides saved to slides.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
