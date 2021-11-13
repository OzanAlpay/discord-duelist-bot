module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction. = ${interaction.commandName}`);
		// interaction.reply('Pong!');
		const requestedCommand = interaction.client.commands.get(interaction.commandName);
		requestedCommand.execute(interaction);
		// console.log(interaction.commandName);
		// console.log(interaction.client.commands[]);
		// If i set ephemeral: true in reply, then only the user of command will see my reply.
		// this.execute burda kendine refer ediyor.
	},
};