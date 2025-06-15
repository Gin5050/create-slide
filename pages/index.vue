<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const error = ref('')
const generating = ref(false)
const result = ref('')
const loading = ref(false)

const config = useRuntimeConfig()
const apiKey = config.OPENAI_API_KEY as string | undefined
if (!apiKey) {
  console.warn('OPENAI_API_KEY is not set in the runtime config')
}

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

async function uploadFile() {
  if (!file.value) return
  generating.value = true
  const form = new FormData()
  form.append('file', file.value)
  try {
    const res = await fetch('/api/generate', { method: 'POST', body: form })
    if (!res.ok) throw new Error('failed')
    const data = await res.json()
    result.value = data.markdown || ''
  } catch (err) {
    error.value = '生成に失敗しました'
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <div class="app">
    <h1>Create Slide</h1>
    <input type="file" accept=".pdf,.md,.txt" @change="handleFileChange" />
    <p v-if="file">選択されたファイル: {{ file.name }}</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <button :disabled="!file || generating" @click="uploadFile">アップロード</button>
    <pre v-if="result">{{ result }}</pre>
    <textarea v-if="result" v-model="result" rows="20" style="width: 100%; margin-top: 1rem;"></textarea>
  </div>
</template>

<style>
.app {
  padding: 2rem;
  font-family: sans-serif;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #09f;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-top: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
