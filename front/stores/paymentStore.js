import { defineStore } from 'pinia';

export const usePaymentStore = defineStore('payment', {
    state: () => ({
        selectedPaymentMethod: 0, // デフォルト値
    }),
    actions: {
        setPaymentMethod(methodId) {
            this.selectedPaymentMethod = methodId;
        },
        resetPaymentMethod() {
            this.selectedPaymentMethod = 0; // デフォルト値にリセット
        },
    },
});