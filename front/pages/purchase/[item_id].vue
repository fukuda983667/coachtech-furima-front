<template>
    <div class="purchase__container" v-if="item">
        <div class="purchase__detail__container">

            <div class="item__detail">
                <div class="item__detail__image">
                    <img :src="item.image_path" alt="商品画像" class="item__image"/>
                </div>
                <div class="item__detail__text">
                    <p class="item__name">{{ item.name }}</p>
                    <p class="item__price__text">&yen; <span class="item__price">{{ formatPrice(item.price) }}</span></p>
                </div>
            </div>

            <div class="purchase__payment__container">
                <label for="payment-method" class="label">支払い方法</label>
                <select
                    id="payment-method"
                    v-model="selectedPaymentMethod"
                    class="purchase__dropdown"
                    :class="{ 'default__color': selectedPaymentMethod === 0 }"
                >
                    <option value=0 disabled>選択してください</option>
                    <option
                        v-for="method in paymentMethods"
                        :key="method.id"
                        :value="method.id"
                    >
                        {{ method.name }}
                    </option>
                </select>
            </div>

            <div class="purchase__address__container">
                <div class="address__header">
                    <p class="address__label">配送先</p>
                    <nuxt-link
                        :to="{ name: 'purchase-address-item_id', params: { item_id: item.id } }"
                        class="link"
                    >
                        変更する
                    </nuxt-link>
                </div>
                <div class="address__text">
                    <p class="postal__code"><span>〒 </span>{{ addressStore.postalCode }}</p>
                    <p class="address__detail">{{ addressStore.address }}</p>
                    <p class="building_name">{{ addressStore.buildingName }}</p>
                </div>
            </div>

        </div>


        <div class="purchase__summary__container">

            <table class="purchase__summary__table">
                <tr class="purchase__summary__row">
                    <th class="purchase__summary__header">商品代金</th>
                    <td class="purchase__summary__data">
                        <span class="purchase__price__text">&yen; </span>{{ formatPrice(item.price) }}
                    </td>
                </tr>
                <tr class="purchase__summary__row">
                    <th class="purchase__summary__header">支払い方法</th>
                    <td class="purchase__summary__data">{{ selectedPaymentMethodName || '未選択' }}</td>
                </tr>
            </table>

            <p v-if="errorMessage" class="error__message">
                {{ errorMessage }}
            </p>

            <button
                class="purchase__button__submit"
                @click="purchaseSubmit"
                :disabled="!isValidPaymentMethod || loading"
            >
                購入する
            </button>

        </div>
    </div>
</template>


<script setup>
import { useAddressStore } from '~/stores/addressStore';
import { usePaymentStore } from '~/stores/paymentStore';

definePageMeta({
    middleware: ['sanctum:auth'],
});

const item = ref()
const paymentMethods = ref([]); // 支払い方法の選択肢をバックから受け取る
const loading = ref(false)  // リクエスト中の状態を管理
const router = useRouter()
const route = useRoute()
const { user } = useSanctumAuth()
const client = useSanctumClient()
// 動的パラメータを取得。そのまま取得すると文字列としてidが格納されてしまう。
const itemId = Number(route.params.item_id);
const addressStore = useAddressStore();
const paymentStore = usePaymentStore();

// 特定の商品詳細取得
const getItem = async () => {
    try {
        const response = await client(`http://localhost:8080/api/items/${itemId}`)

        item.value = response.item
    } catch (error) {
        console.error('商品情報取得エラー', error)
    }
}

// 支払い方法の選択肢をバックから取得
const getPaymentMethods = async () => {
    try {
        const response = await client('http://localhost:8080/api/payment-methods')

        paymentMethods.value = response.paymentMethods
    } catch (error) {
        console.error('支払い方法選択肢取得エラー', error)
    }
}

