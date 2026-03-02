<template>
  <div :class="['bg-white rounded-2xl shadow-sm border border-gray-100', padding, className]">
    <div v-if="title || $slots.header" class="flex items-center justify-between mb-6">
      <h3 v-if="title" class="text-xl font-bold text-gray-800 flex items-center gap-2">
        <span v-if="icon" class="text-xl">{{ icon }}</span>
        {{ title }}
        <span v-if="subtitle" class="text-sm font-normal text-gray-400">{{ subtitle }}</span>
      </h3>
      <slot name="header" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  icon?: string
  padding?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  padding: 'p-6 lg:p-8'
})
</script>
