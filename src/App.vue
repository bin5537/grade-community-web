<template>
    <headerBox />
    <router-view/>
    <FooterBox />
</template>

<script setup>
    import FooterBox from "./components/FooterBox.vue";
    import headerBox from "./components/headerBox.vue";
</script>

<style lang="scss">
    @import "./scss/main.scss";
</style>