<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gerenciar Avisos</h1>
        <p class="text-gray-600">Envie recados e comunicados para todos os funcionários</p>
      </div>

      <!-- Botão criar novo aviso -->
      <div class="mb-6">
        <button
          @click="abrirModalNovoAviso"
          class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Aviso
        </button>
      </div>

      <!-- Lista de avisos -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="text-gray-500 mt-4">Carregando avisos...</p>
      </div>

      <div v-else-if="avisos.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p class="text-gray-500 text-lg mb-2">Nenhum aviso criado</p>
        <p class="text-gray-400 text-sm">Clique em "Novo Aviso" para criar o primeiro</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="aviso in avisos"
          :key="aviso.id"
          class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ aviso.titulo }}</h3>
              <p class="text-gray-600 mb-4 whitespace-pre-wrap">{{ aviso.descricao }}</p>
              <div class="flex items-center gap-4 text-sm text-gray-500">
                <span>{{ formatarData(aviso.created_at) }}</span>
                <button
                  @click="abrirComentarios(aviso.id)"
                  class="flex items-center gap-1 hover:text-blue-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  Ver comentários
                </button>
              </div>
            </div>
            <button
              @click="confirmarDeletar(aviso.id)"
              class="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Deletar aviso"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Modal novo aviso com AnimatedModal -->
      <AnimatedModal v-model:open="modalNovoAvisoAberto">
        <AnimatedModalBody
          class="max-w-2xl"
          :show-close="true"
        >
          <form @submit.prevent="criarNovoAviso" class="flex flex-col h-full">
            <AnimatedModalContent class="flex-1 overflow-y-auto space-y-4">
              <!-- Título do Modal -->
              <div class="mb-6">
                <h3 class="text-2xl font-bold text-gray-900">Novo Aviso</h3>
                <p class="text-gray-600 mt-1">Envie um comunicado para todos os funcionários</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Título <span class="text-red-500">*</span>
                </label>
              <div class="relative">
                <input
                  ref="tituloInput"
                  v-model="novoAviso.titulo"
                  type="text"
                  maxlength="200"
                  placeholder="Ex: 📢 Reunião importante na sexta-feira"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  @click="toggleEmojiPicker('titulo')"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors text-xl"
                  title="Adicionar emoji"
                >
                  😊
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                {{ novoAviso.titulo.length }}/200 caracteres
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descrição <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <textarea
                  ref="descricaoInput"
                  v-model="novoAviso.descricao"
                  rows="6"
                  placeholder="Escreva a mensagem completa... Você pode usar emojis! 😊"
                  class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                ></textarea>
                <button
                  type="button"
                  @click="toggleEmojiPicker('descricao')"
                  class="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded transition-colors text-xl"
                  title="Adicionar emoji"
                >
                  😊
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Clique no emoji para adicionar à mensagem
              </p>
            </div>

            <!-- Emoji Picker -->
            <div
              v-if="emojiPickerAberto"
              class="bg-gray-50 rounded-lg border border-gray-200 p-4"
              @click.stop
            >
              <div class="mb-3">
                <p class="text-sm font-medium text-gray-700 mb-2">Escolha um emoji:</p>
              </div>

              <!-- Categorias -->
              <div class="flex gap-2 mb-3 overflow-x-auto pb-2">
                <button
                  v-for="cat in categorias"
                  :key="cat.nome"
                  @click="categoriaSelecionada = cat.nome"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1',
                    categoriaSelecionada === cat.nome
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  ]"
                  type="button"
                >
                  <span class="text-base">{{ cat.icone }}</span>
                  <span>{{ cat.nome }}</span>
                </button>
              </div>

              <!-- Grid de Emojis -->
              <div class="bg-white rounded-lg border border-gray-200 p-3">
                <div class="grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
                  <button
                    v-for="emoji in emojisFiltered"
                    :key="emoji"
                    @click="inserirEmoji(emoji)"
                    class="text-2xl hover:bg-blue-50 rounded p-2 transition-colors"
                    type="button"
                    :title="emoji"
                  >
                    {{ emoji }}
                  </button>
                </div>

                <div v-if="emojisFiltered.length === 0" class="text-center py-8 text-gray-400 text-sm">
                  Nenhum emoji encontrado
                </div>
              </div>
            </div>

            </AnimatedModalContent>

            <AnimatedModalFooter class="flex gap-3">
              <button
                type="button"
                @click="fecharModalNovoAviso"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="criando"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {{ criando ? 'Criando...' : 'Criar Aviso' }}
              </button>
            </AnimatedModalFooter>
          </form>
        </AnimatedModalBody>
      </AnimatedModal>

      <!-- Modal de Comentários -->
      <AvisosModalAvisos 
        :aberto="modalComentariosAberto"
        :aviso-selecionado="avisoAtualParaComentarios"
        @fechar="fecharComentarios"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AnimatedModal,
  AnimatedModalBody,
  AnimatedModalContent,
  AnimatedModalFooter,
} from '~/components/ui/animated-modal'

