import DiscordJS, { GuildManager, GuildMember, Intents, Interaction, MessageEmbed, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import connect from './utils/mongo'
const approvals = require('./components/approvals')

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES
    ],

    partials: [
        "CHANNEL",
        "MESSAGE",
        "REACTION",
        "USER"
    ]
})

client.on('ready', () => {
    console.log('The bot is ready!')

    connect();

    // Register components
    approvals(client)

})

client.login(process.env.DISCORD_TOKEN)