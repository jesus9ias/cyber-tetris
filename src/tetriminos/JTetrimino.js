export default () => ({
  type: 'J',
  position: 'north',
  color: '#0075c5',
  secondaryColor: '#3b95cc',
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
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 2]
    ],
    west: [
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0]
    ]
  }
});