definePageMeta({
  middleware: 'auth',
  layout: 'default'
})

const { avisos, loading, fetchAvisos, criarAviso, deletarAviso } = useAvisos()
const { formatarData: formatarDataCompleta } = useFormatarData()

const modalNovoAvisoAberto = ref(false)
const modalComentariosAberto = ref(false)
const avisoSelecionado = ref<string | null>(null)
const criando = ref(false)
const emojiPickerAberto = ref(false)
const campoAtivo = ref<'titulo' | 'descricao'>('titulo')
const categoriaSelecionada = ref('Sorrisos')

const tituloInput = ref<HTMLInputElement>()
const descricaoInput = ref<HTMLTextAreaElement>()

const novoAviso = ref({
  titulo: '',
  descricao: ''
})

// Categorias de emojis estilo Telegram
const categorias = [
  { nome: 'Sorrisos', icone: '😊' },
  { nome: 'Gestos', icone: '👋' },
  { nome: 'Pessoas', icone: '👨' },
  { nome: 'Animais', icone: '🐶' },
  { nome: 'Comida', icone: '🍕' },
  { nome: 'Viagem', icone: '✈️' },
  { nome: 'Atividades', icone: '⚽' },
  { nome: 'Objetos', icone: '💡' },
  { nome: 'Símbolos', icone: '❤️' },
  { nome: 'Bandeiras', icone: '🇧🇷' }
]

// Emojis por categoria (estilo Telegram) - Parte 1
const emojisPorCategoria: Record<string, string[]> = {
  'Sorrisos': [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
    '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜',
    '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐',
    '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬',
    '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕',
    '🤢', '🤮', '🤧', '🥵', '🥶', '😵', '🤯', '🤠',
    '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁',
    '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
    '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
    '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠',
    '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹',
    '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹'
  ],
  'Gestos': [
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
    '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
    '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀',
    '👁️', '👅', '👄', '💋', '🩸'
  ],
  'Pessoas': [
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👩‍🦱',
    '🧑‍🦱', '👨‍🦱', '👩‍🦰', '🧑‍🦰', '👨‍🦰', '👱‍♀️', '👱', '👱‍♂️',
    '👩‍🦳', '🧑‍🦳', '👨‍🦳', '👩‍🦲', '🧑‍🦲', '👨‍🦲', '🧔', '🧔‍♀️',
    '🧔‍♂️', '👵', '🧓', '👴', '👲', '👳‍♀️', '👳', '👳‍♂️',
    '🧕', '👮‍♀️', '👮', '👮‍♂️', '👷‍♀️', '👷', '👷‍♂️', '💂‍♀️',
    '💂', '💂‍♂️', '🕵️‍♀️', '🕵️', '🕵️‍♂️', '👩‍⚕️', '🧑‍⚕️', '👨‍⚕️',
    '👩‍🌾', '🧑‍🌾', '👨‍🌾', '👩‍🍳', '🧑‍🍳', '👨‍🍳', '👩‍🎓', '🧑‍🎓',
    '👨‍🎓', '👩‍🎤', '🧑‍🎤', '👨‍🎤', '👩‍🏫', '🧑‍🏫', '👨‍🏫', '👩‍🏭'
  ],
  'Animais': [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵',
    '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤',
    '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
    '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎',
    '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡',
    '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅'
  ],
  'Comida': [
    '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭',
    '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝',
    '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽',
    '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄',
    '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯',
    '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔',
    '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙',
    '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗',
    '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚',
    '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥',
    '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐',
    '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂',
    '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯'
  ]
}

// Emojis por categoria - Parte 2
emojisPorCategoria['Viagem'] = [
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
  '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽',
  '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔',
  '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋',
  '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇',
  '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️',
  '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️',
  '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️',
  '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢',
  '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️'
]

emojisPorCategoria['Atividades'] = [
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
  '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
  '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿',
  '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌',
  '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️',
  '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️',
  '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇',
  '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊',
  '🎯', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅',
  '🪆', '🪄', '🎭', '🎨', '🧵', '🪡', '🧶', '🪢'
]

