<template>
    <p>認証メールを送信しました</p>
</template>

<script setup>
// 未認証ユーザのみ閲覧可能
definePageMeta({
    middleware: ['sanctum:guest'],
    layout: 'auth',
});
</script>