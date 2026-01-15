<template>
  <fieldset class="space-y-2">
    <legend class="text-sm font-medium text-slate-700">{{ label }}</legend>

    <div class="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-3 py-2">
      <button type="button" class="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition
               hover:bg-slate-200 hover:text-primary
               active:scale-95
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100
               disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="disabled || (min !== undefined && modelValue <= min)" @click="stepDown" aria-label="Decrease value">
        <span class="text-2xl leading-none">−</span>
      </button>

      <div class="flex-1 px-3 text-center">
        <input :id="inputId" :name="name" :disabled="disabled" inputmode="numeric" autocomplete="off" class="w-full bg-transparent text-center text-sm font-semibold text-slate-700
                 placeholder:text-slate-400 focus:outline-none" :value="display" @input="onInput" @blur="onBlur"
          :aria-required="required || undefined" />
      </div>

      <button type="button" class="grid h-8 w-8 place-items-center rounded-md text-slate-500 transition
               hover:bg-slate-200 hover:text-primary
               active:scale-95
               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-100
               disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="disabled || (max !== undefined && modelValue >= max)" @click="stepUp" aria-label="Increase value">
        <span class="text-2xl leading-none">+</span>
      </button>
    </div>

    <p v-if="hint" class="text-xs text-slate-500">{{ hint }}</p>
  </fieldset>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { NumberStepper } from "@/types";

const props = withDefaults(defineProps<NumberStepper>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", v: number): void;
}>();

const clamp = (n: number) => {
  if (props.min !== undefined) n = Math.max(props.min, n);
  if (props.max !== undefined) n = Math.min(props.max, n);
  return n;
};

const stepUp = () => emit("update:modelValue", clamp(props.modelValue + props.step));
const stepDown = () => emit("update:modelValue", clamp(props.modelValue - props.step));


const raw = ref(String(props.modelValue));

watch(
  () => props.modelValue,
  (v) => {
    // keep input in sync when value changes from buttons/parent
    raw.value = String(v);
  }
);

const parse = (s: string) => {
  // allow only digits (and optional decimal if you want)
  const cleaned = s.replace(/[^\d]/g, "");
  if (cleaned === "") return null;
  return Number(cleaned);
};

const display = computed(() => raw.value);

const onInput = (e: Event) => {
  const v = (e.target as HTMLInputElement).value;
  raw.value = v;

  const n = parse(v);
  if (n === null) return;

  emit("update:modelValue", clamp(n));
};

const onBlur = () => {
  const n = parse(raw.value);
  const finalValue = n === null ? (props.min ?? 0) : clamp(n);
  emit("update:modelValue", finalValue);
  raw.value = String(finalValue);
};
</script>
