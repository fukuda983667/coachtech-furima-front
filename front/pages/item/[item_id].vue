<template>
    <div class="item-detail__container" v-if="item">
        <div class="item-detail__image">
            <div class="item__image__wrapper">
                <img :src="item.image_path" alt="商品画像" class="item__image" v-if="item.image_path" />
                <img class="label__sold" src="~assets/icons/sold.svg" alt="Soldアイコン" v-if="item.is_sold" />
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

            <p class="message__owner" v-if="isAuthenticated && user?.id === item.user_id">あなたの出品商品です</p>
            <p class="message__sold" v-if="item.is_sold">売り切れ</p>
            <NuxtLink
                :to="{ name: 'purchase-item_id', params: { item_id: item.id } }"
                class="button__purchase"
                v-if="!item.is_sold && (!isAuthenticated || user?.id !== item.user_id)"
            >
                購入手続きへ
            </NuxtLink>

            <div class="item__description__wrapper">
                <h3 class="item__description__text">商品説明</h3>
                <span class="item__description">{{ item.description }}</span>
            </div>

            <div class="item__information__wrapper">
                <h3 class="item__information__text">商品の情報</h3>

                <div class="item__category__wrapper">
                    <h4 class="item__category__text">カテゴリー</h4>
                    <div class="category__list">
                        <span v-for="category in item.categories" :key="category.id" class="category__list__item">
                            {{ category.name }}
                        </span>
                    </div>
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
const itemId = Number(route.params.item_id);
const { user, isAuthenticated } = useSanctumAuth()


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

        isLiked.value = response.is_liked,
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

            .label__sold {
                position: absolute;
                top: 0;
                left: 0;
                width: 35%;
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

        .message__owner {
            color: green;
            font-size: 20px;
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

        .item__description__wrapper {
            margin: 10px 0 25px;
            .item__description__text {
                margin: 0;
                font-size: 36px;
            }
            .item__description {
                display: inline-block;
                padding: 20px 0;
                font-size: 24px;
            }
        }


        .item__information__text {
            margin: 0;
            font-size: 36px;
        }

        .item__category__wrapper {
            display: flex;
            margin-top: 25px;

            .item__category__text {
                margin: 0 40px 0 0;
                width: 120px;
                flex-shrink: 0;
                font-size: 24px;
            }
            .category__list {
                display: flex;
                flex-wrap: wrap;
                gap: 20px 20px;
                .category__list__item {
                    display: inline-block;
                    padding: 0 25px 0;
                    height: 30px;
                    text-align: center;
                    font-size: 20px;
                    background-color: #D9D9D9;
                    border-radius: 15px;
                }
            }
        }

        .item__condition__wrapper {
            display: flex;
            margin-top: 25px;
            align-items: center;

            .item__condition__text {
                margin: 0 40px 0 0;
                font-size: 24px;
            }

            .item__condition {
                display: inline-block;
                padding: 0 25px 0;
                text-align: center;
                font-size: 20px;
            }
        }
    }
}


/* タブレット（～1024px） */
@media screen and (max-width: 1024px) {
    .item-detail__container {
        flex-direction: column;
        align-items: center;

        .item-detail__image,
        .item-detail__sidebar {
            width: 65%;
        }
    }
}
</style>