export default () => ({
  type: 'I',
  position: 'north',
  colors: ['#01aaee', '#008fc8', '#32c2ee'],
  sides: {
    north: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3]
    ],
    east: [
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2]
    ],
    south: [
      [2, 0],
      [2, 1],
      [2, 2],
      [2, 3]
    ],
    west: [
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1]
    ],
  }
});