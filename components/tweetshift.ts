import DiscordJS, { Intents, Client } from 'discord.js'
import * as ChatService from '../services/chat.service'
import * as TwitterService from '../services/twitter.service'

module.exports = async (client: Client) => {
    async function setupTwitterListening(){
        let currentRules;
        let newRules;

        let allChats = await ChatService.getAllChats({});
        let twitterAccounts: String[] = [];

        currentRules = await TwitterService.getRules()
        await TwitterService.deleteRules(currentRules)
        const rules: { value: string }[] = [];

        await allChats.forEach((value, index) => {
            value.twitter_accounts.forEach((value: any, index) => {
                if(!twitterAccounts?.includes(value)){
                    twitterAccounts?.push(value)
                    rules.push({value: `from:${value}`})
                }
            })
        })

        await TwitterService.setRules(rules)
        
        console.log(await TwitterService.getRules())    

        await TwitterService.streamTweets(client)
    }
}