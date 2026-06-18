<template>
  <NuxtLink 
    :to="to"
    :class="[
      'rounded-2xl p-5 text-white transition-all',
      gradientClass
    ]"
  >
    <svg class="w-10 h-10 mb-3 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath"/>
    </svg>
    <p class="text-3xl font-bold">{{ value }}</p>
    <p class="text-white/80">{{ label }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
interface Props {
  to: string
  value: string | number
  label: string
  color: 'blue' | 'purple' | 'green' | 'orange'
  iconPath: string
}

const props = defineProps<Props>()

const gradientMap = {
  blue: 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
  purple: 'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
  green: 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
  orange: 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
}

const gradientClass = computed(() => gradientMap[props.color])
</script>
