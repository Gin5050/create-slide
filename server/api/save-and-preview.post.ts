import { writeFileSync } from 'fs'
import { join } from 'path'
import { spawn } from 'child_process'

let slidevProcess: any = null
let previewPort = 3030

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { markdown } = body

        if (!markdown) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Markdown content is required'
            })
        }

        // slides.mdファイルを更新
        const slidesPath = join(process.cwd(), 'slides', 'slides.md')

        // Slidev用のフロントマターを追加（既存のフロントマターがある場合は保持）
        let slidevMarkdown = markdown

        if (!markdown.startsWith('---')) {
            slidevMarkdown = `---
theme: ./theme
---

${markdown}`
        }

        writeFileSync(slidesPath, slidevMarkdown, 'utf-8')

        // 既存のSlidevプロセスを停止
        if (slidevProcess) {
            slidevProcess.kill()
        }

        // 新しいSlidevプロセスを開始
        slidevProcess = spawn('npx', ['slidev', 'slides/slides.md', '--port', previewPort.toString()], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'ignore'
        })

        // プロセス開始を少し待つ
        await new Promise(resolve => setTimeout(resolve, 2000))

        return {
            success: true,
            previewUrl: `http://localhost:${previewPort}`,
            message: 'Slidev preview started successfully'
        }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to start Slidev preview: ' + errorMessage
        })
    }
})
