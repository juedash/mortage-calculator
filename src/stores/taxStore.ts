import { defineStore } from "pinia";
import { ref } from "vue";

export const useTaxStore = defineStore("tax", () => {
  const brokerTax = ref(0.035);
  const cityTax = ref(0.06);

  return { brokerTax, cityTax };
});
