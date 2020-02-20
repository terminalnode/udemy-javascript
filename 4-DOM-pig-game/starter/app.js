/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/

var scores, roundScore, activePlayer, dice, lastRoll;
resetGame();

function switchPlayer() {
    document.getElementById(`score-${activePlayer}`).textContent = scores[activePlayer];

    activePlayer = activePlayer === 0 ? 1 : 0;
    roundScore = 0;
    lastRoll = null;
    document.querySelector(".dice").style.display = "none";

    for (let i = 0; i < 2; i++) {
        document.getElementById(`current-${i}`).textContent = "0";
        document.querySelector(`.player-${i}-panel`).classList.toggle("active")
    }
}

function resetGame() {
    scores = [ 0, 0 ]
    roundScore = 0;
    activePlayer = 0;
    diceValue = 0;
    lastRoll = 0;
    document.querySelector(".dice").style.display = "none";
    document.querySelector(".btn-roll").style.display = "block";
    document.querySelector(".btn-hold").style.display = "block";

    for (let i = 0; i < 2; i++) {
        document.getElementById(`score-${i}`).textContent = "0";
        document.getElementById(`current-${i}`).textContent = "0";
        document.querySelector(`.player-${i}-panel`).classList.remove("winner");
    }

    document.querySelector(`.player-0-panel`).classList.remove("active")
    document.querySelector(`.player-1-panel`).classList.remove("active")
    document.querySelector(`.player-0-panel`).classList.add("active")
}

document.querySelector(".btn-new").addEventListener("click", resetGame);

document.querySelector(".btn-roll").addEventListener("click", function() {
    let diceValue = Math.floor(Math.random() * 6) + 1;

    let diceDOM = document.querySelector(".dice");
    diceDOM.style.display = "block";
    diceDOM.src = `dice-${diceValue}.png`;

    if (diceValue === 6 && lastRoll == 6) {
        scores[activePlayer] = 0;
        roundScore = 0;
        switchPlayer();
    } else if (diceValue !== 1) {
        lastRoll = diceValue;
        roundScore += diceValue;
        document.getElementById(`current-${activePlayer}`).textContent = roundScore;
    } else {
        switchPlayer();
    }
});

document.querySelector(".btn-hold").addEventListener("click", function() {
    scores[activePlayer] += roundScore;

    if (scores[activePlayer] >= 100) {
        document.getElementById(`score-${activePlayer}`).textContent = "Winner!";
        document.querySelector(`.player-${activePlayer}-panel`).classList.add("winner");
        document.querySelector(`.player-${activePlayer}-panel`).classList.remove("active");
        document.querySelector(".dice").style.display = "none";
        document.querySelector(".btn-roll").style.display = "none";
        document.querySelector(".btn-hold").style.display = "none";
    } else {
        switchPlayer();
    }
});
