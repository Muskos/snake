import { AppSettings } from './settings';
import { snakeMocks } from './mock/snake';
import { 
  GameState, 
  Position, 
  Direction, 
  SpeedChangeCallback 
} from '../types';

const DEFAULT_SNAKE: Position[] = [{ x: 10, y: 10 }];

export class SnakeGame {
  private width: number;
  private height: number;
  public onSpeedChange: SpeedChangeCallback | null;
  private defaultSnake: Position[];
  private state!: GameState;

  constructor(width = 20, height = 20, onSpeedChange: SpeedChangeCallback | null = null) {
    this.width = width;
    this.height = height;
    this.onSpeedChange = onSpeedChange;
    this.defaultSnake = DEFAULT_SNAKE;
    // this.defaultSnake = snakeMocks[0].map(part => ({ ...part }));
    // this.defaultSnake = snakeMocks[1].map(part => ({ ...part }));
    // this.defaultSnake = snakeMocks[2].map(part => ({ ...part }));
    // this.defaultSnake = snakeMocks[3].map(part => ({ ...part }));
    this.defaultSnake = snakeMocks[5].map(part => ({ ...part }));
    this.reset();
  }

  reset(): void {
    const snake = this.defaultSnake.map(part => ({ ...part }));
    const food = this.generateFood(snake);

    this.state = {
      snake,
      direction: 'right',
      food,
      score: 0,
      gameOver: false,
      speedLevel: 0
    };
    if (this.onSpeedChange) {
      this.onSpeedChange(AppSettings.initialInterval);
    }
  }

  update(): void {
    if (this.state.gameOver) return;
    this.moveSnakeForward();
    if (this.checkCollision()) {
      this.state.gameOver = true;
      this.reset();
      return;
    }

    this.handleFood();
  }

  private moveSnakeForward(): void {
    const head = this.state.snake[0];
    const newHead: Position = { ...head };
    const dx = this.state.direction === 'right' ? 1 : this.state.direction === 'left' ? -1 : 0;
    const dy = this.state.direction === 'down' ? 1 : this.state.direction === 'up' ? -1 : 0;

    newHead.x += dx;
    newHead.y += dy;

    this.state.snake.unshift(newHead);
  }

  changeDirection(newDirection: Direction): void {
    const oppositeDirections: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    if (oppositeDirections[newDirection] === this.state.direction) {
      return;
    }
    this.state.direction = newDirection;
  }

  private checkCollision(): boolean {
    const head = this.state.snake[0];

    if (
      head.x < 0 ||
      head.x + 1 > this.width ||
      head.y < 0 ||
      head.y + 1 > this.height
    ) {
      this.state.gameOver = true;
      return true;
    }

    for (let i = 1; i < this.state.snake.length; i++) {
      if (
        Math.abs(head.x - this.state.snake[i].x) < 1e-6 &&
        Math.abs(head.y - this.state.snake[i].y) < 1e-6
      ) {
        this.state.gameOver = true;
        return true;
      }
    }

    return false;
  }

  private handleFood(): void {
    const head = this.state.snake[0];
    const food = this.state.food;
    if (head.x === food.x && head.y === food.y) {
      this.state.score += 1;
      this.state.food = this.generateFood();
      if (this.state.score % 5 === 0 && this.onSpeedChange) {
        this.state.speedLevel += 1;
        const newInterval = Math.max(40, 100 - this.state.speedLevel * 10);
        this.onSpeedChange(newInterval);
      }
    } else {
      this.state.snake.pop();
    }
    console.log(`Score: ${this.state.score}, Speed Level: ${this.state.speedLevel}`);
  }

  private generateFood(snake: Position[] = this.state.snake): Position {
    const occupied = new Set(snake.map(part => `${part.x},${part.y}`));
    const freeCells: Position[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (!occupied.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }
    if (freeCells.length === 0) {
      return { x: -1, y: -1 };
    }
    const idx = Math.floor(Math.random() * freeCells.length);
    return freeCells[idx];
  }

  increaseSpeed(): void {
    this.state.speedLevel += 1;
  }

  getState(): GameState {
    return this.state;
  }
}