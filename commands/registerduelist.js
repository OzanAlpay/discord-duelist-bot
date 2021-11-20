const { SlashCommandBuilder } = require('@discordjs/builders');
const { insertNewDuelist, getDuelistById } = require('../connect.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerduelist')
		.setDescription('A Command for registering new duelist')
		.addUserOption(option => option.setName('target').setDescription('Select a user to register').setRequired(true)),
	async execute(interaction) {
		console.log(interaction);
		console.log('Execute Register Duelist Called!');
		const selectedUser = interaction.options.getUser('target');
		getDuelistById(selectedUser.id, async () => {
			await interaction.reply('An Error Occured Please Try Later');
		}, async (result) => {
			if (Array.isArray(result) && result.length) {
				console.log('This user already registered!');
				console.log(result);
				await interaction.reply(selectedUser.username + ' is already registered!');
			}
			else {
				console.log('This user is not registered!');
				insertNewDuelist(selectedUser.id, selectedUser.username, async () => {
					await interaction.reply('While registering ' + selectedUser.username + ' an error occured, please try again!');
				}, async () => {
					await interaction.reply(selectedUser.username + ' registered successfully!');
				});
			}
		});
	},
};