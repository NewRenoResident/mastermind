export function mastermind() {
  console.log("MASTERMIND".padStart(33, " "));
  console.log("CREATIVE COMPUTING".padStart(37, " "));
  console.log("MORRISTOWN, NEW JERSEY".padStart(38, " "));
  console.log("\n\n");

  console.log("THE GAME OF MASTERMIND");
  console.log("\nCOLOR CODES:");
  console.log("R=RED     O=ORANGE     Y=YELLOW");
  console.log("G=GREEN   B=BLUE       P=PURPLE\n");

  let gameHistory = [];
  let gameRunning = true;

  function generateSecretCode() {
    const colors = ["R", "O", "Y", "G", "B", "P"];
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += colors[Math.floor(Math.random() * colors.length)];
    }
    return code;
  }

  function calculatePegs(guess, secret) {
    let blackPegs = 0;
    let whitePegs = 0;
    const secretArray = [...secret];
    const guessArray = [...guess];

    // Calculate black pegs (correct color in correct position)
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] === secretArray[i]) {
        blackPegs++;
        guessArray[i] = secretArray[i] = "X";
      }
    }

    // Calculate white pegs (correct color in wrong position)
    for (let i = 0; i < 4; i++) {
      if (guessArray[i] !== "X") {
        const index = secretArray.indexOf(guessArray[i]);
        if (index !== -1) {
          whitePegs++;
          secretArray[index] = "X";
        }
      }
    }

    return { blackPegs, whitePegs };
  }

  function showBoard() {
    console.log("\nGUESS    BLACKS  WHITES");
    console.log("-----    ------  ------");
    gameHistory.forEach((move) => {
      console.log(
        `${move.guess}      ${move.blackPegs}      ${move.whitePegs}`
      );
    });
  }

  function playGame() {
    const secretCode = generateSecretCode();
    let moves = 0;
    const maxMoves = 10;

    while (gameRunning && moves < maxMoves) {
      moves++;
      console.log(`\nMOVE NUMBER ${moves}`);

      const guess = prompt(
        "Enter your guess (4 colors) or 'BOARD' to see history or 'QUIT' to end:"
      );

      if (!guess) {
        console.log("Game ended. Thanks for playing!");
        gameRunning = false;
        return;
      }

      const upperGuess = guess.toUpperCase();

      if (upperGuess === "BOARD") {
        showBoard();
        moves--;
        continue;
      }

      if (upperGuess === "QUIT") {
        console.log(`The secret code was: ${secretCode}`);
        gameRunning = false;
        return;
      }

      if (upperGuess.length !== 4 || !/^[ROYGBP]{4}$/.test(upperGuess)) {
        console.log("Invalid input! Use R, O, Y, G, B, or P");
        moves--;
        continue;
      }

      const { blackPegs, whitePegs } = calculatePegs(upperGuess, secretCode);
      gameHistory.push({ guess: upperGuess, blackPegs, whitePegs });

      console.log(`${blackPegs} BLACK PEGS`);
      console.log(`${whitePegs} WHITE PEGS`);

      if (blackPegs === 4) {
        console.log("\nYOU WIN!!");
        gameRunning = false;
        return;
      }
    }

    if (moves >= maxMoves) {
      console.log("SORRY, YOU LOSE");
      console.log(`The secret code was: ${secretCode}`);
    }

    const playAgain = prompt("Want to play again? (YES/NO):");
    if (playAgain && playAgain.toUpperCase() === "YES") {
      gameHistory = [];
      playGame();
    }
  }

  playGame();
}
