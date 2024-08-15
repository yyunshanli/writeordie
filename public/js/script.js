// initialize variable for each element
const textarea = document.getElementById('textArea');
const timerBar = document.getElementById('timerBar');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const summarizeButton = document.getElementById('summarizeButton');
const summaryElement = document.getElementById('summary');
const snakeHead = document.getElementById('snakeHead');

let countdown;
let timeLeft = 5; // countdown from 5 seconds
let timerStarted = false; // flag to track if timer has started
let typingTimeout; // timeout handle for detecting inactivity
let summarizing = false; // flag to prevent multiple summarize requests

function updateSnakeHeadPosition() {
    // get the current width of the timer bar, the snake head, and the container
    const timerBarWidth = timerBar.clientWidth;
    const snakeHeadWidth = snakeHead.clientWidth;
    const containerWidth = timerBar.parentElement.clientWidth; // Timer container width

    const percentFilled = (parseFloat(timerBar.style.width) || 0) / 100;
    const snakeHeadPosition = percentFilled * (timerBarWidth - snakeHeadWidth);

    const maxPosition = containerWidth - snakeHeadWidth;
    snakeHead.style.left = `${Math.min(Math.max(snakeHeadPosition, 0), maxPosition)}px`;
}


function startTimer() {
    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerBar.style.width = '100%'; // fill entire bar
            textarea.disabled = true; // disable the text area
            saveButton.disabled = false; // enable the save button
            updateSnakeHeadPosition()
        } else {
            timeLeft--;
            const percentFilled = ((5 - timeLeft) / 5) * 100; // calculate fill percentage
            timerBar.style.width = percentFilled + '%'; // update bar width
            updateSnakeHeadPosition(); // update snake head position
        }
    }, 1000);
}

function resetTimer() {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
    timeLeft = 5;
    timerBar.style.width = '0%'; // reset bar width
    textarea.disabled = false; // enable the text area
    saveButton.disabled = true; // disable the save button
    summarizeButton.disabled = true; // disable the summarize button

    // clear the previous timeout to reset typing detection
    clearTimeout(typingTimeout);
    
    // set a timeout to detect inactivity
    typingTimeout = setTimeout(() => {
        clearInterval(countdown);
        timerBar.style.width = '100%'; // fill entire bar
        textarea.disabled = true; // disable the text area
        saveButton.disabled = false; // enable the save button
        summarizeButton.disabled = false; // enable the summarize button
        updateSnakeHeadPosition()
    }, 5000); // 5 seconds timeout for inactivity
    updateSnakeHeadPosition()
}

function saveText() {
    const text = textarea.value;
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'my_text.txt';
    link.click();
}

function resetPage() {
    clearInterval(countdown);
    clearTimeout(typingTimeout);
    timeLeft = 5;
    timerBar.style.width = '0%'; // reset bar width
    textarea.value = '';
    textarea.disabled = false; // enable the text area
    saveButton.disabled = true; // disable the save button
    summarizeButton.disabled = true; // disable the summarize button
    timerStarted = false; // reset timer started flag
    snakeHead.style.left = '0';
    summaryElement.textContent = ''; // clear the summary text
    summaryElement.style.display = 'none'; // hide the summary element
}

async function summarizeText() {
    if (summarizing) return; // prevent multiple requests
    summarizing = true; // set flag to true while summarizing
    summarizeButton.disabled = true; // disable the summarize button

    summaryElement.textContent = 'Summarizing...'; // placeholder during summarization
    summaryElement.style.display = 'block';

    const text = textarea.value;
    try {
        // send request to Node.js server
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text }),
        });

        // error handling
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // handle response
        const data = await response.json();
        summaryElement.textContent = data.summary || 'No summary available';
    } catch (error) { // error handling
        console.error('Error summarizing text:', error);
        summaryElement.textContent = 'Error summarizing text';
    } finally {
        summarizing = false; // reset flag after request
        summarizeButton.disabled = false; // re-enable the summarize button
    }
}

// event listeners
summarizeButton.removeEventListener('click', summarizeText);
summarizeButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    summarizeText();
});

document.addEventListener('DOMContentLoaded', () => {
    updateSnakeHeadPosition(); 
});

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('textarea');

    textarea.addEventListener('input', function() { //expand and contract text area
        this.style.height = 'auto'; 
        this.style.height = (this.scrollHeight) + 'px'; 
    });
});

window.addEventListener('resize', updateSnakeHeadPosition);
textarea.addEventListener('input', resetTimer);
saveButton.addEventListener('click', saveText);
resetButton.addEventListener('click', resetPage);
summarizeButton.removeEventListener('click', summarizeText); 
summarizeButton.addEventListener('click', (event) => {
    event.preventDefault(); 
    summarizeText();
});



