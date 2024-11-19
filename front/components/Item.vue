<template>
    <nuxt-link :to="{ name: 'item-item_id', params: { item_id: item.id } }" class="item">
        <!-- 商品画像 -->
        <img :src="item.image_path" alt="商品画像" class="item__image" v-if="item.image_path" />

        <!-- 商品名 -->
        <p class="item__name">{{ item.name }}</p>
    </nuxt-link>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

</script>

<style lang="scss" scoped>
.item {
    text-decoration: none;
    color: black;
    cursor: pointer;

    .item__image {
        width: 100%;
        aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
        object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
        border-radius: 4px;
    }

    .item__name {
        font-size: 24px;
        margin: 0;
    }
}

</style>