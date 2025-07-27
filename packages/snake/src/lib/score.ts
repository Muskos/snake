import { ScoreOptions } from '../types';

export const DEFAULT_SCORE = 0;
export const DEFAULT_GLOBAL_SCORE = 0;
export const DEFAULT_POINTS_PER_FOOD = 10;
export const DEFAULT_POINTS_PER_SPECIAL_FOOD = 20;
export const DEFAULT_SPEED_BONUS_MULTIPLIER = 1;

export class ScoreManager {
  private score = DEFAULT_SCORE;
  private globalScore = DEFAULT_GLOBAL_SCORE;
  private pointsPerFood: number;
  private pointsPerSpecialFood: number;
  private speedBonusMultiplier: number;

  constructor(options: ScoreOptions = {}) {
    this.pointsPerFood = options.pointsPerFood ?? DEFAULT_POINTS_PER_FOOD;
    this.pointsPerSpecialFood = options.pointsPerSpecialFood ?? DEFAULT_POINTS_PER_SPECIAL_FOOD;
    this.speedBonusMultiplier = options.speedBonusMultiplier ?? DEFAULT_SPEED_BONUS_MULTIPLIER;
  }

  addFood(isSpecial: boolean, speedLevel: number) {
    const base = isSpecial ? this.pointsPerSpecialFood : this.pointsPerFood;
    const points = Math.floor(base * (this.speedBonusMultiplier * (1 + speedLevel * 0.1)));
    this.score += points;
    this.globalScore += points;
    return points;
  }

  addPoints(points: number) {
    this.score += points;
    this.globalScore += points;
  }

  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = DEFAULT_SCORE;
  }

  getGlobalScore() {
    return this.globalScore;
  }

  setGlobalScore(score: number) {
    this.globalScore = score;
  }
}