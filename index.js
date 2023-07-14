import { process } from '/env.js'
import { Configuration, OpenAIApi } from 'openai'

const setupTextarea = document.getElementById('setup-textarea')// text area on setup page
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
        prompt: `Generate an engaging, professional and marketable movie synopsis based on the following idea: ${outline}`,
        max_tokens: 60 // default is 16
    });
    
    movieBossText.innerText = response.data.choices[0].text.trim()
    console.log(response)
};

// fetch synopsis
async function fetchSynopsis(outline) {
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Generate a short synopsis for a movie based on the outline supplied by the user: "${outline}"`,
        max_tokens: 800
    });

    document.getElementById('output-text').innerText = response.data.choices[0].text.trim()
};

