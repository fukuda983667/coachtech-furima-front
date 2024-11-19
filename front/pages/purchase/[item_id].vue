<template>
    <h1>item_id : {{ itemId }}</h1>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});

const route = useRoute()
// 動的パラメータを取得
const itemId = route.params.item_id
</script>