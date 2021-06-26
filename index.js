require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const wazirXAPI = 'https://api.wazirx.com/api/v2/tickers';

const generalMessage = `
Hello From Crypto Bot!!
Send **!crypto help** for valid commands.
`;

const instructionsMsg = `
Send **!crypto <Cryptocurrency Base Unit>** to receive current price.
Examples: 
**!crypto btc** for Bitcoin
**!crypto eth** for Ethereum
**!crypto matic** for Matic(Polygon)
`;

bot.login(TOKEN);

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', async (msg) => {
  if (msg.content.startsWith('!crypto')) {
    const commandArray = msg.content.split(' ');
    if (commandArray.length < 2) {
      msg.reply(generalMessage);
      return;
    }
    const command = commandArray[1];
    if (command === 'help') {
      msg.reply(instructionsMsg);
      return;
    }
    try {
      const price = await fetchCryptoInfo(`${command.toLowerCase()}inr`);
      if (price)
        msg.reply(
          `${price.name} - ₹${price.last} at ${new Date().toLocaleString()}`
        );
      else {
        msg.reply(`Invalid Crypto Name ${command}`);
      }
    } catch (err) {
      msg.reply(`Error while fetching Price`);
    }
  }
});

function fetchCryptoInfo(currencyName) {
  return axios
    .get(wazirXAPI)
    .then((res) => {
      const price = res.data[currencyName];
      return price;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
}
