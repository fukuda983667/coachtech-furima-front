<template>
    <nuxt-link :to="{ name: 'item-item_id', params: { item_id: item.id } }" class="item">
        <!-- 商品画像 -->
        <div class="item__image__wrapper">
            <img :src="item.image_path" alt="商品画像" class="item__image" v-if="item.image_path" />
            <img class="label__sold" src="~assets/icons/sold.svg" alt="Soldアイコン" v-if="item.is_sold" />
        </div>
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

    .item__image__wrapper {
        position: relative;
        width: 100%;
        aspect-ratio: 1 / 1;
        border-radius: 4px;
        overflow: hidden;

        .item__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .label__sold {
            position: absolute;
            top: 0;
            left: 0;
            width: 35%;
        }
    }

    .item__name {
        font-size: 24px;
        margin: 0;
    }
}
</style>