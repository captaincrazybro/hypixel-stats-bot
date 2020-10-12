const mineflayer = require('mineflayer')
const hypixel = require('hypixel-api-nodejs');

const bot = mineflayer.createBot({
  host: 'mc.hypixel.net', // optional
  port: 25565,       // optional
  username: process.env.EMAIL, // email and password are required only for
  password: process.env.PASSWORD,          // online-mode=true servers
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

console.log("Connected!");

bot.on('message', function (messageJson) {
    let message;
    if(messageJson.json.text) message = messageJson.json.text;
    else message = "";
    if(messageJson.json.extra != undefined){
      messageJson.json.extra.forEach(val => {
        message += val.text;
      })
    }
  //console.log(message);
  if(messageJson.json.text == "From "){
    message = message.replace("From ", "");
    let sender;
    if(message.split(":")[0].split(" ").length == 2){
      sender = message.split(":")[0].split(" ")[1];
    //} else if(message.split(":")[0].split(" ").length == 3){
    //  
    } else {
      sender = message.split(":")[0]
    }
    
    let cmd = message.split(":")[1];
    let args = cmd.split(" ");
    args.shift();
    
    if(args.length == 0) return sendMessage(sender, "Specify a command (message the bot 'help' for a list of commands)")
    
    if(args[0] == "help"){
      sendMessage(sender, "List of commands");
    } else {
      getStats(sender, args);
    }
    
  }
})

function getStats(sender, args){
  let gamemode = args[0];
  
  let player;
  
  if(args.length == 1) player = sender;
  else player = args[1];
  
  hypixel.getPlayerByName(process.env.APIKEY, player).then(player => {
    console.log(player.stats[gamemode]);
  })
  
  
}

function sendMessage(username, message){
  console.log(`To ${username}: ${message}`)
  //bot._client.write("chat", {message:`/msg ${username} ${message}`});
}