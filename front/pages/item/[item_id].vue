<template>
    <div class="item-detail__container" v-if="item">
        <div class="item-detail__image">
            <img :src="item.image_path" alt="商品画像" class="item__image"/>
        </div>

        <div class="item-detail__sidebar">
            <h2 class="item__name">{{ item.name }}</h2>
            <p class="item__brand">{{ item.brand }}</p>
            <p class="item__price__text">&yen;<span class="item__price">{{ item.price }}</span>(税込)</p>

            <div class="button__wrapper">
                <!-- お気に入りボタンとコメント件数表示器？ -->
            </div>

            <nuxt-link :to="{ name: 'purchase-item_id', params: { item_id: item.id } }" class="button__purchase">
                購入手続きへ
            </nuxt-link>

            <div class="item__description__wrapper">
                <h3 class="item__description__text">商品説明</h3>
                <span class="item__description">{{ item.description }}</span>
            </div>

            <div class="item__information__wrapper">
                <h3 class="item__information__text">商品の情報</h3>

                <div class="item__category__wrapper">
                    <h4 class="item__category__text">カテゴリー</h4>
                    <span v-for="category in item.categories" :key="category.id" class="item__category">
                        {{ category.name }}
                    </span>
                </div>

                <div class="item__condition__wrapper">
                    <h4 class="item__condition__text">商品の状態</h4>
                    <span class="item__condition">{{ item.condition_text }}</span>
                </div>
            </div>


            <div class="item__comments">
                <!-- コメント機能閲覧と投稿フォーム -->
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'default',
});

const item = ref()
const route = useRoute()
// 動的パラメータを取得
const itemId = route.params.item_id

const getItem = async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/items/${itemId}`)
        // レスポンスのJSONデータを取得
        const data = await response.json();

        // 取得したデータの items プロパティを items に格納
        item.value = data.item;
    } catch (error) {
        console.error('商品情報取得エラー', error)
    }
}

onMounted(async () => {
    await getItem();
})
</script>


<style lang="scss" scoped>
.item-detail__container {
    display: flex;
    margin-top: 95px;

    .item-detail__image {
        padding: 2.8% 2.8% 0;
        width: 50%;
        box-sizing: border-box;

        .item__image {
            width: 100%;
            aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
            object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
            border-radius: 4px;
        }
    }

    .item-detail__sidebar {
        padding: 0 2.8%;
        width: 50%;
        box-sizing: border-box;

        .item__name {
            margin: 0;
            font-size: 45px;
        }
        .item__brand {
            margin: 0;
            font-size: 20px;
        }
        .item__price__text {
            margin: 20px 0;
            font-size: 30px;
            .item__price {
                font-size: 45px;
            }
        }

        .button__purchase {
            display: inline-block;
            margin: 22px 0;
            height: 56px;
            width: 100%;
            color: white;
            font-size: 30px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            background-color: #FF5555;
            border-radius: 4px;
            line-height: 56px;
            transition: background-color 0.3s ease;
        }
        .button__purchase:hover {
            background-color: #D64545; /* ホバー時の色 */
        }

        .item__description__text {
            margin: 0;
            font-size: 36px;
        }
        .item__description {
            display: inline-block;
            padding: 20px 0;
            font-size: 24px;
        }

        .item__information__text {
            margin: 0;
            font-size: 36px;
        }

        .item__category__wrapper {
            display: flex;
            margin-top: 15px;
            align-items: center;

            .item__category__text {
                margin: 0 40px 0 0;
                font-size: 24px;
            }

            .item__category {
                display: inline-block;
                margin-left: 25px;
                padding: 0 25px 0;
                height: 30px;
                text-align: center;
                font-size: 20px;
                background-color: #D9D9D9;
                border-radius: 15px;
            }
        }

        .item__condition__wrapper {
            display: flex;
            margin-top: 15px;
            align-items: center;

            .item__condition__text {
                margin: 0 40px 0 0;
                font-size: 24px;
            }

            .item__condition {
                display: inline-block;
                margin-left: 25px;
                padding: 0 25px 0;
                text-align: center;
                font-size: 20px;
            }
        }

    }
}
</style>