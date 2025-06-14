<template>
  <footer class="w-full py-2 px-6 flex justify-between items-center text-xs text-muted">
    <span>{{ $slidev.configs.presenter ?? 'Presenter Name' }}</span>
    <span><SlideCurrentNo /> / <SlidesTotal /></span>
  </footer>
</template>
