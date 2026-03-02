<template>
  <div class="flex items-center">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
    />
    <label v-if="label" :for="inputId" class="ml-2 block text-sm text-gray-900">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  label?: string
}

defineProps<Props>()

defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Gerar ID único para o input
const inputId = `checkbox-${Math.random().toString(36).substr(2, 9)}`
</script>