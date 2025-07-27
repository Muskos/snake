import { AppSettingsType } from '../types';

class AppSettingsClass implements AppSettingsType {
  initialInterval: number;

  constructor() {
    this.initialInterval = 100;
  }
}

export const AppSettings = new AppSettingsClass();