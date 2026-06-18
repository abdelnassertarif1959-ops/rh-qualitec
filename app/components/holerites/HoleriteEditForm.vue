<template>
  <div class="space-y-6">
    <!-- Informações do Funcionário -->
    <div class="bg-gray-50 rounded-xl p-4">
      <h3 class="font-semibold text-gray-900 mb-2">{{ holerite.funcionario.nome_completo }}</h3>
      <div v-if="carregandoDados" class="text-sm text-gray-500">
        ⏳ Carregando informações...
      </div>
      <div v-else class="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span class="text-gray-600">Cargo:</span>
          <span class="ml-2 font-medium">{{ holerite.funcionario.cargo }}</span>
        </div>
        <div>
          <span class="text-gray-600">Empresa:</span>
          <span class="ml-2 font-medium">
            {{ empresaInfo ? (empresaInfo.nome_fantasia || empresaInfo.nome || 'Não definida') : 'Não encontrada' }}
          </span>
        </div>
        <div v-if="empresaInfo?.cnpj" class="col-span-2">
          <span class="text-gray-600">CNPJ:</span>
          <span class="ml-2 font-medium">{{ formatarCNPJ(empresaInfo.cnpj) }}</span>
        </div>
      </div>
    </div>

    <!-- Abas -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="abaAtiva = tab.id"
          :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            abaAtiva === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Aba: Dados Básicos -->
    <div v-if="abaAtiva === 'basicos'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.salario_base" 
          type="number" 
          label="Salário Base (Mensal)"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.dias_trabalhados" 
          type="number" 
          label="Dias Trabalhados no Mês"
          placeholder="30"
          step="1"
          min="1"
          max="31"
        />
      </div>

      <!-- Informação do valor diário -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div class="text-sm space-y-1">
          <div class="flex justify-between">
            <span class="text-gray-600">💰 Valor do Dia (Salário Base ÷ 30):</span>
            <span class="font-bold text-blue-600">{{ formatarMoeda(calcularValorDia()) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">📅 Dias Trabalhados:</span>
            <span class="font-bold text-blue-600">{{ form.dias_trabalhados || 30 }} dias</span>
          </div>
          <div class="flex justify-between border-t border-blue-300 pt-1 mt-1">
            <span class="font-semibold text-blue-700">💵 Salário Proporcional:</span>
            <span class="text-lg font-bold text-blue-700">{{ formatarMoeda(calcularSalarioProporcional()) }}</span>
          </div>
        </div>
      </div>

      <!-- Alerta sobre recálculo automático -->
      <UiAlert variant="info" class="text-sm">
        ⚙️ <strong>Recálculo Automático:</strong> Ao mudar os dias trabalhados ou salário base, os valores de INSS e Pensão Alimentícia serão recalculados automaticamente <strong>apenas se estiverem em modo percentual</strong>. O adiantamento sempre recalcula (40% fixo).
      </UiAlert>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.data_pagamento" 
          type="date" 
          label="Data de Pagamento"
        />
        
        <UiInput 
          v-model="form.observacoes" 
          label="Observações"
          placeholder="Observações sobre este holerite"
        />
      </div>
    </div>

    <!-- Aba: Proventos -->
    <div v-if="abaAtiva === 'proventos'" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.bonus" 
          type="number" 
          label="Bônus"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.horas_extras" 
          type="number" 
          label="Horas Extras"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.adicional_noturno" 
          type="number" 
          label="Adicional Noturno"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.adicional_periculosidade" 
          type="number" 
          label="Adicional de Periculosidade"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.adicional_insalubridade" 
          type="number" 
          label="Adicional de Insalubridade"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.comissoes" 
          type="number" 
          label="Comissões"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <!-- Total de Proventos -->
      <div class="bg-green-50 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-green-700">Total de Proventos:</span>
          <span class="text-xl font-bold text-green-700">{{ formatarMoeda(calcularTotalProventos()) }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Descontos -->
    <div v-if="abaAtiva === 'descontos'" class="space-y-4">
      <!-- INSS com Percentual -->
      <div class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold text-gray-800 flex items-center gap-2">
            🏛️ INSS (Instituto Nacional do Seguro Social)
          </h4>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold',
              inssConfig.tipo === 'percentual' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            ]"
          >
            {{ inssConfig.tipo === 'percentual' ? '📊 MODO PERCENTUAL (Recalcula)' : '💵 MODO FIXO (Manual)' }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Tipo de Cálculo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Cálculo
            </label>
            <select 
              v-model="inssConfig.tipo"
              @change="calcularINSS"
              class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="fixo">💵 Valor Fixo</option>
              <option value="percentual">📊 Percentual do Salário Bruto</option>
            </select>
          </div>

          <!-- Valor ou Percentual -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ inssConfig.tipo === 'percentual' ? 'Percentual (%)' : 'Valor (R$)' }}
            </label>
            <input
              v-if="inssConfig.tipo === 'percentual'"
              v-model="inssConfig.percentual"
              @input="calcularINSS"
              type="number"
              step="0.01"
              min="0"
              max="100"
              placeholder="Ex: 7.5"
              class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <input
              v-else
              v-model="form.inss"
              @input="atualizarReferenciaINSS"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <!-- Campo de Referência (apenas para modo fixo) -->
        <div v-if="inssConfig.tipo === 'fixo'" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            📝 Referência do INSS (aparecerá no PDF/HTML)
          </label>
          <UiInput 
            v-model="form.inss_referencia"
            :uppercase="false"
            placeholder="Ex: 12.00"
            hint="Este texto aparecerá na coluna 'Referência' do holerite"
          />
          <button
            @click="gerarReferenciaAutomatica"
            type="button"
            class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
          >
            ✨ Gerar referência automática
          </button>
        </div>

        <!-- Cálculo Detalhado (se percentual) -->
        <div v-if="inssConfig.tipo === 'percentual'" class="bg-white rounded-lg p-3 text-sm space-y-1">
          <div class="flex justify-between text-gray-600">
            <span>Salário Bruto:</span>
            <span class="font-medium">{{ formatarMoeda(calcularTotalProventos()) }}</span>
          </div>
          <div class="flex justify-between font-bold text-blue-600 pt-1 border-t">
            <span>INSS ({{ inssConfig.percentual }}%):</span>
            <span>{{ formatarMoeda(form.inss) }}</span>
          </div>
        </div>

        <UiAlert variant="info" class="text-xs">
          💡 <strong>Dica:</strong> 
          {{ inssConfig.tipo === 'percentual' 
            ? `O INSS será calculado como ${inssConfig.percentual}% do salário bruto. Tabela progressiva 2026: 7,5% a 14% conforme faixa salarial.` 
            : 'O INSS será descontado como valor fixo. Use esta opção se já calculou manualmente.' 
          }}
        </UiAlert>
      </div>

      <!-- IRRF -->
      <div class="grid grid-cols-1 gap-4">
        <UiInput 
          v-model="form.irrf" 
          type="number" 
          label="IRRF"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.vale_transporte" 
          type="number" 
          label="Vale Transporte"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.vale_refeicao_desconto" 
          type="number" 
          label="Vale Refeição"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.plano_saude" 
          type="number" 
          label="Plano de Saúde"
          placeholder="0.00"
          step="0.01"
        />
        
        <UiInput 
          v-model="form.plano_odontologico" 
          type="number" 
          label="Plano Odontológico"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <!-- Adiantamento Salarial (40% do Salário Bruto) -->
      <div class="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 space-y-3">
        <h4 class="font-semibold text-orange-900 flex items-center gap-2">
          💰 Adiantamento Salarial (40% do Salário Bruto)
        </h4>
        
        <div class="bg-white rounded-lg p-3 text-sm space-y-1">
          <div class="flex justify-between text-gray-600">
            <span>Salário Bruto (Proporcional):</span>
            <span class="font-medium">{{ formatarMoeda(calcularTotalProventos()) }}</span>
          </div>
          <div class="flex justify-between font-bold text-orange-600 pt-1 border-t">
            <span>Adiantamento (40%):</span>
            <span>{{ formatarMoeda(form.adiantamento) }}</span>
          </div>
        </div>

        <UiAlert variant="info" class="text-xs">
          💡 <strong>Informação:</strong> O adiantamento é calculado automaticamente como 40% do salário bruto proporcional aos dias trabalhados.
        </UiAlert>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <UiInput 
          v-model="form.faltas" 
          type="number" 
          label="Faltas"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <!-- Desconto por Afastamento -->
      <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 space-y-3">
        <h4 class="font-semibold text-amber-900 flex items-center gap-2">
          🏥 Desconto por Afastamento
        </h4>

        <div class="grid grid-cols-2 gap-4">
          <UiInput
            v-model="form.desconto_afastamento"
            type="number"
            label="Valor do Desconto (R$)"
            placeholder="0.00"
            step="0.01"
          />
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Calcular pelo salário proporcional</label>
            <button
              type="button"
              @click="calcularDescontoAfastamento"
              class="w-full px-3 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-sm font-medium text-amber-800 transition-colors"
            >
              ⚡ Zerar salário (afastamento total)
            </button>
          </div>
        </div>

        <div v-if="Number(form.desconto_afastamento) > 0" class="bg-white rounded-lg p-3 text-sm space-y-1">
          <div class="flex justify-between text-gray-600">
            <span>Salário Proporcional:</span>
            <span class="font-medium">{{ formatarMoeda(calcularSalarioProporcional()) }}</span>
          </div>
          <div class="flex justify-between font-bold text-amber-700 pt-1 border-t border-amber-200">
            <span>Desconto Afastamento:</span>
            <span>- {{ formatarMoeda(Number(form.desconto_afastamento)) }}</span>
          </div>
        </div>

        <UiAlert variant="info" class="text-xs">
          💡 Use este campo para descontar dias de afastamento (INSS, acidente, licença não remunerada, etc.). Para afastamento total, clique em "Zerar salário" — isso define o desconto igual ao salário proporcional, resultando em R$ 0,00 de provento líquido.
        </UiAlert>
      </div>

      <!-- Pensão Alimentícia com Percentual -->
      <div class="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold text-purple-900">💜 Pensão Alimentícia</h4>
          <span 
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold',
              pensaoConfig.tipo === 'percentual' 
                ? 'bg-green-100 text-green-700 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            ]"
          >
            {{ pensaoConfig.tipo === 'percentual' ? '📊 MODO PERCENTUAL (Recalcula)' : '💵 MODO FIXO (Manual)' }}
          </span>
        </div>
        
        <div class="grid grid-cols-3 gap-4 mb-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cálculo</label>
            <select 
              v-model="pensaoConfig.tipo"
              @change="calcularPensao"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="fixo">💵 Valor Fixo</option>
              <option value="percentual">📊 Percentual do Líquido</option>
            </select>
          </div>

          <div v-if="pensaoConfig.tipo === 'fixo'">
            <UiInput 
              v-model="form.pensao_alimenticia" 
              type="number" 
              label="Valor Fixo"
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div v-if="pensaoConfig.tipo === 'percentual'">
            <UiInput 
              v-model="pensaoConfig.percentual" 
              type="number" 
              label="Percentual (%)"
              placeholder="30"
              step="0.01"
              @input="calcularPensao"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recorrência</label>
            <select 
              v-model="pensaoConfig.recorrente"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option :value="false">📅 Apenas este mês</option>
              <option :value="true">🔄 Recorrente (todos os meses)</option>
            </select>
          </div>
        </div>

        <div v-if="pensaoConfig.tipo === 'percentual'" class="bg-white rounded-lg p-3 border border-purple-200">
          <div class="text-sm space-y-1">
            <div class="flex justify-between">
              <span class="text-gray-600">Salário Bruto:</span>
              <span class="font-medium">{{ formatarMoeda(calcularTotalProventos()) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">(-) INSS:</span>
              <span class="font-medium text-red-600">{{ formatarMoeda(form.inss) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">(-) IRRF:</span>
              <span class="font-medium text-red-600">{{ formatarMoeda(form.irrf) }}</span>
            </div>
            <div class="flex justify-between border-t border-purple-200 pt-1 mt-1">
              <span class="font-semibold text-purple-900">Salário Líquido (base):</span>
              <span class="font-bold text-purple-900">{{ formatarMoeda(calcularSalarioLiquidoBase()) }}</span>
            </div>
            <div class="flex justify-between bg-purple-100 rounded p-2 mt-2">
              <span class="font-bold text-purple-900">Pensão ({{ pensaoConfig.percentual }}%):</span>
              <span class="text-xl font-bold text-purple-900">{{ formatarMoeda(form.pensao_alimenticia) }}</span>
            </div>
          </div>
        </div>

        <UiAlert variant="info" class="text-xs mt-3">
          <strong>💡 Dica:</strong> 
          {{ pensaoConfig.tipo === 'percentual' 
            ? `A pensão será calculada como ${pensaoConfig.percentual}% do salário líquido (após INSS e IRRF).` 
            : 'A pensão será descontada como valor fixo mensal.' 
          }}
          {{ pensaoConfig.recorrente 
            ? ' Este desconto será aplicado automaticamente todos os meses.' 
            : ' Este desconto será aplicado apenas neste holerite.' 
          }}
        </UiAlert>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <UiInput 
          v-model="form.fgts" 
          type="number" 
          label="FGTS (8% do salário)"
          placeholder="0.00"
          step="0.01"
        />
      </div>

      <UiAlert variant="info" class="text-sm">
        💡 <strong>Informação:</strong> O FGTS não é descontado do salário do funcionário. É um depósito feito pela empresa (8% do salário bruto) em conta vinculada do trabalhador.
      </UiAlert>

      <!-- Total de Descontos -->
      <div class="bg-red-50 p-4 rounded-lg">
        <div class="flex justify-between items-center">
          <span class="font-semibold text-red-700">Total de Descontos:</span>
          <span class="text-xl font-bold text-red-700">{{ formatarMoeda(calcularTotalDescontos()) }}</span>
        </div>
      </div>
    </div>

    <!-- Aba: Itens Personalizados -->
    <div v-if="abaAtiva === 'personalizados'" class="space-y-4">
      <UiAlert variant="info" class="mb-4">
        Adicione benefícios ou descontos personalizados que serão aplicados automaticamente nos holerites do funcionário durante o período definido.
      </UiAlert>

      <!-- Lista de itens existentes -->
      <div v-if="itensPersonalizados.length > 0" class="space-y-3 mb-6">
        <h4 class="font-semibold text-gray-700">Itens Ativos</h4>
        <div 
          v-for="item in itensPersonalizados" 
          :key="item.id"
          class="bg-white border rounded-lg p-4"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-semibold',
                    item.tipo === 'beneficio' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  ]"
                >
                  {{ item.tipo === 'beneficio' ? '💰 Benefício' : '📉 Desconto' }}
                </span>
                <span 
                  :class="[
                    'px-2 py-1 rounded text-xs font-semibold',
                    item.vigencia_tipo === 'unico' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  ]"
                >
                  {{ item.vigencia_tipo === 'unico' ? '📅 Único' : '🔄 Recorrente' }}
                </span>
              </div>
              <p class="font-semibold text-gray-900">{{ item.descricao }}</p>
              <p class="text-lg font-bold" :class="item.tipo === 'beneficio' ? 'text-green-600' : 'text-red-600'">
                {{ formatarMoeda(item.valor) }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Vigência: {{ formatarData(item.data_inicio) }} 
                {{ item.data_fim ? `até ${formatarData(item.data_fim)}` : '(sem data fim)' }}
              </p>
              <p v-if="item.observacoes" class="text-sm text-gray-400 mt-1">
                {{ item.observacoes }}
              </p>
            </div>
            <button 
              @click="removerItem(item.id)"
              class="text-red-500 hover:text-red-700 p-2"
              title="Remover item"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8 text-gray-500">
        Nenhum item personalizado cadastrado
      </div>

      <!-- Botão para adicionar novo item -->
      <UiButton 
        v-if="!mostrarFormNovoItem"
        @click="mostrarFormNovoItem = true"
        variant="secondary"
        class="w-full"
      >
        ➕ Adicionar Novo Item
      </UiButton>

      <!-- Formulário de novo item -->
      <div v-if="mostrarFormNovoItem" class="bg-gray-50 rounded-lg p-4 space-y-4">
        <h4 class="font-semibold text-gray-700">Novo Item Personalizado</h4>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select 
              v-model="novoItem.tipo"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beneficio">💰 Benefício (Provento)</option>
              <option value="desconto">📉 Desconto</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vigência</label>
            <select 
              v-model="novoItem.vigencia_tipo"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="unico">📅 Único (apenas este mês)</option>
              <option value="recorrente">🔄 Recorrente (vários meses)</option>
            </select>
          </div>
        </div>

        <UiInput 
          v-model="novoItem.descricao"
          label="Descrição"
          placeholder="Ex: Bônus de produtividade, Desconto de uniforme..."
        />

        <UiInput 
          v-model="novoItem.valor"
          type="number"
          label="Valor"
          placeholder="0.00"
          step="0.01"
        />

        <div class="grid grid-cols-2 gap-4">
          <UiInput 
            v-model="novoItem.data_inicio"
            type="date"
            label="Data Início"
          />

          <UiInput 
            v-model="novoItem.data_fim"
            type="date"
            label="Data Fim (opcional)"
            :disabled="novoItem.vigencia_tipo === 'unico'"
          />
        </div>

        <UiInput 
          v-model="novoItem.observacoes"
          label="Observações (opcional)"
          placeholder="Informações adicionais..."
        />

        <div class="flex gap-3">
          <UiButton @click="adicionarItem" class="flex-1">
            ✅ Adicionar
          </UiButton>
          <UiButton 
            variant="secondary" 
            @click="cancelarNovoItem"
            class="flex-1"
          >
            ❌ Cancelar
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Resumo -->
    <div class="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-gray-700">Total Proventos:</span>
          <span class="font-semibold text-green-600">{{ formatarMoeda(calcularTotalProventos()) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-700">Total Descontos:</span>
          <span class="font-semibold text-red-600">- {{ formatarMoeda(calcularTotalDescontos()) }}</span>
        </div>
        <div class="border-t border-blue-300 pt-2 flex justify-between">
          <span class="font-bold text-blue-900">Salário Líquido:</span>
          <span class="text-2xl font-bold text-blue-900">{{ formatarMoeda(calcularSalarioLiquido()) }}</span>
        </div>
      </div>
    </div>

    <!-- Botões -->
    <div class="flex justify-end gap-3 pt-4 border-t">
      <UiButton variant="secondary" @click="$emit('cancel')">
        Cancelar
      </UiButton>
      <UiButton @click="salvar">
        💾 Salvar Alterações
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  holerite: any
}>()

const emit = defineEmits<{
  save: [data: any]
  cancel: []
  atualizado: [data: any]
}>()

// Estados
const abaAtiva = ref('basicos')
const empresaInfo = ref<any>(null)
const carregandoDados = ref(true)
const itensPersonalizados = ref<any[]>([])
const mostrarFormNovoItem = ref(false)

const tabs = [
  { id: 'basicos', label: 'Dados Básicos', icon: '📋' },
  { id: 'proventos', label: 'Proventos', icon: '💰' },
  { id: 'descontos', label: 'Descontos', icon: '📉' },
  { id: 'personalizados', label: 'Itens Personalizados', icon: '⚙️' }
]

// Formulário
const form = ref({
  salario_base: props.holerite.salario_base || 0,
  dias_trabalhados: props.holerite.dias_trabalhados || 30,
  data_pagamento: props.holerite.data_pagamento || '',
  observacoes: props.holerite.observacoes || '',
  bonus: props.holerite.bonus || 0,
  horas_extras: props.holerite.horas_extras || 0,
  adicional_noturno: props.holerite.adicional_noturno || 0,
  adicional_periculosidade: props.holerite.adicional_periculosidade || 0,
  adicional_insalubridade: props.holerite.adicional_insalubridade || 0,
  comissoes: props.holerite.comissoes || 0,
  inss: props.holerite.inss || 0,
  inss_referencia: props.holerite.inss_referencia || '',
  irrf: props.holerite.irrf || 0,
  fgts: props.holerite.fgts || 0,
  vale_transporte: props.holerite.vale_transporte || 0,
  vale_refeicao_desconto: props.holerite.vale_refeicao_desconto || 0,
  plano_saude: props.holerite.plano_saude || 0,
  plano_odontologico: props.holerite.plano_odontologico || 0,
  adiantamento: props.holerite.adiantamento || 0,
  faltas: props.holerite.faltas || 0,
  pensao_alimenticia: props.holerite.pensao_alimenticia || 0,
  desconto_afastamento: props.holerite.desconto_afastamento || 0
})

// Configuração da pensão alimentícia (carregada do banco)
const pensaoConfig = ref({
  tipo: props.holerite.pensao_tipo || 'percentual',
  percentual: props.holerite.pensao_percentual || 30,
  recorrente: props.holerite.pensao_recorrente || false
})

// Configuração do INSS (carregada do banco)
const inssConfig = ref({
  tipo: props.holerite.inss_tipo || 'percentual',
  percentual: props.holerite.inss_percentual || 7.5
})

// Formulário de novo item personalizado
const novoItem = ref({
  tipo: 'beneficio',
  descricao: '',
  valor: 0,
  vigencia_tipo: 'unico',
  data_inicio: '',
  data_fim: '',
  observacoes: ''
})

// Buscar informações da empresa e jornada do funcionário
const carregarDadosAdicionais = async () => {
  carregandoDados.value = true
  try {
    // O holerite pode ter funcionario_id ou funcionario.id
    const funcId = props.holerite.funcionario_id || props.holerite.funcionario?.id
    
    if (!funcId) {
      console.error('ID do funcionário não encontrado no holerite')
      carregandoDados.value = false
      return
    }
    
    console.log('Buscando dados do funcionário:', funcId)
    
    // Buscar dados do funcionário completo
    const funcionario: any = await $fetch(`/api/funcionarios/${funcId}`)
    console.log('Funcionário carregado:', funcionario)
    
    // Buscar empresa
    if (funcionario.empresa_id) {
      console.log('Buscando empresa:', funcionario.empresa_id)
      const response: any = await $fetch(`/api/empresas/${funcionario.empresa_id}`)
      empresaInfo.value = response.data || response
      console.log('Empresa carregada:', empresaInfo.value)
    }

    // Se não tiver dias trabalhados definidos, usar 30 como padrão
    if (!form.value.dias_trabalhados || form.value.dias_trabalhados === 0) {
      form.value.dias_trabalhados = 30
    }

    // CARREGAR CONFIGURAÇÕES PERMANENTES DE INSS E PENSÃO
    try {
      console.log('📖 Carregando configurações permanentes...')
      const configResponse: any = await $fetch(`/api/funcionarios/${funcId}/config-inss-pensao`)
      
      if (configResponse.success && configResponse.data) {
        console.log('✅ Configurações permanentes carregadas:', configResponse.data)
        
        // Se o holerite não tem configurações próprias, usar as permanentes
        if (!props.holerite.inss_tipo) {
          inssConfig.value = {
            tipo: configResponse.data.inss.tipo,
            percentual: configResponse.data.inss.percentual
          }
          
          if (configResponse.data.inss.tipo === 'fixo') {
            form.value.inss = configResponse.data.inss.valor_fixo
            form.value.inss_referencia = configResponse.data.inss.referencia
          }
          
          console.log('📊 INSS configurado com valores permanentes:', inssConfig.value)
        }
        
        if (!props.holerite.pensao_tipo && configResponse.data.pensao.ativa) {
          pensaoConfig.value = {
            tipo: configResponse.data.pensao.tipo,
            percentual: configResponse.data.pensao.percentual,
            recorrente: configResponse.data.pensao.recorrente
          }
          
          if (configResponse.data.pensao.tipo === 'fixo') {
            form.value.pensao_alimenticia = configResponse.data.pensao.valor_fixo
          }
          
          console.log('💜 Pensão configurada com valores permanentes:', pensaoConfig.value)
        }
      }
    } catch (error) {
      console.warn('⚠️ Erro ao carregar configurações permanentes (usando padrões):', error)
    }

    // Buscar itens personalizados
    await carregarItensPersonalizados(funcId)
  } catch (error) {
    console.error('Erro ao carregar dados adicionais:', error)
  } finally {
    carregandoDados.value = false
  }
}

// Carregar itens personalizados do funcionário
const carregarItensPersonalizados = async (funcId: number) => {
  try {
    const response: any = await $fetch(`/api/holerites/itens-personalizados/${funcId}`)
    
    if (response.warning) {
      console.warn('⚠️', response.warning)
    }
    
    itensPersonalizados.value = response.data || []
  } catch (error: any) {
    console.error('Erro ao carregar itens personalizados:', error)
    itensPersonalizados.value = []
    
    // Mostrar mensagem amigável se a tabela não existe
    if (error.message?.includes('PGRST205') || error.message?.includes('not exist')) {
      console.error('❌ A tabela holerite_itens_personalizados não existe!')
      console.error('📋 Execute o arquivo: EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor')
    }
  }
}

// Adicionar novo item personalizado
const adicionarItem = async () => {
  try {
    const funcId = props.holerite.funcionario_id || props.holerite.funcionario?.id
    
    if (!novoItem.value.descricao || !novoItem.value.valor || !novoItem.value.data_inicio) {
      alert('⚠️ Preencha todos os campos obrigatórios')
      return
    }

    // Se for único, data_fim = data_inicio
    const dataFim = novoItem.value.vigencia_tipo === 'unico' 
      ? novoItem.value.data_inicio 
      : novoItem.value.data_fim || null

    await $fetch('/api/holerites/itens-personalizados', {
      method: 'POST',
      body: {
        funcionario_id: funcId,
        tipo: novoItem.value.tipo,
        descricao: novoItem.value.descricao,
        valor: Number(novoItem.value.valor),
        vigencia_tipo: novoItem.value.vigencia_tipo,
        data_inicio: novoItem.value.data_inicio,
        data_fim: dataFim,
        observacoes: novoItem.value.observacoes
      }
    })

    // Recarregar lista e recalcular totais do holerite
    await carregarItensPersonalizados(funcId)
    await recalcularTotais()
    cancelarNovoItem()
    alert('✅ Item adicionado com sucesso!')
  } catch (error: any) {
    console.error('Erro ao adicionar item:', error)
    
    // Mensagem específica se a tabela não existe
    if (error.message?.includes('não existe') || error.message?.includes('EXECUTAR-ITENS-PERSONALIZADOS')) {
      alert('❌ Erro: A tabela não existe no banco de dados.\n\n📋 Execute o arquivo EXECUTAR-ITENS-PERSONALIZADOS.sql no Supabase SQL Editor.\n\nVeja a documentação em: docs/CORRECAO-ITENS-PERSONALIZADOS.md')
    } else {
      alert('❌ Erro ao adicionar item: ' + error.message)
    }
  }
}

// Recalcular totais do holerite incluindo itens personalizados
const recalcularTotais = async () => {
  try {
    const holeriteId = props.holerite.id
    if (!holeriteId) return

    const resultado = await $fetch<{ success: boolean; data: any }>(`/api/holerites/${holeriteId}/recalcular`, {
      method: 'POST'
    })

    if (resultado.success) {
      // Emitir evento para o pai atualizar os totais exibidos
      emit('atualizado', resultado.data)
      console.log('✅ Totais recalculados:', resultado.data)
    }
  } catch (error) {
    console.error('Erro ao recalcular totais:', error)
  }
}

// Remover item personalizado
const removerItem = async (itemId: number) => {
  if (!confirm('Deseja realmente remover este item?')) return

  try {
    await $fetch(`/api/holerites/itens-personalizados/${itemId}`, {
      method: 'DELETE'
    })

    const funcId = props.holerite.funcionario_id || props.holerite.funcionario?.id
    await carregarItensPersonalizados(funcId)
    await recalcularTotais()
    alert('Item removido com sucesso!')
  } catch (error) {
    console.error('Erro ao remover item:', error)
    alert('Erro ao remover item')
  }
}

// Cancelar novo item
const cancelarNovoItem = () => {
  mostrarFormNovoItem.value = false
  novoItem.value = {
    tipo: 'beneficio',
    descricao: '',
    valor: 0,
    vigencia_tipo: 'unico',
    data_inicio: '',
    data_fim: '',
    observacoes: ''
  }
}

// Cálculos
// Calcular valor de 1 dia (Salário Base / 30)
const calcularValorDia = () => {
  const salarioBase = Number(form.value.salario_base) || 0
  return salarioBase / 30
}

// Calcular salário proporcional aos dias trabalhados
const calcularSalarioProporcional = () => {
  const valorDia = calcularValorDia()
  const diasTrabalhados = Number(form.value.dias_trabalhados) || 30
  return valorDia * diasTrabalhados
}

const calcularTotalProventos = () => {
  const salarioProporcional = calcularSalarioProporcional()
  
  return (
    (isNaN(salarioProporcional) ? 0 : salarioProporcional) +
    Number(form.value.bonus || 0) +
    Number(form.value.horas_extras || 0) +
    Number(form.value.adicional_noturno || 0) +
    Number(form.value.adicional_periculosidade || 0) +
    Number(form.value.adicional_insalubridade || 0) +
    Number(form.value.comissoes || 0)
  )
}

// Calcular salário líquido base (para cálculo da pensão percentual)
const calcularSalarioLiquidoBase = () => {
  const proventos = calcularTotalProventos()
  const inss = Number(form.value.inss) || 0
  const irrf = Number(form.value.irrf) || 0
  return proventos - inss - irrf
}

// Calcular INSS
const calcularINSS = () => {
  console.log('🏛️ calcularINSS() chamado')
  console.log('   Tipo:', inssConfig.value.tipo)
  
  if (inssConfig.value.tipo === 'percentual') {
    const salarioBruto = calcularTotalProventos()
    const percentual = Number(inssConfig.value.percentual) || 0
    const inssCalculado = (salarioBruto * percentual) / 100
    
    console.log('   Salário Bruto:', salarioBruto)
    console.log('   Percentual:', percentual + '%')
    console.log('   INSS Calculado:', inssCalculado)
    
    form.value.inss = inssCalculado
    form.value.inss_referencia = '' // Limpar referência em modo percentual
  } else {
    console.log('   Modo fixo - mantendo valor:', form.value.inss)
    // Gerar referência automática se não existir
    if (!form.value.inss_referencia) {
      gerarReferenciaAutomatica()
    }
  }
  // Se for fixo, mantém o valor digitado manualmente
}

// Gerar referência automática do INSS
const gerarReferenciaAutomatica = () => {
  if (inssConfig.value.tipo === 'fixo') {
    // Usar apenas o percentual configurado
    const percentualConfig = Number(inssConfig.value.percentual) || 0
    
    if (percentualConfig > 0) {
      // Gerar apenas o percentual formatado (ex: "12.00" ou "8.90")
      form.value.inss_referencia = percentualConfig.toFixed(2)
    }
  }
}

// Atualizar referência e percentual quando o valor do INSS mudar (modo fixo)
const atualizarReferenciaINSS = () => {
  if (inssConfig.value.tipo === 'fixo') {
    // Calcular o percentual baseado no valor fixo digitado
    const valorINSS = Number(form.value.inss) || 0
    const salarioBruto = calcularTotalProventos()
    
    if (salarioBruto > 0 && valorINSS > 0) {
      const percentualCalculado = (valorINSS / salarioBruto) * 100
      inssConfig.value.percentual = percentualCalculado
      console.log(`📊 Percentual INSS atualizado: ${percentualCalculado.toFixed(2)}%`)
    }
    
    // Gerar referência automática com o percentual calculado
    gerarReferenciaAutomatica()
  }
}

// Calcular Adiantamento (40% do salário bruto proporcional)
const calcularAdiantamento = () => {
  const salarioBruto = calcularTotalProventos()
  form.value.adiantamento = salarioBruto * 0.40 // 40% fixo
}

// Calcular pensão alimentícia
const calcularPensao = () => {
  console.log('💜 calcularPensao() chamado')
  console.log('   Tipo:', pensaoConfig.value.tipo)
  
  if (pensaoConfig.value.tipo === 'percentual') {
    const liquidoBase = calcularSalarioLiquidoBase()
    const percentual = Number(pensaoConfig.value.percentual) || 0
    const pensaoCalculada = (liquidoBase * percentual) / 100
    
    console.log('   Salário Líquido Base:', liquidoBase)
    console.log('   Percentual:', percentual + '%')
    console.log('   Pensão Calculada:', pensaoCalculada)
    
    form.value.pensao_alimenticia = pensaoCalculada
  } else {
    console.log('   Modo fixo - mantendo valor:', form.value.pensao_alimenticia)
  }
  // Se for fixo, mantém o valor digitado manualmente
}

// Calcular desconto por afastamento total (zera o salário proporcional)
const calcularDescontoAfastamento = () => {
  form.value.desconto_afastamento = calcularSalarioProporcional()
}

const calcularTotalDescontos = () => {
  const totalBruto = (
    Number(form.value.inss || 0) +
    Number(form.value.irrf || 0) +
    Number(form.value.vale_transporte || 0) +
    Number(form.value.vale_refeicao_desconto || 0) +
    Number(form.value.plano_saude || 0) +
    Number(form.value.plano_odontologico || 0) +
    Number(form.value.adiantamento || 0) +
    Number(form.value.faltas || 0) +
    Number(form.value.pensao_alimenticia || 0) +
    Number(form.value.desconto_afastamento || 0)
  )
  const totalProventos = calcularTotalProventos()
  if (isNaN(totalBruto) || isNaN(totalProventos)) return 0
  return Math.min(totalBruto, totalProventos)
}

const calcularSalarioLiquido = () => {
  const liquido = calcularTotalProventos() - calcularTotalDescontos()
  return Math.max(0, liquido)
}

// Formatação
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

const formatarCNPJ = (cnpj: string) => {
  const numeros = cnpj.replace(/\D/g, '')
  return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

const formatarData = (data: string) => {
  if (!data) return ''
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')
}

// Função para sanitizar valores numéricos (converter strings vazias em 0)
const sanitizarValorNumerico = (valor: any): number => {
  if (valor === '' || valor === null || valor === undefined) return 0
  const parsed = Number(valor)
  return isNaN(parsed) ? 0 : parsed
}

// Salvar
const salvar = async () => {
  // IMPORTANTE: NÃO criar item personalizado de pensão automaticamente
  // A pensão alimentícia deve ser gerenciada APENAS pelo campo pensao_alimenticia do holerite
  // Itens personalizados devem ser criados manualmente pelo usuário na aba "Itens Personalizados"
  // Isso evita duplicação de pensão no holerite
  
  try {
    // 1. SALVAR CONFIGURAÇÕES PERMANENTES NO FUNCIONÁRIO
    const funcId = props.holerite.funcionario_id || props.holerite.funcionario?.id
    
    if (funcId) {
      console.log('💾 Salvando configurações permanentes no funcionário...')
      
      await $fetch(`/api/funcionarios/${funcId}/config-inss-pensao`, {
        method: 'PATCH',
        body: {
          // Configurações de INSS
          inss_config_tipo: inssConfig.value.tipo,
          inss_config_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
          inss_config_valor_fixo: inssConfig.value.tipo === 'fixo' ? sanitizarValorNumerico(form.value.inss) : 0,
          inss_config_referencia: form.value.inss_referencia || null,
          
          // Configurações de Pensão
          pensao_config_tipo: pensaoConfig.value.tipo,
          pensao_config_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
          pensao_config_valor_fixo: pensaoConfig.value.tipo === 'fixo' ? sanitizarValorNumerico(form.value.pensao_alimenticia) : 0,
          pensao_config_recorrente: pensaoConfig.value.recorrente,
          pensao_config_ativa: sanitizarValorNumerico(form.value.pensao_alimenticia) > 0
        }
      })
      
      console.log('✅ Configurações permanentes salvas!')
    }
    
    // 2. SALVAR DADOS DO HOLERITE
    // Sanitizar todos os valores numéricos antes de enviar
    const dadosSanitizados = {
      salario_base: sanitizarValorNumerico(form.value.salario_base),
      dias_trabalhados: sanitizarValorNumerico(form.value.dias_trabalhados),
      data_pagamento: form.value.data_pagamento || null,
      observacoes: form.value.observacoes || null,
      bonus: sanitizarValorNumerico(form.value.bonus),
      horas_extras: sanitizarValorNumerico(form.value.horas_extras),
      adicional_noturno: sanitizarValorNumerico(form.value.adicional_noturno),
      adicional_periculosidade: sanitizarValorNumerico(form.value.adicional_periculosidade),
      adicional_insalubridade: sanitizarValorNumerico(form.value.adicional_insalubridade),
      comissoes: sanitizarValorNumerico(form.value.comissoes),
      inss: sanitizarValorNumerico(form.value.inss),
      inss_referencia: form.value.inss_referencia || null,
      irrf: sanitizarValorNumerico(form.value.irrf),
      fgts: sanitizarValorNumerico(form.value.fgts),
      vale_transporte: sanitizarValorNumerico(form.value.vale_transporte),
      vale_refeicao_desconto: sanitizarValorNumerico(form.value.vale_refeicao_desconto),
      plano_saude: sanitizarValorNumerico(form.value.plano_saude),
      plano_odontologico: sanitizarValorNumerico(form.value.plano_odontologico),
      adiantamento: sanitizarValorNumerico(form.value.adiantamento),
      faltas: sanitizarValorNumerico(form.value.faltas),
      pensao_alimenticia: sanitizarValorNumerico(form.value.pensao_alimenticia),
      desconto_afastamento: sanitizarValorNumerico(form.value.desconto_afastamento),
      // Salvar configurações de INSS e Pensão no holerite também (para histórico)
      inss_tipo: inssConfig.value.tipo,
      inss_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
      pensao_tipo: pensaoConfig.value.tipo,
      pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
      pensao_recorrente: pensaoConfig.value.recorrente
    }
    
    console.log('📤 Enviando dados sanitizados do holerite:', dadosSanitizados)
    emit('save', dadosSanitizados)
  } catch (error) {
    console.error('❌ Erro ao salvar configurações permanentes:', error)
    // Continuar salvando o holerite mesmo se falhar ao salvar as configurações
    const dadosSanitizados = {
      salario_base: sanitizarValorNumerico(form.value.salario_base),
      dias_trabalhados: sanitizarValorNumerico(form.value.dias_trabalhados),
      data_pagamento: form.value.data_pagamento || null,
      observacoes: form.value.observacoes || null,
      bonus: sanitizarValorNumerico(form.value.bonus),
      horas_extras: sanitizarValorNumerico(form.value.horas_extras),
      adicional_noturno: sanitizarValorNumerico(form.value.adicional_noturno),
      adicional_periculosidade: sanitizarValorNumerico(form.value.adicional_periculosidade),
      adicional_insalubridade: sanitizarValorNumerico(form.value.adicional_insalubridade),
      comissoes: sanitizarValorNumerico(form.value.comissoes),
      inss: sanitizarValorNumerico(form.value.inss),
      inss_referencia: form.value.inss_referencia || null,
      irrf: sanitizarValorNumerico(form.value.irrf),
      fgts: sanitizarValorNumerico(form.value.fgts),
      vale_transporte: sanitizarValorNumerico(form.value.vale_transporte),
      vale_refeicao_desconto: sanitizarValorNumerico(form.value.vale_refeicao_desconto),
      plano_saude: sanitizarValorNumerico(form.value.plano_saude),
      plano_odontologico: sanitizarValorNumerico(form.value.plano_odontologico),
      adiantamento: sanitizarValorNumerico(form.value.adiantamento),
      faltas: sanitizarValorNumerico(form.value.faltas),
      pensao_alimenticia: sanitizarValorNumerico(form.value.pensao_alimenticia),
      desconto_afastamento: sanitizarValorNumerico(form.value.desconto_afastamento),
      inss_tipo: inssConfig.value.tipo,
      inss_percentual: sanitizarValorNumerico(inssConfig.value.percentual),
      pensao_tipo: pensaoConfig.value.tipo,
      pensao_percentual: sanitizarValorNumerico(pensaoConfig.value.percentual),
      pensao_recorrente: pensaoConfig.value.recorrente
    }
    emit('save', dadosSanitizados)
  }
}

// Carregar dados ao montar
onMounted(() => {
  carregarDadosAdicionais()
  // Calcular valores iniciais automaticamente
  calcularINSS() // Calcular INSS (se percentual)
  calcularAdiantamento() // Calcular adiantamento (40% do salário bruto)
  calcularPensao() // Calcular pensão (se percentual)
})

// Watch para atualizar o formulário quando o holerite mudar
watch(() => props.holerite, (novoHolerite) => {
  if (novoHolerite) {
    console.log('🔄 Holerite mudou, atualizando formulário:', novoHolerite)
    
    // Atualizar todos os campos do formulário com os valores do holerite
    form.value = {
      salario_base: novoHolerite.salario_base || 0,
      dias_trabalhados: novoHolerite.dias_trabalhados || 30,
      data_pagamento: novoHolerite.data_pagamento || '',
      observacoes: novoHolerite.observacoes || '',
      bonus: novoHolerite.bonus || 0,
      horas_extras: novoHolerite.horas_extras || 0,
      adicional_noturno: novoHolerite.adicional_noturno || 0,
      adicional_periculosidade: novoHolerite.adicional_periculosidade || 0,
      adicional_insalubridade: novoHolerite.adicional_insalubridade || 0,
      comissoes: novoHolerite.comissoes || 0,
      inss: novoHolerite.inss || 0,
      inss_referencia: novoHolerite.inss_referencia || '',
      irrf: novoHolerite.irrf || 0,
      fgts: novoHolerite.fgts || 0,
      vale_transporte: novoHolerite.vale_transporte || 0,
      vale_refeicao_desconto: novoHolerite.vale_refeicao_desconto || 0,
      plano_saude: novoHolerite.plano_saude || 0,
      plano_odontologico: novoHolerite.plano_odontologico || 0,
      adiantamento: novoHolerite.adiantamento || 0,
      faltas: novoHolerite.faltas || 0,
      pensao_alimenticia: novoHolerite.pensao_alimenticia || 0
    }
    
    // Atualizar configurações de INSS e Pensão
    inssConfig.value = {
      tipo: novoHolerite.inss_tipo || 'percentual',
      percentual: novoHolerite.inss_percentual || 7.5
    }
    
    pensaoConfig.value = {
      tipo: novoHolerite.pensao_tipo || 'percentual',
      percentual: novoHolerite.pensao_percentual || 30,
      recorrente: novoHolerite.pensao_recorrente || false
    }
    
    console.log('✅ Configurações carregadas:', {
      inss: inssConfig.value,
      pensao: pensaoConfig.value
    })
    
    // Recarregar dados adicionais
    carregarDadosAdicionais()
  }
}, { immediate: true, deep: true })

// Watchers para recalcular automaticamente
watch(() => form.value.dias_trabalhados, (novoValor, valorAnterior) => {
  console.log('🔄 Dias trabalhados mudou:', valorAnterior, '→', novoValor)
  console.log('📊 INSS Config:', inssConfig.value)
  console.log('💜 Pensão Config:', pensaoConfig.value)
  
  // Recalcular INSS se estiver em modo percentual
  if (inssConfig.value.tipo === 'percentual') {
    console.log('✅ Recalculando INSS (percentual)')
    calcularINSS()
  } else {
    console.log('⚠️ INSS está em modo fixo, não recalculando')
  }
  
  // Recalcular adiantamento (sempre 40%)
  console.log('✅ Recalculando adiantamento (40%)')
  calcularAdiantamento()
  
  // Recalcular pensão se estiver em modo percentual
  if (pensaoConfig.value.tipo === 'percentual') {
    console.log('✅ Recalculando Pensão (percentual)')
    calcularPensao()
  } else {
    console.log('⚠️ Pensão está em modo fixo, não recalculando')
  }
})

watch(() => form.value.salario_base, (novoValor, valorAnterior) => {
  console.log('🔄 Salário base mudou:', valorAnterior, '→', novoValor)
  
  // Recalcular INSS se estiver em modo percentual
  if (inssConfig.value.tipo === 'percentual') {
    console.log('✅ Recalculando INSS (percentual)')
    calcularINSS()
  }
  
  // Recalcular adiantamento (sempre 40%)
  console.log('✅ Recalculando adiantamento (40%)')
  calcularAdiantamento()
  
  // Recalcular pensão se estiver em modo percentual
  if (pensaoConfig.value.tipo === 'percentual') {
    console.log('✅ Recalculando Pensão (percentual)')
    calcularPensao()
  }
})

// Recalcular pensão quando INSS ou IRRF mudar (se pensão for percentual)
watch(() => form.value.inss, () => {
  if (pensaoConfig.value.tipo === 'percentual') {
    calcularPensao()
  }
})

watch(() => form.value.irrf, () => {
  if (pensaoConfig.value.tipo === 'percentual') {
    calcularPensao()
  }
})
</script>
