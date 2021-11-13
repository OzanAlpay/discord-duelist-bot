const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('registerduelist')
		.setDescription('A Command for registering new duelist')
		.addUserOption(option => option.setName('target').setDescription('Select a user to register')),
	async execute(interaction) {
		console.log(interaction);
		const selectedUser = interaction.options.getUser('target');
		console.log(selectedUser);
		await interaction.reply('PONG!');
	},
};