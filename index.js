const Discord = require('discord.js');
const client = new Discord.Client();
const { token, prefix } = require('./config.json'); //Config file - change token here.
let jobs = ["Doctor", "Chemical Engineering", "Chemist", "Crickter", "Civil Engineer", "Astronaut", "Physicist", "Musician", "Lawyer", "Baker", "Carpenter", "Caterer", "Fire Fighter", "IT Engineer", "Hacker", "Preist", "Farmer", "Comedian", "Chess Player", "Air Hostess", "Hotel Servant", "Police Officer", "Solider", "Actor", "Model", "Footballer", "Vet", "Writer", "Teacher", "Pilot","YouTuber","Stock Broker","Astrologer","Mountain Climber"];
const uniqueRandom = require('unique-random'); //Gives a unique value
const Canvas = require('canvas')
const games = new Set(); //A set has unique values - something that every message channel have.
let quiz = require('./quiz.json');
let ranks = [];


client.once('ready', () => {
	console.log('I am Ready!');
	}) //Gets ready to work.

client.on('message', async message => {




	if (message.content.toLowerCase().startsWith("!quit")) {
		games.delete(message.channel.id); //Quitting Games
		ranks=[]; //Init ranks
		message.channel.send("Game successfully Quitted!"); 
	}

	if(message.content.toLowerCase().startsWith("!love"))
	{

	const canvas = Canvas.createCanvas(900, 550);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./love.jpg');

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	message.channel.send(`Vaise toh I am in love with Cemil and Beast and almost everyone else - but I feel as a bot my only true love should be who it always was - MEE6. Love my babu :yawning_face: `, attachment);



	}

	if (message.content.startsWith(`${prefix}`)) {
		if (games.has(message.channel.id)) {
			message.channel.send('game already in progress');
		}

		else {
			games.add(message.channel.id); //Adding games to set
			console.log(message.author.id);
			quiz_selector(message);
		}

	}
}
);

// !!! remember to do games.delete(message.channel.id) to remove the channel ID after the quiz is over!

async function quiz_selector(message) {


	message.channel.send("Welcome to JaaneBot Quiz! \n \n Here are the available games: \n \n `For GK Quiz: !g gk` \n `For That's my job, type: !g j`");
	const filter = response => response.content.startsWith(`!g `) || response.content.startsWith(`!quit`) && !response.author.bot //Filter to await message
	try {

		const collected = await message.channel.awaitMessages
			(filter, { max: 1, time: 45000, errors: ['time'] });

			if(collected.first().content.startsWith("!quit"))
			{
				games.delete(message.channel.id)
				return
			}
		let gameSelector = collected.first().content.split(' '); //Collects the first with given filter

		if (gameSelector[1] === 'gk') {
			message.channel.send('Welcome to General Trivia Quiz');
			round_b(message);

		}

		else if (gameSelector[1] === 'j') {
			job_sender(message)
		}

		else //error handling
		{
			message.channel.send("Restarting due to incorrect response");
			quiz_selector(message); //recursive call
		}

	}

	catch (err) {
		console.log(err);
		message.channel.send("Request Time Out!");
		games.delete(message.channel.id);

	}

}


async function round_b(message) {

	if (games.has(message.channel.id)) {
		let i;
		for (i = 0; i <5; i++) { // Change this value to change the number of questions
			await create_collector(message);

			if (i == 4) {	//Change this value to (n-1) if you change the loop
				games.delete(message.channel.id);
				winner(message) //declares winner
				ranks=[];
		}
		}

	}

}


async function create_collector(message) {
	if (games.has(message.channel.id)) {

		let i = uniqueRandom(0,quiz.length - 1)
		const item = quiz[i()]; //unique random question from quiz JSON

		const filter = response => {
			return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()) || response.content.startsWith("!quit"); //some may not be important
		};

		message.channel.send(item.question);

		try {

		const collected = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
		
		if(collected.first().content=='!quit') //Quits immedieatly, and turns off any further message awaiting
		{
			return;
		}
		
		rank(collected.first().author.id)
		await message.channel.send(`${collected.first().author} got the correct answer!`);
		}

		catch (err) {
			console.log(err)
			//If no one gets the answer, it ends the round and returns the answer
			return message.channel.send("Time is up! Answer is" + " _"+item.answers[0]+"_ ");
		}

	}
}


