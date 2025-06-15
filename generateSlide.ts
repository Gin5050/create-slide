import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.NITRO_OPENAI_API_KEY });

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

// Removed CLI entrypoint and guard. Use generateSlides() in server context only.
