<template>
    <header>
        <div class="inner">
            <h1 class="logo">
                <router-link to="/">LOGO</router-link>
            </h1>

            <nav>
                <ul>
                    <li><router-link to="/GeneralBoard">일반게시판</router-link></li>
                    <li><a href="#">익명게시판</a></li>
                    <li><a href="#">학점관리</a></li>
                </ul>
            </nav>

            <div id="myPage">
                <ul>
                    <li v-if="!isLogin">
                        <router-link to="/LoginPage">로그인</router-link>
                    </li>
                    <li v-else>
                        <span>{{ username }}님</span>
                        <ul>
                            <li>
                                <a href="#" @click.prevent="logout">로그아웃</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

axios.defaults.withCredentials = true;

const isLogin = ref(false);
const username = ref("");

const checkLogin = async () => {
    try {
        const { data } = await axios.get("http://localhost:3000/auth/check");
        if (data.isLogin) {
            isLogin.value = true;
            username.value = data.user.name;
        }
    } catch (error) {
        alert(error);
    }
};

const logout = async () => {
    try {
        await axios.post("http://localhost:3000/auth/logout");
        isLogin.value = false;
    } catch (error) {
        alert(error);
    }
};

onMounted(checkLogin);
</script>
