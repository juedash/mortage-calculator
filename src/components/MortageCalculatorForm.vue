<template>
  <form class="mx-auto flex flex-col w-full max-w-xs gap-6 py-10" @submit.prevent="emitSubmit">
    <!-- Commission -->
    <fieldset class="space-y-2">
      <legend class="text-sm font-medium text-slate-700">Real estate commission</legend>

      <div class="inline-flex w-full rounded-md border border-slate-200 bg-slate-100 p-1">
        <input
          id="commission-yes"
          class="peer/yes sr-only"
          type="radio"
          name="commission"
          v
          :value="true"
          v-model="commission"
        />
        <label
          for="commission-yes"
          class="flex-1 cursor-pointer select-none rounded-md px-4 py-2 text-center text-sm font-semibold text-slate-500 transition hover:text-slate-700 peer-checked/yes:bg-white peer-checked/yes:text-primary peer-checked/yes:shadow-sm peer-checked/yes:ring-1 peer-checked/yes:ring-slate-200"
        >
          Yes
        </label>

        <input
          id="commission-no"
          class="peer/no sr-only"
          type="radio"
          name="commission"
          :value="false"
          v-model="commission"
        />
        <label
          for="commission-no"
          class="flex-1 cursor-pointer select-none rounded-md px-4 py-2 text-center text-sm font-semibold text-slate-500 transition hover:text-slate-700 peer-checked/no:bg-white peer-checked/no:text-primary peer-checked/no:shadow-sm peer-checked/no:ring-1 peer-checked/no:ring-slate-200"
        >
          No
        </label>
      </div>

      <ErrorMessage name="commission" class="text-xs text-red-500" />
    </fieldset>

    <!-- Property price -->
    <div class="space-y-1">
      <NumberStepper
        label="Property Purchase Price"
        :model-value="propertyPrice"
        :step="1000"
        :min="0"
        required
        @update:modelValue="setAndTouchPropertyPrice"
      />
      <ErrorMessage name="propertyPrice" class="text-xs text-red-500" />
    </div>

    <!-- Total savings -->
    <div class="space-y-1">
      <NumberStepper
        label="Total Savings"
        :model-value="totalSavings"
        :step="1000"
        :min="0"
        required
        @update:modelValue="setAndTouchTotalSavings"
      />
      <ErrorMessage name="totalSavings" class="text-xs text-red-500" />
    </div>

    <!-- Annual repayment rate -->
    <fieldset class="space-y-2">
      <label for="annualRepaymentRate" class="text-sm font-medium text-slate-700">
        Annual Repayment Rate
      </label>

      <div
        class="flex items-center w-full max-w-xs rounded-md border border-slate-200 bg-slate-100 px-3 py-2"
      >
        <input
          id="annualRepaymentRate"
          name="annualRepaymentRate"
          inputmode="decimal"
          placeholder="0"
          class="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
          v-model.number="annualRepaymentRate"
          @blur="touchAnnualRepaymentRate(true)"
        />
        <span class="ml-2 shrink-0 select-none text-sm font-semibold text-slate-500">%</span>
      </div>

      <ErrorMessage name="annualRepaymentRate" class="text-xs text-red-500" />
    </fieldset>

    <button
      type="submit"
      :disabled="!meta.valid || isSubmitting"
      class="w-full max-w-xs rounded-md hover:cursor-pointer bg-primary py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      Save
    </button>
  </form>
</template>

<script setup lang="ts">
import { useForm, useField, ErrorMessage } from 'vee-validate'
import { object, boolean, number } from 'yup'
import NumberStepper from './NumberStepper.vue'
import { useDebounceFn } from '@vueuse/core'
import { watch } from 'vue'
import type { MortgageFormValues } from '@/types/MortageCalculator'

const emit = defineEmits<{
  (e: 'change', values: MortgageFormValues): void
  (e: 'submit', values: MortgageFormValues): void
}>()

const schema = object({
  commission: boolean().required('Commission is required'),

  propertyPrice: number()
    .typeError('Property purchase price must be a number')
    .moreThan(0, 'Property purchase price must be greater than 0')
    .required('Property purchase price is required'),

  totalSavings: number()
    .typeError('Total savings must be a number')
    .moreThan(0, 'Total savings must be greater than 0')
    .required('Total savings is required'),

  annualRepaymentRate: number()
    .typeError('Annual repayment rate must be a number')
    .min(0, 'Must be 0 or more')
    .max(100, 'Must be 100 or less')
    .required('Annual repayment rate is required'),
})

const { handleSubmit, validate, values, meta, isSubmitting } = useForm({
  validationSchema: schema,
  validateOnMount: true,
  initialValues: {
    commission: false,
    propertyPrice: 320000,
    totalSavings: 80000,
    annualRepaymentRate: 2,
  },
})

const { value: commission } = useField<boolean>('commission')

const {
  value: propertyPrice,
  setValue: setPropertyPrice,
  setTouched: touchPropertyPrice,
} = useField<number>('propertyPrice')

const {
  value: totalSavings,
  setValue: setTotalSavings,
  setTouched: touchTotalSavings,
} = useField<number>('totalSavings')

const { value: annualRepaymentRate, setTouched: touchAnnualRepaymentRate } =
  useField<number>('annualRepaymentRate')

const setAndTouchPropertyPrice = (v: number) => {
  setPropertyPrice(v)
  touchPropertyPrice(true)
}

const setAndTouchTotalSavings = (v: number) => {
  setTotalSavings(v)
  touchTotalSavings(true)
}

const emitChange = useDebounceFn(async () => {
  const res = await validate()
  if (!res.valid) return

  const payload: MortgageFormValues = {
    commission: values.commission,
    propertyPrice: values.propertyPrice,
    totalSavings: values.totalSavings,
    annualRepaymentRate: values.annualRepaymentRate,
  }

  emit('change', payload)
}, 500)

const emitSubmit = useDebounceFn(() => {
  handleSubmit((v) => emit('submit', v))()
}, 500)

watch([commission, propertyPrice, totalSavings, annualRepaymentRate], () => {
  emitChange()
})
</script>
