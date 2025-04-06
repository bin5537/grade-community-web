<template>
    <section id="loginWrap">
        <article id="loginBox">
            <h1 class="logo">LOGO</h1>
            <form action="">
                <input type="text" placeholder="아이디를 입력하세요.">
                <input type="password" placeholder="비밀번호를 입력하세요.">

                <div>
                    <div class="checkList">
                        <input type="checkbox" id="save_id">
                        <span class="checkBox"></span>
                        <label for="save_id">아이디 저장</label>
                    </div>
                    <div class="checkList">
                        <input type="checkbox" id="keep_login">
                        <span class="checkBox"></span>
                        <label for="keep_login">자동 로그인</label>
                    </div>
                </div>

                <input type="submit" value="로그인">
            </form>

            <div class="line and">
                <span>또는</span>
            </div>

            <div id="oAuthMenu">
                <button class="kakao">
                    <span class="logo"></span>
                    <span class="text">카카오로 로그인</span>
                </button>
                <button class="toss">
                    <span class="logo"></span>
                    <span class="text">토스로 로그인</span>
                </button>
            </div>

            <div class="line end">
                <a href="#">아이디 찾기</a>
                <a href="#">비밀번호호 찾기</a>
                <a href="#">회원가입</a>
            </div>
        </article>
    </section>
</template>

<style lang="scss">
    @import "../scss/layout/_Base.scss";
    @import "../scss/views/_LoginPage.scss";
</style>

