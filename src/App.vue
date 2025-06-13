<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const error = ref('')
const result = ref('')
const loading = ref(false)

const apiKey = import.meta.env.VITE_OPENAI_API_KEY

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) {
    file.value = null
    return
  }
  const selectedFile = files[0]
  const allowed = ['pdf', 'md', 'txt']
  const ext = selectedFile.name.split('.').pop()?.toLowerCase()
  if (ext && allowed.includes(ext)) {
    file.value = selectedFile
    error.value = ''
  } else {
    error.value = '対応していないファイル形式です。pdf, md, txt のみアップロードできます。'
    file.value = null
    target.value = ''
  }
}

async function generateSlide(): Promise<void> {
  if (!file.value) return
  if (!apiKey) {
    error.value = 'OPENAI_API_KEY が設定されていません'
    return
  }
  loading.value = true
  error.value = ''
  result.value = ''
  try {
    const ext = file.value.name.split('.').pop()?.toLowerCase()
    const prompt = '与えられたファイルから、slidevでスライドを作成するためのmarkdownファイルを作成して'
    if (ext === 'pdf') {
      const form = new FormData()
      form.append('file', file.value)
      form.append('purpose', 'assistants')

      const uploadRes = await fetch('https://api.openai.com/v1/files', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      })
      const upload = await uploadRes.json()
      const body = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'file', file: { file_id: upload.id } },
            ],
          },
        ],
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      result.value = data.choices?.[0]?.message?.content ?? ''
    } else {
      const text = await file.value.text()
      const body = {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\n${text}`,
          },
        ],
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      result.value = data.choices?.[0]?.message?.content ?? ''
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="app">
    <h1>Create Slide</h1>
    <input type="file" accept=".pdf,.md,.txt" @change="handleFileChange" />
    <p v-if="file">選択されたファイル: {{ file.name }}</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <button @click="generateSlide" :disabled="!file || loading">
      openaiでslidev用のファイルを作る
    </button>
    <textarea v-if="result" v-model="result" rows="20" style="width: 100%; margin-top: 1rem;"></textarea>
  </div>
</template>

<style>
.app {
  padding: 2rem;
  font-family: sans-serif;
}
</style>
