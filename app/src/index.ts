import DiscordJS, { GuildManager, GuildMember, Intents, Interaction, MessageEmbed, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES
    ],

    partials: [
        "CHANNEL"
    ]
})

client.on('ready', () => {
    console.log('The bot is ready.')

    const guild = client.guilds.cache.get('844200833603076097')
    let commands

    if(guild){
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'ping',
        description: 'Replies with pong.'
    })
})

client.on('guildMemberAdd', guildMember =>{
    guildMember.send('Welcome to The Chartist Discord server! \n'
    + '\n'
    + 'To be approved, please answer this message with some more information on why you want to join. \n'
    + '\n'
    + 'Our staff will review your message as soon as possible.').catch(console.error)
})

client.on('messageCreate', message => {
    if(message.channel.type === 'DM'){
        if(!message.author.bot){
            let embed = new MessageEmbed()
            .setTitle('\n' + message.author.username + '\n')
            .setColor('#FFA500').setDescription(message.content)
            .addField('Twitter', 'bartdewever', true)
            .setTimestamp();

            (client.channels.cache.get('' + process.env.APPROVALS_CHAT) as TextChannel).send({ embeds: [embed] });
        }
    } else if(message.channelId == process.env.APPROVALS_CHAT){
        message.react('✅');
        message.react('❌');
    }
})

client.login(process.env.DISCORD_TOKEN)