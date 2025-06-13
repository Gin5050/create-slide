import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI();

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx generateSlide.ts <file>');
    process.exit(1);
  }

  const ext = path.extname(filePath).toLowerCase();
  const prompt = '与えられたファイルから、slidevでスライドを作成するためのmarkdownファイルを作成して';
  let messages: any;

  if (ext === '.pdf') {
    const file = await openai.files.create({
      file: fs.createReadStream(filePath),
      purpose: 'assistants',
    });
    messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'file', file: { file_id: file.id } },
        ],
      },
    ];
  } else {
    const text = fs.readFileSync(filePath, 'utf-8');
    messages = [
      {
        role: 'user',
        content: `${prompt}\n\n${text}`,
      },
    ];
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
  });

  const markdown = completion.choices[0]?.message?.content ?? '';
  fs.writeFileSync('slides.md', markdown, 'utf-8');
  console.log('Generated slides saved to slides.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