// 購入リクエスト送信
const purchaseSubmit = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/purchases', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                item_id: item.value.id,
                payment_method_id: selectedPaymentMethod.value,
                postal_code: addressStore.postalCode,
                address: addressStore.address,
                building_name: addressStore.buildingName,
            },
        })
        // 成功時の処理
        console.log(response.message.value)
        // アドレス情報をリセット
        addressStore.resetAddress();
        // 支払い方法をリセット
        paymentStore.resetPaymentMethod();

        router.push('/') // リダイレクト先
    } catch (error) {
        console.error('購入処理エラー:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}

// 支払い方法をpiniaから取得、変更したらpiniaの値を更新→改めてpiniaから取得
const selectedPaymentMethod = computed({
    get: () => paymentStore.selectedPaymentMethod, // ストアの値を取得
    set: (value) => paymentStore.setPaymentMethod(value), // ストアの値を更新
});

// 選択された支払い方法名を取得
const selectedPaymentMethodName = computed(() => {
    const method = paymentMethods.value.find(method => method.id === selectedPaymentMethod.value);
    return method ? method.name : null;
});

// 支払い方法が正しく選択されているかどうかを確認する計算プロパティ
const isValidPaymentMethod = computed(() => {
    return selectedPaymentMethod.value !== null && selectedPaymentMethod.value !== 0;
});

// 価格をカンマ区切りでフォーマット
const formatPrice = (price) => {
    if (!price) return '';
    return price.toLocaleString('ja-JP');
};

// ユーザー情報をもとに住所の初期値を設定
const setAddressInitialValues = () => {
    if (!addressStore.postalCode) addressStore.postalCode = user.value.postal_code || '';
    if (!addressStore.address) addressStore.address = user.value.address || '';
    if (!addressStore.buildingName) addressStore.buildingName = user.value.building_name || '';
};

onMounted(async () => {
    await getItem();
    await getPaymentMethods();
    await setAddressInitialValues();
})
</script>


<style lang="scss" scoped>
.purchase__container {
    display: flex;
    margin: 60px auto 0;
    padding: 0 20px;
    max-width: 1350px;

    // 画面左側支払い方法選択画面▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    .purchase__detail__container {
        padding: 0 2.8%;
        width: 65%;

        .item__detail {
            display: flex;
            gap: 50px;
            padding-bottom: 50px;
            border-bottom: 1px solid #000000;
            .item__detail__image {
                width: 180px;
                box-sizing: border-box;
                .item__image {
                    position: sticky; /* 追従する設定 */
                    top: 180px; /* 上部からの距離 */
                    width: 100%;
                    aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
                    object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
                    border-radius: 4px;
                }
            }

            .item__name {
                margin: 0;
                font-size: 30px;
                font-weight: 700;
            }
            .item__price__text {
                margin: 20px 0;
                font-size: 27px;
                .item__price {
                    font-size: 30px;
                }
            }
        }

        .purchase__payment__container {
            display: flex;
            flex-direction: column; /* 子要素を縦方向に並べる */
            margin-top: 30px;
            gap: 50px;
            padding-bottom: 60px;
            border-bottom: 1px solid #000000;
            .label {
                margin-left: 35px;
                font-size: 20px;
                font-weight: 700;
            }
            .purchase__dropdown {
                margin-left: 95px;
                width: 265px;
                height: 30px;
                font-size: 16px;
                font-weight: 700;
                border: 1px solid #5F5F5F;
                border-radius: 4px;
            }
            /* 初期状態のスタイル */
            .purchase__dropdown.default__color {
                color: #5F5F5F;
            }
        }

        .purchase__address__container {
            display: flex;
            flex-direction: column; /* 子要素を縦方向に並べる */
            margin-top: 30px;
            gap: 50px;
            padding-bottom: 60px;
            border-bottom: 1px solid #000000;

            .address__header {
                display: flex;
                margin: 0 35px;
                justify-content: space-between;
                align-items: center;
                .address__label {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                }
                .link {
                    font-size: 20px;
                    color: #0073CC;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    &:hover {
                        color: #551A8B;
                    }
                }
            }

            .address__text {
                display: flex;
                flex-direction: column; /* 子要素を縦方向に並べる */
                gap: 10px;
                margin-left: 95px;
                font-size: 20px;
                font-weight: 600;
                & p {
                    margin: 0;
                }
            }
        }
    }
    // 画面左側支払い方法選択画面▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

    // 画面右側サマリ画面▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
    .purchase__summary__container {
        padding: 0 2.8%;
        width: 35%;

        .purchase__summary__table {
            width: 100%;
            height: 235px;
            border-collapse: collapse;
            .purchase__summary__row {
                border: 1px solid black;

                .purchase__summary__header {
                    padding: 10px;
                    width: 50%;
                    font-size: 20px;
                    font-weight: 400;
                }
                .purchase__summary__data {
                    padding: 10px;
                    width: 50%;
                    text-align: center;
                    font-size: 24px;
                    .purchase__price__text {
                        font-size: 20px;
                    }
                }
            }
        }

        .purchase__button__submit {
            display: inline-block;
            margin-top: 60px;
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
    // 画面右側サマリ画面▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
}
</style>