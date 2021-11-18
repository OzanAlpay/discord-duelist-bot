const { SlashCommandBuilder } = require('@discordjs/builders');
const { getDuelistById, registerDuelRecord } = require('../connect.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addduelresult')
		.setDescription('Insert A New Duel Result to Database')
		.addUserOption(option => option.setName('firstduelist').setDescription('Select First Duelist').setRequired(true))
		.addUserOption(option => option.setName('secondduelist').setDescription('Select Second Duelist').setRequired(true))
		.addIntegerOption(option => option.setName('duelresult').setDescription('Enter Duel Result as an integer such as 1,0,-1 etc').setRequired(true)),
	async execute(interaction) {
		const firstDuelist = interaction.options.getUser('firstduelist');
		const secondDuelist = interaction.options.getUser('secondduelist');
		const duelResult = interaction.options.getInteger('duelresult');
		if (firstDuelist.id === secondDuelist.id) {
			await interaction.reply('Please select different users for duelists!');
			return;
		}
		else if (duelResult === 0) {
			await interaction.reply('Duel Result Entered as 0, No need to save this duel result');
			return;
		}

		getDuelistById(firstDuelist.id, () => {console.log('ERROR V1');}, async (result) => {
			if (Array.isArray(result) && result.length === 0) {
				await interaction.reply(firstDuelist.username + ' is  NOT registered!, register it first to enter a duel with it');
				return;
			}
			getDuelistById(secondDuelist.id, () => { console.log('ERROR V2');}, async (res) => {
				if (Array.isArray(res) && res.length === 0) {
					await interaction.reply(secondDuelist.username + 'is  NOT registered!, register it first to enter a duel with it');
					return;
				}
				registerDuelRecord(firstDuelist.id, secondDuelist.id, duelResult, async () => {
					await interaction.reply('An Error Occured While Inserting Duel Record!, Please Try Again Later!');
					return;
				}, async (registerDuelData) => {
					console.log(registerDuelData);
					await interaction.reply('Duel Registered For ' + firstDuelist.username + ' VS ' + secondDuelist.username + ' : ' + duelResult);
				});
			});
		});
	},
};