<template>
    <div class="item-detail__container" v-if="item">
        <div class="item-detail__image">
            <div class="item__image__wrapper">
                <img :src="item.image_path" alt="商品画像" class="item__image" v-if="item.image_path" />
                <div v-if="item.isSold" class="item__sold__label">
                    <span class="item__sold__text">Sold</span>
                </div>
            </div>
        </div>

        <div class="item-detail__sidebar">
            <h2 class="item__name">{{ item.name }}</h2>
            <p class="item__brand">{{ item.brand }}</p>
            <p class="item__price__text">&yen;<span class="item__price">{{ formatPrice(item.price) }}</span>(税込)</p>

            <div class="action__icons">
                <div class="action__like">
                    <LikeButton :itemId="item.id" :isLiked="isLiked" :likeCount="likeCount" v-if="likeCount >= 0"/>
                </div>
                <div class="action__comment">
                    <img class="icon__comment" src="~assets/icons/comment.svg" alt="コメントアイコン">
                    <span class="commetn__count">{{ commentCount }}</span>
                </div>
            </div>

            <p class="message__sold" v-if="item.isSold">売り切れ</p>
            <nuxt-link
                :to="{ name: 'purchase-item_id', params: { item_id: item.id } }"
                class="button__purchase"
                v-if="!item.isSold"
            >
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
                    <span class="item__condition">{{ item.condition.name }}</span>
                </div>
            </div>


            <div class="item__comments">
                <Comments
                    :itemId="itemId"
                    :comments="comments"
                    :commentCount="commentCount"
                    :getComments="getComments"
                />
            </div>
        </div>
    </div>
</template>

<script setup>

import Comments from '~/components/Comments.vue';
definePageMeta({
    layout: 'default',
});

const item = ref()
const isLiked = ref()
const likeCount = ref()
const comments = ref([])
const commentCount = ref(0)
const route = useRoute()

// 動的パラメータを取得。そのまま取得すると文字列としてidが格納されてしまう。
const itemId = Number(route.params.item_id);

const client = useSanctumClient()
const getItem = async () => {
    try {
        const response = await client(`http://localhost:8080/api/items/${itemId}`)

        item.value = response.item
    } catch (error) {
        console.error('商品情報取得エラー', error)
    }
}

const getLikes = async () => {
    try {
        const response = await client(`http://localhost:8080/api/likes/${itemId}`)

        isLiked.value = response.isLiked,
        likeCount.value = response.like_count
    } catch (error) {
        console.error('お気に入り取得エラー', error)
    }
}

const getComments = async () => {
    try {
        const response = await client(`http://localhost:8080/api/comments/${itemId}`)

        comments.value = response.comments,
        commentCount.value = response.comment_count
    } catch (error) {
        console.error('コメント取得エラー', error)
    }
}

// 価格をカンマ区切りでフォーマット
const formatPrice = (price) => {
    if (!price) return '';
    return price.toLocaleString('ja-JP');
};

onMounted(async () => {
    await getItem();
    await getLikes();
    await getComments();
})
</script>


<style lang="scss" scoped>
.item-detail__container {
    display: flex;
    margin: auto;
    padding: 0 20px;
    max-width: 1350px;

    .item-detail__image {
        padding: 2.8% 2.8% 0;
        width: 50%;
        box-sizing: border-box;

        .item__image__wrapper {
            position: sticky;
            top: 180px; /* 上部からの距離 */
            width: 100%;
            aspect-ratio: 1 / 1;
            border-radius: 4px;
            overflow: hidden;

            .item__image {
                width: 100%;
                aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
                object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
                border-radius: 4px;
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
                    font-size: clamp(8px, 4vw, 50px);
                    font-weight: bold;
                }
            }
        }
    }

    .item-detail__sidebar {
        margin-top: 60px;
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

        .action__icons {
            display: flex;
            gap: 64px;
            margin-left: 45px;

            .action__like {
                display: flex;
                flex-direction: column; /* 子要素を縦方向に並べる */
                align-items: center;    /* 左右中央揃え */
                gap: 5px;
            }

            .action__comment {
                display: flex;
                flex-direction: column; /* 子要素を縦方向に並べる */
                align-items: center;    /* 左右中央揃え */
                gap: 5px;

                .icon__comment {
                    width: 40px;
                    height: 40px;
                }
            }
        }

        .message__sold {
            color: red;
            font-size: 20px;
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