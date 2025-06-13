<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const error = ref('')

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
</script>

<template>
  <div class="app">
    <h1>Create Slide</h1>
    <input type="file" accept=".pdf,.md,.txt" @change="handleFileChange" />
    <p v-if="file">選択されたファイル: {{ file.name }}</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
  </div>
</template>

<style>
.app {
  padding: 2rem;
  font-family: sans-serif;
}
</style>
