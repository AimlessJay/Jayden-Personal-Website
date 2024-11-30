const word = wordOfTheDay; // Word_of_the_day
const user = currUser; // Word_of_the_day
const maxRows = word.length; // Maximum number of rows
const leaderboardContainer = document.getElementById("leaderboard-container");

let currentRow = 0; // Keep track of the current row
let guesses = Array(word.length * maxRows).fill("");
let letterKeyPressCount = 0;

const startTime = new Date();
let lastResetDate = new Date().getDate();

let userTimes = {};

let rules = instructions;

function giveRules(){
    const ruleContainer = document.getElementById("rule-container");

    if (rules === 'True'){
        const gridContainer = document.getElementById("grid-container");
        gridContainer.innerHTML = ""; // Clear the grid
        gridContainer.style.display = "none";

        const wordleContainer = document.getElementById("wordle-container");
        wordleContainer.style.display = "none";

        const keyboard = document.getElementById("full-keyboard");
        keyboard.style.display = "none";

        const checkBtn = document.getElementById("guess-btn");
        checkBtn.style.display = "none";

        ruleContainer.style.display = "flex";
        //console.log("this is true")
    }else{

        const gridContainer = document.getElementById("grid-container");
        gridContainer.style.display = "grid";

        const wordleContainer = document.getElementById("wordle-container");
        wordleContainer.style.display = "block";

        const keyboard = document.getElementById("full-keyboard");
        keyboard.style.display = "flex";

        const checkBtn = document.getElementById("guess-btn");
        checkBtn.style.display = "block";

        ruleContainer.style.display = "none";
        //console.log("this is false")
    }
}

function hideRules() {
    const gridContainer = document.getElementById("grid-container");
    const ruleContainer = document.getElementById("rule-container");

    gridContainer.style.display = "grid";

    const wordleContainer = document.getElementById("wordle-container");
    wordleContainer.style.display = "block";

    const keyboard = document.getElementById("full-keyboard");
    keyboard.style.display = "flex";

    const checkBtn = document.getElementById("guess-btn");
    checkBtn.style.display = "block";

    ruleContainer.style.display = "none";
}

// db = database();

// const mysql = require('mysql');

// const connection = mysql.createConnection({
//     host: '127.0.0.1',
//     user: 'master',
//     password: 'master',
//     database: 'db',
// });

function createGrid() {
    const gridContainer = document.getElementById("grid-container");

    // Number of columns based on the length of the word
    const numColumns = word.length;

    // Clear existing content in the grid container
    gridContainer.innerHTML = "";

    for (let i = 0; i < maxRows; i++) {
        // Create a row div to contain cells
        const row = document.createElement("div");
        row.classList.add("row");

        for (let j = 0; j < numColumns; j++) {
            const index = i * numColumns + j; // Calculate the overall index for the cell
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.setAttribute("data-index", index);
            cell.addEventListener("click", () => toggleLetter(index));
            row.appendChild(cell);
        }

        gridContainer.appendChild(row);
    }
}

function updateGrid() {
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell, index) => {
        cell.textContent = guesses[index];
    });
}

function updateRowColors() {
    const lastRow = currentRow - 1;
    const rowStart = lastRow * word.length;
    const rowEnd = currentRow * word.length;

    const letterCount = {};

    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        if (!letterCount[letter]) {
            letterCount[letter] = 1;
        } else {
            letterCount[letter]++;
        }
    }

    for (let i = rowStart; i < rowEnd; i++) {
        const cell = document.querySelector(`.cell[data-index="${i}"]`);
        const guessedLetter = guesses[i];
        const correctLetter = word[i % word.length];

        cell.classList.remove("grey-cell", "yellow-cell", "green-cell");

        if (guessedLetter === correctLetter) {
            cell.classList.add("green-cell");
        } else if (letterCount[guessedLetter] && letterCount[guessedLetter] > 0) {
            cell.classList.add("yellow-cell");
            letterCount[guessedLetter]--;
        } else {
            cell.classList.add("grey-cell");
        }
    }

    // for (let i = rowStart; i < rowEnd; i++) {
    //     const cell = document.querySelector(`.cell[data-index="${i}"]`);

    //     if (!cell) {
    //         console.error(`Cell not found for index ${i}`);
    //         continue;  // Skip to the next iteration if the cell is not found
    //     }

    //     const guessedLetter = guesses[i];
    //     const correctLetter = word[i % word.length];

    //     cell.classList.remove("grey-cell", "yellow-cell", "green-cell");

    //     if (guessedLetter === correctLetter) {
    //         cell.classList.add("green-cell");
    //     } else if (word.includes(guessedLetter)) {
    //         cell.classList.add("yellow-cell");
    //     } else {
    //         cell.classList.add("grey-cell");
    //     }
    // }
}

function makeRowGreen(row) {
    const rowStart = row * word.length;
    const rowEnd = (row + 1) * word.length;

    for (let i = rowStart; i < rowEnd; i++) {
        const cell = document.querySelector(`.cell[data-index="${i}"]`);
        cell.classList.remove("grey-cell", "yellow-cell", "green-cell");
        cell.classList.add("green-cell");
    }
}


