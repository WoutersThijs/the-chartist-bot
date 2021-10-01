"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = (client) => {
    // Join server event
    client.on('guildMemberAdd', (guildMember) => __awaiter(void 0, void 0, void 0, function* () {
        guildMember.send('Welcome to The Chartist Discord server! \n'
            + '\n'
            + 'To be approved, please answer this message with some more information on why you want to join. \n'
            + '\n'
            + 'Our staff will review your message as soon as possible.').catch(console.error);
    }));
    // New message event
    client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
        if (message.channel.type === 'DM') {
            if (!message.author.bot) {
                let embed = new discord_js_1.MessageEmbed()
                    .setTitle('\n' + message.author.username + '\n')
                    .setColor('#FFA500').setDescription(message.content)
                    .addField('Twitter', 'bartdewever', true)
                    .setTimestamp();
                client.channels.cache.get('' + process.env.APPROVALS_CHAT).send({ embeds: [embed] });
            }
        }
        else if (message.channelId == process.env.APPROVALS_CHAT) {
            message.react('✅');
            message.react('❌');
        }
    }));
    // Emoji react
    client.on('messageReactionAdd', (reaction, user) => {
        console.log('DDD');
    });
};
