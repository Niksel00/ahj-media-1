import validateCoords from '../validateCoords';

test.each([
  ['valid coords without space', '51.50851, −0.12572', '51.50851, −0.12572'],
  ['valid coords with space', '51.50851,−0.12572', '51.50851, −0.12572'],
  ['valid coords with []', '[51.50851, −0.12572]', '51.50851, −0.12572'],
  ['invalid format of coords', '[ 51.50851, −0.12572]', false],
  ['invalid value of coords ', '91.50851, −0.12572', false],
])(('Test validateCoords for '), (_, input, expected) => {
  expect(validateCoords(input)).toBe(expected);
});
