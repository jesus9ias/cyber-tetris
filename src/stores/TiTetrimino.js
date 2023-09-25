export default () => ({
  type: 'T',
  position: 'north',
  color: 'purple',
  sides: {
    north: [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    east: [
      [0, 1],
      [1, 1],
      [1, 2],
      [2, 1]
    ],
    south: [
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 1]
    ],
    west: [
      [0, 1],
      [1, 1],
      [1, 0],
      [2, 1]
    ]
  }
});