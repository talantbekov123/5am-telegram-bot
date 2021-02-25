const express = require('express')
const app = express()
const port = 3000
fs = require('fs');

app.get('/', async (req, res) => {
  const db = require('./database/index')('./database/models/*.js');
  db.connect('mongodb://localhost/5amclub');

  let chats = await db.Chat.find({});
  let responses = await db.Response.find({});

  var currDate = new Date();

  let result = [];
  for (let chat of chats) {
    let name = chat.from.first_name;
    if (chat.from.last_name) {
      name += ' ' + chat.from.last_name;
    }

    let obj = {
      name,
      time: []
    }

    for (let i = 5; i >= 0; i--) {
      
      let axilary = []

      for (let response of responses) {
        let date = new Date(response.created_at);
        const diffTime = Math.abs(date - currDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (chat.chatId.toString() == response.chatId.toString() && diffDays == i) {
          let bishTime = new Date(response.created_at);
          bishTime.setHours(bishTime.getHours());
          axilary.push(`${bishTime.getHours()}:${bishTime.getMinutes()}`);
        }

      }

      obj.time.push(axilary);
    }
    obj.time.pop();
    
    result.push(obj);
  }


  let data = `{ "data": ${JSON.stringify(result)}}`;
  await fs.writeFileSync('botFile.json', data);

  res.sendFile(__dirname + "/botFile.json");
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})