<template>
    <section id="loginWrap">
        <article id="loginBox">
            <h1 class="logo">LOGO</h1>
            <form action="" @submit.prevent="login">
                <input type="text" v-model="user_id" placeholder="아이디를 입력하세요.">
                <input type="password" v-model="password" placeholder="비밀번호를 입력하세요.">

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
                <button v-for="btn in oAuthButtons" :key="btn.category" :class="btn.category"
                    @click="oAuthLogin(btn.category)">
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
import { onMounted, ref } from "vue";
import axios from "axios";

const user_id = ref("");
const password = ref("");

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
const oAuthLogin = async (category) => {
    if (category !== "kakao") return;

    if (!window.Kakao || !window.Kakao.Auth || !window.Kakao.isInitialized()) {
        return;
    }

    try {
        const authObj = await new Promise((resolve, reject) => {
            window.Kakao.Auth.login({
                scope: "profile_nickname, account_email",
                success: resolve,
                fail: reject
            });
        });

        const res = await axios.post("http://122.46.30.192:3000/auth/kakao", {
            access_token: authObj.access_token
        }, { withCredentials: true });

        if (res.data.success) {
            alert("카카오 로그인을 성공하였습니다.");
            window.location.href = "/";
        } else {
            alert("카카오 로그인에 실패하였습니다.");
        }
    } catch (err) {
        console.error(err);
        alert("카카오 로그인 중 오류가 발생했습니다." + JSON.stringify(err));
    }
};


// 로컬 로그인
const login = async () => {
    try {
        const res = await axios.post("http://122.46.30.192:3000/auth/login", {
            user_id: user_id.value,
            password: password.value
        });

        if (res.data.success) {
            window.location.href = "/";
            alert("로그인을 성공하였습니다.");
        } else {
            alert("아이디 또는 비밀번호가 올바르지 않습니다.")
        }
    } catch (error) {
        alert(error);
    }
}
</script>
