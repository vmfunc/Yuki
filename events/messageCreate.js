const { Events } = require('discord.js');
const path = require('path');
const https = require('https');
const fs = require('fs');
const sdk = require('api')('@virustotal/v3.0#40nj53llc655dro');

const { apikey } = require('../config/config.json');

function getExt(str) {
	const basename = path.basename(str);
	const firstDot = basename.indexOf('.');
	const lastDot = basename.lastIndexOf('.');
	const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, '$1');
	if (firstDot === lastDot) {
		return extname;
	}
	return basename.slice(firstDot, lastDot) + extname;
}

function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function vtScan(id, message) {
	await sleep(15000);

}

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (message.attachments) {
			message.attachments.forEach(attachment => {
				const attachementExt = getExt(attachment.url);
				if (attachementExt === '.exe' || attachementExt === '.zip' || attachementExt === '.rar' || attachementExt === '.dll') {
					const file = fs.createWriteStream(`./uploads/${path.basename(attachment.url)}`);
					const request = https.get(attachment.url, function(response) {
						response.pipe(file);

						file.on('finish', () => {
							file.close();
							console.log('1 File downloaded');
							fs.readFile(__filename, (err) => {
								if (err) {
									console.log(`Cannot read file. ${err}`);
								}
								else {
									sdk.postFiles({
										file: './uploads/' + path.basename(attachment.url),
									}, {
										'x-apikey': apikey,
									}).then(({ data }) => message.reply('VirusTotal Scan started. Please wait a few seconds or minutes for the results ! 🐾\n\n **Analyzing file:** ' + path.basename(attachment.url) + '\n**Analysis available at:** https://www.virustotal.com/gui/file-analysis/' + data.data.id + ' 🛠️'))
										.catch(err => console.error(err));
									console.log(path.basename(attachment.url));
								}
							});
						});
					});
				}
			});
		}
	},
};