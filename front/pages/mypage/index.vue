<template>
    <h2>mypage</h2>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>
