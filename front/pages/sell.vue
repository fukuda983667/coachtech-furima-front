<template>
    <h2>sell</h2>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>