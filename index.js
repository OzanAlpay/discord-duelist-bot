const { Client, Intents } = require('discord.js');
require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
console.log(discordToken);
client.once('ready', () => {
	console.log('Ready to Go!');
});

// console.log(token)

client.login(discordToken);