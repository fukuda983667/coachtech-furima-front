<template>
    <header class="header">
        <div class="header__container">
            <!-- ハンバーガーボタン -->
            <button class="hamburger__button" @click="toggleMenu">
                <img class="hamburger__image" src="../assets/icons/hamburger.svg" alt="hamburgerアイコン"/>
            </button>
            <h1>
                <a class="link" href="/">
                    <img src="../public/icon/logo.svg" alt="ヘッダーロゴ">
                </a>
            </h1>
            <Search class="search"></Search>
            <div class="button__wrapper" >
                <NuxtLink class="link" v-if="isAuthenticated" @click="performLogout">ログアウト</NuxtLink>
                <NuxtLink class="link" v-else to="/login">ログイン</NuxtLink>
                <NuxtLink class="link" to="/mypage">マイページ</NuxtLink>
                <NuxtLink class="link sell" to="/sell">出品</NuxtLink>
            </div>
        </div>

        <!-- サイドバー -->
        <div class="sidebar" :class="{ 'is__open': isMenuOpen }">
            <ul class="sidebar__link__list">
                <li class="list__item__link"><NuxtLink class="sidebar__link" v-if="isAuthenticated" @click="performLogout">ログアウト</NuxtLink></li>
                <li class="list__item__link"><NuxtLink class="sidebar__link" v-if="!isAuthenticated" to="/login">ログイン</NuxtLink></li>
                <li class="list__item__link"><NuxtLink class="sidebar__link" to="/mypage" @click="toggleMenu">マイページ</NuxtLink></li>
                <li class="list__item__link"><NuxtLink class="sidebar__link" to="/sell" @click="toggleMenu">出品</NuxtLink></li>
            </ul>
        </div>

        <!-- 背景オーバーレイ -->
        <div class="overlay" :class="{ 'is__active': isMenuOpen }" @click="toggleMenu"></div>

    </header>



    <main class="main">
        <NuxtPage />
    </main>

    <footer class="footer"></footer>
</template>


<script setup>
const { isAuthenticated, logout } = useSanctumAuth()
const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};


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

.hamburger__button {
    display: none;
    padding: 0;
    width: 30px;
    border: none;
    cursor: pointer;
    background-color: transparent;

    .hamburger__image {
        width: 100%;
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


/* サイドバー */
.sidebar {
    position: fixed;
    top: 80; /* ヘッダーの高さ分 */
    left: -250px; /* 初期状態は画面外 */
    width: 250px;
    height: calc(100vh - 80px); /* ヘッダーを除いた高さ */
    background-color: #202020;
    z-index: 1100; /* ヘッダーより上に表示 */
    transition: transform 0.3s ease;

    &.is__open {
        transform: translateX(250px); /* 表示 */
    }

    .sidebar__link__list {
        margin: 20px 0 0;
        padding: 0;
        list-style: none;

        .list__item__link {

            .sidebar__link {
                display: inline-block;
                padding: 5px 15px;
                width: 100%;
                text-decoration: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                box-sizing: border-box;

                /* ホバー時の背景色変更 */
                &:hover {
                    background-color: #333;
                }
            }
        }
    }
}

/* 背景オーバーレイ */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* グレーで彩度を落とす */
    z-index: 1000; /* サイドバーの下に配置 */
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;

    &.is__active {
        opacity: 1;
        pointer-events: auto;
    }
}


/* タブレット（～1024px） */
@media screen and (max-width: 1024px) {

    .header {
        .header__container {
            justify-content: flex-start;
            gap: 0 20px;

            .search {
                margin-left: auto;
            }
        }
    }

    .hamburger__button {
        display: inline-block;
    }

    .button__wrapper {
        display: none;
    }
}
</style>