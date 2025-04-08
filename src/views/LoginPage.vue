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
                <button v-for="btn in oAuthButtons" :key="btn.category" :class="btn.category" @click="oAuthLogin(btn.category)">
                    <span class="logo"></span>
                    <span class="text">{{ btn.text }}</span>
                </button>
            </div>

            <div class="line end">
                <span v-for="(link, idx) in footerLinks" :key="idx">
                    <a v-if="link.type === 'a'" :href="link.href">{{ link.text }}</a>
                    <RouterLink v-else-if="link.type === 'router'" :to="link.href">{{ link.text }}</RouterLink>
                </span>
            </div>


        </article>
    </section>
</template>

<style lang="scss">
    @import "../scss/layout/_base.scss";
    @import "../scss/views/_LoginPage.scss";
</style>

<script setup>
    import { onMounted } from "vue";

    // 체크박스 목록 정리
    const checkBoxs = [
        { id: "save_id", label: "아이디 저장" },
        { id: "keep_login", label: "자동 로그인" },
    ]

    // 간편 로그인 목록록 정리
    const oAuthButtons = [
        { category: "kakao", text: "카카오로 로그인" },
        { category: "naver", text: "네이버로 로그인" },
    ]

    // 하단 하이퍼링크 목록 정리
    const footerLinks = [
        { text: "아이디 찾기", href: "#", type: "a" },
        { text: "비밀번호 찾기", href: "#", type: "a" },
        { text: "회원가입", href: "/SignUpPage", type: "router" }
    ];


    // 카카오 JavaScript SDK 키 (키 노출방지를 위해 env 활용)
    onMounted(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init(process.env.VUE_APP_KAKAO_JAVASCRIPT_KEY);
        }
    });

    // 간편 로그인 버튼 클릭시 (category로 값을 받아 확인(카카오, 네이버 등))
    function oAuthLogin(category) {
        if (category === "kakao") {
            // kakao가 없거나 Auth가 없으면 return
            if (!window.Kakao || !window.Kakao.Auth) return;

            // 카카오 로그인 인증요청
            window.Kakao.Auth.authorize({ redirectUri: "http://localhost:1115/kakao/callback" });
        } else if (category === "naver") {
            // 네이버인경우 실행
            alert("naver 인증요청(test)");
        }
    }
</script>
