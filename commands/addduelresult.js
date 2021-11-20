const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDuelistById, registerDuelRecord } = require('../connect.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addduelresult')
		.setDescription('Insert A New Duel Result to Database')
		.addUserOption(option => option.setName('firstduelist').setDescription('Select First Duelist').setRequired(true))
		.addUserOption(option => option.setName('secondduelist').setDescription('Select Second Duelist').setRequired(true))
		.addIntegerOption(option => option.setName('firstduelistscore').setDescription('Enter First Duelist\'s score as an integer such as 1,2 etc').setRequired(true))
		.addIntegerOption(option => option.setName('secondduelistscore').setDescription('Enter Second Duelist\'s score as an integer such as 1,2 etc').setRequired(true)),
	async execute(interaction) {
		let firstDuelist = interaction.options.getUser('firstduelist');
		let secondDuelist = interaction.options.getUser('secondduelist');
		let firstDuelistScore = interaction.options.getInteger('firstduelistscore');
		let secondDuelistScore = interaction.options.getInteger('secondduelistscore');
		const guildId = interaction.guildId;
		if (firstDuelist.id === secondDuelist.id) {
			await interaction.reply('Please select different users for duelists!');
			return;
		}

		if (firstDuelist.id > secondDuelist.id) {
			const tempDuelist = secondDuelist;
			const tempScore = secondDuelistScore;
			secondDuelist = firstDuelist;
			firstDuelist = tempDuelist;
			secondDuelistScore = firstDuelistScore;
			firstDuelistScore = tempScore;
		}
		getDuelistById(firstDuelist.id, () => {console.log('ERROR V1');}, async (result) => {
			if (Array.isArray(result) && result.length === 0) {
				await interaction.reply(firstDuelist.username + ' is  NOT registered!, register it first to enter a duel with it');
			}
			getDuelistById(secondDuelist.id, () => { console.log('ERROR V2');}, async (res) => {
				if (Array.isArray(res) && res.length === 0) {
					await interaction.reply(secondDuelist.username + 'is  NOT registered!, register it first to enter a duel with it');
				}
				registerDuelRecord(firstDuelist.id, secondDuelist.id, firstDuelistScore, secondDuelistScore, guildId, async () => {
					await interaction.reply('An Error Occured While Inserting Duel Record!, Please Try Again Later!');
				}, async (registerDuelData) => {
					await interaction.reply('Duel Registered For ' + firstDuelist.username + ' VS ' + secondDuelist.username + ' =  ' + firstDuelistScore + ' : ' + secondDuelistScore);
				});
			});
		});
	},
};