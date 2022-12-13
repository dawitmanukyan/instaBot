require("dotenv").config();
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const nodeTelegramApi = require('node-telegram-bot-api');

const token = '5924043349:AAEQy9xoE9MiNCEqjWlEVWK_OxhbuDY31qg';

const bot = new nodeTelegramApi(token, {polling: true});

let status = false;

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Bot starting'},
        {command: '/instapost', description: 'Post photo to Instagram'}
    ]);
    
    bot.on('message', message => {
        console.log(message);
        const userMessage = message.text;
        const userId = message.chat.id;
        if(userMessage == '/start'){
            return bot.sendMessage(userId, 'Hi');
        }
        if(userMessage == '/instapost'){
            status = true;
            return bot.sendMessage(userId, 'Please send me photos url');
        }
        if(status){
            status = false;
            const postToInsta = async () => {
                const ig = new IgApiClient();
                ig.state.generateDevice(process.env.IG_USERNAME);
                await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

                const imageBuffer = await get({
                    url: message.text,
                    encoding: null, 
                });

                await ig.publish.photo({
                    file: imageBuffer,
                    caption: 'This photo added by nodePostPhotoBot'
                });
            }
            postToInsta();
            bot.sendMessage(userId, '✅ Added ✅');
        }
    });
}
start();
