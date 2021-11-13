const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('hit')
		.setDescription('Test Command'),
	async execute(interaction) {
		await interaction.reply('PONG!');
	},
};