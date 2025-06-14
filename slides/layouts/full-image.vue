<template>
  <section
    class="h-full w-full bg-cover bg-center flex items-center justify-center"
    :style="{ backgroundImage: `url(${$frontmatter.image})` }"
  >
    <h1 class="text-white text-5xl font-bold drop-shadow-lg">
      <slot />
    </h1>
  </section>
</template>
