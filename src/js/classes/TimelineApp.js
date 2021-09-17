/* eslint-disable no-inner-declarations */
/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import TimelineStorage from './TimelineStorage';
import Coords from './Coords';
import Tooltip from './Tooltip';

export default class TimelineApp {
  constructor() {
    this.container = document.querySelector('.container');
    this.messageInput = document.getElementById('message_input');
    this.mediaButtons = document.querySelector('.media-buttons');
    this.recordButtons = document.querySelector('.record-buttons');
    this.audioButton = document.querySelector('.audio-button');
    this.videoButton = document.querySelector('.video-button');
    this.timelineStorage = new TimelineStorage();
    this.timelineList = document.getElementById('timeline_list');
    this.coords = new Coords();
    this.tooltip = new Tooltip();
    this.acceptButton = document.querySelector('.accept-button');
    this.declineButton = document.querySelector('.decline-button');
    this.timerBox = document.querySelector('.timer-box');
  }

  init() {
    this.action();
  }

  action() {
    this.messageInput.addEventListener('keypress', async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (document.querySelector('.coords-form-active')) return;
        if (this.messageInput.value !== '') {
          try {
            const coords = await this.coords.getCoords();
            this.timelineStorage.add(this.messageInput.value, coords);
            this.draw(this.timelineStorage.timelines[0]);
            this.messageInput.value = '';
          } catch (error) {
            console.log(error);
          }
          this.coords.coordsInput.value = '';
        }
      }
    });
    this.audioButton.addEventListener('click', async () => {
      if (document.querySelector('.coords-form-active') || document.querySelector('.tooltip')) return;
      this.mediaButtons.classList.remove('media-buttons-active');
      this.recordButtons.classList.add('record-buttons-active');
      await this.record('audio');
    });
    this.videoButton.addEventListener('click', async () => {
      if (document.querySelector('.coords-form-active') || document.querySelector('.tooltip')) return;
      this.mediaButtons.classList.remove('media-buttons-active');
      this.recordButtons.classList.add('record-buttons-active');
      await this.record('video');
    });
  }

  draw(el) {
    const timeline = document.createElement('div');
    timeline.className = 'timeline';
    timeline.innerHTML = `
      <span class="timeline-date">${this.formatDate(el.date)}</span>
      <div class="timeline-content">${el.content}</div>
      <span class="timeline-coords">[${el.coords}]</span>
    `;
    this.timelineList.insertAdjacentElement('afterbegin', timeline);
  }

  async record(type) {
    if (!window.MediaRecorder) {
      this.tooltip.show(`${type}Error`);
      this.mediaButtons.classList.add('media-buttons-active');
      this.recordButtons.classList.remove('record-buttons-active');
      return;
    }

    try {
      let interval = null;
      let seconds = 0;
      let save = false;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === 'video',
      });
      console.log(stream);
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      const stopRecord = (event) => {
        if (document.querySelector('.coords-form-active') || document.querySelector('.tooltip')) return;
        if (event.target.classList.contains('accept-button')) {
          save = true;
        } else {
          save = false;
        }
        this.mediaButtons.classList.add('media-buttons-active');
        this.recordButtons.classList.remove('record-buttons-active');
        recorder.stop();
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };

      recorder.addEventListener('start', () => {
        if (type === 'video') {
          const previewBox = document.createElement('div');
          previewBox.className = 'preview-box';
          const preview = document.createElement('video');
          preview.className = 'preview';
          preview.srcObject = stream;
          preview.muted = false;
          preview.play();
          previewBox.appendChild(preview);
          this.container.appendChild(previewBox);
        }
        console.log('recording started');
        interval = setInterval(() => {
          seconds += 1;
          this.timerBox.innerText = this.timer(seconds);
        }, 1000);
        this.acceptButton.addEventListener('click', stopRecord);
        this.declineButton.addEventListener('click', stopRecord);
      });
      recorder.addEventListener('dataavailable', (event) => {
        console.log('data available');
        chunks.push(event.data);
      });
      recorder.addEventListener('stop', async () => {
        this.acceptButton.removeEventListener('click', stopRecord);
        this.declineButton.removeEventListener('click', stopRecord);
        if (type === 'video') this.container.removeChild(document.querySelector('.preview-box'));
        console.log('recording stopped');
        clearInterval(interval);
        this.timerBox.innerText = '00:00';
        if (save) {
          const blob = new Blob(chunks);
          const media = document.createElement('div');
          media.className = `${type}-content`;
          media.innerHTML = `
            <${type} class="${type}" src="${URL.createObjectURL(blob)}" controls></${type}>
            `;
          const coords = await this.coords.getCoords();
          this.timelineStorage.add(media.outerHTML, coords);
          this.draw(this.timelineStorage.timelines[0]);
          this.coords.coordsInput.value = '';
        }
      });
      recorder.start();
    } catch (e) {
      console.error(e);
      this.mediaButtons.classList.add('media-buttons-active');
      this.recordButtons.classList.remove('record-buttons-active');
      this.tooltip.show(`${type}Error`);
      this.coords.coordsInput.value = '';
    }
  }

  formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(2);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year} ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  timer(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds - min * 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
}
