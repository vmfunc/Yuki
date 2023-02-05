const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meow')
		.setDescription('Literally a ping command'),
	async execute(interaction) {
		await interaction.reply('meow!');
	},
};
