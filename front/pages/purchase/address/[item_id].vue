<template>
    <div class="address__container">
        <h2 class="title">住所の変更</h2>

        <form class="form" @submit.prevent="updateAddress">
            <div class="form__content">
                <label class="label" for="postal-code">郵便番号</label>
                <input class="input" type="text" id="postal-code" v-model="postalCode"/>
                <p class="error__message" v-if="postalCodeError">{{ postalCodeError }}</p>
            </div>
            <div class="form__content">
                <label class="label" for="address">住所</label>
                <input class="input" type="text" id="address" v-model="address"/>
                <p class="error__message" v-if="addressError">{{ addressError }}</p>
            </div>
            <div class="form__content">
                <label class="label" for="building-name">建物名</label>
                <input class="input" type="text" id="building-name" v-model="buildingName"/>
                <p class="error__message" v-if="buildingNameError">{{ buildingNameError }}</p>
            </div>

            <button class="update__address__button__submit" type="submit" :disabled="!isValid || loading">更新する</button>
        </form>
    </div>
</template>


<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});

import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const router = useRouter();
const route = useRoute();
const itemId = Number(route.params.item_id);
const loading = ref(false);
const client = useSanctumClient()


// バリデーション設定▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
const validationSchema = yup.object({
    postalCode: yup
        .string()
        .required("郵便番号を入力してください")
        .matches(/^\d{3}-\d{4}$/, "郵便番号はXXX-XXXXの形式で入力してください"),
    address: yup
        .string()
        .required("住所を入力してください")
        .max(255, "住所は255文字以内で入力してください"),
    buildingName: yup
        .string()
        .required("建物名を入力してください")
        .max(255, "建物名は255文字以内で入力してください"),
});

// useFormでバリデーション設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドのバリデーション設定
const { value: postalCode, errorMessage: postalCodeError } = useField("postalCode");
const { value: address, errorMessage: addressError } = useField("address");
const { value: buildingName, errorMessage: buildingNameError } = useField("buildingName");

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// バリデーション設定▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


// 住所情報を更新する関数
const updateAddress = async () => {
    if (loading.value) return;
    loading.value = true;

    try {
        const response = await client('/api/user/address', {
            method: 'POST',
            body: {
                postal_code: postalCode.value,
                address: address.value,
                building_name: buildingName.value,
            },
        });

        // 登録後の住所情報を取得
        const newAddress = response.address;
        // 住所更新後、購入ページに遷移
        await router.push({ name: 'purchase-item_id', params: { item_id: itemId }, query: {changedAddressId: newAddress.id}});
    } catch (error) {
        console.error('住所更新エラー', error);
    } finally {
        loading.value = false;
    }
};
</script>


<style lang="scss" scoped>
.address__container {
    display: flex;
    margin: 50px auto 0;
    padding: 0 20px;
    max-width: 1350px;
    flex-direction: column; /* 子要素を縦方向に並べる */
    align-items: center;

    .title {
        font-size: 36px;
        font-weight: 700;
        margin: 0;
    }

    .form {
        margin-top: 60px;
        width: 100%; /* カードの幅を設定 */
        max-width: 680px;
        box-sizing: border-box;
        .form__content {
            display: flex;
            margin-top: 65px;
            flex-direction: column; /* 子要素を縦方向に並べる */
            &:first-of-type {
                margin: 0;
            }

            .label {
                font-size: 24px;
                font-weight: 700;
            }
            .input {
                margin-top: 5px;
                padding: 5px 7px;
                height: 45px;
                font-size: 24px;
                border: 1px solid #5F5F5F;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .error__message {
                margin: 15px 0 0;
                font-size: 18px;
                font-weight: 700;
                color: red;
            }
        }

        .update__address__button__submit {
            display: inline-block;
            margin-top: 100px;
            height: 60px;
            width: 100%;
            color: white;
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            background-color: #FF5555;
            border: none;
            border-radius: 5px;
            line-height: 60px;
            cursor: pointer;
            transition: background-color 0.3s ease;

            &:disabled {
                cursor: not-allowed;
            }
            &:not(:disabled):hover {
                background-color: #D64545; /* ホバー時の色 */
            }
        }
    }
}
</style>