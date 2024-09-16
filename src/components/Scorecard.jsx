function Scorecard({ username, score, lives }) {
  return (
    <div className="absolute top-2 left-2 bg-white p-2 rounded shadow">
      <p>
        <strong>{username}</strong>
      </p>
      <p>Score: {score}</p>
      <p>Lives: {lives}</p>
    </div>
  );
}

export default Scorecard;
