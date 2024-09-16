function GameOverScreen({ username, score, onRestart }) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white">
      <h2 className="text-4xl mb-4">Game Over</h2>
      <p className="text-2xl mb-2">Player: {username}</p>
      <p className="text-2xl mb-4">Final Score: {score}</p>
      <button
        onClick={onRestart}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Play Again
      </button>
    </div>
  );
}

export default GameOverScreen;
