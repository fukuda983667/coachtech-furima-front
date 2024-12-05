<template>
    <div class="sell__container">
        <h2 class="title">商品の出品</h2>

        <form class="form" @submit.prevent="postItem">
            <div class="form__content">
                <label class="label">商品画像</label>
                <div class="item__image__container">
                    <div class="item__image__wrapper" v-if="previewImage">
                        <img
                            class="item__image"
                            v-if="previewImage"
                            :src="previewImage"
                            alt="商品画像"
                        />
                    </div>
                    <p class="error__message" v-if="imageError">{{ imageError }}</p>
                    <label for="upload-image" class="button__upload-image__label">画像を選択する</label>
                    <input
                        id="upload-image"
                        class="button__upload-image__input"
                        type="file"
                        accept="image/jpeg, image/png"
                        @change="onImageChange"
                    />
                </div>

            </div>

            <h3 class="subtitle">商品の詳細</h3>
            <!-- カテゴリー選択 -->
            <div class="form__content">
                <label class="label">カテゴリー</label>
                <div class="categories__container">
                    <button
                    v-for="category in categories"
                    :key="category.id"
                    :class="['category__button', { 'category__button--selected': selectedCategories.includes(category.id) }]"
                    @click.prevent="toggleCategorySelection(category.id)"
                    >
                        {{ category.name }}
                    </button>
                </div>
                <p class="error__message" v-if="categoriesError">{{ categoriesError }}</p>
            </div>
            <!-- 商品状態選択 -->
            <div class="form__content">
                <label class="label" for="item-condition">商品の状態</label>
                <select
                    id="item-condition"
                    v-model="selectedCondition"
                    class="condition__dropdown"
                    :class="{ 'default__color': selectedCondition === 0 }"
                >
                    <option value=0 disabled>選択してください</option>
                    <option
                        v-for="condition in conditions"
                        :key="condition.id"
                        :value="condition.id"
                    >
                        {{ condition.name }}
                    </option>
                </select>
                <p class="error__message" v-if="itemConditionError">{{ itemConditionError }}</p>
            </div>

            <h3 class="subtitle">商品名と説明</h3>
            <!-- 商品名入力欄 -->
            <div class="form__content">
                <label class="label" for="item-name">商品名</label>
                <input class="input" type="text" id="item-name" v-model="itemName"/>
                <p class="error__message" v-if="itemNameError">{{ itemNameError }}</p>
            </div>
            <!-- ブランド名入力欄 -->
            <div class="form__content">
                <label class="label" for="item-brand">ブランド名</label>
                <input class="input" type="text" id="item-brand" v-model="itemBrand"/>
                <p class="error__message" v-if="itemBrandError">{{ itemBrandError }}</p>
            </div>
            <!-- 商品説明入力欄 -->
            <div class="form__content">
                <label class="label" for="item-description">商品の説明</label>
                <textarea class="textare" id="item-description" rows="5" v-model="itemDescription"></textarea>
                <p class="error__message" v-if="itemDescriptionError">{{ itemDescriptionError }}</p>
            </div>
            <!-- 商品価格入力欄 -->
            <div class="form__content">
                <label class="label" for="item-price">販売価格</label>
                <input class="input" type="text" id="item-price" v-model="itemPrice"/>
                <p class="error__message" v-if="itemPriceError">{{ itemPriceError }}</p>
            </div>

            <button class="button__submit" type="submit" :disabled="!isValid || loading">出品する</button>
        </form>
    </div>
</template>


<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});


import { useField, useForm } from "vee-validate";
import * as yup from "yup";


const categories = ref([])
const selectedCategories = ref([]);
const conditions = ref([])
const selectedCondition = ref(0)
const imagePath = ref(null); // 選択された画像パス
const previewImage = ref(null); // プレビュー画像URL
const imageError = ref(''); // 画像のエラーメッセージ
const categoriesError = ref(''); // カテゴリのエラーメッセージ
const itemConditionError = ref(''); // 商品状態のエラーメッセージ

const { user, refreshIdentity } = useSanctumAuth()
const client = useSanctumClient()
const router = useRouter()
const loading = ref(false)  // リクエスト中の状態を管理


// バリデーション設定▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
const validationSchema = yup.object({
    itemName: yup
        .string()
        .required("商品名を入力してください")
        .max(255, "商品名は255文字以内で入力してください"),
    itemBrand: yup
        .string()
        .required("ブランド名を入力してください")
        .max(255, "ブランド名は255文字以内で入力してください"),
    itemDescription: yup
        .string()
        .required("商品説明を入力してください")
        .max(255, "商品説明は255文字以内で入力してください"),
    itemPrice: yup
        .number()
        .required("商品価格を入力してください") // 必須項目
        .typeError("商品価格は数値で入力してください") // 数値以外の場合のエラー
        .min(1, "商品価格は1円以上で入力してください") // 最小値
        .max(10000000 - 1, "商品価格は1000万円未満で入力してください") // 最大値（1,000万円未満）
});

// useFormでバリデーション設定
const { meta } = useForm({
    validationSchema,
});

// 各フィールドのバリデーション設定
const { value: itemName, errorMessage: itemNameError } = useField("itemName");
const { value: itemBrand, errorMessage: itemBrandError } = useField("itemBrand");
const { value: itemDescription, errorMessage: itemDescriptionError } = useField("itemDescription");
const { value: itemPrice, errorMessage: itemPriceError } = useField("itemPrice");

