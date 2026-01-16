<template>
  <section class="space-y-3">
    <header class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
      <p v-if="subtitle" class="text-xs text-gray-500">{{ subtitle }}</p>
    </header>

    <div class="overflow-hidden rounded-md">
      <table class="w-full text-sm">
        <thead class="text-gray-600 border-b border-gray-200">
          <tr>
            <th class="py-3 text-left">Fixation length</th>
            <th class="py-3 text-right">Monthly rate</th>
            <th class="py-3 text-right">Interest rate</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-for="row in rows" :key="row.years" class="hover:bg- gray-50">
            <td class="py-3 text-gray-800">{{ row.years }} Years</td>
            <td class="py-3 text-right tabular-nums text-gray-700">
              {{ formatMoney(row.monthlyRate) }}
            </td>
            <td class="py-3 text-right tabular-nums text-gray-700">
              {{ row.borrowingRate.toFixed(2) }}%
            </td>
          </tr>

          <tr v-if="rows.length === 0">
            <td colspan="3" class="py-6 text-center text-gray-500">No rates available.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type RateTableEntry = {
  borrowingRate: number
  monthlyRate: number
}

export type RatesTable = Record<string, RateTableEntry>

const props = withDefaults(
  defineProps<{
    table: RatesTable | null
    title?: string
    subtitle?: string
    currency?: string
  }>(),
  {
    title: 'Rates table',
    currency: '€',
  },
)

const rows = computed(() => {
  if (!props.table) return []
  return Object.entries(props.table)
    .map(([years, v]) => ({
      years: Number(years),
      borrowingRate: v.borrowingRate,
      monthlyRate: v.monthlyRate,
    }))
    .sort((a, b) => a.years - b.years)
})

const formatMoney = (n: number) =>
  `${props.currency}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
</script>
