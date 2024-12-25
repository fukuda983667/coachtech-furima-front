<template>
    <div class="filter__container">
        <div class="filter__button__wrapper">
            <button
                class="filter__button"
                :class="{ active: filterType === 'all' }"
                @click="setFilterType('all')"
            >
                おすすめ
            </button>
            <button
                class="filter__button"
                :class="{ active: filterType === 'favorites' }"
                @click="setFilterType('favorites')"
            >
                マイリスト
            </button>
        </div>
    </div>


    <div class="list__container">
        <ul class="items__list">
            <li class="list__item" v-for="item in filteredItems" :key="item.id">
                <Item class="item" :item="item" />
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});

import { useItemStore } from '@/stores/itemStore';

const itemStore = useItemStore();
const { fetchItems, setFilterType } = itemStore; //itemStoreから関数取得

const filterType = computed(() => itemStore.filterType); //itemStoreからデータを参照
const filteredItems = computed(() => itemStore.filteredItems); //itemStoreからデータを参照


// コンポーネントがマウントされたときに取得
onMounted(async () => {
    await fetchItems()
})
</script>

<style lang="scss" scoped>
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
        margin-left: -30px;
        margin-right: -30px;

        .list__item {
            margin-bottom: 50px;
            padding: 0 30px;
            width: 25%; /* 各アイテムの幅を25%に設定 */
            list-style: none;
            box-sizing: border-box; /* パディングを含めて幅を計算 */
        }
    }
}



/* タブレット（～1024px） */
@media screen and (max-width: 1024px) {
    .list__container {
        padding: 0 20px;
        .items__list {
            margin-left: -15px;
            margin-right: -15px;

            .list__item {
                margin-bottom: 25px;
                padding: 0 15px;
                width: 33.3%; /* 各アイテムの幅を50%に設定 */

                :deep(.item__name) {
                    font-size: 20px; // :deepで子コンポーネント(Item)までスコープ拡張
                }
            }
        }
    }
}
</style>
