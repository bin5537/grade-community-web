<template>
    <header>
        <div class="inner">
            <h1 class="logo">
                <router-link to="/">LOGO</router-link>
            </h1>

            <nav>
                <ul>
                    <li>
                        <router-link to="/GeneralBoard">일반게시판</router-link>
                    </li>
                    <li><a href="#">익명게시판</a></li>
                    <li><a href="#">학점관리</a></li>
                </ul>
            </nav>

            <div id="myPage">
                <ul>
                    <li>
                        <router-link to="/LoginPage">로그인</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>
