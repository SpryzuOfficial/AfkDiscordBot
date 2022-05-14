require('dotenv').config();

const {Client, Intents} = require('discord.js');

const {dbConnection} = require('./config_database');

const AfkMsg = require('./models/afk-message');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const afk = [];

dbConnection();
client.on('ready', () =>
{
    console.log(client.user.tag);
});

client.on('messageCreate', async(message) =>
{
    if(message.author.bot) return;
    const list = message.content.split(' ');
    const command = list[0];
    const args = list.splice(1);

    const id = message.author.id;

    if(message.mentions.users.first() != undefined)
    {
        if(afk.includes(message.mentions.users.first().id))
        {
            const customMsg = await AfkMsg.findOne({id: message.mentions.users.first().id});

            let string = `<@!${id}> ${message.mentions.users.first().username} is AFK: `
            if(customMsg)
            {
                string += ('"' + customMsg.name + '"');
            }

            await message.channel.send(string);
        }
    }

    if(afk.includes(id))
    {
        await message.channel.send(`<@!${id}> i have removed your AFK!`);
        afk.splice(afk.indexOf(id), 1);
    }
    else
    {
        if(command == 'x' + 'afk')
        {
            const customMsg = await AfkMsg.findOne({id});

            if(customMsg)
            {
                await AfkMsg.findByIdAndDelete(customMsg._id);
            }

            const name = args.join(' ');
            const msg = new AfkMsg({id, name});

            await msg.save();

            await message.channel.send(`<@!${id}> I have set you as AFK: "${name}", sending another message will reset it.`);
            afk.push(id);
        }
    }
});

client.login(process.env.TOKEN);