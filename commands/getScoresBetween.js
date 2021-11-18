const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDuelistById, getDuelRecordsBetweenTwoUsers } = require('../connect');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('getscoresbetween')
		.setDescription('Get Duel Results Between Two Users')
		.addUserOption(option => option.setName('firstduelist').setDescription('Select First Duelist').setRequired(true))
		.addUserOption(option => option.setName('secondduelist').setDescription('Select Second Duelist').setRequired(true)),
	async execute(interaction) {
		console.log('getDuelResultsBetween Called!');
		let firstDuelist = interaction.options.getUser('firstduelist');
		let secondDuelist = interaction.options.getUser('secondduelist');
		if (firstDuelist.id === secondDuelist.id) {
			await interaction.reply('Please select different users for duelists!');
			return;
		}
		if (firstDuelist.id > secondDuelist.id) {
			const tempDuelist = secondDuelist;
			secondDuelist = firstDuelist;
			firstDuelist = tempDuelist;
		}
		getDuelistById(firstDuelist.id, () => { console.log('ERROR V1'); }, async (result) => {
			if (Array.isArray(result) && result.length === 0) {
				await interaction.reply(firstDuelist.username + ' is  NOT registered!, register it first to get duel results about it');
				return;
			}
			getDuelistById(secondDuelist.id, () => { console.log('ERROR V2'); }, async (res) => {
				if (Array.isArray(res) && res.length === 0) {
					await interaction.reply(secondDuelist.username + 'is  NOT registered!, register it first to get duel results about it');
					return;
				}
				getDuelRecordsBetweenTwoUsers(firstDuelist.id, secondDuelist.id, async () => {
					await interaction.reply('An Error Occured While Retrieving Duel Records!, Please Try Again Later!');
					return;
				}, async (registerDuelData) => {
					console.log('HERE!');
					console.log(registerDuelData);
					let infoString = 'SCORES\n';
					for (const duelResult of registerDuelData) {
						let resultString;
						if (duelResult.Result > 0) {
							resultString = duelResult.Result + ':0';
						}
						else {
							resultString = '0:' + (duelResult.Result * -1);
						}
						infoString = infoString + ' ' + firstDuelist.username + ' vs ' + secondDuelist.username + ' : ' + resultString + ' at : ' + duelResult.date + '\n';
					}
					await interaction.reply(infoString);
					console.log('Interaction replied!');
					return;
				});
			});
		});
	},

};