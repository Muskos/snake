export { GameEngine } from './engine';
export { SnakeGame } from './game';
export { SnakeView } from './view';
export { AppSettings } from './settings';

export type {
  Direction,
  Position,
  GameState,
  GameConfig,
  ViewConfig,
  EngineConfig,
  ControlCallback,
  SpeedChangeCallback,
  SnakeMock,
  AppSettingsType
} from '../types';

export { snakeMocks } from './mock/snake'; 