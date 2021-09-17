export default class Tooltip {
  constructor() {
    this.container = document.querySelector('.container');
  }

  show(type) {
    const tooltipText = {
      errorCoords: 'Пожалуйста, проверьте корректность введенных координат.',
      cancelCoords: 'К сожалению, определить координаты не удалось. Дайте, пожалуйста, разрешение на использование геопозиции и повторите попытку.',
      audioError: 'К сожалению, микрофон недоступен. Пожалуйста, дайте разрешение на использование микрофона в настройках браузера либо воспользуйтесь другим браузером.',
      videoError: 'К сожалению, камера недоступна. Дайте разрешение на использование камеры в настройках браузера либо воспользуйтесь другим браузером.',
    };
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = `
          <p class="tooltip-text">${tooltipText[type]}</p>
          <button type="button" class="tooltip-button">Ок</button>
        `;
    this.container.appendChild(tooltip);
    const tooltipButton = document.querySelector('.tooltip-button');
    tooltipButton.addEventListener('click', () => {
      this.container.removeChild(tooltip);
    });
  }
}
