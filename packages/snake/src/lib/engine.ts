const DEFAULT_SPEED = 1000;

export class GameEngine {
  private update: () => void;
  private render: () => void;
  private interval: number;
  private timer: NodeJS.Timeout | null;

  constructor(update: () => void, render: () => void, interval: number = DEFAULT_SPEED) {
    this.update = update;
    this.render = render;
    this.interval = interval;
    this.timer = null;
  }

  start(): void {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.update();
      this.render();
      console.log(this.interval);
    }, this.interval);
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setInterval(newInterval: number): void {
    this.stop();
    this.interval = newInterval;
    this.start();
  }
}