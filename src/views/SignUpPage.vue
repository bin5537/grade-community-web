<template>
    <section id="signUpWrap">
        <article id="signUpBox">
            <div class="logo">
                <h1 class="logo">LOGO</h1>
                <p>회원가입을 통해 다양한 서비스를 이용해보세요!</p>
            </div>

            <form @submit.prevent="signUp">
                <label for="">
                    <span class="labelTitle">
                        아이디
                        <span v-if="errorData.user_id" class="errorMsg">{{ errorData.user_id }}</span>
                    </span>
                    <input type="text" v-model="userInfo.user_id" placeholder="영문, 숫자 6~14자"
                        @input="userIdCheck(userInfo.user_id)">
                </label>

                <label for="">
                    <span class="labelTitle">비밀번호</span>
                    <input type="password" v-model="userInfo.password" placeholder="영문, 숫자, 특수문자 12~20자">
                </label>

                <label for="">
                    <span class="labelTitle">이름</span>
                    <input type="text" v-model="userInfo.name" placeholder="이름을 입력하세요.">
                </label>

                <label for="" class="">
                    <span class="labelTitle">이메일</span>
                    <span class="label2">
                        <input type="text" v-model="userInfo.email" placeholder="@를 포함하여 입력하세요.">
                        <button @click="sendCode" type="button">인증코드 발송</button>
                    </span>
                </label>

                <label for="">
                    <span class="label2">
                        <input type="text" v-model="userInfo.codeInput" placeholder="인증코드를 입력하세요.">
                        <button @click="verifyCode" type="button">인증 확인</button>
                    </span>
                </label>

                <label for="">
                    <span class="labelTitle">생년월일</span>
                    <input type="date" v-model="userInfo.birth">
                </label>

                <input type="submit" value="회원가입">
            </form>
        </article>
    </section>
</template>

<style lang="scss">
@import "../scss/layout/base.scss";
@import "../scss/views/_SignUpPage.scss";
</style>

<script setup>

import { ref } from "vue";  // 반응형 데이터 관리 함수
import axios from "axios";  // HTTP 요청/응답 라이브러리

// userInfo 객체 생성 (ID, 비밀번호, 성명, 이메일, 인증코드, 생년월일일)
const userInfo = ref({
    user_id: "",
    password: "",
    name: "",
    email: "",
    codeInput: "",
    birth: "",
});

// errorData 객체 생성
const errorData = ref({
    user_id: "",
    password: "",
    name: "",
    email: "",
    codeInput: "",
    birth: ""
});

const userIdCheck = (user_id) => {
    // A ~ Z, a ~ z, 0 ~ 9 (6 ~ 14자 확인)
    const checkType = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,14}$/;

    // .test()를 이용해 표현식과 일치하는지 확인 (checkType === user_id)
    if (!checkType.test(user_id)) {
        if (user_id.length === 0) {
            errorData.value.user_id = "";
        } else {
            errorData.value.user_id = "6~14자의 영문과 숫자만 사용하세요.";
        }
        return false;
    }

    errorData.value.user_id = "";
    return true;
}

// 이메일 인증 여부 저장 변수
const emailVerified = ref(false);

// 인증코드 발송
const sendCode = async () => {
    try {
        // 서버로 전송하여 인증코드 발송을 요청
        const res = await axios.post("http://localhost:3000/auth/sendCode", {
            email: userInfo.value.email
        });

        // 인증코드 발송송 성공 응답시 alert()
        if (res.data.success) {
            alert("인증코드가 발송되었습니다.");
        }
    } catch {
        alert("error");
    }
}

// 인증코드 확인
const verifyCode = async () => {
    try {
        // 입력한 인증코드와 이메일 주소를 서버로 전송
        const res = await axios.post("http://localhost:3000/auth/verifyCode", {
            code: userInfo.value.codeInput,
            email: userInfo.value.email
        });

        // 서버에서 인증 성공 응답시 이메일 인증 여부를 true로 변경
        if (res.data.success) {
            emailVerified.value = true;
            alert("인증이 완료되었습니다.");
        } else {
            alert("인증을 실패하였습니다.");
        }
    } catch {
        alert("error");
    }
}

// 회원가입
const signUp = async () => {
    // 이메일 인증이 완료가 안된 경우 return
    if (!userIdCheck(userInfo.value.user_id)) return;
    if (!emailVerified.value) return;

    try {
        // 회원가입 입력란에 입력한 정보를 서버에 전송
        const res = await axios.post("http://localhost:3000/auth/signUp", {
            user_id: userInfo.value.user_id,
            password: userInfo.value.password,
            name: userInfo.value.name,
            email: userInfo.value.email,
            birth: userInfo.value.birth
        });

        // success 응답시 회원가입 성공 alert() 실행
        if (res.data.success) {
            alert("회원가입을 완료하였습니다!");
        } else {
            alert("실패")
        }
    } catch {
        alert("error");
    }
}
</script>
