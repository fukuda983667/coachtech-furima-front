<template>
    <header class="header">
        <div class="header__container">
            <h1>
                <a class="link" href="/">
                    <img src="../public/icon/logo.svg" alt="ヘッダーロゴ">
                </a>
            </h1>
        </div>
    </header>
    <main class="main">
        <NuxtPage />
    </main>
    <footer class="footer"></footer>
</template>


<script setup>

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

.main {
    padding: 0;
}
</style>

<style lang="scss" scoped>
.header {
    background-color: #000;
    .header__container {
        display: flex;
        margin: 0 auto;
        padding: 0 20px;
        height: 80px;
        max-width: 1300px;
        justify-content: space-between;
        align-items: center;
            h1 {
                margin: 0;
                height: 32px;
            }
    }
}
</style>