emojisPorCategoria['Objetos'] = [
  '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
  '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷',
  '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟',
  '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️',
  '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌',
  '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵',
  '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️',
  '🪜', '🧰', '🪛', '🔧', '🔨', '⚒️', '🛠️', '⛏️',
  '🪓', '🪚', '🔩', '⚙️', '🪤', '🧱', '⛓️', '🧲',
  '🔫', '💣', '🧨', '🪃', '🔪', '🗡️', '⚔️', '🛡️'
]

emojisPorCategoria['Símbolos'] = [
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
  '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀',
  '💤', '🏧', '🚾', '♿', '🅿️', '🈳', '🈂️', '🛂',
  '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧️', '🚻'
]

emojisPorCategoria['Bandeiras'] = [
  '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️',
  '🇧🇷', '🇺🇸', '🇬🇧', '🇨🇦', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸',
  '🇵🇹', '🇦🇷', '🇲🇽', '🇨🇱', '🇨🇴', '🇵🇪', '🇻🇪', '🇺🇾',
  '🇵🇾', '🇧🇴', '🇪🇨', '🇬🇾', '🇸🇷', '🇨🇷', '🇵🇦', '🇨🇺',
  '🇩🇴', '🇭🇹', '🇯🇲', '🇹🇹', '🇧🇸', '🇧🇧', '🇬🇩', '🇱🇨',
  '🇻🇨', '🇦🇬', '🇩🇲', '🇰🇳', '🇧🇿', '🇬🇹', '🇭🇳', '🇸🇻',
  '🇳🇮', '🇯🇵', '🇨🇳', '🇰🇷', '🇮🇳', '🇷🇺', '🇦🇺', '🇿🇦',
  '🇪🇬', '🇳🇬', '🇰🇪', '🇪🇹', '🇬🇭', '🇹🇿', '🇺🇬', '🇲🇦'
]

// Computed para buscar o aviso completo
const avisoAtualParaComentarios = computed(() => {
  if (!avisoSelecionado.value) return null
  return avisos.value.find(a => a.id === avisoSelecionado.value) || null
})

// Emojis filtrados por categoria
const emojisFiltered = computed(() => {
  return emojisPorCategoria[categoriaSelecionada.value] || []
})

// Carregar avisos ao montar
onMounted(() => {
  fetchAvisos()
})

const abrirModalNovoAviso = () => {
  modalNovoAvisoAberto.value = true
  emojiPickerAberto.value = false
}

const criarNovoAviso = async () => {
  if (!novoAviso.value.titulo.trim() || !novoAviso.value.descricao.trim()) {
    return
  }

  criando.value = true
  const result = await criarAviso(novoAviso.value.titulo, novoAviso.value.descricao)
  
  if (result.success) {
    fecharModalNovoAviso()
  }
  
  criando.value = false
}

const fecharModalNovoAviso = () => {
  modalNovoAvisoAberto.value = false
  emojiPickerAberto.value = false
  novoAviso.value = { titulo: '', descricao: '' }
}

const toggleEmojiPicker = (campo: 'titulo' | 'descricao') => {
  campoAtivo.value = campo
  emojiPickerAberto.value = !emojiPickerAberto.value
}

const inserirEmoji = (emoji: string) => {
  if (campoAtivo.value === 'titulo') {
    const input = tituloInput.value
    if (input) {
      const start = input.selectionStart || 0
      const end = input.selectionEnd || 0
      const text = novoAviso.value.titulo
      novoAviso.value.titulo = text.substring(0, start) + emoji + text.substring(end)
      
      // Reposicionar cursor
      nextTick(() => {
        input.focus()
        input.setSelectionRange(start + emoji.length, start + emoji.length)
      })
    } else {
      novoAviso.value.titulo += emoji
    }
  } else {
    const textarea = descricaoInput.value
    if (textarea) {
      const start = textarea.selectionStart || 0
      const end = textarea.selectionEnd || 0
      const text = novoAviso.value.descricao
      novoAviso.value.descricao = text.substring(0, start) + emoji + text.substring(end)
      
      // Reposicionar cursor
      nextTick(() => {
        textarea.focus()
        textarea.setSelectionRange(start + emoji.length, start + emoji.length)
      })
    } else {
      novoAviso.value.descricao += emoji
    }
  }
  
  emojiPickerAberto.value = false
}

const confirmarDeletar = async (avisoId: string) => {
  if (!confirm('Deseja realmente deletar este aviso? Esta ação não pode ser desfeita.')) {
    return
  }

  await deletarAviso(avisoId)
}

const abrirComentarios = (avisoId: string) => {
  avisoSelecionado.value = avisoId
  modalComentariosAberto.value = true
}

const fecharComentarios = () => {
  modalComentariosAberto.value = false
  avisoSelecionado.value = null
}

const formatarData = formatarDataCompleta
</script>
