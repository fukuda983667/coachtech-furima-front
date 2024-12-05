<template>
    <header class="header">
        <div class="header__container">
            <h1>
                <a class="link" href="/">
                    <img src="../public/icon/logo.svg" alt="ヘッダーロゴ">
                </a>
            </h1>
            <Search></Search>
            <div class="button__wrapper" >
                <NuxtLink class="link" v-if="isAuthenticated" @click="performLogout">ログアウト</NuxtLink>
                <NuxtLink class="link" v-else to="/login">ログイン</NuxtLink>
                <NuxtLink class="link" to="/mypage">マイページ</NuxtLink>
                <NuxtLink class="link sell" to="/sell">出品</NuxtLink>
            </div>
        </div>
    </header>
    <main class="main">
        <NuxtPage />
    </main>
    <footer class="footer"></footer>
</template>


<script setup>
const { isAuthenticated, logout } = useSanctumAuth()
const router = useRouter();

const performLogout = async () => {
    try {
        // ユーザーをログアウトさせる
        await logout()

        // ログアウト成功後にリダイレクト
        router.push('/login') // リダイレクト先を必要に応じて変更してください
    } catch (error) {
        console.error('ログアウトに失敗しました:', error)
    }
}
</script>


<style>
body {
    display: flex;
    justify-content: center;
    margin: 0;
    background-color: #fff;
    font-display: swap;

    font-family: "Inter", "Noto Sans JP", sans-serif;
}

button {
    font-family: "Inter", "Noto Sans JP", sans-serif;
}

.main {
    margin: 0 auto;
    padding: 0;
}

.footer{
    height: 100px;
}
</style>

<style lang="scss" scoped>
.header {
    position: sticky;
    top: 0px;
    background-color: #000;
    z-index: 1000; /* 他の要素の上に表示 */
    .header__container {
        display: flex;
        margin: 0 auto;
        padding: 0 20px;
        height: 80px;
        max-width: 1350px;
        justify-content: space-between;
        align-items: center;
            h1 {
                margin: 0;
                height: 32px;
            }
    }
}

.button__wrapper {
    .link {
        color: white;
        font-size: 22px;
        text-decoration: none;
        border: none;
        cursor: pointer;
        &:not(:last-child) {
            margin-right: 20px;
        }
    }
    .link.sell {
        padding: 10px 20px;
        color: black;
        background-color: white;
        border-radius: 4px;
    }
}
</style>