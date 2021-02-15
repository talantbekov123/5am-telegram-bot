(async () => {
    const TelegramBot = require('node-telegram-bot-api');

    // replace the value below with the Telegram token you receive from @BotFather
    const token = '1625857880:AAFgp0X34mJYcdzvJvHbTnp-oZzPv-peplY';

    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, { polling: true });


    /* Configure database */
    const db = require('./database/index')('./database/models/*.js');
    db.connect('mongodb://localhost/5amclub');

    let questions = ['Утро — новый день, новый вдох, новые надежды...',
        'Если каждое утро вы будете просыпаться с мыслью о том, что сегодня обязательно произойдет что-то хорошее, так и будет!',
        'Утром один час лучше, чем два вечером.',
        'Каждое утро перед нами стоит выбор: продолжить спать и видеть прекрасные сны, или встать и воплощать эти сны в реальность. Выбор за нами.',
        'Утром людям приходят более правильные мысли, чем вечером.',
        'Ненастное утро может смениться ясным днём.',
        'Утром думай. Днем действуй. Вечером ешь. Ночью спи.',
        'Утро вечера мудренее. Звучит глупо и затасканно, но это так.',
        'Утром всё выглядит иначе.',
        'Рано ложиться и рано вставать — вот что делает человека здоровым, богатым и умным.',
        'Если утро было добрым, значит, день будет успешный. А доброе оно по определению.',
        'Счастливых людей будит вовсе не будильник...',
        'Ты удивишься, но счастливому человеку легко вставать утром.',
        'Каждое утро — шанс начать жизнь заново.',
        'Если вы проснулись утром с ощущением, что проспали на работу — подремлите еще часок, чтобы ощущение переросло в уверенность.',
        'Самый крепкий сон наступает после сигнала будильника в 7 утра.',
        'Не выспался — это когда с утра на работе вместо мобильного в кармане обнаруживаешь пульт от телевизора.',
        'Мало встать рано утром, надо ещё перестать спать.',
        'Восемьдесят три процента всех дней в году начинаются одинаково: звенит будильник.'
    ];

    let axilary = 'Напишите в ответ любой текст, что бы бот зафиксировал ваш ответ.'

    // max excluded
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    async function tick() {
        // get time
        var datetime = new Date();
        var hours = datetime.getHours();
        let minutes = datetime.getMinutes();

        const chats = await db.Chat.find({});

        console.log(hours, minutes);

        if (hours == 3 && minutes == 21) {

            for (let chat of chats) {
                if (chat.isOpenToQuestion) {
                    await db.Chat.findOneAndUpdate({ chatId: chat.chatId }, { isOpenToQuestion: false });
                    let randomInt = getRandomInt(19);
                    // get random and ask questions
                    bot.sendMessage(chat.chatId, questions[randomInt] + `\n\n${axilary}`).catch((error) => {
                        console.log(error.code);
                        console.log(error.response.body);
                    });
                }
            }
        } else if (hours == 6 && minutes == 15) {
            for (let chat of chats) {
                if (chat.isOpenToQuestion) {
                    await db.Chat.findOneAndUpdate({ chatId: chat.chatId }, { isOpenToQuestion: false });
                    let randomInt = getRandomInt(19);
                    // get random and ask questions
                    bot.sendMessage(chat.chatId, questions[randomInt] + `\n\n${axilary}`).catch((error) => {
                        console.log(error.code);
                        console.log(error.response.body);
                    });
                }
            }
        } else {
            for (let chat of chats) {
                await db.Chat.findOneAndUpdate({ chatId: chat.chatId }, { isOpenToQuestion: true });
            }
        }

    }


    setInterval(tick, 10000);

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const message = msg.text;
        const from = msg.from;

        if (message.toLocaleLowerCase() == 'start') {
            await db.Chat.findOneAndUpdate({ chatId }, { from, isOpenToQuestion: true }, { upsert: true });
            bot.sendMessage(chatId, 'Вы сохранены в базе');
        } else if (message.toLocaleLowerCase() == 'end') {
            await db.Chat.remove({ chatId });
            bot.sendMessage(chatId, 'Вы удалены с базы');
        }
        await db.Response.create({ chatId, message });

        // send a message to the chat acknowledging receipt of their message
    });
})();