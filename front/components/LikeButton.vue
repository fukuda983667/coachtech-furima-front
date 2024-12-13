<template>
    <button :class="{ liked: isLiked }" @click="toggleLike" class="like__button" :disabled="loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40" height="40" style="opacity:1;">
            <path :fill="isLiked ? '#FFA500' : '#4B4B4B'" d="M512 209.015c0-4.653-.716-9.372-2.19-13.952-6.077-18.85-23.6-31.616-43.403-31.623H338.382l-38.97-121.336c-6.062-18.858-23.59-31.652-43.41-31.659-19.835.007-37.352 12.801-43.414 31.652l19.706 6.336-19.706-6.329-38.97 121.336H45.601c-19.803.007-37.327 12.773-43.408 31.623-1.474 4.581-2.19 9.3-2.19 13.952-.007 14.406 6.85 28.322 19.023 37.06l103.702 74.452-40.925 119.192c-1.55 4.689-2.302 9.515-2.302 14.29-.006 14.319 6.776 28.135 18.782 36.88 7.976 5.789 17.418 8.716 26.804 8.709 9.44.007 18.944-2.942 26.945-8.803l102.95-75.443 102.942 75.443c7.99 5.854 17.491 8.81 26.934 8.803 9.374.007 18.825-2.913 26.804-8.709 12.015-8.753 18.8-22.568 18.786-36.894 0-4.761-.741-9.58-2.284-14.255L389.29 320.512l103.694-74.452C505.138 237.337 512.007 223.421 512 209.015zM468.852 212.431l-116.047 83.319c-7.364 5.286-10.421 14.686-7.587 23.288l44.684 135.611c0 1.323-.619 2.604-1.752 3.423-.756.546-1.575.791-2.467.798-.895-.007-1.736-.258-2.506-.812l-115.169-84.405c-7.264-5.322-17.206-5.322-24.47 0L128.592 459.36c-.758.554-1.593.805-2.492.812-.888-.007-1.715-.252-2.47-.805-1.122-.82-1.73-2.086-1.737-3.395l44.67-135.611c2.833-8.609-.227-18.002-7.592-23.288L43.152 212.431c-1.119-.784-1.744-2.071-1.752-3.409.558-1.748 2.194-2.927 4.006-2.92H188.71c9.001 0 16.955-5.804 19.706-14.377L252 54.74c.553-1.734 2.19-2.92 4.002-2.912 1.805-.008 3.445 1.179 4.002 2.919l43.579 135.698c2.748 8.573 10.706 14.377 19.706 14.377h143.11c1.812-.007 3.448 1.172 4.002 2.92.607 1.754-.012 3.034-1.137 3.832z"/>
        </svg>
    </button>
    <span class="like__count">{{ likeCount }}</span>
</template>


<script setup>

const props = defineProps({
    itemId: {
        type: Number,
        required: true,
    },
    isLiked: {
        type: Boolean,
        required: true,
    },
    likeCount: {
        type: Number,
        required: true,
    },
});

const itemId = props.itemId
const isLiked = ref(props.isLiked);
const likeCount = ref(props.likeCount);

const router = useRouter()
const loading = ref(false)  // リクエスト中の状態を管理
const client = useSanctumClient()
const { isAuthenticated } = useSanctumAuth()


const toggleLike = async () => {

    // 未認証ならログインページにリダイレクト
    if (!isAuthenticated.value) {
        router.push('/login');
    }

    if (loading.value) return;  // リクエスト中は何もしない
    loading.value = true;  // リクエスト開始

    try {
        const response = await client('/api/likes', {
            method: 'POST',
            body: {
                item_id: itemId
            },
        })
        // 成功時の処理
        isLiked.value = response.is_liked  // 状態を更新
        likeCount.value = response.like_count; // カウントを更新
        console.log(response)
    } catch (error) {
        console.error('お気に入りトグル:', error)
        // エラーハンドリング: 状態を元に戻すか、ユーザーにエラーメッセージを表示する
    } finally {
        loading.value = false;  // リクエスト終了
    }
}
</script>


<style lang="scss" scoped>
.like__button {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}
</style>