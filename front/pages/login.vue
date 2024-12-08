<template>
    <div class="form__container">
        <form class="form" @submit.prevent>
            <h2 class="form__title">ログイン</h2>

            <div class="input__container">
                <label for="email" class="label__email">メールアドレス</label>
                <input class="input" id="email" type="text" v-model="email" autocomplete="username"/>
            </div>
            <p class="error__message" v-if="emailError">{{ emailError }}</p>

            <div class="input__container">
                <label for="password" class="label__password">パスワード</label>
                <input class="input" id="password" type="password" v-model="password" autocomplete="current-password"/>
            </div>
            <p class="error__message" v-if="passwordError">{{ passwordError }}</p>

            <div class="button__wrapper">
                <p v-if="backendErrorMessage" class="error__message">{{ backendErrorMessage }}</p>
                <button
                    class="button__submit"
                    type="button"
                    @click="performLogin"
                    :disabled="!isValid || loading"
                >
                    ログインする
                </button>
            </div>

        </form>
        <NuxtLink class="link__register" to="/register">会員登録はこちら</NuxtLink>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

// 未認証ログインユーザのみ閲覧可能
definePageMeta({
    middleware: ['sanctum:guest'],
    layout: 'auth',
});

const router = useRouter()
const { login } = useSanctumAuth()
const loading = ref(false)  // リクエスト中の状態を管理
const backendErrorMessage = ref(null);


// バリデーションスキーマの定義
const validationSchema = yup.object({
    email: yup
        .string()
        .required('Emailを入力してください')
        .email('有効なEmailを入力してください'),
    password: yup
        .string()
        .required('パスワードを入力してください')
        .min(8, 'パスワードは8文字以上で入力してください')
        .max(255, 'パスワードは255文字以下で入力してください'),
});

// useFormを使ってバリデーションスキーマを設定
const { meta } = useForm({
    validationSchema,
});

// フィールドの設定
const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);


const performLogin = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始
    backendErrorMessage.value = null;

    try {
        // 資格情報のペイロードを作成
        const credentials = {
            email: email.value,
            password: password.value,
        }
        // ユーザーをログインさせる
        await login(credentials)
        router.push('/') // リダイレクト先
    } catch (error) {
        // エラー応答を処理
        if (error.response) {
            console.log('エラーレスポンスデータ:', error.response); // レスポンス内容を確認
            backendErrorMessage.value = error.response._data.message; // サーバーのエラーメッセージ
        } else {
            console.log('エラーにresponseがありません:', error); // レスポンスがない場合
        }
        console.error('ログインに失敗しました:', error)
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

    .label__email,
    .label__password {
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

.button__wrapper {
    margin-top: 80px;
    .error__message {
        margin: 0 auto 20px;
    }
    .button__submit {
        display: inline-block; /* ボタンをインラインブロックに設定 */
        padding: 15px; /* ボタンの内側の余白を設定 */
        width: 100%;
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
}



.link__register {
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