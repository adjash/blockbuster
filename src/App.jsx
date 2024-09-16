import { useEffect, useState, useCallback, useRef } from "react";
import Ball from "./components/Ball";
import Platform from "./components/Platform";
import generateBlocks from "./data/blocks";
import UsernameInput from "./components/UsernameInput";
import Scorecard from "./components/Scorecard";
import GameOverScreen from "./components/GameOverScreen";

function App() {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 550 });
  const [isShooting, setIsShooting] = useState(false);
  const [ballDirection, setBallDirection] = useState({ x: 0, y: "up" });
  const [platformPosition, setPlatformPosition] = useState({ x: 300 });
  const [blocks, setBlocks] = useState(generateBlocks());

  const lastTimestampRef = useRef(null);
  const animationFrameId = useRef(null);

  const ballSpeed = 300;

  const checkCollision = useCallback(() => {
    const ballRect = {
      left: ballPosition.x,
      right: ballPosition.x + 25,
      top: ballPosition.y,
      bottom: ballPosition.y + 25,
    };

    let hitBlock = false;

    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => {
        if (!block.isVisible) return block;

        const blockRect = {
          left: block.x,
          right: block.x + block.width,
          top: block.y,
          bottom: block.y + block.height,
        };

        if (
          ballRect.left < blockRect.right &&
          ballRect.right > blockRect.left &&
          ballRect.top < blockRect.bottom &&
          ballRect.bottom > blockRect.top
        ) {
          hitBlock = true;
          setBallDirection((prev) => ({ ...prev, y: "down" }));
          setScore((prevScore) => prevScore + 10);
          return { ...block, isVisible: false };
        }
        return block;
      })
    );

    if (hitBlock) {
      checkWinCondition();
    }
  }, [ballPosition]);

  const checkWinCondition = useCallback(() => {
    const remainingBlocks = blocks.filter((block) => block.isVisible);
    if (remainingBlocks.length === 0) {
      setGameOver(true);
    }
  }, [blocks]);

  const checkPlatformCollision = useCallback(() => {
    const platformRect = {
      left: platformPosition.x - 75, // Subtract half the platform width
      right: platformPosition.x + 75, // Add half the platform width
      top: 580,
    };

    if (
      ballPosition.y + 25 >= platformRect.top &&
      ballPosition.x + 12.5 >= platformRect.left &&
      ballPosition.x + 12.5 <= platformRect.right
    ) {
      const hitPoint = ballPosition.x + 12.5 - (platformPosition.x - 75);
      const relativeHitPoint = hitPoint / 150;
      const xDirection = relativeHitPoint - 0.5;

      setBallDirection({ x: xDirection * 5, y: "up" });
    }
  }, [ballPosition, platformPosition]);

  const gameLoop = useCallback(
    (timestamp) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;

      const deltaTime = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      if (isShooting) {
        setBallPosition((prev) => {
          let newY =
            ballDirection.y === "up"
              ? prev.y - ballSpeed * deltaTime
              : prev.y + ballSpeed * deltaTime;
          let newX = prev.x + ballDirection.x * ballSpeed * deltaTime;

          // bounce off left wall
          if (newX <= 0) {
            setBallDirection((prev) => ({ ...prev, x: prev.x + 1 }));
          }
          // bounce off right wall
          if (newX >= 575) {
            setBallDirection((prev) => ({ ...prev, x: prev.x - 1 }));
          }

          // bounce off top wall
          if (newY <= 0) {
            setBallDirection((prev) => ({ ...prev, y: "down" }));
          }

          if (newY >= 575) {
            setLives((prevLives) => prevLives - 1);
            if (lives <= 1) {
              setGameOver(true);
              return prev;
            }
            setIsShooting(false);
            return { x: platformPosition.x, y: 550 };
          }

          return { x: newX, y: newY };
        });
        checkCollision();
        checkPlatformCollision();
      }

      animationFrameId.current = requestAnimationFrame(gameLoop);
    },
    [
      isShooting,
      ballDirection,
      checkCollision,
      checkPlatformCollision,
      lives,
      platformPosition.x,
    ]
  );

  useEffect(() => {
    if (isShooting && !gameOver) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [isShooting, gameLoop, gameOver]);

  const handleShoot = () => {
    if (!isShooting && !gameOver) {
      setIsShooting(true);
      setBallPosition({
        x: platformPosition.x,
        y: 550,
      });
      setBallDirection({ x: 0, y: "up" });
    }
  };

  const handleStartGame = (name) => {
    setUsername(name);
    setGameStarted(true);
  };

  const handleRestart = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsShooting(false);
    setBallPosition({ x: 290, y: 550 });
    setPlatformPosition({ x: 300 });
    setBlocks(generateBlocks());
  };

  if (!gameStarted) {
    return <UsernameInput onSubmit={handleStartGame} />;
  }

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-2xl my-2">BrickBuster</h1>
      </div>

      <Scorecard username={username} score={score} lives={lives} />
      <div className="gameboard relative w-[600px] h-[600px] mx-auto border border-gray-300 overflow-hidden">
        {blocks.map(
          (block) =>
            block.isVisible && (
              <div
                key={block.id}
                className={`${block.class} rounded-md absolute`}
                style={{
                  width: block.width,
                  height: block.height,
                  left: block.x,
                  top: block.y,
                }}
              ></div>
            )
        )}
        <Ball position={ballPosition} />
        <Platform
          position={platformPosition}
          setPosition={setPlatformPosition}
          onShoot={handleShoot}
        />
        {gameOver && (
          <GameOverScreen
            username={username}
            score={score}
            onRestart={handleRestart}
          />
        )}
      </div>
    </>
  );
}

export default App;
