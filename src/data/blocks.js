const generateBlocks = () => {
  let idCounter = 0;
  const blocks = [];
  const minWidth = 25;
  const maxWidth = 100;
  const blockHeight = 30;
  const padding = 5;
  const rows = 5;
  const containerWidth = 600;

  const bgColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  for (let row = 0; row < rows; row++) {
    let rowWidth = 0;
    let rowBlocks = [];

    while (rowWidth < containerWidth - maxWidth) {
      const randomWidth =
        Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
      const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

      if (rowWidth + randomWidth + padding > containerWidth - maxWidth) {
        break;
      }

      rowBlocks.push({
        id: idCounter++,
        class: randomColor,
        special: "",
        isVisible: true,
        width: randomWidth,
        height: blockHeight,
        x: rowWidth,
        y: row * (blockHeight + padding),
      });

      rowWidth += randomWidth + padding;
    }

    // Center the blocks in the row
    const rowPadding = (containerWidth - rowWidth + padding) / 2;
    rowBlocks.forEach((block) => {
      block.x += rowPadding;
    });

    blocks.push(...rowBlocks);
  }

  return blocks;
};

export default generateBlocks;
