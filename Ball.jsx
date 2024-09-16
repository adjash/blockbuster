function Ball({ position }) {
  return (
    <div
      className="rounded-full w-[25px] h-[25px] absolute bg-red-600"
      style={{
        left: position.x,
        top: position.y,
      }}
    ></div>
  );
}

export default Ball;
