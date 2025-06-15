<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const error = ref('')
const generating = ref(false)
const result = ref('')
const loading = ref(false)
const showPreview = ref(false)
const previewUrl = ref('')

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

async function saveAndPreview() {
  if (!result.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    // Markdownを保存してSlidevプレビューを開始
    const response = await fetch('/api/save-and-preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ markdown: result.value }),
    })
    
    if (response.ok) {
      const data = await response.json()
      previewUrl.value = data.previewUrl
      showPreview.value = true
    } else {
      error.value = 'プレビューの開始に失敗しました'
    }
  } catch (err) {
    error.value = 'プレビューの開始に失敗しました'
  } finally {
    loading.value = false
  }
}

function closePreview() {
  showPreview.value = false
  previewUrl.value = ''
}
</script>

<template>
  <div class="app">
    <h1>Create Slide</h1>
    <input type="file" accept=".pdf,.md,.txt" @change="handleFileChange" />
    <p v-if="file">選択されたファイル: {{ file.name }}</p>
    <p v-if="error" style="color: red;">{{ error }}</p>
    <button :disabled="!file || generating" @click="uploadFile">
      {{ generating ? '生成中...' : 'アップロード' }}
    </button>
    
    <div v-if="result" class="result-section">
      <h2>生成されたMarkdown</h2>
      <div class="action-buttons">
        <button @click="saveAndPreview" class="preview-btn" :disabled="loading">
          {{ loading ? 'プレビュー開始中...' : 'Slidevでプレビュー' }}
        </button>
      </div>
      <textarea v-model="result" rows="20" class="markdown-editor"></textarea>
    </div>

    <!-- Slidevプレビューモーダル -->
    <div v-if="showPreview" class="preview-modal">
      <div class="preview-header">
        <div>
          <h3>Slidevプレビュー</h3>
          <p class="preview-note">スライドが読み込まれるまで少々お待ちください</p>
        </div>
        <button @click="closePreview" class="close-btn">×</button>
      </div>
      <div class="preview-content">
        <iframe 
          v-if="previewUrl"
          :src="previewUrl" 
          class="preview-iframe"
          frameborder="0"
        ></iframe>
      </div>
    </div>
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

.result-section {
  margin-top: 2rem;
}

.action-buttons {
  margin: 1rem 0;
}

.preview-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.preview-btn:hover {
  background-color: #45a049;
}

.markdown-editor {
  width: 100%;
  margin-top: 1rem;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.preview-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.preview-header h3 {
  margin: 0;
}

.preview-note {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #666;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

.preview-content {
  flex: 1;
  background: white;
  overflow: hidden;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