/* ----------- For that's my job -----------*/
async function job_sender(message) {
	const random = uniqueRandom(0, jobs.length-1); //unique random for a job
	const index_jobs = random();
	message.channel.send(`Welcome to _That's my Job_ ! Hey <@${message.author.id}>, check my DM!`); //sends a DM
	message.author.send("Hey, your job is " + jobs[index_jobs] + ". Type `!start` in the server to begin the game!");

	const filter = response => { return response.content.includes(`!start`) && (response.author.id === message.author.id) && !response.author.bot || response.content.startsWith("!quit")} //Important for the denner to not give the answer

	try {
		const collected = await message.channel.awaitMessages
		(filter, { max: 1, time: 90000, errors: ['time'] });

		if(collected.first().content.startsWith("!quit")) //quit the game
		return 	games.delete(message.channel.id);
		
		message.channel.send("Let's do this! Use `!guess` to predict a profession. "+ "<@"+message.author.id+">"+", type `!no` if they ask you a question, and the answer is a no. Use `!quit` to quit any time.");
		job_guess(message, index_jobs);

	}

	catch (err) {
		console.log(err)
		message.channel.send("Request Time Out!"); //Time-out, change time above to extend this.
		games.delete(message.channel.id);

	}

}

async function job_guess(message, index_jobs) {
	const filter = response => {
		return response.content.startsWith("!guess") &&  (response.author.id != message.author.id) && !response.author.bot  || response.content.startsWith("!no") && (response.author.id==message.author.id) && !response.author.bot
	}

	try {
		if(games.has(message.channel.id))
		{
			if (filter) {

				let i;
				for (i = 0; i < 5; i++) {
					const collected = await message.channel.awaitMessages(filter, { max: 1, time: 600000, errors: ['time'] })
					const guess = collected.first().content.toLowerCase()

					if (guess.includes(jobs[index_jobs].toLowerCase())) {
						games.delete(message.channel.id)
						return message.channel.send(`${collected.first().author}, That's the job!`)
					}
					else {

						if (i < 3)
							message.channel.send("Nope! You need to try a little better. You have " + (4 - i) + " guesses left.");

						else if (i ==3) {
							message.channel.send("Nope, this is your final chance! :pleading_face: ");
						}
						if (i == 4) {
							games.delete(message.channel.id)
							return message.channel.send(`That's not my job. Sorry, but the correct answer was a _${jobs[index_jobs]}_ . Better luck next time!`);
						}
					}
				}
				

			}	
		}

	}

	catch (err) {
		message.channel.send('Sorry, time ran out!')
		console.log(err);
		games.delete(message.channel.id)
	}
}

function rank(wId)
{
	let w_lock=0
	if(ranks.length==0)
	{
		ranks.push({
			id: wId,
			points:0
		})
	}


	ranks.forEach(element => {

		if(element.id == wId)
		{
			element.points = element.points+1
			w_lock=1
		}
	});

	if(!w_lock)
	{
		ranks.push({
			id: wId,
			points:1
		})
	}

	ranks.forEach(element => 
		{
			console.log(element)
		})
}

function winner(message)
{
	console.log()
	max=[];
	max_points=0;
	max_id=0

	console.log("In winner")
	console.log("ranks is"+ ranks)

	if(ranks.length==0)
	{
		return message.channel.send("No one won this time. :cry: ");
	}
	else
	{
		ranks.forEach(element => {
			if(element.points>max_points)
			{
				max_points = element.points
				max_id = element.id
			}
		});

		ranks.forEach(element => {
			if(element.points==max_points)
			{
				max.push(element)
			}
		})

		if(max.length==1)
		return message.channel.send(`The winner is <@${max_id}>`)
		else
		return message.channel.send(`A randomly chosen winner is <@${max[Math.floor((Math.random() * 3))].id}>`);
	}
}

client.login(token);