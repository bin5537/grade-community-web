<template>
    <nav>
        <router-link to="/LoginPage">로그인</router-link> |
        <router-link to="/SignUpPage">회원가입</router-link>
    </nav>
    <router-view/>
    <FooterBox />
</template>

<script setup>
    import FooterBox from "./components/FooterBox.vue";
</script>

<style lang="scss">
    @import "./scss/main.scss";
</style>
