const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const discordToken = process.env.DISCORD_TOKEN;

const commands = [
	new SlashCommandBuilder().setName('hit').setDescription('Replies it with Pong!'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(discordToken);
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.	then(() => console.log('Successfully regisered application commands.'))
	.catch(console.error);
