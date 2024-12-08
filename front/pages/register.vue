<template>
    <div class="form__container">
        <form class="form" @submit.prevent>
            <h2 class="form__title">会員登録</h2>

            <!-- ユーザー名 -->
            <div class="input__container">
                <label for="name" class="label">ユーザー名</label>
                <input class="input" id="name" type="text" v-model="name" autocomplete="username"/>
            </div>
            <p class="error__message" v-if="nameError">{{ nameError }}</p>

            <!-- メールアドレス -->
            <div class="input__container">
                <label for="email" class="label">メールアドレス</label>
                <input class="input" id="email" type="text" v-model="email" autocomplete="email"/>
            </div>
            <p class="error__message" v-if="emailError">{{ emailError }}</p>

            <!-- パスワード -->
            <div class="input__container">
                <label for="password" class="label">パスワード</label>
                <input class="input" id="password" type="password" v-model="password" autocomplete="current-password"/>
            </div>
            <p class="error__message" v-if="passwordError">{{ passwordError }}</p>

            <!-- 確認用パスワード -->
            <div class="input__container">
                <label for="password_confirmation" class="label">確認用パスワード</label>
                <input class="input" id="password_confirmation" type="password" v-model="passwordConfirmation" autocomplete="new-password"/>
            </div>
            <p class="error__message" v-if="passwordConfirmationError">{{ passwordConfirmationError }}</p>

            <button class="button__submit" type="button" @click="register" :disabled="!isValid || loading">登録する</button>
        </form>
        <NuxtLink class="link__login" to="/login">ログインはこちら</NuxtLink>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

// 未認証ユーザのみ閲覧可能
definePageMeta({
    middleware: ['sanctum:guest'],
    layout: 'auth',
});

const { login } = useSanctumAuth()
const router = useRouter()
const loading = ref(false)  // リクエスト中の状態を管理


// バリデーションスキーマの定義
const validationSchema = yup.object({
    name: yup
        .string()
        .required('ユーザー名を入力してください')
        .max(30, 'ユーザー名は30文字以下で入力してください'),
    email: yup
        .string()
        .required('メールアドレスを入力してください')
        .email('有効なメールアドレスを入力してください'),
    password: yup
        .string()
        .required('パスワードを入力してください')
        .min(8, 'パスワードは8文字以上で入力してください')
        .max(255, 'パスワードは255文字以下で入力してください'),
    passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), null], 'パスワードが一致しません')
        .required('確認用パスワードを入力してください'),
});

// useFormを使ってバリデーションスキーマを設定
const { meta } = useForm({
    validationSchema,
});

// フィールドの設定
const { value: name, errorMessage: nameError } = useField('name');
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');
const { value: passwordConfirmation, errorMessage: passwordConfirmationError } = useField('passwordConfirmation');


// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// 会員登録
const register = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                password_confirmation: passwordConfirmation.value,
            }),
            credentials: 'include', //httpリクエストにクッキーが送信される
        })

        console.log('登録成功')

        router.push('/message') // // 登録成功後、ホームページへ遷移
    } catch (error) {
        console.error('登録エラー:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}
</script>


<style lang="scss" scoped>
.form__container {
    display: flex;
    margin: 50px auto 0; /* 上下に余白を追加し、中央揃え */
    width: 680px; /* カードの幅を設定 */
    flex-direction: column; /* 子要素を縦に配置 */
    text-align: center;
    background-color: #fff; /* 背景色を白に設定 */

    .form {
        display: flex;
        flex-direction: column; /* 子要素を縦に配置 */
        text-align: center;
    }

    .form__title {
        margin: 0;
        font-size: 36px;
        border-top-left-radius: 5px; /* 左上の角を丸くする */
        border-top-right-radius: 5px; /* 右上の角を丸くする */
    }
}


.input__container {
    display: flex;
    flex-direction: column; /* 子要素を縦に配置 */
    margin-top: 20px; /* フィールド間の間隔を追加 */

    .label {
        margin-right: auto;
        font-size: 24px;
        font-weight: bold;
    }

    .input {
        margin-top: 5px;
        padding: 10px; /* 内側の余白を設定 */
        border: 1px solid #5F5F5F;
        border-radius: 4px;
        font-size: 30px; /* 文字サイズを設定 */
        outline: none; /* フォーカス時の枠線を消す */
        width: 100%; /* 入力フィールドの幅を100%に設定 */
        box-sizing: border-box; /* パディングを含めてボックスサイズを計算 */
    }
}


.error__message {
    margin: 5px auto 0 0;
    color: #ff0000;
    font-size: 24px;
    font-weight: bold;
}


.button__submit {
    margin-top: 80px;
    display: inline-block; /* ボタンをインラインブロックに設定 */
    padding: 15px; /* ボタンの内側の余白を設定 */
    font-size: 26px; /* ボタンの文字サイズを設定 */
    font-weight: bold;
    color: #fff; /* テキストの色を白に設定 */
    background-color: #ff5555; /* ボタンの背景色を設定 */
    border-radius: 5px; /* ボタンの角を丸くする */
    border: none; /* ボタンの枠線を消す */
    cursor: pointer; /* マウスカーソルをポインターにする */
    transition: background-color 0.3s; /* 背景色の変化にアニメーションを追加 */

    &:disabled {
        cursor: not-allowed;
    }

    &:not(:disabled):hover {
        background-color: #d84b4b; /* ホバー時の背景色を設定 */
    }
}
 

.link__login {
    margin: 30px auto 0;
    font-size: 20px;
    color: #0073CC;
    text-decoration: none;
    border: none;

    &:hover {
        color: #551a8b
    }
}
</style>