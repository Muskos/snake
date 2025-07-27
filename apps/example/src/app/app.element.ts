import './app.element.css';
import { createSnakeGame } from '@snake/snake';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];

  connectedCallback() {
    const title = '@snake/example';
    this.innerHTML = `
      <div class="wrapper">
        <div class="container">
          <div id="welcome">
            <h1>
              <span>Hello there,</span>
              Welcome ${title} 👋
            </h1>
            <p>Snake Game Demo</p>
          </div>
          
          <div id="game-container">
            <div id="snake-game"></div>
            <div id="game-info">
              <p>Use arrow keys or WASD to control the snake</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Создаем игру в контейнере
    const gameContainer = this.querySelector('#snake-game') as HTMLElement;
    if (gameContainer) {
      createSnakeGame(gameContainer, {
        width: 20,
        height: 20,
        cellSize: 20
      });
    }
  }
}

customElements.define('snake-root', AppElement);
