<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-600 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :class="[
        'w-full px-4 py-3 text-lg border-2 rounded-xl outline-none transition-colors resize-none',
        disabled ? 'border-gray-100 bg-gray-50 text-gray-500' : 'border-gray-200 focus:border-primary-500'
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 3
})

defineEmits<{
  'update:modelValue': [value: string]
}>()

const id = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)
</script>
