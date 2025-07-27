export * from './lib';

import { GameEngine, SnakeGame, SnakeView, AppSettings } from './lib';

export function createSnakeGame(container: HTMLElement, options?: {
  width?: number;
  height?: number;
  cellSize?: number;
}) {
  const width = options?.width || 20;
  const height = options?.height || 20;
  const cellSize = options?.cellSize || 20;

  const game = new SnakeGame(width, height);

  const view = new SnakeView(container, cellSize);
  const engine = new GameEngine(
    () => game.update(),
    () => {
      const state = game.getState();
      view.render(state);
    },
    AppSettings.initialInterval
  );

  view.onControl(dir => game.changeDirection(dir));
  engine.start();

  return {
    game,
    view,
    engine,
    destroy: () => {
      engine.stop();
    }
  };
}