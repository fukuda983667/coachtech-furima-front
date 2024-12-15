<template>
    <div class="profile__container">
        <h2 class="title">プロフィール設定</h2>

        <form class="form" @submit.prevent="updateProfile">
            <div class="form__content">
                <div class="image__upload">
                    <div class="user__icon">
                        <img
                            class="user__icon__image"
                            v-if="previewImage"
                            :src="previewImage"
                            alt="ユーザーアイコン"
                        />
                    </div>
                    <label for="upload-image" class="button__upload-image__label">画像を選択する</label>
                    <input
                        id="upload-image"
                        class="button__upload-image__input"
                        type="file"
                        accept="image/jpeg, image/png"
                        @change="onImageChange"
                    />
                </div>
                <p class="error__message" v-if="imageError">{{ imageError }}</p>
            </div>

            <div class="form__content">
                <label class="label" for="user-name">ユーザー名</label>
                <input class="input" type="text" id="user-name" v-model="userName"/>
                <p class="error__message" v-if="userNameError">{{ userNameError }}</p>
            </div>
            <div class="form__content">
                <label class="label" for="postal-code">郵便番号</label>
                <input class="input" type="text" id="postal-code" v-model="postalCode"/>
                <p class="error__message" v-if="postalCodeError">{{ postalCodeError }}</p>
            </div>
            <div class="form__content">
                <label class="label" for="address">住所</label>
                <input class="input" type="text" id="address" v-model="address"/>
                <p class="error__message" v-if="addressError">{{ addressError }}</p>
            </div>
            <div class="form__content">
                <label class="label" for="building-name">建物名</label>
                <input class="input" type="text" id="building-name" v-model="buildingName"/>
                <p class="error__message" v-if="buildingNameError">{{ buildingNameError }}</p>
            </div>

            <button class="update__address__button__submit" type="submit" :disabled="!isValid || loading">更新する</button>
        </form>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});


import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const loading = ref(false)  // リクエスト中の状態を管理
const router = useRouter()

const { user, refreshIdentity } = useSanctumAuth()
const client = useSanctumClient()

const imagePath = ref(null); // 選択された画像パス
const previewImage = ref(null); // プレビュー画像URL
const imageError = ref(''); // 画像のエラーメッセージ

// バリデーション設定▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
const validationSchema = yup.object({
    userName: yup
        .string()
        .required("ユーザー名を入力してください")
        .max(255, "ユーザー名は255文字以内で入力してください"),
    postalCode: yup
        .string()
        .required("郵便番号を入力してください")
        .matches(/^\d{3}-\d{4}$/, "郵便番号はXXX-XXXXの形式で入力してください"),
    address: yup
        .string()
        .required("住所を入力してください")
        .max(255, "住所は255文字以内で入力してください"),
    buildingName: yup
        .string()
        .required("建物名を入力してください")
        .max(255, "建物名は255文字以内で入力してください"),
});

// useFormでバリデーション設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドのバリデーション設定
const { value: userName, errorMessage: userNameError } = useField("userName");
const { value: postalCode, errorMessage: postalCodeError } = useField("postalCode");
const { value: address, errorMessage: addressError } = useField("address");
const { value: buildingName, errorMessage: buildingNameError } = useField("buildingName");

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// バリデーション設定▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

// デフォルトのアドレス情報取得
const getAddress = async () => {
    try {
        const response = await client('/api/user/address')

        address.value = response.address.address || '';
        postalCode.value = response.address.postal_code || '';
        buildingName.value = response.address.building_name || '';

    } catch (error) {
        console.error('コメント取得エラー', error)
    }
}

// プロファイル更新処理
const updateProfile = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const formData = new FormData();
        formData.append("user_id", user.value.id);
        formData.append("name", userName.value);
        formData.append("postal_code", postalCode.value);
        formData.append("address", address.value);
        formData.append("building_name", buildingName.value);
        if (imagePath.value) {
            formData.append("image_path", imagePath.value); // キー名はAPI仕様と一致させる
        }

        const response = await client('/api/user/profile', {
            method: 'POST',
            body: formData,
        })
        // 成功時の処理
        console.log(response.message.value)
        refreshIdentity()
        router.push('/') // リダイレクト先

    } catch (error) {
        console.error('プロファイル更新エラー:', error)
    } finally {
        loading.value = false;  // リクエスト終了
    }
}


// 画像変更時の処理
const onImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // ファイル形式チェック
    if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("JPEGまたはPNG形式の画像を選択してください。");
        return;
    }

    // ファイルサイズチェック（1024KB以下）
    if (file.size > 1024 * 1024) {
        imageError.value = "1024KB以下の画像を選択してください。";
        return;
    }

    // ファイルをプレビュー用に設定
    const reader = new FileReader();
    reader.onload = () => {
        previewImage.value = reader.result;
    };
    reader.readAsDataURL(file);

    // 実際のアップロード処理用に設定
    imagePath.value = file;
    // エラーメッセージをリセット
    imageError.value = '';

    // 確認用ログ
    console.log('選択されたファイル:', imagePath.value);
};


onMounted(async () => {
    await getAddress()
    userName.value = user.value.name || "";
    previewImage.value = user.value.image_path || null;
})
</script>


<style lang="scss" scoped>
.profile__container {
    display: flex;
    margin: 60px auto 0;
    padding: 0 20px;
    max-width: 1350px;
    flex-direction: column; /* 子要素を縦方向に並べる */
    align-items: center;

    .title {
        font-size: 36px;
        font-weight: 700;
        margin: 0;
    }

    .form {
        margin-top: 60px;
        width: 680px;
        .form__content {
            display: flex;
            margin-top: 45px;
            flex-direction: column; /* 子要素を縦方向に並べる */
            &:first-of-type {
                margin: 0;
                .image__upload {
                    display: flex;
                    align-items: center;
                    gap: 0 40px;
                }

                .user__icon {
                    width: 150px;
                    box-sizing: border-box;
                    .user__icon__image {
                        width: 100%;
                        aspect-ratio: 1 / 1; /* 正方形のアスペクト比を設定 */
                        object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
                        border-radius: 50%; /* 円形にする */
                        border: 2px solid #D9D9D9; /* 灰色のボーダー */
                    }
                }

                .button__upload-image__label {
                    display: inline-block;
                    margin: 0;
                    height: 50px;
                    width: 180px;
                    background-color: white;
                    color: #FF5555;
                    font-size: 20px;
                    font-weight: 700;
                    border: 2px solid #FF5555;
                    border-radius: 10px;
                    line-height: 46px;
                    text-align: center;
                    box-sizing: border-box;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    &:hover {
                        color: #D64545; /* ホバー時の色 */
                        border-color: #D64545;
                    }
                }
                .button__upload-image__input {
                    display: none;
                }
                .error__message {

                }
            }

            .label {
                font-size: 24px;
                font-weight: 700;
            }
            .input {
                margin-top: 5px;
                padding: 5px 7px;
                height: 45px;
                font-size: 24px;
                border: 1px solid #5F5F5F;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .error__message {
                margin: 15px 0 0;
                font-size: 18px;
                font-weight: 700;
                color: red;
            }
        }

        .update__address__button__submit {
            display: inline-block;
            margin-top: 100px;
            height: 60px;
            width: 100%;
            color: white;
            font-size: 26px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            background-color: #FF5555;
            border: none;
            border-radius: 5px;
            line-height: 60px;
            cursor: pointer;
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