function toggleLetter(index) {
    const cellValue = guesses[index];
    const nextLetter = getNextLetter(cellValue);

    guesses[index] = nextLetter;
    updateGrid();
}

function getNextLetter(letter) {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (!letter || letter === "") {
        return alphabet[0];
    }

    const currentIndex = alphabet.indexOf(letter);
    const nextIndex = (currentIndex + 1) % alphabet.length;
    return alphabet[nextIndex];
}

async function validateWord(word) {
    const apiKey = '537623139dmshdfe20fde287a22dp1bb4e1jsn2e205325aba0';
    const apiUrl = `https://wordsapiv1.p.rapidapi.com/words/${word}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
                'X-RapidAPI-Key': apiKey,
            },
        });

        const data = await response.json();

        if (data.word && data.word.length === word.length) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error validating word:', error);
        return false;
    }
}

async function checkGuess() {
    const currentGuess = guesses.slice(currentRow * word.length, (currentRow + 1) * word.length).join("").toLowerCase();

    if (currentGuess === word) {
        // Congratulations! Correct guess.
        makeRowGreen(currentRow);
        updateGrid();
        letterKeyPressCount = 0;
        gameOver(true);
        // alert("Congratulations! You guessed the word!");

        // const rowElement = document.querySelector(`.row[data-row="${currentRow}"]`);
        // rowElement.classList.add("correct-row");
    } else {
        // Incorrect guess. Check if the word is of the correct length and valid.
        if (currentGuess.length !== word.length) {
            letterKeyPressCount = 0;
            alert("Word length is incorrect. Try again!");

            guesses.fill("", currentRow * word.length, (currentRow + 1) * word.length);
            updateGrid();
        } else {
            const isValid = await validateWord(currentGuess);
            console.log(`Word: ${currentGuess}, Valid: ${isValid}`);

            if (isValid) {
                letterKeyPressCount = 0;
                alert("Incorrect guess. Try again!");
                currentRow++;
            } else {
                letterKeyPressCount = 0;
                alert("Invalid word. Try again!");
                guesses.fill("", currentRow * word.length, (currentRow + 1) * word.length);
                updateGrid();
            }
        }

        // Check if we've reached the maximum number of rows
        if (currentRow === maxRows) {
            gameOver(false);
            // alert("Maximum rows reached. Game over!");
            // Reset the game or take other actions LATER
        }
        updateRowColors();
    }
    letterKeyPressCount = 0;
}

document.addEventListener("DOMContentLoaded", function () {
    giveRules();
    createGrid();
    updateGrid();
    retrieveAndSetUserTimes();
});

// Capture keypress events and update the grid
document.addEventListener("keypress", async function (event) {
    const pressedKey = String.fromCharCode(event.charCode).toLowerCase();

    if(letterKeyPressCount < word.length){
        if (/^[a-z]$/.test(pressedKey)) {
            letterKeyPressCount++;
            const index = guesses.indexOf("", currentRow * word.length);
            // console.log(letterKeyPressCount);
            // console.log(word.length)

            if (index !== -1) {
                guesses[index] = pressedKey;
                updateGrid();

                // Validate the word when it's complete
                if (guesses.slice(currentRow * word.length, (currentRow + 1) * word.length).every((letter) => letter !== "")) {
                    const userInput = guesses.slice(currentRow * word.length, (currentRow + 1) * word.length).join("");

                    // Check if the word is of the correct length
                    if (userInput.length === word.length) {
                        const isValid = await validateWord(userInput);
                        

                        if (!isValid) {
                            alert("Invalid word. Try again!");
                            // Clear the invalid word
                            guesses.fill("", currentRow * word.length, (currentRow + 1) * word.length);
                            letterKeyPressCount = 0;
                            updateGrid();
                        }
                    } else {
                        alert("Word length is incorrect. Try again!");
                        // Clear the invalid word
                        guesses.fill("", currentRow * word.length, (currentRow + 1) * word.length);
                        letterKeyPressCount = 0;
                        updateGrid();
                    }
                }
            }
        }
    }
});


document.addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
        letterKeyPressCount--;
        //console.log(event.key)
        handleBackspace();
    }
    if (event.key === "Enter") {
        checkGuess();
    }
});



function handleBackspace() {
    const lastFilledIndex = guesses.indexOf("", currentRow * word.length) - 1;
    //console.log(lastFilledIndex)
    // Check if there is a filled cell to delete
    if (lastFilledIndex !== -1) {
        // Clear the last filled cell
        guesses[lastFilledIndex] = "";
        updateGrid();
    }
}

function addToInput(letter) {
    const index = guesses.indexOf("");

    if (index !== -1) {
        // Update the first empty cell with the pressed letter
        guesses[index] = letter.toLowerCase();  // Make sure the letter is in lowercase
        updateGrid();
        letterKeyPressCount++;

        // Validate the word when it's complete
        if (letterKeyPressCount === word.length) {
            checkGuess();
        }
    }
}

function gameOver(isWinner) {
    // Calculate the time taken
    const endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Convert to seconds

    // Replace the grid with the leaderboard
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = ""; // Clear the grid
    gridContainer.style.display = "none";

    const wordleContainer = document.getElementById("wordle-container");
    wordleContainer.style.display = "none";

    const keyboard = document.getElementById("full-keyboard");
    keyboard.style.display = "none";

    const checkBtn = document.getElementById("guess-btn");
    checkBtn.style.display = "none";

    const leaderboardContainer = document.getElementById("leaderboard-container");
    // leaderboardContainer.classList.add("leaderboard");
    leaderboardContainer.style.display = "flex";

    if (isWinner) {
        // Display a congratulatory message
        const congratsMessage = document.getElementById("result-message");
        congratsMessage.textContent = "Congratulations! You guessed the word!";
        updateUserTime(user ,timeTaken);

        // leaderboardContainer.appendChild(congratsMessage);
    } else {
        // Display a message for unsuccessful attempts
        const gameOverMessage = document.getElementById("result-message");
        gameOverMessage.textContent = "Game over! You've reached the maximum number of rows.";
        // leaderboardContainer.appendChild(gameOverMessage);
    }

    // Display the hidden word
    const hiddenWordMessage = document.getElementById("hidden-word");
    const upperWord = word.toUpperCase();
    hiddenWordMessage.textContent = `Hidden Word: ${upperWord}`;
    // leaderboardContainer.appendChild(hiddenWordMessage);

    // Display the time taken
    const timeTakenMessage = document.getElementById("time-taken");
    timeTakenMessage.textContent = `Time Taken: ${timeTaken} seconds`;
    // leaderboardContainer.appendChild(timeTakenMessage);

    // Append the leaderboard container to the document
    // document.body.appendChild(leaderboardContainer);
}

function updateUserTime(userId, timeTaken) {
    resetUserTimesIfNeeded();

    // Check if the user already has an entry in the dictionary
    if (userTimes.hasOwnProperty(userId)) {
        // User already exists, update the time
        if(timeTaken < userTimes[userId]){
            userTimes[userId] = timeTaken;
            console.log(timeTaken);
            console.log(userTimes[userId])
        }
    } else {
        // User doesn't exist, add a new entry
        userTimes[userId] = timeTaken;
    }
    const userTimesJSON = JSON.stringify(userTimes);
    document.cookie = `userTimes=${userTimesJSON}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    //console.log(userTimes)
    updateLeaderboard();
}

