<template>
    <h2>mypage</h2>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>
