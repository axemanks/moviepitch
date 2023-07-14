import { process } from '/env.js'


const apiKey = process.env.OPENAI_API_KEY
const url = "https://api.openai.com/v1/completions"

const setupTextarea = document.getElementById('setup-textarea')// text area on setup page
const setupInputContainer = document.getElementById('setup-input-container') // input
const movieBossText = document.getElementById('movie-boss-text') // the prompt text

// add event listener to the send button
document.getElementById("send-btn").addEventListener("click", () => {
    // if there is input when the button is clicked...
  //if (setupTextarea.value) {  
    setupInputContainer.innerHTML = `<img src="images/loading.svg" class="loading" id="loading">` // display loading
    movieBossText.innerText = `Ok, just wait a second while my digital brain digests that...` // update the text while loading
//   }

    // fetch the response from the API
    fetchBotReply();
});


// fetch the response from the API
function fetchBotReply() {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': 'Sound Enthusiastic in five words or less.'
        })
    }).then(response => response.json()).then(data => 
        movieBossText.innerText = data.choices[0].text
        )
}