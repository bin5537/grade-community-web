const express = require("express");
const mysql2 = require("mysql2/promise");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:1115",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));

// 데이터베이스 연결
const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 이메일 인증코드 저장
const emailCode = {};

// 이메일 발송
app.post("/auth/sendCode", async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000);
    emailCode[email] = code;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            to: email,
            subject: "[Mojuk] 회원가입 인증코드 발송",
            html: `<div>인증코드: ${code}</div>`
        });

        return res.json({ success: true });
    } catch {
        return res.json({ success: false });
    }
});

// 인증코드 확인
app.post("/auth/verifyCode", (req, res) => {
    const { code, email } = req.body;
    if (emailCode[email] && emailCode[email].toString() === code.toString()) {
        return res.json({ success: true });
    } else {
        return res.json({ success: false });
    }
});

// 회원가입
app.post("/auth/signUp", async (req, res) => {
    const { user_id, password, name, email, birth } = req.body;

    try {
        const bcryptPassword = await bcrypt.hash(password, 10);
        await database.query(
            `INSERT INTO mojuk_users (user_id, password, name, email, birth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, bcryptPassword, name, email, birth]
        );
        return res.json({ success: true });
    } catch {
        return res.json({ success: false });
    }
});

// 로그인
app.post("/auth/login", async (req, res) => {
    const { user_id, password } = req.body;

    try {
        const [users] = await database.query(
            `SELECT * FROM mojuk_users WHERE user_id = ?`,
            [user_id]
        );

        if (users.length === 0) {
            return res.json({ success: false });
        }

        const user = users[0];
        const passwordCheck = await bcrypt.compare(password, user.password);

        if (passwordCheck) {
            req.session.user = {
                id: user.id,
                user_id: user.user_id,
                name: user.name
            };
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        return res.json({ success: false });
    }
});

// 세션 확인
app.get("/auth/check", (req, res) => {
    if (req.session.user) {
        res.json({ isLogin: true, user: req.session.user });
    } else {
        res.json({ isLogin: false });
    }
});

// 로그아웃
app.post("/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ success: true });
    });
});

// 서버 시작
app.listen(3000, () => {
    console.log("server.js (port: 3000)");
});
