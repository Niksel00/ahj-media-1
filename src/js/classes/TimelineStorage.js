import Timeline from './Timeline';

export default class TimelineStorage {
  constructor() {
    this.timelines = [];
  }

  add(content, coords) {
    this.timelines.unshift(new Timeline(content, coords));
  }
}
