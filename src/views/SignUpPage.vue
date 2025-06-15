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
                    <span class="labelTitle">
                        비밀번호
                        <span v-if="errorData.password" class="errorMsg">{{ errorData.password }}</span>
                    </span>

                    <input type="password" v-model="userInfo.password" placeholder="영문, 숫자, 특수문자 12~20자"
                        @input="passwordCheck(userInfo.password)">
                </label>

                <label for="">
                    <span class="labelTitle">
                        이름
                        <span v-if="errorData.name" class="errorMsg">{{ errorData.name }}</span>
                    </span>
                    <input type="text" v-model="userInfo.name" placeholder="이름을 입력하세요."
                        @input="nameCheck(userInfo.name)">
                </label>

                <label for="" class="">
                    <span class="labelTitle">
                        이메일
                        <span v-if="errorData.email" class="errorMsg">{{ errorData.email }}</span>
                    </span>
                    <span class="label2">
                        <input type="text" v-model="userInfo.email" placeholder="@를 포함하여 입력하세요."
                            @input="emailCheck(userInfo.email)">
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
                    <span class="labelTitle">
                        생년월일
                        <span v-if="errorData.birth" class="errorMsg">{{ errorData.birth }}</span>
                    </span>
                    <input type="date" v-model="userInfo.birth" @input="birthCheck(userInfo.birth)">
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

// 아이디 유효성 검사
const userIdCheck = (user_id) => {
    // A ~ Z, a ~ z, 0 ~ 9 (6 ~ 14자 확인)
    const checkType = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,14}$/;

    // .test()를 이용해 표현식과 일치하는지 확인 (checkType === user_id)
    if (!checkType.test(user_id)) {
        if (user_id.length === 0) {
            errorData.value.user_id = "";
        } else {
            errorData.value.user_id = "6~14자의 영문과 숫자를 포함해야 합니다.";
        }
        return false;
    }

    errorData.value.user_id = "";
    return true;
}

// 비밀번호 유효성 검사
const passwordCheck = (password) => {
    // 영문, 숫자, 특수문자 포함하여 12~20자
    const checkType = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{12,20}$/;

    if (!checkType.test(password)) {
        if (password.length === 0) {
            errorData.value.password = "";
        } else {
            errorData.value.password = "12~20자의 영문, 숫자, 특수문자를 포함해야 합니다.";
        }
        return false;
    }
    errorData.value.password = "";
    return true;
}

// 이름 유효성 검사
const nameCheck = (name) => {
    // 한글 2~8자자
    const checkType = /^[가-힣]{2,8}$/;

    if (!checkType.test(name)) {
        if (name.length === 0) {
            errorData.value.name = "";
        } else {
            errorData.value.name = "2~8자의 한글 이름만 입력해야 합니다.";
        }
        return false;
    }
    errorData.value.name = "";
    return true;
}

// 이메일 유효성 검사
const emailCheck = (email) => {
    // 일반적인 이메일 형식
    const checkType = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!checkType.test(email)) {
        if (email.length === 0) {
            errorData.value.email = "";
        } else {
            errorData.value.email = "올바른 이메일 형식으로 입력해주세요.";
        }
        return false;
    }

    errorData.value.email = "";
    return true;
}

// 생년월일 유효성 검사
const birthCheck = (birth) => {
    const selectDate = new Date(birth);
    const today = new Date();

    if (selectDate > today) {
        errorData.value.birth = "올바른 생년월일을 입력해주세요.";
        return false;
    }

    errorData.value.birth = "";
    return true;
}

// 이메일 인증 여부 저장 변수
const emailVerified = ref(false);

// 인증코드 발송
const sendCode = async () => {
    try {
        // 서버로 전송하여 인증코드 발송을 요청
        const res = await axios.post("http://122.46.30.192:3000/auth/sendCode", {
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
        const res = await axios.post("http://122.46.30.192:3000/auth/verifyCode", {
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

// 필드 확인
function checkField(type, alertMsg) {
    if (!type) {
        alert(alertMsg);
        return false;
    }
    return true;
}

// 회원가입
const signUp = async () => {
    if (!checkField(userIdCheck(userInfo.value.user_id), "올바른 아이디를 입력해주세요.")) return;
    if (!checkField(passwordCheck(userInfo.value.password), "올바른 비밀번호를 입력해주세요.")) return;
    if (!checkField(nameCheck(userInfo.value.name), "올바른 이름을 입력해주세요.")) return;
    if (!checkField(emailCheck(userInfo.value.email), "올바른 이메일을 입력해주세요.")) return;
    if (!checkField(birthCheck(userInfo.value.birth), "올바른 생년월일을 입력해주세요.")) return;

    try {
        // 회원가입 입력란에 입력한 정보를 서버에 전송
        const res = await axios.post("http://122.46.30.192:3000/auth/signUp", {
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
