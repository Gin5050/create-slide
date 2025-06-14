<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const error = ref('')
const generating = ref(false)
const result = ref('')

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
  </div>
</template>

<style>
.app {
  padding: 2rem;
  font-family: sans-serif;
}
</style>
