// Setting Game Name
let gameName = (document.title = "Guess The Word");
let theH1 = (document.querySelector("h1").innerHTML = gameName);
document.querySelector(
  "footer"
).innerHTML = `${gameName} Game Created By Omar Alaa`;

// Setting Game Options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = [
  "Create",
  "Update",
  "Delete",
  "Purple",
  "Laptop",
  "Window",
  "Grapes",
  "Castle",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message");

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", getHint);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  for (i = 1; i <= numberOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;
    inputsContainer.appendChild(tryDiv);
    if (i != 1) tryDiv.classList.add("disabled-inputs");
    for (j = 1; j <= numberOfLetters; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("max-length", "1");
      tryDiv.appendChild(input);
    }
  }
  inputsContainer.children[0].children[1].focus();
  let InputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  InputsInDisabledDiv.forEach((input) => (input.disabled = true));
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
    input.addEventListener("keydown", function (event) {
      // console.log(event)
      const currentIndex = Array.from(inputs).indexOf(event.target); // Or This
      // console.log(currentIndex);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

let guessButton = document.querySelector(".check-word");
guessButton.addEventListener("click", handleGuesses);
// console.log(wordToGuess);
function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    let inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
    let letter = inputField.value.toLowerCase();
    let actualLetter = wordToGuess[i - 1];
    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In Place
      inputField.classList.add("in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("wrong");
      successGuess = false;
    }
  }

  // check If User Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `You Win The Message Is <span>${wordToGuess}</span>`;
    // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    // Disabled Guess Button
    guessButton.disabled = true;
  } else {
    document
      .querySelector(`.try-${currentTry}`)
      .classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(
      `.try-${currentTry} input`
    );
    currentTryInputs.forEach((input) => (input.disabled = true));
    currentTry++;
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    let element = document.querySelector(`.try-${currentTry}`);
    if (element) {
      document
        .querySelector(`.try-${currentTry}`)
        .classList.remove("disabled-inputs");
      element.children[1].focus();
    } else {
      guessButton.disabled = true;
      messageArea.innerHTML = `You Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}
function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    hintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  // console.log(enabledInputs);
  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
  // console.log(emptyEnabledInputs);

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    // console.log(randomIndex);
    // console.log(randomInput);
    // console.log(indexToFill);
    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    // console.log(currentIndex);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);


window.onload = function () {
  generateInput();
};
