<template>
    <input
        class="search__input"
        type="text"
        placeholder="なにをお探しですか？"
        v-model="searchQuery"
    />
</template>

<script setup>
import { useItemStore } from '@/stores/itemStore';
const itemStore = useItemStore();

// Piniaの検索クエリと連動
const searchQuery = computed({
    get: () => itemStore.searchQuery,
    set: (value) => itemStore.setSearchQuery(value),
});
</script>

<style lang="scss" scoped>
.search__input {
    flex-grow: 1;
    max-width: 500px;
    min-width: 250px;
    height: 50px;
    padding: 10px;
    font-size: 22px;
    outline: none;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;
}
</style>
