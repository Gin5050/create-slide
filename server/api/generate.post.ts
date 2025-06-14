import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { generateSlides } from '../../generateSlide.ts'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'file is required' })
  }
  const file = formData.find((p) => p.name === 'file' && p.filename)
  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'file is required' })
  }

  const tempPath = path.join(tmpdir(), `${Date.now()}-${file.filename}`)
  await fs.writeFile(tempPath, file.data)
  try {
    const markdown = await generateSlides(tempPath)
    await fs.unlink(tempPath)
    return { markdown }
  } catch (err) {
    await fs.unlink(tempPath).catch(() => {})
    throw createError({ statusCode: 500, statusMessage: 'error generating slide' })
  }
})
