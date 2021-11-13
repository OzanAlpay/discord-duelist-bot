const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('hit')
		.setDescription('Test Command'),
	async execute(interaction) {
		console.log('Ping Called!');
		await interaction.reply('PONG!');
	},
};