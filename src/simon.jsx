import React, { useState } from "react";
import "./simon.css";

function Simon() {
  const colors = ["yellow", "red", "purple", "green"];

  // Button click sounds (free hosted)
  const soundMap = {
    yellow: "https://freesound.org/data/previews/341/341695_5260877-lq.mp3",
    red: "https://freesound.org/data/previews/341/341696_5260877-lq.mp3",
    purple: "https://freesound.org/data/previews/341/341697_5260877-lq.mp3",
    green: "https://freesound.org/data/previews/341/341698_5260877-lq.mp3",
  };

  // Background music
  const bgMusic = new Audio(
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  );
  bgMusic.loop = true;
  bgMusic.volume = 0.15;

  const [gameSeq, setGameSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [highest, setHighest] = useState(0);
  const [level, setLevel] = useState(0);
  const [flashColor, setFlashColor] = useState(null);
  const [started, setStarted] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Play button sound
  const playSound = (color) => {
    const audio = new Audio(soundMap[color]);
    audio.play().catch(() => {});
  };

  // Start game
  const startGame = () => {
    setStarted(true);
    setIsGameOver(false);
    setGameSeq([]);
    setUserSeq([]);
    setLevel(0);

    // Play background music
    bgMusic.play().catch(() => {});

    setTimeout(() => nextRound(), 500);
  };

  // Next round
  const nextRound = () => {
    setUserSeq([]);
    setLevel((prev) => {
      const newLevel = prev + 1;
      if (newLevel > highest) setHighest(newLevel);
      return newLevel;
    });

    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    const newSeq = [...gameSeq, nextColor];
    setGameSeq(newSeq);
    playSequence(newSeq);
  };

  // Flash sequence + sound
  const playSequence = (seq) => {
    setFlashing(true);
    let i = 0;
    const interval = setInterval(() => {
      setFlashColor(seq[i]);
      playSound(seq[i]); // sound during sequence
      setTimeout(() => setFlashColor(null), 400);
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setFlashing(false), 500);
      }
    }, 800);
  };

  // Handle user click
  const handleClick = (color) => {
    if (!started || flashing) return;

    playSound(color); // sound on user click

    const newUserSeq = [...userSeq, color];
    setUserSeq(newUserSeq);

    if (newUserSeq[newUserSeq.length - 1] !== gameSeq[newUserSeq.length - 1]) {
      gameOver();
      return;
    }

    if (newUserSeq.length === gameSeq.length) {
      setTimeout(nextRound, 800);
    }
  };

  // Game over
  const gameOver = () => {
    setIsGameOver(true);
    setStarted(false);
    setGameSeq([]);
    setUserSeq([]);
    setLevel(0);

    // Stop background music
    bgMusic.pause();
    bgMusic.currentTime = 0;
  };

  return (
    <div className={`game-container ${isGameOver ? "game-over" : ""}`}>
      {isGameOver ? (
        <div className="game-over-screen">
          <h1 className="game-over-text">GAME OVER</h1>
          <button className="start-btn" onClick={startGame}>
            Play Again
          </button>
        </div>
      ) : (
        <>
          <h1>ColorTabGame</h1>
          <h2 className="level">
            {started
              ? `Level: ${level} | Highest: ${highest}`
              : "Press Start to Play"}
          </h2>

          {!started && (
            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          )}

          <div className="board">
            {colors.map((color) => (
              <div
                key={color}
                className={`btn ${color} ${flashColor === color ? "flash" : ""}`}
                onClick={() => handleClick(color)}
              ></div>
            ))}
          </div>
        </>
      )}
          <h2 className="Rule">Rules:</h2>
          <ul className="rules">
              <li>Press Start to begin the game.</li>
              <li>Watch the sequence of flashing colors.</li>
              <li>Repeat the sequence by clicking the buttons in the same order.</li>
              <li>Every correct round increases the level.</li>
              <li>If you make a mistake, the game is over.</li>
          </ul>
          <h6 className="footer-name">✨Shahid khan</h6>
    </div>
  );
}

export default Simon;
