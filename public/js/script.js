const textarea = document.getElementById('textArea');
const timerBar = document.getElementById('timerBar');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const summarizeButton = document.getElementById('summarizeButton');
const summaryElement = document.getElementById('summary');
const snakeHead = document.getElementById('snakeHead');

let countdown;
let timeLeft = 5; // Countdown from 5 seconds
let timerStarted = false; // Flag to track if timer has started
let typingTimeout; // Timeout handle for detecting inactivity
let summarizing = false; // Flag to prevent multiple summarize requests

function updateSnakeHeadPosition() {
    // Get the current width of the timer bar
    const timerBarWidth = timerBar.clientWidth;
    // Set the snake head's position relative to the width of the timer bar
    snakeHead.style.left = `${timerBarWidth}px`; // place snake head at the end of the timer bar
}

function startTimer() {
    countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerBar.style.width = '100%'; // fill entire bar
            textarea.disabled = true; // disable the text area
            saveButton.disabled = false; // enable the save button
            snakeHead.style.right = '0';
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
    timerBar.style.width = '0%'; // Reset bar width
    textarea.disabled = false; // Enable the text area
    saveButton.disabled = true; // Disable the save button
    summarizeButton.disabled = true; // Disable the summarize button

    // Clear the previous timeout to reset typing detection
    clearTimeout(typingTimeout);
    
    // Set a timeout to detect inactivity
    typingTimeout = setTimeout(() => {
        clearInterval(countdown);
        timerBar.style.width = '100%'; // Fill the bar completely
        textarea.disabled = true; // Disable the text area
        saveButton.disabled = false; // Enable the save button
        summarizeButton.disabled = false; // Enable the summarize button
    }, 5000); // 5 seconds timeout for inactivity
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
    timerBar.style.width = '0%'; // Reset bar width
    textarea.value = '';
    textarea.disabled = false; // Enable the text area
    saveButton.disabled = true; // Disable the save button
    summarizeButton.disabled = true; // Disable the summarize button
    timerStarted = false; // Reset timer started flag
    snakeHead.style.left = '0';
}

async function summarizeText() {
    if (summarizing) return; // Prevent multiple requests
    summarizing = true; // Set flag to true while summarizing
    summarizeButton.disabled = true; // Disable the summarize button

    summaryElement.textContent = 'Summarizing...';
    summaryElement.style.display = 'block';

    const text = textarea.value;
    try {
        // Send request to Node.js server
        const response = await fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: text }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Handle response
        const data = await response.json();
        summaryElement.textContent = data.summary || 'No summary available';
    } catch (error) {
        console.error('Error summarizing text:', error);
        summaryElement.textContent = 'Error summarizing text';
    } finally {
        summarizing = false; // Reset flag after request
        summarizeButton.disabled = false; // Re-enable the summarize button
    }
}

// Ensure only one event listener is attached
summarizeButton.removeEventListener('click', summarizeText);
summarizeButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default behavior
    summarizeText();
});


document.addEventListener('DOMContentLoaded', () => {
    updateSnakeHeadPosition(); // Ensure snake head is correctly positioned initially
});
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.querySelector('textarea');

    textarea.addEventListener('input', function() {
        this.style.height = 'auto'; // Reset the height
        this.style.height = (this.scrollHeight) + 'px'; // Set the height to the scroll height
    });
});

window.addEventListener('resize', updateSnakeHeadPosition);
textarea.addEventListener('input', resetTimer);
saveButton.addEventListener('click', saveText);
resetButton.addEventListener('click', resetPage);
summarizeButton.removeEventListener('click', summarizeText);
summarizeButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent any default behavior
    summarizeText();
});



