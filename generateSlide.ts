import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function generateSlides(filePath: string): Promise<string> {
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

  return completion.choices[0]?.message?.content ?? '';
}

async function main(): Promise<void> {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: npx tsx generateSlide.ts <file>');
    process.exit(1);
  }

  const markdown = await generateSlides(filePath);
  fs.writeFileSync('slides.md', markdown, 'utf-8');
  console.log('Generated slides saved to slides.md');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
