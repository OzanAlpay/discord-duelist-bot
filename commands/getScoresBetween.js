const { DateTime } = require('luxon');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDuelistById, getDuelRecordsBetweenTwoUsers } = require('../connect');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('getscoresbetween')
		.setDescription('Get Duel Results Between Two Users')
		.addUserOption(option => option.setName('firstduelist').setDescription('Select First Duelist').setRequired(true))
		.addUserOption(option => option.setName('secondduelist').setDescription('Select Second Duelist').setRequired(true)),
	async execute(interaction) {
		let firstDuelist = interaction.options.getUser('firstduelist');
		let secondDuelist = interaction.options.getUser('secondduelist');
		const guildId = interaction.guildId;
		console.log('Guild ID = ' + guildId);
		if (firstDuelist.id === secondDuelist.id) {
			await interaction.reply('Please select different users for duelists!');
		}
		if (firstDuelist.id > secondDuelist.id) {
			const tempDuelist = secondDuelist;
			secondDuelist = firstDuelist;
			firstDuelist = tempDuelist;
		}
		getDuelistById(firstDuelist.id, () => { console.log('ERROR V1'); }, async (result) => {
			if (Array.isArray(result) && result.length === 0) {
				await interaction.reply(firstDuelist.username + ' is  NOT registered!, register it first to get duel results about it');
			}
			getDuelistById(secondDuelist.id, () => { console.log('ERROR V2'); }, async (res) => {
				if (Array.isArray(res) && res.length === 0) {
					await interaction.reply(secondDuelist.username + 'is  NOT registered!, register it first to get duel results about it');
				}
				getDuelRecordsBetweenTwoUsers(firstDuelist.id, secondDuelist.id, guildId, async () => {
					await interaction.reply('An Error Occured While Retrieving Duel Records!, Please Try Again Later!');
				}, async (duelResults) => {
					console.log('Duel Results = ');
					console.log(duelResults);
					let infoString = `LAST 10 DUELS BETWEEN ${firstDuelist.username} , ${secondDuelist.username}\n`;
					const numberOfTotalMatches = duelResults.length - 1 ;
					let firstDuelistTotalScore = 0;
					let secondDuelistTotalScore = 0;
					for (let i = numberOfTotalMatches; i >= 0; i--) {
						if (i > numberOfTotalMatches - 10) {
							const readableDate = DateTime.fromJSDate(duelResults[i].date).setZone('UTC+4').setLocale('tr').toLocaleString(DateTime.DATETIME_MED);

							infoString = infoString + ' ' + firstDuelist.username +
								' vs ' + secondDuelist.username +
								' = ' + duelResults[i].Firstduelistscore +
								' : ' + duelResults[i].Secondduelistscore +
								' at : ' + readableDate + '\n';
						}
						firstDuelistTotalScore += duelResults[i].Firstduelistscore;
						secondDuelistTotalScore += duelResults[i].Secondduelistscore;
					}
					infoString += 'Total ' + firstDuelist.username + ' : ' + firstDuelistTotalScore + ' --- ' + secondDuelist.username + ' : ' + secondDuelistTotalScore;
					await interaction.reply(infoString);

				});
			});
		});
	},

};