import { GameState, ControlCallback, Position } from '../types';

export class SnakeView {
  private cellSize: number;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private controls: HTMLDivElement;

  constructor(container: HTMLElement = document.body, cellSize: number = 20) {
    this.cellSize = cellSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 400;
    this.canvas.height = 400;
    this.canvas.id = 'snake-canvas';
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.controls = document.createElement('div');
    this.controls.className = 'snake-controls';
    this.controls.innerHTML = `
      <button data-dir="up">↑</button>
      <div>
        <button data-dir="left">←</button>
        <button data-dir="down">↓</button>
        <button data-dir="right">→</button>
      </div>
    `;
    container.appendChild(this.controls);
  }

  onControl(callback: ControlCallback): void {
    this.controls.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        const dir = target.getAttribute('data-dir');
        if (dir) callback(dir as any);
      }
    });

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right'
      };
      const dir = keyMap[e.key];
      if (dir) callback(dir as any);
    });
  }

  render(state: GameState): void {
    this.clear();
    this.drawBorder();
    this.drawSnake(state.snake);
    this.drawFood(state.food);
    if (state.gameOver) {
      this.drawGameOver();
    }
  }

  private clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawBorder(): void {
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawSnake(snake: Position[]): void {
    this.ctx.fillStyle = 'lime';
    snake.forEach(part => {
      this.ctx.fillRect(
        part.x * this.cellSize,
        part.y * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });
  }

  private drawFood(food: Position): void {
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(
      food.x * this.cellSize,
      food.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }

  private drawGameOver(): void {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(
      'Game Over',
      this.canvas.width / 2 - 60,
      this.canvas.height / 2
    );
  }
}