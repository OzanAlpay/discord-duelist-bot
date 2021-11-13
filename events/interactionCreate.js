module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
		console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`);
		console.log(interaction);
		interaction.reply('Pong!');
		// If i set ephemeral: true in reply, then only the user of command will see my reply.
	},
};