const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getLeaderBoardResults } = require('../connect.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('showleaderboard')
		.setDescription('Show Leaderboard of current server'),
	async execute(interaction) {
		const guildId = interaction.guildId;
		// console.log(guildMemberManager);
		getLeaderBoardResults(guildId, (err) => {console.log(err);}, async (response) => {
			console.log(response);
			// const resultString = 'Leaderboard';
			let index = 1;
			let userNames = '';
			let winsLoses = '';
			let scores = '';
			const leaderBoard = new MessageEmbed();
			leaderBoard.setTitle('Duel Leaderboard');
			for (const userData of response) {
				userNames += `\`${index}\` ${userData.name}\n`;
				winsLoses += `\`${userData.wins}/${userData.loses}\`\n`;
				scores += `\`${userData.Score}\`\n`;
				index++;
			}
			leaderBoard.addFields({ name: 'Scores', value: userNames, inline:true },
				{ name: 'Won/Lost', value: winsLoses, inline: true },
				{ name: 'Score', value: scores, inline: true });
			/*
			for (const playerScore of response) {
				resultString = resultString + '\n' + index + '. ' +
					playerScore.name + ' Wins = ' +
					playerScore.wins + ' Loses = ' +
					playerScore.loses + ' Score = ' +
					playerScore.Score + ' WinRate = %' + ((playerScore.wins / (playerScore.loses + playerScore.wins)) * 100).toFixed(2);
				index++;
			}
			*/
			await interaction.reply({ embeds: [leaderBoard] });
		});
	},
};
