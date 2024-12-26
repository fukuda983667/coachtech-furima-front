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
                    <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
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
                    <p class="postal__code"><span>〒 </span>{{ address.postalCode }}</p>
                    <p class="address__detail">{{ address.address }}</p>
                    <p class="building_name">{{ address.buildingName }}</p>
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
definePageMeta({
    middleware: ['sanctum:auth'],
});

const paymentMethods = ref([
    { id: 1, name: 'コンビニ支払い' },
    { id: 2, name: 'カード支払い' },
]);
const selectedPaymentMethod = ref(0);
const address = ref({
    id: '',
    postalCode: '',
    address: '',
    buildingName: '',
});
const item = ref()
const loading = ref(false)  // リクエスト中の状態を管理
const router = useRouter()
const route = useRoute()
const itemId = Number(route.params.item_id);
const { user } = useSanctumAuth()
const client = useSanctumClient()


// 特定の商品詳細取得
const getItem = async () => {
    try {
        const response = await client(`/api/items/${itemId}`)

        item.value = response.item
    } catch (error) {
        console.error('商品情報取得エラー', error)
    }
}

// ユーザの住所情報取得
const getAddress = async () => {
    try {
        const changedAddressId = route.query.changedAddressId;

        if (changedAddressId) {
            const response = await client(`/api/user/address/${changedAddressId}`)
            address.value = {
                id: response.address.id || '',
                postalCode: response.address.postal_code || '',
                address: response.address.address || '',
                buildingName: response.address.building_name || '',
            };
        } else {
            const response = await client('/api/user/address/default')
            address.value = {
                id: response.address.id || '',
                postalCode: response.address.postal_code || '',
                address: response.address.address || '',
                buildingName: response.address.building_name || '',
            };
        }
    } catch (error) {
        console.error('住所情報取得エラー', error)
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
                address_id: address.value.id,
                payment_method: selectedPaymentMethod.value,
            },
        })
        // 成功時の処理
        console.log(response.message.value)

        router.push('/') // リダイレクト先
    } catch (error) {
        console.error('購入処理エラー:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}


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


onMounted(async () => {
    await getItem();
    await getAddress();
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
                    padding: 5px;
                    width: 40%;
                    font-size: 20px;
                    font-weight: 400;
                }
                .purchase__summary__data {
                    padding: 5px;
                    width: 60%;
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


@media screen and (max-width: 1024px) {
    .purchase__container {
        flex-direction: column;
        align-items: center;
        gap: 50px;

        .purchase__detail__container,
        .purchase__summary__container {
            width: 65%;
        }
    }
}
</style>