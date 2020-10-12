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
    
    if(args[0].toLowerCase() == "help"){
      sendMessage(sender, "List of commands");
    } else if(args[0].toLowerCase() == "who" || args[0].toLowerCase() == "list"){
      sendMessage(sender, "Coming soon... :)")
    } else if(args[0].toLowerCase() == "about" || args[0].toLowerCase() == "author"){
      sendMessage(sender, "Made by cqptain");
    } else {
      getStats(sender, args);
    }
    
  }
})

function getStats(sender, args){
  let gamemode = capitalize(args[0]);
  
  if(gamemode == "Skywars") gamemode = "SkyWars";
  
  let player;
  
  if(args.length == 1) player = sender;
  else player = args[1];
  
  hypixel.getPlayerByName(process.env.APIKEY, player).then(obj => {
    if(!obj.success) return sendMessage(sender, "Invalid player");
    if(obj.player == null || obj.player.stats == null) return sendMessage(sender, "The bot encountered a temporary problem, please try again");
    sendMessage(sender, `${player}'s ${gamemode} stats`)
    let stats = obj.player.stats[gamemode];
    console.log(obj.player.stats)
    console.log(stats);
    if(stats == undefined) return sendMessage(sender, "Invalid gamemode");
    switch(gamemode){
      case("Duels"):{
        sendMessage(sender, `- WS: ${stats.current_winstreak}, Best WS: ${stats.best_overall_winstreak}`);
        sendMessage(sender, `- Wins: ${stats.wins}, Losses: ${stats.losses}`);
        sendMessage(sender, `- Kills: ${stats.kills}, Deaths: ${stats.deaths}`);
        sendMessage(sender, `- WLR: ${Number.parseFloat(stats.wins/stats.losses).toFixed(2)}, KDR: ${Number.parseFloat(stats.kills/stats.deaths).toFixed(2)}`);
        break;
      }
      case("Bedwars"):{
        sendMessage(sender, `- Level: ${obj.player.achievements.bedwars_level}, XP: ${stats.Experience}`)
        sendMessage(sender, `- Finals Kills: ${stats.final_kills_bedwars}, Final Deaths: ${stats.final_deaths_bedwars}`)
        sendMessage(sender, `- Kills: ${stats.kills_bedwars}, Deaths: ${stats.deaths_bedwars}`)
        sendMessage(sender, `- Wins: ${stats.wins_bedwars}, Losses: ${stats.losses_bedwars}`)
        sendMessage(sender, `- FKDR: ${Number.parseFloat(stats.final_kills_bedwars/stats.final_deaths_bedwars).toFixed(2)}, WLR: ${Number.parseFloat(stats.wins_bedwars/stats.losses_bedwars).toFixed(2)}`)
        break;
      }
      case("Skywars"):{
        sendMessage(sender, `- Level: ${obj.player.achievements.skywars_level}, XP: ${stats.Experience}`)
        break;
      }
      default:{
        sendMessage(sender, `Unfortunately, stats for this gamemode are not yet supported`)
        break;
      }
    }
  })
  
  
}

function sendMessage(username, message){
  console.log(`To ${username}: ${message}`)
  //bot._client.write("chat", {message:`/msg ${username} ${message}`});
}

function capitalize(string){
  string = string.toLowerCase();
  string = string.charAt(0).toUpperCase() + string.slice(1)
  return string;
}