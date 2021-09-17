/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable prefer-promise-reject-errors */
import validateCoords from '../validateCoords';
import Tooltip from './Tooltip';

export default class Coords {
  constructor() {
    this.coordsForm = document.forms.coords;
    this.coordsInput = document.getElementById('coords_input');
    this.cancelButton = document.querySelector('.cancel-button');
    this.sendButton = document.querySelector('.send-button');
    this.tooltip = new Tooltip();
  }

  getCoords() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude}, ${longitude}`);
        }, (error) => {
          console.log(error);
          this.coordsForm.classList.add('coords-form-active');
          this.coordsForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (document.querySelector('.tooltip')) return;
            if (validateCoords(this.coordsInput.value)) {
              this.coordsForm.classList.remove('coords-form-active');
              resolve(validateCoords(this.coordsInput.value));
            } else {
              this.tooltip.show('errorCoords');
            }
          });
          this.cancelButton.addEventListener('click', () => {
            if (document.querySelector('.tooltip')) return;
            this.coordsForm.classList.remove('coords-form-active');
            this.tooltip.show('cancelCoords');
            reject('cancel');
          });
        });
      } else {
        this.coordsForm.classList.remove('coords-form-active');
        this.tooltip.show('cancelCoords');
        reject('error');
      }
    });
  }
}
