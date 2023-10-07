export default () => ({
  type: 'I',
  position: 'north',
  color: '#01aaee',
  secondaryColor: '#32c2ee',
  sides: {
    north: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ],
    east: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3]
    ],
    south: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0]
    ],
    west: [
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3]
    ]
  }
});