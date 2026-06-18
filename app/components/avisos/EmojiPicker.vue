<template>
  <div class="relative">
    <button
      type="button"
      @click="togglePicker"
      class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      title="Adicionar emoji"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>

    <!-- Picker Dropdown -->
    <div
      v-if="showPicker"
      class="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
      style="width: 320px; max-height: 400px;"
    >
      <!-- Header com categorias -->
      <div class="flex items-center gap-1 p-2 border-b border-gray-200 overflow-x-auto">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          @click="selectedCategory = cat.id"
          :class="[
            'p-2 rounded-lg transition-colors flex-shrink-0',
            selectedCategory === cat.id
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-500 hover:bg-gray-100'
          ]"
          :title="cat.name"
        >
          {{ cat.icon }}
        </button>
      </div>

      <!-- Grid de emojis -->
      <div class="p-3 overflow-y-auto" style="max-height: 320px;">
        <div class="grid grid-cols-8 gap-1">
          <button
            v-for="emoji in currentEmojis"
            :key="emoji"
            type="button"
            @click="selectEmoji(emoji)"
            class="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
            :title="emoji"
          >
            {{ emoji }}
          </button>
        </div>
      </div>

      <!-- Footer com emojis recentes -->
      <div v-if="recentEmojis.length > 0" class="border-t border-gray-200 p-2">
        <div class="text-xs text-gray-500 mb-1 px-1">Recentes</div>
        <div class="flex gap-1 overflow-x-auto">
          <button
            v-for="emoji in recentEmojis"
            :key="emoji"
            type="button"
            @click="selectEmoji(emoji)"
            class="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            {{ emoji }}
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay para fechar -->
    <div
      v-if="showPicker"
      @click="showPicker = false"
      class="fixed inset-0 z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  select: [emoji: string]
}>()

const showPicker = ref(false)
const selectedCategory = ref('smileys')
const recentEmojis = ref<string[]>([])

// Categorias de emojis estilo Telegram
const categories = [
  { id: 'smileys', name: 'Sorrisos e Emoções', icon: '😊' },
  { id: 'gestures', name: 'Gestos', icon: '👋' },
  { id: 'people', name: 'Pessoas', icon: '👨' },
  { id: 'animals', name: 'Animais', icon: '🐶' },
  { id: 'food', name: 'Comida', icon: '🍕' },
  { id: 'travel', name: 'Viagem', icon: '✈️' },
  { id: 'activities', name: 'Atividades', icon: '⚽' },
  { id: 'objects', name: 'Objetos', icon: '💡' },
  { id: 'symbols', name: 'Símbolos', icon: '❤️' },
  { id: 'flags', name: 'Bandeiras', icon: '🇧🇷' }
]

// Emojis por categoria (estilo Telegram)
const emojisByCategory: Record<string, string[]> = {
  smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
    '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
    '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
    '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒',
    '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '😵',
    '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕',
    '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺',
    '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱',
    '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤',
    '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩'
  ],
  gestures: [
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
    '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
    '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀',
    '👁️', '👅', '👄', '💋', '🩸'
  ],
  people: [
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱',
    '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️',
    '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '🧔‍♀️',
    '🧔‍♂️', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️',
    '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️',
    '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️',
    '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓',
    '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭'
  ],
  animals: [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵',
    '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤',
    '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
    '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎',
    '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡',
    '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅'
  ],
  food: [
    '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭',
    '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝',
    '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽',
    '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄',
    '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯',
    '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔',
    '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙',
    '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗'
  ],
  travel: [
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽',
    '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔',
    '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋',
    '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇',
    '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️',
    '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️',
    '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️'
  ],
  activities: [
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
    '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
    '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
    '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌',
    '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️',
    '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️',
    '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇',
    '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊'
  ],
  objects: [
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
    '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷',
    '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟',
    '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️',
    '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌',
    '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵',
    '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️',
    '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️'
  ],
  symbols: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
    '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
    '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️',
    '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️',
    '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹',
    '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌',
    '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️',
    '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗',
    '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️',
    '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯',
    '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀'
  ],
  flags: [
    '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
    '🇧🇷', '🇺🇸', '🇬🇧', '🇨🇦', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸',
    '🇵🇹', '🇦🇷', '🇲🇽', '🇨🇱', '🇨🇴', '🇵🇪', '🇻🇪', '🇺🇾',
    '🇵🇾', '🇧🇴', '🇪🇨', '🇬🇾', '🇸🇷', '🇨🇷', '🇵🇦', '🇨🇺',
    '🇩🇴', '🇭🇹', '🇯🇲', '🇹🇹', '🇧🇸', '🇧🇧', '🇬🇩', '🇱🇨',
    '🇻🇨', '🇦🇬', '🇩🇲', '🇰🇳', '🇧🇿', '🇬🇹', '🇭🇳', '🇸🇻',
    '🇳🇮', '🇯🇵', '🇨🇳', '🇰🇷', '🇮🇳', '🇷🇺', '🇦🇺', '🇿🇦'
  ]
}

const currentEmojis = computed(() => {
  return emojisByCategory[selectedCategory.value] || []
})

const togglePicker = () => {
  showPicker.value = !showPicker.value
}

const selectEmoji = (emoji: string) => {
  emit('select', emoji)
  
  // Adicionar aos recentes
  const index = recentEmojis.value.indexOf(emoji)
  if (index > -1) {
    recentEmojis.value.splice(index, 1)
  }
  recentEmojis.value.unshift(emoji)
  
  // Manter apenas os 16 mais recentes
  if (recentEmojis.value.length > 16) {
    recentEmojis.value = recentEmojis.value.slice(0, 16)
  }
  
  // Salvar no localStorage
  if (process.client) {
    localStorage.setItem('recent-emojis', JSON.stringify(recentEmojis.value))
  }
  
  showPicker.value = false
}

// Carregar emojis recentes do localStorage
onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('recent-emojis')
    if (saved) {
      try {
        recentEmojis.value = JSON.parse(saved)
      } catch (e) {
        // Ignorar erro
      }
    }
  }
})
</script>
