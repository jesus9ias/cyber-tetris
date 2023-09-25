export default () => ({
  type: 'J',
  position: 'north',
  color: 'blue',
  sides: {
    north: [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    east: [
      [0, 2],
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    south: [
      [2, 2],
      [1, 2],
      [1, 1],
      [1, 0]
    ],
    west: [
      [2, 0],
      [2, 1],
      [1, 1],
      [0, 1]
    ]
  }
});