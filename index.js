const mineflayer = require('mineflayer')
const hypixel = require('hypixel-api-nodejs');
const getJSON = require('get-json')

let partyQue = [];
let gettingMembers = false;
let partyMembers = [];
let alreadyChecked = false;

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
    
  } else if(message.includes("has invited you to join their party!")){
    if(message.includes(":")) return;
    let player = message.split("\n")[1].split(" ")[0];
    if(player.includes("[")) player = message.split("\n")[1].split(" ")[1];
    partyQue.push(player);
    if(partyQue.length == 1){
      startParty();
    }
  } else if((message.startsWith("Party Leader") || message.startsWith("Party Moderator") || message.startsWith("Party Member")) && gettingMembers){
    let players = message.split(":")[1].split(" ");
    players.shift();
    players.join(" ");
    players = players.split(", ");
    players.forEach(player => {
      if(player.includes("[")) player = player.split(" ")[1];
      if(player != bot.username) partyMembers.push(player);
    })
    if(!alreadyChecked){
      alreadyChecked = true;
      setTimeout(() => {
        
        /*getJSON("https://api.mojang.com/users/profiles/minecraft/" + partyMembers[0], (error, response) => {
          if(error) console.log(error);
          else {
            getJSON(`https://api.hypixel.net/status?key=${process.env.APIKEY}&uuid=${response.id}`, (error, status) => {
              if(error) console.log(error);
              else {
              if(status.session.gametype != undefined && (status.session.gametype == "BEDWARS")){*/
        partyMembers.forEach(val => {
          getJSON("https://api.mojang.com/users/profiles/minecraft/" + val, (error, response) => {
            if(error) {
              console.log(error);
              nextParty();
            } else {
              getJSON(`https://api.hypixel.net/status?key=${process.env.APIKEY}&uuid=${response.id}`, (error, status) => {
                if(error) {
                  console.log(error);
                  nextParty();
                } else {
                  hypixel.getPlayerByUuid(process.env.APIKEY, response.id).then(obj => {
                    let gamemode = capitalize(status.session.gametype)
                    if(gamemode == "Skywars") gamemode = "SkyWars";
                    if(obj.player == null || obj.player.stats == null){
                      console.log({message:"/pchat The bot encountered a temporary problem, please try again"})
                      nextParty();
                      return;
                    }
                    let stats = obj.player.stats[gamemode];
                    switch(gamemode){
                        case("Bedwars"):{
                          console.log({message:`/pchat ${val} - Level: ${obj.player.achievements.level_bedwars}, WS: ${stats.winstreak}, Finals: ${stats.final_kills_bedwars}, FKDR: ${Number.parseFloat(stats.final_kills_bedwars/stats.final_deaths_bedwars).toFixed(2)}, Wins: ${stats.wins_bedwars}`})
                          break;
                        }
                      default:{
                        console.log({message:"/pchat Unfortunately, this gamemode is not yet supported"})
                        break;
                      }
                    }
                    if(partyMembers.indexOf(val) == (partyMembers.length - 1)){
                      nextParty();
                    }
                  })
                }
              })
            }
          })
        });
              /*} else {
                bot._client.write("chat", {message:"Unfortunately, this gamemode is not yet support"})
                alreadyChecked = false;
                partyMembers = []
                gettingMembers = false;
                partyQue.shift()
                bot._client.write("chat", {message:"/party leave"})
              }*/
            //}
            //})
          //}
        //})
      }, 2500)
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
    let stats = obj.player.stats[gamemode];
    //console.log(stats);
    if(stats == undefined) return sendMessage(sender, "Invalid gamemode");
    switch(gamemode){
      case("Duels"):{
        sendMessage(sender, `${player}'s ${gamemode} stats - WS: ${stats.current_winstreak}, Best WS: ${stats.best_overall_winstreak}, Wins: ${stats.wins}, Losses: ${stats.losses}, Kills: ${stats.kills}, Deaths: ${stats.deaths}, WLR: ${Number.parseFloat(stats.wins/stats.losses).toFixed(2)}, KDR: ${Number.parseFloat(stats.kills/stats.deaths).toFixed(2)}`);
        break;
      }
      case("Bedwars"):{
        sendMessage(sender, `${player}'s ${gamemode} stats - Level: ${obj.player.achievements.bedwars_level}, XP: ${stats.Experience}, WS: ${stats.winstreak}, Finals Kills: ${stats.final_kills_bedwars}, Final Deaths: ${stats.final_deaths_bedwars}, Kills: ${stats.kills_bedwars}, Deaths: ${stats.deaths_bedwars}, Wins: ${stats.wins_bedwars}, Losses: ${stats.losses_bedwars}` +
                   `, FKDR: ${Number.parseFloat(stats.final_kills_bedwars/stats.final_deaths_bedwars).toFixed(2)}, WLR: ${Number.parseFloat(stats.wins_bedwars/stats.losses_bedwars).toFixed(2)}`)
        break;
      }
      case("SkyWars"):{
        sendMessage(sender, `${player}'s ${gamemode} stats - Level: ${obj.player.achievements.skywars_you_re_a_star}, XP: ${stats.skywars_experience}, ` +
        `Wins: ${stats.wins}, Losses: ${stats.losses}, ` +
        `Kills: ${stats.kills}, Deaths: ${stats.deaths}, ` +
        `WLR: ${Number.parseFloat(stats.wins/stats.losses).toFixed(2)}, KDR: ${Number.parseFloat(stats.kills/stats.deaths).toFixed(2)}`)
        break;
      }
      default:{
        sendMessage(sender, `Unfortunately, stats for this gamemode are not yet supported`)
        break;
      }
    }
  })
  
  
}

bot.chat("/p accept cqptain")

function sendMessage(username, message){
  console.log(`To ${username}: ${message}`)
  //bot._client.write("chat", {message:`/msg ${username} ${message}`});
}

function capitalize(string){
  string = string.toLowerCase();
  string = string.charAt(0).toUpperCase() + string.slice(1)
  return string;
}

function startParty(){
  console.log({message:"/party accept " + partyQue[0]});
  bot._client.write("chat", {message:"/party accept " + partyQue[0]})
  gettingMembers = true;
  //bot._client.write("chat", {message:"/party list"})
}

function nextParty(){
  alreadyChecked = false;
  partyMembers = []
  gettingMembers = false;
  partyQue.shift()
  bot._client.write("chat", {message:"/party leave"})
  if(partyQue.length != 0) startParty();
}