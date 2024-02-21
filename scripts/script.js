const hangmanImage = document.querySelector(".hangman-box img");
const palavraDisplay = document.querySelector(".palavra-display");
const guessesText = document.querySelector(".suposicoes-text b");
const tecladoDiv = document.querySelector(".teclado");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 3;

const resetGame = () => {
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `img/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    tecladoDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    palavraDisplay.innerHTML = '';

    // Exibir traços para cada letra da palavra atual
    currentWord.split("").forEach((letter, index) => {
        const liElement = document.createElement('li');
        liElement.classList.add("carta");
        if (index === 0) {
            liElement.innerText = letter; // Exibir a primeira letra diretamente
        } 
        palavraDisplay.appendChild(liElement);
    });
    gameModal.classList.remove("show");
}


const getRandomWord = () => {
    const { word: palavra, hint: dica } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = palavra;
    console.log(palavra);
    document.querySelector(".dica-text b").innerText = dica;
    resetGame();
}

const gameOver = (isVictory) => {
    setTimeout(() => {
        const modalText = isVictory ? `Você acertou a palavra:` : `A palavra correta era:`;
        gameModal.resultGif = isVictory ? 'victory.gif' : 'lost.gif';
        gameModal.querySelector("img").src = `img/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Parabéns!' : 'Game Over!'}`;
        gameModal.querySelector(".content p").innerHTML = `${modalText} <b>${currentWord}</b>`;

        // Exibe todas as letras da palavra corretamente adivinhadas em caso de vitória
        if (isVictory) {
            palavraDisplay.querySelectorAll("li").forEach((letterLi, index) => {
                letterLi.innerText = currentWord[index];
            });
        }

        gameModal.classList.add("show");
    }, 300);

    // Limpa as letras corretas no caso de derrota
    if (!isVictory) {
        palavraDisplay.querySelectorAll("li").forEach((letterLi, index) => {
            letterLi.innerText = ''; // Limpa a letra
            letterLi.classList.remove('guessed'); // Remove a classe
        });
    }
}


const initGame = (button, clickedLetter) => {
    let correctGuess = false;

    if (currentWord.includes(clickedLetter)) {
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) {
                correctGuess = true;
                correctLetters.push(letter);
                palavraDisplay.querySelectorAll("li")[index].innerText = letter;
                palavraDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
       wrongGuessCount++;
       hangmanImage.src = `img/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Verificar condição de vitória após cada jogada
    if (wrongGuessCount === maxGuesses) {
        gameOver(false); // Se o jogador exceder o número máximo de palpites errados
    } else if (correctLetters.length === currentWord.length) {
        gameOver(true); // Se o jogador adivinhar todas as letras corretamente
    }
}

// Criar botões do teclado
for (let i = 97; i <= 122; i++) {
    const button = document.createElement('button');
    const letter = String.fromCharCode(i);
    button.innerText = letter;
    tecladoDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, letter));
}

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);


function escolherCategoria(categoriaSelecionada) {
    const filteredWords = wordList.filter(wordObj => wordObj.hint.toLowerCase() === categoriaSelecionada.toLowerCase());
    if (filteredWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredWords.length);
        currentWord = filteredWords[randomIndex].word;
        const dica = filteredWords[randomIndex].hint;
        document.querySelector(".dica-text b").innerText = dica;
        resetGame(); // Reiniciar o jogo com a nova palavra e dica
    } else {
        alert("Nenhuma palavra encontrada para esta categoria.");
    }
}


function toggleWordOptions() {
    var wordOptions = document.getElementById("wordOptions");
    var toggleOptionsBtn = document.getElementById("toggleOptionsBtn");

    if (wordOptions.style.display === "none") {
        wordOptions.style.display = "block";
        toggleOptionsBtn.textContent = "Esconder Categorias";
    } else {
        wordOptions.style.display = "none";
        toggleOptionsBtn.textContent = "Mostrar Categorias";
    }
}
