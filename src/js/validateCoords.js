export default function validateCoords(coords) {
  if (/^(\[?-?)((\d|[0-8]\d?|90)\.\d{5,}), ?(-|−)?((\d{1,2}|1[0-7][0-9]|180)\.\d{5,})(\]?)$/.test(coords)) {
    const arr = coords.split(',');
    const latitude = arr[0].replace(/\[/, '');
    const longitude = arr[1].replace(/\]/, '').replace(/\s/, '');
    return `${latitude}, ${longitude}`;
  }
  return false;
}
