const { Client, Intents } = require('discord.js');
require('dotenv').config();
const discordToken = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.once('ready', () => {
	console.log('Ready to Go!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;

	if (commandName === 'hit') {
		await interaction.reply('Pong!');
	}
});
client.login(discordToken);