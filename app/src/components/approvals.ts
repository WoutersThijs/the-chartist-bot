import { ButtonInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, TextChannel, RoleResolvable, Role } from 'discord.js';

module.exports = (client: Client) => {


    // Join server event
    client.on('guildMemberAdd', async guildMember => {
        guildMember.send('Welcome to The Chartist Discord server! \n'
            + '\n'
            + 'To be approved, please answer this message with some more information on why you want to join. \n'
            + '\n'
            + 'Our staff will review your message as soon as possible.').catch(console.error)
    })

    // New message event
    client.on('messageCreate', async message => {
        if (message.channel.type === 'DM') {
            if (!message.author.bot) {
                let embed = new MessageEmbed()
                    .setTitle('\n' + message.author.username + '\n')
                    .setColor('#FFA500')
                    .setDescription(message.content)
                    .addField('Twitter', 'bartdewever', true)
                    .addField('Status', 'Waiting', true)
                    .setTimestamp()

                let row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(message.author.id + '_app')
                            .setLabel('Approve')
                            .setStyle('SUCCESS')
                    ).addComponents(
                        new MessageButton()
                            .setCustomId(message.author.id + '_den')
                            .setLabel('Deny')
                            .setStyle('DANGER')
                    );

                (client.channels.cache.get('' + process.env.APPROVALS_CHAT) as TextChannel).send({ embeds: [embed], components: [row] });
            }
        }
    })

    // Button click event
    client.on('interactionCreate', async i => {
        if (i.isButton()) {
            const option = i.customId.substring(i.customId.length - 3, i.customId.length)

            if (option === 'app' || option == 'den') {
                const member_id = i.customId.substring(0, i.customId.length - 4)

                const guild = client.guilds.cache.get('' + process.env.GUILD)
                const member = guild?.members.cache.find(member => member.id === member_id)

                if (option === 'app') {
                    member?.roles.add('' + process.env.APPROVED_ROLE_ID)
                } else {
                    member?.roles.remove('' + process.env.APPROVED_ROLE_ID)
                }

                let embed = new MessageEmbed()
                    .setTitle('\n' + member?.displayName + '\n')
                    .setColor((option === 'app') ? '#3BA55D' : '#ED4245')
                    .setDescription('GET TEXT FROM DATABASE')
                    .addField('Twitter', 'TWITTER', true)
                    .addField('Status', (option === 'app') ? 'Approved' : 'Denied', true)
                    .setTimestamp()

                i.update({ embeds: [embed] })
            }
        }
    })
}