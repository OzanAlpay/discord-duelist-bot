const path = require('path');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
module.exports = {
	name: 'guildCreate',
	execute(guild) {
		const clientId = process.env.CLIENT_ID;
		const guildId = guild.id;
		const discordToken = process.env.DISCORD_TOKEN;
		const commands = [];
		const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
		// console.log('Our discordToken is = ' + discordToken);
		for (const file of commandFiles) {
			const command = require(`../commands/${file}`);
			commands.push(command.data.toJSON());
		}

		const rest = new REST({ version: '9' }).setToken(discordToken);
		rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
			.then(() => console.log('Successfully regisered application commands.'))
			.catch(console.error);
	},
};