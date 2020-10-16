JaaneBot is a discord quiz bot, made with two intresting games. 
The first one is a general trivia/General Knowledge quiz that has a bunch of questions. These questions can are selected randomly, and sent to the user. 
If they answer correctly, they get a point, which are stored temporarily in an array of objects.

The second game is a game where a user is Dm'ed a profession, and people ask questions to the user in order to identify the profession. 
When a gusser wants to guess a word, they use the command !guess followed by the profession they think it might be. 
There are a total of chances and 10 minutes to guess the profession.

At any time, both the games can be quit with !quit.
The bot is capable of sensing messages and also detect the key/correct words from a string.

All dev-related comments are done on the code.

-----***How to install the bot (For Newbie Devs)***-----

To install the bot, you need:

1. Node.js v12.10 or above.
2.NPM packages - Discord.js (Above v12), uniqueRandom,nodemon.
3. A code editor - something like VSC, Sublime Text will be fine.

To use the bot, create a token id via https://discord.com/developers/applications, if you don't know how, take a look at https://discord.com/developers/docs/intro.

Use this token in the config.json file, and you're good to go!

Note: The bot is not available on any cloud based server. Hence, the bot can only be used when the index.js file is running on the computer/server.

