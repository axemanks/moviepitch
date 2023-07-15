import { process } from '/env.js'
import { Configuration, OpenAIApi } from 'openai'


const setupInputContainer = document.getElementById('setup-input-container') // input
const movieBossText = document.getElementById('movie-boss-text') // the prompt text


// set configuration
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

// new instance of OpenAIApi
const openai = new OpenAIApi(configuration)

// add event listener to the send button
document.getElementById("send-btn").addEventListener("click", () => {
    const setupTextarea = document.getElementById('setup-textarea')// text area on setup page
    // if there is input when the button is clicked...
    if (setupTextarea.value) {
        const userInput = setupTextarea.value // get the input
        setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">` // display loading
        movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...` // update the text while loading
        // fetch the response from the API
        fetchBotReply(userInput);
        fetchSynopsis(userInput);

    }
});


// fetch the response from the API
async function fetchBotReply(outline) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a short message to enthusiastically say an outline sounds interesting and that you need some minutes to think about it.
        ###
        outline: Two dogs fall in love and move to Hawaii to learn to surf.
        message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
        ###
        outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
        message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
        ###
        outline: A group of corrupt lawyers try to send an innocent woman to jail.
        message: Wow that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
        ###
        outline: ${outline}
        message: 
        `,
        max_tokens: 60 // default is 16
    });

    movieBossText.innerText = response.data.choices[ 0 ].text.trim()
    console.log(response)
};

// fetch synopsis
async function fetchSynopsis(outline) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate an engaging, professional and marketable movie synopsis based on an outline. The synopsis should include actors names in brackets after each character. Choose actors that would be ideal for this role.
        ###
        outline: A big-headed daredevil fighter pilot goes back to school only to be sent on a deadly mission.
        synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
        ###
        outline:${outline}
        synopsis:
        `,
        max_tokens: 800
    });
    const synopsis = response.data.choices[ 0 ].text.trim()
    document.getElementById('output-text').innerText = synopsis
    fetchTitle(synopsis)
    fetchStars(synopsis)
};

// fetch title
async function fetchTitle(synopsis) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a gripping and exciting title for a movie that will go down in history based on the ${synopsis}`,
        max_tokens: 50,
        temperature: 0.7,// more creative
    });
    document.getElementById('output-title').innerText = response.data.choices[ 0 ].text.trim() // change "output-title" h1
};

// extract actor names
async function fetchStars(synopsis) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Extract the names in brackets from the synopsis.
        ###
        synopsis: The Top Gun Naval Fighter Weapons School is where the best of the best train to refine their elite flying skills. When hotshot fighter pilot Maverick (Tom Cruise) is sent to the school, his reckless attitude and cocky demeanor put him at odds with the other pilots, especially the cool and collected Iceman (Val Kilmer). But Maverick isn't only competing to be the top fighter pilot, he's also fighting for the attention of his beautiful flight instructor, Charlotte Blackwood (Kelly McGillis). Maverick gradually earns the respect of his instructors and peers - and also the love of Charlotte, but struggles to balance his personal and professional life. As the pilots prepare for a mission against a foreign enemy, Maverick must confront his own demons and overcome the tragedies rooted deep in his past to become the best fighter pilot and return from the mission triumphant.
        names: Tom Cruise, Val Kilmer, Kelly McGillis
        ###
        synopsis: ${synopsis}
        names:   
        `,
        max_tokens: 30
    })
    document.getElementById('output-stars').innerText = response.data.choices[ 0 ].text.trim()
}


