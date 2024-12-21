<template>
    <div class="mypage__header">
        <div class="mypage__header__container">
            <div class="user__detail">
                <div class="user__icon">
                    <img
                        class="user__icon__image"
                        v-if="user.image_path"
                        :src="user.image_path"
                        alt="ユーザーアイコン"
                    />
                </div>
                <h2 class="user__name">{{ user.name }}</h2>
            </div>

            <NuxtLink class="link" to="/mypage/profile">プロフィールを編集</NuxtLink>
        </div>
    </div>

    <div class="filter__container">
        <div class="filter__button__wrapper">
            <button
                class="filter__button"
                :class="{ active: filterType === 'listed' }"
                @click="setFilterType('listed')"
            >
                出品した商品
            </button>
            <button
                class="filter__button"
                :class="{ active: filterType === 'purchased' }"
                @click="setFilterType('purchased')"
            >
                購入した商品
            </button>
        </div>
    </div>

    <div class="list__container">
        <ul class="items__list">
            <li class="list__item" v-for="item in filteredItems" :key="item.id">
                <Item :item="item" />
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});


const purchasedItems = ref([])
const listedItems = ref([])
const filterType = ref('listed') // 初期値を出品アイテムに設定
const route = useRoute();
const router = useRouter();

const { user } = useSanctumAuth()


const client = useSanctumClient()
const getMyPageItems = async () => {
    try {
        const response = await client('/api/user/my-page/items')

        purchasedItems.value = response.purchased_items,
        listedItems.value = response.listed_items
    } catch (error) {
        console.error('コメント取得エラー', error)
    }
}


// フィルターされたアイテムを動的に計算
const filteredItems = computed(() => {
    if (filterType.value === 'listed') {
        return listedItems.value;
    } else if (filterType.value === 'purchased') {
        return purchasedItems.value;
    }
    return [];
});

// フィルターを変更し、URL を更新
const setFilterType = (type) => {
    filterType.value = type;

    // クエリパラメータを更新 urlが変わる
    router.push({ query: { page: type === 'listed' ? 'sell' : 'buy' } });
};


onMounted(async () => {
    await getMyPageItems();

    // ページ再読み込みの時、クエリパラメータを取得してフィルターセット
    const queryPage = route.query.page;
    if (queryPage === 'buy') {
        filterType.value = 'purchased';
    } else if (queryPage === 'sell') {
        filterType.value = 'listed';
    }
})
</script>


<style lang="scss" scoped>
.mypage__header {
    margin: 80px auto 0;
    padding: 0 20px;
    max-width: 1350px;
    .mypage__header__container {
        display: flex;
        margin: 0 auto;
        max-width: 1050px;
        align-items: center;
        justify-content: space-between;

        .user__detail {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 50px;

            .user__icon {
                width: 150px;
                box-sizing: border-box;
                .user__icon__image {
                    width: 100%;
                    aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
                    object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
                    border-radius: 50%; /* 円形にする */
                    border: 2px solid #D9D9D9; /* 灰色のボーダー */
                }
            }

            .user__name {
                margin: 0;
                font-size: 36px;
            }
        }

        .link {
            display: inline-block;
            margin: 0;
            height: 60px;
            width: 300px;
            color: #FF5555;
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            border: 2px solid #FF5555;
            border-radius: 10px;
            line-height: 56px;
            box-sizing: border-box;
            transition: background-color 0.3s ease;
            &:hover {
                color: #D64545; /* ホバー時の色 */
                border-color: #D64545;
            }
        }
    }
}


.filter__container {
    position: sticky; /* 親要素に対してスクロール追従 */
    top: 80px;
    padding-top: 40px;
    z-index: 10;
    background-color: #fff;
    padding-bottom: 5px;
    border-bottom: 2px solid #5F5F5F;
    .filter__button__wrapper {
        margin: 0 auto;
        padding: 0 20px;
        max-width: 1350px;
        .filter__button {
            margin-left: 90px;
            background: none;
            color: #5f5f5f; /* 非選択状態の色 */
            font-size: 24px;
            font-weight: 700;
            border: none;
            cursor: pointer;

            &.active {
                color: red; /* 選択状態の色 */
            }
        }
    }
}


.list__container {
    margin: 40px auto 0;
    padding: 0 20px;
    max-width: 1350px;
    .items__list {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        margin-left: -35px;
        margin-right: -35px;
    }

    .list__item {
        margin-bottom: 50px;
        padding: 0 clamp(10px, 2.5%, 30px);
        width: 25%; /* 各アイテムの幅を25%に設定 */
        list-style: none;
        box-sizing: border-box; /* パディングを含めて幅を計算 */
    }
}
</style>