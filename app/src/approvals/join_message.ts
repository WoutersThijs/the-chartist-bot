import { Client } from 'discord.js';

export default (client: Client) => {
    client.on('guildMemberAdd', guildMember =>{
        guildMember.send('Welcome to The Chartist Discord server! \n'
        + '\n'
        + 'To be approved, please answer this message with some more information on why you want to join. \n'
        + '\n'
        + 'Our staff will review your message as soon as possible.').catch(console.error)
    })
}