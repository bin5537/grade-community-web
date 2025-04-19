const express = require("express"); // 웹 서버 구축
const mysql2 = require("mysql2/promise"); // MySql 데이터베이스 연결 라이브러리
const nodemailer = require("nodemailer"); // 이메일 발송 라이브러리

// 2025-04-15 (세션작업)
const cors = require("cors");
const exSession = require("express-session");
const session = require("express-session");

// 환경변수 불러오기기
require("dotenv").config();

const app = express();
const maxAge = 1000; // 세션 유지 시간

app.use(express.json());
app.use(cors({
    origin: "http://localhost:1115",
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: maxAge * (1000 * 60 ^ 60)
    }
}));

// 데이터베이스 연결
const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 이메일 코드 저장 객체
const emailCode = {};

// 이메일 발송
app.post("/auth/sendCode", async (req, res) => {
    const {
        email
    } = req.body;

    // 100,000 ~ 999,999 이하 랜덤 정수 생성
    const code = Math.floor(100000 + Math.random() * 900000);

    // 인증코드를 이메일에 저장
    emailCode[email] = code;

    // SMTP 설정 (user: 이메일 주소, pass: 구글 앱 비밀번호)
    const transporter = nodemailer.createTransport({
        service: "gmail", // gmail 사용
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    try {
        // 인증코드 이메일 발송 (html을 이용한 디자인)
        await transporter.sendMail({
            to: email,
            subject: "[Mojuk] 회원가입 인증코드 발송",
            html: `
                <div style="max-width:520px; margin:0 auto; padding:20px; border:1px solid #e0e0e0; border-radius:5px; font-family:'SpoqaHanSansNeo', sans-serif;">
                    <h2 style="color:#444; font-size:28px; font-weight:bold;">Mojuk 인증코드</h2>
                    <p style="color:#999; font-size:16px;">아래의 인증코드를 입력해주세요.</p>
                    <div style="background:#f5f5f5; padding:20px 0; text-align:center; font-size:32px; letter-spacing:10px; font-weight:bold; color:#333; margin:20px 0;">
                        ${code}
                    </div>
                    <p style="color:#999; font-size:12px;">ⓒ 2025. subin All Rights Reserved.</p>
                </div>
            `
        });

        res.json({
            success: true
        });
    } catch {
        res.json({
            success: false
        });
    }
});

// 인증코드 확인
app.post("/auth/verifyCode", (req, res) => {
    const {
        code,
        email
    } = req.body;

    // 이메일 코드가 존재하는 경우 입력한 코드와 발급받은 인증코드가 일치한지 확인
    if (emailCode[email] && emailCode[email].toString() === code.toString()) {
        return res.json({
            success: true
        });
    } else {
        return res.json({
            success: false
        });
    }
});

// 회원가입 (SQL 저장)
app.post("/auth/signUp", async (req, res) => {
    const {
        user_id,
        password,
        name,
        email,
        birth
    } = req.body;

    try {
        // 입력받은 사용자 정보를 DB에 저장하는 쿼리
        await database.query(
            `INSERT INTO mojuk_users (user_id, password, name, email, birth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, password, name, email, birth]
        );
        res.json({
            success: true
        });
    } catch {
        res.json({
            success: false
        });
    }
});

// 로그인

app.post("/auth/login", async (req, res) => {
    const {
        user_id,
        password
    } = req.body;

    try {
        const dataResult = await database.query(
            `SELECT * FROM mojuk_users WHERE user_id = ? AND password = ?`,
            [user_id, password]
        );

        if (dataResult.length > 0) {
            req.session.user = {
                id: dataResult[0].id,
                user_id: dataResult[0].user_id,
                name: dataResult[0].name
            }

            res.json({
                success: true,
                user: req.session.user
            });
        }
    } catch {
        res.json({
            success: false
        })
    }
});

// 서버 시작
app.listen(3000, () => {
    console.log("server.js (port: 3000)");
});
