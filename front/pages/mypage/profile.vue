<template>
    <h2>profile</h2>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>