// Function to reset userTimes at the beginning of each day
function resetUserTimesIfNeeded() {
    const currentDate = new Date().getDate();

    // Check if it's a new day
    if (currentDate !== lastResetDate) {
        // It's a new day, reset the dictionary
        userTimes = {};
        lastResetDate = currentDate;
    }
}

function updateLeaderboard() {
    // Sort userTimes by time in ascending order
    const sortedUserTimes = Object.entries(userTimes).sort((a, b) => {
        const timeA = a[1];
        const timeB = b[1];

        // Convert time strings to seconds for comparison
        const secondsA = convertTimeToSeconds(timeA);
        const secondsB = convertTimeToSeconds(timeB);

        return secondsA - secondsB;
    });

    // Take the top 5 users from the sorted list
    const topUsers = sortedUserTimes.slice(0, 5);

    // Get the "leaderboard-container" div
    const leaderboardContainer = document.getElementById("leaderboard-container");

    // Create an unordered list
    const ul = document.createElement("ul");

    // Add each user to the list
    topUsers.forEach(([userId, time]) => {
        const li = document.createElement("li");
        li.textContent = `${userId} time: ${time}`;
        // li.style.color = white;
        ul.appendChild(li);
    });

    // Update the leaderboard container with the new list
    // leaderboardContainer.innerHTML = "";
    leaderboardContainer.appendChild(ul);
}

// Function to convert time strings to seconds for comparison
function convertTimeToSeconds(timeString) {
    if (timeString > 60){
        try {
            const [minutes, seconds] = timeString.split(":").map(Number);
            return minutes * 60 + seconds;
        } catch (error) {
            console.error('Error converting time to seconds:', error);
            console.log('timeString:', timeString);
            return 0; // Return a default value in case of an error
        }
    }
}

// Function to retrieve cookies and update userTimes
function retrieveAndSetUserTimes() {
    const userTimesCookie = getCookie("userTimes");
    
    if (userTimesCookie) {
        try {
            userTimes = JSON.parse(userTimesCookie);
            console.log("User times retrieved from cookie:", userTimes);
        } catch (error) {
            console.error("Error parsing userTimes from cookie:", error);
        }
    }
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
}

// function updateWordleTime(userId, timeTaken) {
//     // SQL query to update the wordle_time for the specified user
//     const updateQuery = `UPDATE users SET wordle_time = ? WHERE user_id = ?`;

//     // Execute the query
//     connection.query(updateQuery, [timeTaken, userId], (error, results) => {
//         if (error) {
//             console.error('Error updating wordle_time:', error);
//         } else {
//             console.log(`Wordle time updated for user ${userId}`);
//         }
//     });
// }

// // Enable keyboard input as soon as the HTML is loaded
// window.onload = function () {
//     document.getElementById('userInput').readOnly = false;
// };