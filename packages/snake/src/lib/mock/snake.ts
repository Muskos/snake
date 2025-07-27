import { SnakeMock } from '../../types';

export const snakeMocks: SnakeMock[] = [
  // 1. Single cell (starting)
  [{ x: 10, y: 10 }],
  // 2. Two segments horizontally
  [{ x: 10, y: 10 }, { x: 9, y: 10 }],
  // 3. Three segments vertically
  [{ x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }],
  // 4. Snake "corner" (L-shaped)
  [{ x: 3, y: 3 }, { x: 3, y: 4 }, { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 5, y: 3 }],
  // 5. Almost entire row
  Array.from({ length: 18 }, (_, i) => ({ x: i + 1, y: 0 })),
  // 6. Almost entire column
  Array.from({ length: 18 }, (_, i) => ({ x: 0, y: i + 1 })),
  // 7. Zigzag snake
  [
    { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 3, y: 4 },
    { x: 4, y: 4 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 6 }
  ],
  // 8. Almost full 5x5 square (without one cell)
  ...(() => {
    const snake: SnakeMock = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        if (!(x === 2 && y === 2)) snake.push({ x, y });
      }
    }
    return [snake];
  })(),
  // 9. Almost entire 20x20 board (without 10 cells)
  ...(() => {
    const snake: SnakeMock = [];
    let skip = 0;
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 20; x++) {
        if (skip < 10 && (x + y) % 19 === 0) {
          skip++;
          continue;
        }
        snake.push({ x, y });
      }
    }
    return [snake];
  })()
];