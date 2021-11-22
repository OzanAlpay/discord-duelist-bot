const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('showleaderboard')
		.setDescription('Show Leaderboard of current server'),
	async execute(interaction) {
		await interaction.reply('Show Leaderboard Called!');
	},
};