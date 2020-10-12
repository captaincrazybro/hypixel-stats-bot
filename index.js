const mineflayer = require('mineflayer')

console.log("hi");

const bot = mineflayer.createBot({
  host: 'hypixel.net', // optional
  port: 25565,       // optional
  username: process.env.EMAIL, // email and password are required only for
  password: process.env.PASSWORD,          // online-mode=true servers
  version: false                 // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
})

console.log("connected");

bot.on('whisper', function (username, message) {
  if (username === bot.username) return
  console.log(message);
})