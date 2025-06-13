<template>
  <header class="w-full py-2 px-6 flex items-center justify-between text-sm opacity-80">
    <span class="font-semibold" style="color:var(--c-brand)">
      {{ $slidev.configs.company ?? 'Your Company' }}
    </span>
    <span v-if="$slidev.nav.currentLayout !== 'cover'">
      {{ $slidev.nav.currentPage?.title }}
    </span>
  </header>
</template>
