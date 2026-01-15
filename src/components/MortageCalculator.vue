<template>
  <section class="bg-gray-50 m-auto min-h-screen w-full">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-3 w-full gap-6 items-start">
        <main class="md:col-span-2">
          <CardSkeleton>
            <h2 class="text-2xl font-semibold tracking-tight text-center">Mortgage Calculator</h2>
            <MortageCalculatorForm @change="onFormChange" />
          </CardSkeleton>
        </main>

        <aside class="md:col-span-1 space-y-6">
          <CardSkeleton>
            <h3 class="text-lg font-semibold">Implied loan</h3>
            <p class="mt-2 text-2xl font-semibold text-slate-700">
              {{ formatMoney(rawLoanAmount) }}
            </p>
          </CardSkeleton>

          <CardSkeleton>
            <h3 class="text-lg font-semibold">Loan to value</h3>
            <p class="mt-2 text-2xl font-semibold text-slate-700">
              {{ (loanToValue * 100).toFixed(1) }}%
            </p>
          </CardSkeleton>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { MortgageFormValues } from "@/types/MortageCalculator";
import CardSkeleton from "./CardSkeleton.vue";
import MortageCalculatorForm from "./MortageCalculatorForm.vue";

import { useMortgageCalculator } from "@/composables/useMortgageCalculator";
import { useTaxStore } from "@/stores/taxStore";

const propertyPrice = ref(500000);
const totalSavings = ref(100000);
const commission = ref(false);

const taxStore = useTaxStore();
const { brokerTax, cityTax } = taxStore;

const { rawLoanAmount, loanToValue } = useMortgageCalculator({
  propertyPrice,
  totalSavings,
  commission: commission,
  brokerTax,
  cityTax,
});

// update parent refs from child form (debounced in the child)
const onFormChange = (values: MortgageFormValues) => {
  propertyPrice.value = values.propertyPrice;
  totalSavings.value = values.totalSavings;
  commission.value = values.commission;
};

const formatMoney = (n: number) => n.toLocaleString();
</script>
