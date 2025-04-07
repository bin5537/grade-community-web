<template>
    <section id="loginWrap">
        <article id="loginBox">
            <h1 class="logo">LOGO</h1>
            <form action="">
                <input type="text" placeholder="아이디를 입력하세요.">
                <input type="password" placeholder="비밀번호를 입력하세요.">

                <div>
                    <div class="checkList" v-for="checkBox in checkBoxs" :key="checkBox.id">
                        <input type="checkbox" :id="checkBox.id">
                        <span class="checkBox"></span>
                        <label :for="checkBox.id">{{ checkBox.label }}</label>
                    </div>
                </div>

                <input type="submit" value="로그인">
            </form>

            <div class="line and">
                <span>또는</span>
            </div>

            <div id="oAuthMenu">
                <button v-for="btn in oAuthButtons" :key="btn.category" :class="btn.category">
                    <span class="logo"></span>
                    <span class="text">{{ btn.text }}</span>
                </button>
            </div>

            <div class="line end">
                <a v-for="(link, idx) in footerLinks" :key="idx" :href="link.href">
                    {{ link.text }}
                </a>
            </div>
        </article>
    </section>
</template>

<style lang="scss">
    @import "../scss/layout/_Base.scss";
    @import "../scss/views/_LoginPage.scss";
</style>

<script setup>
    const checkBoxs = [
        { id: "save_id", label: "아이디 저장" },
        { id: "keep_login", label: "자동 로그인" },
    ]
    const oAuthButtons = [
        { category: "kakao", text: "카카오로 로그인" },
        { category: "toss", text: "토스로 로그인" },
    ]

    const footerLinks = [
        { text: "아이디 찾기", href: "#" },
        { text: "비밀번호 찾기", href: "#" },
        { text: "회원가입", href: "#" },
    ]
</script>
