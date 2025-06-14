import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

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

  const openai = new OpenAI({ apiKey });

  const ext = path.extname(filePath).toLowerCase();
  const prompt = '与えられたファイルから、slidevでスライドを作成するためのmarkdownファイルを作成して';

  let response;
  if (ext === '.pdf') {
    const uploaded = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'assistants',
    });
    response = await openai.responses.create({
      model: 'o3',
      input: [
        { type: 'text', text: prompt },
        { type: 'file', file: { file_id: uploaded.id } },
      ],
    });
  } else {
    const text = fs.readFileSync(filePath, 'utf-8');
    response = await openai.responses.create({
      model: 'o3',
      input: `${prompt}\n\n${text}`,
    });
  }

  const markdown = (response as any).output_text ?? '';
  fs.writeFileSync('slides.md', markdown, 'utf-8');
  console.log('Generated slides saved to slides.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
