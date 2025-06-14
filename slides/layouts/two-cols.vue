<template>
  <div class="grid grid-cols-12 gap-6 h-full">
    <aside class="col-span-4 flex flex-col justify-center">
      <slot name="aside"><h2><slot name="title"/></h2></slot>
    </aside>
    <section class="col-span-8 flex items-center">
      <slot />
    </section>
  </div>
</template>
