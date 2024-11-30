<template>
    <h2>profile</h2>
</template>

<script setup>
definePageMeta({
    middleware: ['sanctum:auth'],
});
</script>
