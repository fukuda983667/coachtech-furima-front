<template>
    <div class="comment__container">
        <h3 class="comment__count">コメント({{ commentCount }})</h3>

        <div class="comment__list__wrapper">
            <ul class="comment__list">
                <li v-for="comment in comments" :key="comment.id" class="comment__item">
                    <div class="comment__user__icon">
                        <img
                            class="comment__user__icon__image"
                            v-if="comment.user.image_path"
                            :src="comment.user.image_path"
                            alt="ユーザーアイコン"
                        />
                    </div>
                    <div class="text__wrapper">
                        <span class="comment__user__name">{{ comment.user.name }}</span>
                        <div class="comment__wrapper">
                            <p class="comment__text">{{ comment.comment }}</p>
                            <time class="comment__date">{{ comment.created_at_relative }}</time>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <div class="comment__form__wrapper">
            <form class="comment__form" @submit.prevent="commentSubmit">
                <h3 class="label__wrapper">
                    <label class="label" for="text">商品へのコメント</label>
                </h3>
                <textarea class="textarea__comment" id="text" rows="7" v-model="newComment"></textarea>
                <p class="error__message" v-if="commentError">{{ commentError }}</p>
                <button class="button__comment__submit" type="submit" :disabled="!isValid || loading">コメントを送信する</button>
            </form>
        </div>

    </div>
</template>


<script setup>
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
    itemId: {
        type: Number,
        required: true,
    },
    comments: {
        type: Object,
        required: true,
    },
    commentCount: {
        type: Number,
        required: true,
    },
    getComments: {
        type: Function, // 親から渡される関数
        required: true,
    },
});
const itemId = props.itemId


// バリデーションスキーマの定義
const validationSchema = yup.object({
    comment: yup
        .string()
        .required("コメントを入力してください")
        .max(255, "コメントは255文字以内で入力してください"),
});

// useFormでバリデーション設定
const { meta } = useForm({
    validationSchema,
});

// フィールド設定
const { value: newComment, errorMessage: commentError } = useField("comment");

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);


const loading = ref(false)  // リクエスト中の状態を管理
const client = useSanctumClient()
const { user } = useSanctumAuth()
const commentSubmit = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/comments', {
            method: 'POST',
            body: {
                user_id: user.value.id,
                item_id: itemId,
                comment: newComment.value.trim(),
            },
        })
        // 成功時の処理
        newComment.value = '' // コメント入力欄をクリア
        props.getComments() // コメント送信成功後に親コンポーネントの getComments を呼び出す
        console.log(response.message)

    } catch (error) {
        console.error('コメント送信エラー:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}
</script>


<style lang="scss" scoped>
.comment__container {
    display: flex;
    margin-top: 20px;
    flex-direction: column; /* 子要素を縦方向に並べる */

    .comment__count {
        margin: 30px 0 15px;
        font-size: 36px;
        color: #5F5F5F;
    }

    .comment__list {
        text-decoration: none;
        list-style-type: none; /* リストのマーカー（・）を非表示 */
        padding-left: 0; /* リストのインデントをなくす */
        .comment__item {
            display: flex;
            margin-bottom: 20px;

            .comment__user__icon {
                margin-right: 8px;
                width: 65px;
                display: flex;
                align-items: flex-start; /* 上揃えに変更 */

                .comment__user__icon__image {
                    width: 100%;
                    aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
                    object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
                    border-radius: 50%; /* 円形にする */
                    border: 1px solid #D9D9D9; /* 灰色のボーダー */
                }
            }

            .comment__user__name {
                font-size: 24px;
                font-weight: 700;
            }

            .text__wrapper {
                width: 100%;
            }
            .comment__wrapper {
                display: flex;
                flex-direction: column; /* 子要素を縦方向に並べる */
                justify-content: space-between;
                margin-top: 5px;
                padding: 10px 15px;
                gap: 15px;
                background-color: #E5E5E5;
                border-radius: 5px;

                .comment__text {
                    margin: 0;
                    font-size: 20px;
                }
                .comment__date {
                    color: #666666;
                }
            }
        }
    }
    .comment__form {
        display: flex;
        flex-direction: column; /* 子要素を縦方向に並べる */

        .label__wrapper {
            margin: 0;

            .label {
                font-size: 28px;
            }
        }

        .textarea__comment {
            margin-top: 5px;
            padding: 10px 5px;
            height: 240px;
            width: 100%;
            box-sizing: border-box;
            font-size: 20px;
            border: 2px solid #5F5F5F;
            border-radius: 5px;
        }

        .error__message {
            margin: 10px 0 0;
            color: red;
            font-size: 20px;
            font-weight: 700;
        }

        .button__comment__submit {
            display: inline-block;
            margin-top: 50px;
            height: 56px;
            width: 100%;
            color: white;
            font-size: 25px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            background-color: #FF5555;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            line-height: 56px;
            transition: background-color 0.3s ease;

            &:disabled {
                cursor: not-allowed;
            }

            &:not(:disabled):hover {
                background-color: #D64545; /* ホバー時の色 */
            }
        }
    }
}
</style>