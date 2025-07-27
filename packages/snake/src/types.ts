export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  direction: Direction;
  food: Position;
  score: number;
  gameOver: boolean;
  speedLevel: number;
}

export interface GameConfig {
  width: number;
  height: number;
  onSpeedChange?: (newInterval: number) => void;
}

export interface ViewConfig {
  container: HTMLElement;
  cellSize: number;
}

export interface EngineConfig {
  update: () => void;
  render: () => void;
  interval?: number;
}

export type ControlCallback = (direction: Direction) => void;
export type SpeedChangeCallback = (newInterval: number) => void;

export type SnakeMock = Position[];

export interface AppSettingsType {
  initialInterval: number;
} 