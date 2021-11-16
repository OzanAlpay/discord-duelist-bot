const { SlashCommandBuilder } = require('@discordjs/builders');
const { insertNewDuelist } = require('../connect.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerduelist')
		.setDescription('A Command for registering new duelist')
		.addUserOption(option => option.setName('target').setDescription('Select a user to register').setRequired(true)),
	async execute(interaction) {
		console.log('Execute Register Duelist Called!');
		const selectedUser = interaction.options.getUser('target');
		insertNewDuelist(selectedUser.id, selectedUser.username);
		await interaction.reply(selectedUser.username + ' Registered');
	},
};