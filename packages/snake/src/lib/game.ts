import { AppSettings } from './settings';
import { snakeMocks } from './mock/snake';
import { 
  GameState, 
  Position, 
  Direction, 
  SpeedChangeCallback,
  Food,
  ScoreOptions,
} from '../types';
import { ScoreManager } from './score';
import { DEFAULT_SNAKE, DEFAULT_SPECIAL_FOOD_CHANCE, DEFAULT_BASE_SPEED, DEFAULT_MAX_SPEED } from './constants';

export interface SnakeGameOptions extends ScoreOptions {
  specialFoodChance?: number;
  baseSpeed?: number;
  speedIncrement?: number;
  maxSpeed?: number;
}

export class SnakeGame {
  private width: number;
  private height: number;
  public onSpeedChange: SpeedChangeCallback | null;
  private defaultSnake: Position[];
  private state!: GameState;
  private scoreManager: ScoreManager;
  private specialFoodChance: number;
  private baseSpeed: number;
  private maxSpeed: number;
  private currentSpeed: number;

  constructor(
    width = 20,
    height = 20,
    options: SnakeGameOptions = {},
    onSpeedChange: SpeedChangeCallback | null = null
  ) {
    this.width = width;
    this.height = height;
    this.scoreManager = new ScoreManager(options);
    this.specialFoodChance = options.specialFoodChance ?? DEFAULT_SPECIAL_FOOD_CHANCE;
    this.onSpeedChange = onSpeedChange;
    this.defaultSnake = DEFAULT_SNAKE;
    this.defaultSnake = snakeMocks[5].map(part => ({ ...part }));
    this.baseSpeed = options.baseSpeed ?? DEFAULT_BASE_SPEED;
    this.maxSpeed = options.maxSpeed ?? DEFAULT_MAX_SPEED;
    this.currentSpeed = this.baseSpeed;
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
    this.currentSpeed = this.baseSpeed;
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
      this.state.score = this.scoreManager.getScore();
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

  private generateFood(snake: Position[] = this.state.snake): Food {
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
      return { x: -1, y: -1, isSpecial: false };
    }
    const idx = Math.floor(Math.random() * freeCells.length);
    const isSpecial = Math.random() < this.specialFoodChance;
    return { ...freeCells[idx], isSpecial };
  }

  increaseSpeed(): void {
    this.state.speedLevel += 1;
  }

  getState(): GameState {
    return this.state;
  }

  // --- API methods ---
  getScore(): number {
    return this.scoreManager.getScore();
  }
  resetScore(): void {
    this.scoreManager.resetScore();
    this.state.score = 0;
  }
  addPoints(points: number): void {
    this.scoreManager.addPoints(points);
    this.state.score = this.scoreManager.getScore();
  }
  getGlobalScore(): number {
    return this.scoreManager.getGlobalScore();
  }
  setGlobalScore(score: number): void {
    this.scoreManager.setGlobalScore(score);
  }

  getSpeed(): number {
    return this.currentSpeed;
  }

  setSpeed(speed: number): void {
    this.currentSpeed = Math.min(speed, this.maxSpeed);
  }

  resetSpeed(): void {
    this.currentSpeed = this.baseSpeed;
  }

  applySpeedModifier(modifier: number): void {
    this.setSpeed(this.currentSpeed * modifier);
  }
}