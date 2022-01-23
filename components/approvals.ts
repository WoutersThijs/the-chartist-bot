import { ButtonInteraction, Client, MessageActionRow, MessageButton, MessageEmbed, TextChannel, RoleResolvable, Role } from 'discord.js';
import * as UserService from './../services/user.service'
import * as ApprovalService from './../services/approval.service'
import * as ApprovalModel from './../models/approval.model'

module.exports = (client: Client) => {
    // Get the verification chat from .env
    const channel = client.channels.cache.get('' + process.env.VERIFICATION_CHAT) as TextChannel;

    // Send welcome message in this channel
    channel.messages.fetch().then((messages) => {
        const text = 'Welcome to The Chartists! An educational group on the art and skill of "tape reading". \n'
            + '\n'
            + 'Thank you for joining! We are focussing on building a very strong community of dedicated Chartists and the more great members to join us the better. \n'
            + '\n'
            + 'Charting the markets and conducting technical analysis requires study and discipline. The objective of this group is help shed light on the dark art of "tape reading" and help people gain the knowledge and confidence that will help you form your own conclusions and to make your decisions when entering or exiting the markets. \n'
            + '\n'
            + "Please verify your account by answering the direct messages I've sent to you."

        // First message
        if (messages.size === 0) {
            channel?.send(text)

        // Not first message -> Change msg 1
        } else {
            for (const message of messages) {
                message[1].edit(text)
            }
        }
    })


    // Join server event
    client.on('guildMemberAdd', async guildMember => {
        UserService.createUser({
            discord_id: guildMember.id.toString(),
            username: guildMember.displayName.toString()
        })


        // DM user on join (ask for approval msg and Twitter name)
        guildMember.send('Welcome to The Chartist Discord server! \n'
            + '\n'
            + 'To be approved, please give us a brief explanation on why you want to join.').catch(console.error)
    })

    // User answers bot DM
    client.on('messageCreate', async message => {
        if (message.channel.type === 'DM') {
            if (!message.author.bot) {

                //Get second last msg

                message.channel.messages.fetch({ limit: 2 }).then(async res => {
                    let last_msg: String
                    let approval_msg: String
                    let approval_twitter: String

                    last_msg = res.last()!.content

                    // Get user from database
                    const user = await UserService.findUser({ discord_id: message.author.id })

                    if (last_msg.includes('Welcome')) {

                        // New approval message
                        const approval = await ApprovalService.createApproval({
                            user: user?.id,
                            message: message.content,
                            twitter: ''
                        })

                        message.channel.send('For the second and last step, please provide us your Twitter username.')
                    }

                    if (last_msg.includes('Twitter')) {
                        const approval = await ApprovalService.findAndUpdateApproval({ user: user?.id }, { twitter: message.content }, { lean : false })

                        let embed = new MessageEmbed()
                            .setTitle('\n' + message.author.username + '\n')
                            .setColor('#FFA500')
                            .setDescription(approval!.message.toString())
                            .addField('Twitter', message.content, true)
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

                        message.channel.send(`Thank you for your application. Our staff will review your application as soon as possible.`)
                    }
                })
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

                const user = await UserService.findUser({ discord_id: member_id })
                const approval = await ApprovalService.findApproval({ user: user?.id })

                let embed = new MessageEmbed()
                    .setTitle('\n' + member?.displayName + '\n')
                    .setColor((option === 'app') ? '#3BA55D' : '#ED4245')
                    .setDescription(approval?.message + '')
                    .addField('Twitter', approval!.twitter.toString(), true)
                    .addField('Status', (option === 'app') ? 'Approved' : 'Denied', true)
                    .setTimestamp()

                i.update({ embeds: [embed] });

                if (option === 'app') {
                    member?.roles.add('' + process.env.APPROVED_ROLE_ID);
                    member?.send('Your application has been approved.');
                    (guild?.channels.cache.get('' + process.env.HANGOUT_CHAT_ID) as TextChannel).send('Welcome to The Chartists, ' + member?.toString() + '!')
                } else {
                    member?.roles.remove('' + process.env.APPROVED_ROLE_ID)
                    member?.ban()
                    member?.send('Your application has been denied.');
                }
            }
        }
    })

    // Remove approvals on ban / kick / leave
    client.on('guildMemberRemove', async member => {
        const user = await UserService.findUser({ discord_id: member.id })
        await UserService.deleteUser({ discord_id: member.id })
        const approval = await ApprovalService.deleteApproval({ user: user?.id })
    })

    client.on('guildBanAdd', async guildban => {
        const user = await UserService.findUser({ discord_id: guildban.user.id })
        await UserService.deleteUser({ discord_id: guildban.user.id })
        const approval = await ApprovalService.deleteApproval({ user: user?.id })
    })
}