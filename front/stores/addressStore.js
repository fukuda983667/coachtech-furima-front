import { defineStore } from 'pinia';

export const useAddressStore = defineStore('address', {
    state: () => ({
        postalCode: '', // 郵便番号
        address: '',     // 住所
        buildingName: '',// 建物名
    }),

    actions: {
        // 住所情報を更新する
        setAddress(postalCode, address, buildingName) {
            this.postalCode = postalCode;
            this.address = address;
            this.buildingName = buildingName;
        },

        // 現在の住所情報をリセットする
        resetAddress() {
            this.postalCode = '';
            this.address = '';
            this.buildingName = '';
        },
    },
});