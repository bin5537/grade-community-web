require("dotenv").config();

const express = require("express");
const router = express.Router();
const mysql2 = require("mysql2/promise");
const nodemailer = require("nodemailer");

const database = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const emailCode = {};

router.post("/sendCode", async (req, res) => {
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
        res.json({
            success: true
        });
    } catch (error) {
        console.log("이메일 전송 실패", error);
        res.json({
            success: false
        });
    }
});

router.post("/verifyCode", async (req, res) => {
    const {
        code,
        email
    } = req.body;

    if (emailCode[email] && emailCode[email].toString() === code.toString()) {
        return res.json({
            match: true
        });
    } else {
        return res.json({
            match: false
        });
    }
});

router.post("/signUp", async (req, res) => {
    const {
        user_id,
        password,
        name,
        email,
        birth
    } = req.body;

    try {
        await database.query(
            `INSERT INTO mojuk_users (user_id, password, name, email, birth, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [user_id, password, name, email, birth]
        )

        res.json({
            success: true
        });
    } catch (error) {
        console.log("데이터베이스 관련 오류발생", error);
        res.json({
            success: false
        });
    }
});

module.exports = router;
