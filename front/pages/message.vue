<template>
    <div class="message__container">
        <p class="message">認証メールを送信しました</p>
    </div>
</template>

<script setup>
// 未認証ユーザのみ閲覧可能
definePageMeta({
    middleware: ['sanctum:guest'],
    layout: 'auth',
});
</script>

<style lang="scss" scoped>
.message__container {
    margin: 0 auto;
    padding: 0 20px;
    max-width: 1350px;
    box-sizing: border-box;
}
</style>