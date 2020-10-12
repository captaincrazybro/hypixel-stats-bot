const mineflayer = require('mineflayer')

console.log("hi");

const bot = mineflayer.createBot({
  host: 'mc.hypixel.net', // optional
  port: 25565,       // optional
  username: process.env.EMAIL, // email and password are required only for
  password: process.env.PASSWORD,          // online-mode=true servers
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

console.log("connected");

bot.on('message', function (messageJson) {
  let message = "";
    if(messageJson.json.extra != undefined){
      messageJson.json.extra.forEach(val => {
        message += val.text;
      })
    }
  console.log(message);
  if(messageJson.json.text){
    let message;
    if(messageJson.json.text) message = messageJson.json.text;
    else message = "";
    if(messageJson.json.extra != undefined){
      messageJson.json.extra.forEach(val => {
        message += val.text;
      })
    }
    let sender;
    if(message.split(":")[0].split(" ").length == 2){
      sender = message.split(":")[0].split(" ")[1];
    } k=ekse u===else {
      sender = message.split(":")[0]
    }
    
    let cmd = message.split(":")[1];
    
    console.log(sender);
    console.log(cmd);
    
  }
})