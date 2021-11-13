const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addduelresult')
		.setDescription('Insert A New Duel Result to Database')
		.addUserOption(option => option.setName('firstduelist').setDescription('Select First Duelist').setRequired(true))
		.addUserOption(option => option.setName('secondduelist').setDescription('Select Second Duelist').setRequired(true))
		.addIntegerOption(option => option.setName('duelresult').setDescription('Enter Duel Result as an integer such as 1,0,-1 etc').setRequired(true)),
	async execute(interaction) {
		console.log('Execute Register Duelist Called!');
		const firstDuelist = interaction.options.getUser('firstduelist');
		const secondDuelist = interaction.options.getUser('secondduelist');
		const duelResult = interaction.options.getInteger('duelresult');
		if (firstDuelist.id === secondDuelist.id) {
			await interaction.reply('Please select different users for duelists!');
			return;
		}
		console.log('First Duelist = ' + firstDuelist.username + ' Second Duelist is = ' + secondDuelist.username + ' and result was = ' + duelResult);
		await interaction.reply('REGISTER DUEL RESULT CALLED!!');
	},
};