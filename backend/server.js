const express = require("express");
const mysql2 = require("mysql2/promise");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bcrypt = require("bcrypt");

// 환경변수 불러오기
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:1115",
    credentials: true
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

        return res.json({
            success: true
        });
    } catch {
        return res.json({
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

// 회원가입
app.post("/auth/signUp", async (req, res) => {
    const {
        user_id,
        password,
        name,
        email,
        birth
    } = req.body;

    try {
        const bcryptPassword = await bcrypt.hash(password, 10);
        await database.query(
            `INSERT INTO mojuk_users (user_id, password, name, email, birth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, bcryptPassword, name, email, birth]
        );
        return res.json({
            success: true
        });
    } catch {
        return res.json({
            success: false
        });
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
            return res.json({
                success: false
            });
        }

        const passwordCheck = await bcrypt.compare(password, users[0].password);
        if (passwordCheck) {
            return res.json({
                success: true
            });
        } else {
            return res.json({
                success: false
            });
        }
    } catch (err) {
        console.error(err);
        return res.json({
            success: false
        });
    }
});


// 서버 시작
app.listen(3000, () => {
    console.log("server.js (port: 3000)");
});
