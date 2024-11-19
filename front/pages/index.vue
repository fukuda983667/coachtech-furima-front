<template>
    <h2>index.vue</h2>
    <div class="list__container">
        <ul class="items__list">
            <li class="list__item" v-for="item in items" :key="item.id">
                <Item :item="item" />
            </li>
        </ul>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});


const items = ref()

const getItems = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/items')
        // レスポンスのJSONデータを取得
        const data = await response.json();

        // 取得したデータの items プロパティを items に格納
        items.value = data.items;
        console.log(items.value)
    } catch (error) {
        console.error('全アイテム取得エラー', error)
    }
}

// コンポーネントがマウントされたときに取得
onMounted(async () => {
    await getItems()
})
</script>

<style lang="scss" scoped>
.list__container {
    .items__list {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        margin-left: -35px;
        margin-right: -35px;
    }

    .list__item {
        margin-bottom: 50px;
        padding: 0 35px;
        width: 25%; /* 各アイテムの幅を25%に設定 */
        list-style: none;
        box-sizing: border-box; /* パディングを含めて幅を計算 */
    }
}
</style>