import fs from 'fs'
import path from 'path'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.NUXT_OPENAI_API_KEY })

export async function generateSlides(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase()
    const prompt = '与えられたファイルから、slidevでスライドを作成するためのmarkdownファイルを作成して'
    let messages: any

    if (ext === '.pdf') {
        const file = await openai.files.create({
            file: fs.createReadStream(filePath),
            purpose: 'assistants',
        })
        messages = [
            {
                role: 'system',
                content: 'あなたはslidev用のmarkdownを作成するためのアシスタントです。回答はそのまま編集、コピペできるようにslidev用のmarkdown以外のテキストは含めないでください。',
            },
            {
                role: 'user',
                content: [
                    { type: 'input_text', text: prompt },
                    { type: 'input_file', file_id: file.id },
                ],
            },
        ]
    } else {
        const text = fs.readFileSync(filePath, 'utf-8')
        messages = [
            {
                role: 'system',
                content: 'あなたはslidev用のmarkdownを作成するためのアシスタントです。回答はそのまま編集、コピペできるようにslidev用のmarkdown以外のテキストは含めないでください。',
            },
            {
                role: 'user',
                content: `${prompt}\n\n${text}`,
            },
        ]
    }

    const result = await openai.responses.create({
        model: 'o4-mini',
        input: messages,
    })

    return result.output_text ?? ''
}
