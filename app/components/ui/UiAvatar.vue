<template>
  <div 
    :class="[
      'rounded-xl flex items-center justify-center font-bold',
      sizeClasses,
      colorClasses
    ]"
    style="line-height: 1;"
  >
    <img v-if="src" :src="src" :alt="name" class="w-full h-full object-cover rounded-xl" />
    <div v-else-if="avatarType" :class="textSizeClass" style="line-height: 1;">{{ getAvatarEmoji(avatarType) }}</div>
    <span v-else :class="textSizeClass">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  src?: string
  avatarType?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'green' | 'orange' | 'purple' | 'gray'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary'
})

const initials = computed(() => {
  return props.name
    .split(' ')
    .map(n => n.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  }
  return sizes[props.size]
})

const textSizeClass = computed(() => {
  const sizes = {
    sm: 'text-base',      // Aumentado de text-sm
    md: 'text-2xl',       // Aumentado de text-lg
    lg: 'text-4xl',       // Aumentado de text-2xl
    xl: 'text-7xl'        // Aumentado de text-5xl
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  // Se tem avatar personalizado, usar fundo neutro
  if (props.avatarType) {
    return 'bg-gray-100'
  }
  
  const colors = {
    primary: 'bg-primary-100 text-primary-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-200 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-500'
  }
  return colors[props.color]
})

// Mapa de avatares disponíveis (específicos para os cargos da empresa)
const avatarMap: Record<string, string> = {
  // Avatares básicos
  'person-1': '👤',
  
  // GERENTE - Responsável por Fiscal, Financeiro, Comercial, RH e Administrativo
  'gerente-1': '👨‍💼',
  'gerente-2': '👩‍💼',
  'gerente-3': '👨🏽‍💼',
  'gerente-4': '👩🏽‍💼',
  
  // ASSISTENTE COMERCIAL
  'ass-comercial-1': '🧑‍💼',
  'ass-comercial-2': '👨‍💼',
  'ass-comercial-3': '👩‍💼',
  'ass-comercial-4': '👨🏽‍💼',
  'ass-comercial-5': '👩🏽‍💼',
  
  // REPRESENTANTE COMERCIAL
  'rep-comercial-1': '🤝',
  'rep-comercial-2': '👔',
  'rep-comercial-3': '💼',
  
  // AUXILIAR COMERCIAL
  'aux-comercial-1': '📊',
  'aux-comercial-2': '📈',
  'aux-comercial-3': '💹',
  
  // ASSISTENTE DE PRODUÇÃO
  'ass-producao-1': '👷‍♂️',
  'ass-producao-2': '👷‍♀️',
  'ass-producao-3': '👷🏽‍♂️',
  'ass-producao-4': '👷🏽‍♀️',
  
  // AUXILIAR DE PRODUÇÃO
  'aux-producao-1': '🔧',
  'aux-producao-2': '⚙️',
  'aux-producao-3': '🛠️',
  
  // SOLDADOR
  'soldador-1': '👨‍🔧',
  'soldador-2': '👩‍🔧',
  'soldador-3': '👨🏽‍🔧',
  'soldador-4': '👩🏽‍🔧',
  'soldador-5': '🔥',
  'soldador-6': '⚡',
  
  // AUXILIAR ADMINISTRATIVO
  'aux-admin-1': '📋',
  'aux-admin-2': '📝',
  'aux-admin-3': '🗂️',
  'aux-admin-4': '📄',
  
  // LÍDER DE ESTOQUE
  'lider-estoque-1': '📦',
  'lider-estoque-2': '🏪',
  'lider-estoque-3': '👨🏽‍💼',
  'lider-estoque-4': '👩🏽‍💼',
  
  // AUXILIAR DE ESTOQUE
  'aux-estoque-1': '📋',
  'aux-estoque-2': '📊',
  'aux-estoque-3': '🏷️',
  'aux-estoque-4': '📈',
  
  // AUXILIAR DE EXPEDIÇÃO
  'aux-expedicao-1': '🚚',
  'aux-expedicao-2': '📦',
  'aux-expedicao-3': '🚛',
  'aux-expedicao-4': '📮',
  
  // AUXILIAR DE SERVIÇOS GERAIS
  'aux-servicos-1': '🧹',
  'aux-servicos-2': '🧽',
  'aux-servicos-3': '🧴',
  'aux-servicos-4': '🗑️',
  
  // TI (Técnico de Informática)
  'ti-1': '👨‍💻',
  'ti-2': '👩‍💻',
  'ti-3': '👨🏽‍💻',
  'ti-4': '👩🏽‍💻',
  'ti-5': '💻',
  'ti-6': '🖥️'
}

const getAvatarEmoji = (avatarType: string): string => {
  return avatarMap[avatarType] || '👤'
}
</script>
