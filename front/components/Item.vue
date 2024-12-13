<template>
    <nuxt-link :to="{ name: 'item-item_id', params: { item_id: item.id } }" class="item">
        <!-- 商品画像 -->
        <div class="item__image__wrapper">
            <img :src="item.image_path" alt="商品画像" class="item__image" v-if="item.image_path" />
            <div v-if="item.is_sold" class="item__sold__label">
                <span class="item__sold__text">Sold</span>
            </div>
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

        .item__sold__label {
            position: absolute;
            top: -23%; /* 上から5%移動 */
            left: -23%; /* 左から5%移動 */
            width: 45%;
            height: 45%;
            background-color: red;
            display: flex;
            align-items: flex-end; /* 下側に沿わせる */
            justify-content: center;
            transform: rotate(-45deg); /* 45度回転 */
            transform-origin: center; /* 回転の基準を図形の中央に設定 */

            .item__sold__text {
                margin-bottom: 4%; /* 下側に余白を追加 */
                color: white;
                font-size: clamp(8px, 1.6vw, 24px);
                font-weight: bold;
            }
        }
    }

    .item__name {
        font-size: 24px;
        margin: 0;
    }
}
</style>