// フォーム全体のバリデーション状態を監視
const isValid = computed(() => meta.value.valid);

// バリデーション設定▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲


// 商品カテゴリーの選択肢をバックから取得
const getCategories = async () => {
    try {
        const response = await client('http://localhost:8080/api/categories')

        categories.value = response.categories
    } catch (error) {
        console.error('カテゴリー選択肢取得エラー', error)
    }
}

// 商品の状態(condiotions)の選択肢をバックから取得
const getConditions = async () => {
    try {
        const response = await client('http://localhost:8080/api/conditions')

        conditions.value = response.conditions
    } catch (error) {
        console.error('商品の状態(conditions)選択肢取得エラー', error)
    }
}


// 商品出品処理
const postItem = async () => {
    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    // エラーをリセット
    imageError.value = "";
    categoriesError.value = "";
    itemConditionError.value = "";

    // 必須項目のバリデーション
    if (!imagePath.value) {
        imageError.value = "商品画像を選択してください。";
    }
    if (selectedCategories.value.length === 0) {
        categoriesError.value = "カテゴリを1つ以上選択してください。";
    }
    if (selectedCondition.value === 0) {
        itemConditionError.value = "商品の状態を選択してください。";
    }

    // エラーがある場合、処理を中断
    if (imageError.value || categoriesError.value || itemConditionError.value) {
        loading.value = false;
        return;
    }


    try {
        const formData = new FormData();
        formData.append("categories", JSON.stringify(selectedCategories.value));
        formData.append("condition_id", selectedCondition.value);
        formData.append("name", itemName.value);
        formData.append("brand", itemBrand.value);
        formData.append("description", itemDescription.value);
        formData.append("price", itemPrice.value);
        if (imagePath.value) {
            formData.append("image_path", imagePath.value); // キー名はAPI仕様と一致させる
        }

        const response = await client('/api/items/', {
            method: 'POST',
            body: formData,
        })
        // 成功時の処理
        console.log(response.message)
        refreshIdentity()
        router.push('/') // リダイレクト先

    } catch (error) {
        console.error('商品出品エラー:', error)
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

    // ファイルサイズチェック（2048KB以下）
    if (file.size > 2048 * 1024) {
        imageError.value = "2048KB以下の画像を選択してください。";
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


// カテゴリー選択の切り替え
const toggleCategorySelection = (categoryId) => {
    const index = selectedCategories.value.indexOf(categoryId);
    if (index === -1) {
        selectedCategories.value.push(categoryId);
    } else {
        selectedCategories.value.splice(index, 1);
    }
    console.log(selectedCategories.value)
};


onMounted(async () => {
    await getCategories();
    await getConditions();
})
</script>


<style lang="scss" scoped>
.sell__container {
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

        .subtitle {
            margin-top: 60px;
            padding-bottom: 10px;
            color: #5F5F5F;
            font-size: 30px;
            border-bottom: 2px solid #5F5F5F;
        }

        .form__content {
            display: flex;
            margin-top: 45px;
            flex-direction: column; /* 子要素を縦方向に並べる */

            // ▼▼▼▼▼▼▼▼▼▼▼商品画像のところ▼▼▼▼▼▼▼▼▼▼▼
            &:first-of-type {
                margin: 0;
                align-items: center;
                .item__image__container {
                    display: flex;
                    margin-top: 5px;
                    padding: 50px;
                    width: 100%;
                    gap: 50px;
                    flex-direction: column; /* 子要素を縦方向に並べる */
                    align-items: center;
                    border: 1px dashed #5F5F5F;
                    border-radius: 4px;
                    box-sizing: border-box;
                    .item__image__wrapper {
                        display: flex; /* 子要素の中央揃えに必要 */
                        width: 250px; /* 横幅を固定 */
                        height: 250px; /* 高さを固定 */
                        border-radius: 4px;
                        box-sizing: border-box;
                        overflow: hidden; /* 画像のはみ出しを防ぐ */
                        justify-content: center; /* 横方向の中央揃え */
                        align-items: center; /* 縦方向の中央揃え */
                        .item__image {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;   /* 短い方を基準に画像を中央に表示 */
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
                }
            }
            // ▲▲▲▲▲▲▲▲▲▲商品画像のところ▲▲▲▲▲▲▲▲▲▲

            .label {
                font-size: 24px;
                font-weight: 700;
                align-self: flex-start;
            }
            .condition__dropdown {
                margin-top: 20px;
                padding: 10px 15px;
                height: 45px;
                font-size: 16px;
                font-weight: 700;
                border: 1px solid #5F5F5F;
                border-radius: 4px;
                box-sizing: border-box;
            }
            .condition__dropdown.default__color {
                color: #5F5F5F;
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
            .textare {
                margin-top: 5px;
                padding: 5px 7px;
                max-width: 100%;
                min-width: 100%;
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

        .button__submit {
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


.categories__container {
    display: flex;
    margin-top: 30px;
    flex-wrap: wrap; // 幅足りなければ折り返し
    justify-content: space-between; // 等間隔に配置
    gap: 30px 20px;
}

.category__button {
    padding: 2px 10px;
    height: 32px;
    background-color: white;
    color: #FF5555;
    border: 2px solid #FF5555;
    border-radius: 200px;
    font-size: 15px;
    line-height: 2px;
    box-sizing: border-box;
    cursor: pointer;
}

.category__button--selected {
    background-color: #FF5555;
    color: white;
    border-color: #FF5555;
}
</style>