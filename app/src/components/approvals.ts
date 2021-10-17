import { ButtonInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, TextChannel, RoleResolvable, Role } from 'discord.js';
import * as UserService from './../services/user.service'
import * as ApprovalService from './../services/approval.service'
import * as ApprovalModel from './../models/approval.model'

module.exports = (client: Client) => {
    // Get the verification chat from .env
    const channel = client.channels.cache.get('' + process.env.VERIFICATION_CHAT) as TextChannel;

    // Send welcome message in this channel
    channel.messages.fetch().then((messages) =>{
        const text = 'Welcome to The Chartists! An educational group on the art and skill of "tape reading". \n'
        + '\n'
        + 'Thank you for joining! We are focussing on building a very strong community of dedicated Chartists and the more great members to join us the better. \n'
        + '\n'
        + 'Charting the markets and conducting technical analysis requires study and discipline. The objective of this group is help shed light on the dark art of "tape reading" and help people gain the knowledge and confidence that will help you form your own conclusions and to make your decisions when entering or exiting the markets. \n'
        + '\n'
        + "Please verify your account by answering the question I've sent you in private."

        // First message
        if(messages.size === 0){
            channel?.send(text)
        
        // Not first message -> Change msg 1
        } else {
            for (const message of messages){
                message[1].edit(text)
            }
        }
    })

    
    // Join server event
    client.on('guildMemberAdd', async guildMember => {
        // Look for discord id in database
        const user = await UserService.findUser({discord_id: guildMember.id})

        // If not in database, add to database
        if(!user){
            UserService.createUser({
                discord_id: guildMember.id.toString(),
                username: guildMember.displayName.toString()
            })
        }

        // DM user on join (ask for approval msg and Twitter name)
        guildMember.send('Welcome to The Chartist Discord server! \n'
            + '\n'
            + 'To be approved, please answer this message with some more information on why you want to join. \n'
            + '\n'
            + 'Our staff will review your message as soon as possible.').catch(console.error)
    })

    // User answers bot DM
    client.on('messageCreate', async message => {
        if (message.channel.type === 'DM') {
            if (!message.author.bot) {
                // Get user from database
                const user = await UserService.findUser({discord_id: message.author.id})

                // New approval message
                const approval = await ApprovalService.createApproval({
                    user: user?.id,
                    message: message.content
                })

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

                const user = await UserService.findUser({discord_id: member_id})
                const approval = await ApprovalService.findApproval({user: user?.id})

                let embed = new MessageEmbed()
                    .setTitle('\n' + member?.displayName + '\n')
                    .setColor((option === 'app') ? '#3BA55D' : '#ED4245')
                    .setDescription(approval?.message + '')
                    .addField('Twitter', 'TWITTER', true)
                    .addField('Status', (option === 'app') ? 'Approved' : 'Denied', true)
                    .setTimestamp()

                i.update({ embeds: [embed] });

                if (option === 'app') {
                    member?.roles.add('' + process.env.APPROVED_ROLE_ID);
                    (guild?.channels.cache.get('' + process.env.HANGOUT_CHAT_ID) as TextChannel).send('Welcome to The Chartists, ' + member?.toString() + '!')
                } else {
                    member?.roles.remove('' + process.env.APPROVED_ROLE_ID)
                    member?.ban()
                }
            }
        }
    })
}