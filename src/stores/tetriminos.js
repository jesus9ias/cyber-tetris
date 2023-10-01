import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import getTetrimino from './getTetrimino';

export const useTetriminos = defineStore('tetriminos', () => {
  let tetrimino = getTetrimino();
  const tetriminoRow = ref(0);
  const tetriminoCol = ref(3);

  const levelProperties = {
    1: { lines: 10, speed: 500 },
    2: { lines: 8, speed: 300 },
    3: { lines: 5, speed: 200 },
    4: { lines: 5, speed: 200 },
    5: { lines: 5, speed: 200 },
    6: { lines: 5, speed: 200 },
    7: { lines: 5, speed: 200 },
    8: { lines: 5, speed: 200 },
    9: { lines: 5, speed: 200 },
    10: { lines: 5, speed: 200 }
  };

  let interval;

  const level = ref(1);
  const points = ref(0);
  const totalLinesCleared = ref(0);
  const levelLinesCleared = ref(0);

  const linesToNextLevel = computed(() => levelProperties[level.value].lines - levelLinesCleared.value);

  let falling = false;

  const matrix = ref([]);

  const keys = {
    enter: 13,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    pause: 80,
    restart: 82,
    zi: 90,
    eks: 88
  };

  const listenKeyboard = () => {
    document.addEventListener('keydown', keyboard);
  }
  
  const keyboard = (key) => {
    const canNotGoRight = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoCol.value + mino[1] + 1 >= 10);
    const hasSomethingRight = tetrimino.sides[tetrimino.position]
      .filter((mino) => {
        const maxRow = tetriminoRow.value + mino[0];
        const maxCol = tetriminoCol.value + mino[1] + 1;
        return matrix.value[maxRow] && matrix.value[maxRow][maxCol] && matrix.value[maxRow][maxCol].locked;
      });
    if (key.keyCode == keys.right && canNotGoRight.length === 0 && hasSomethingRight.length === 0) {
      tetriminoCol.value++;
      paintTetrimino();
    }
  
    const canNotGoLeft = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoCol.value + mino[1] -1 < 0);
    const hasSomethingLeft = tetrimino.sides[tetrimino.position]
      .filter((mino) => {
        const minRow = tetriminoRow.value + mino[0];
        const minCol = tetriminoCol.value + mino[1] - 1;
        return matrix.value[minRow] && matrix.value[minRow][minCol] && matrix.value[minRow][minCol].locked;
      });
    if (key.keyCode == keys.left && canNotGoLeft.length === 0 && hasSomethingLeft.length === 0) {
      tetriminoCol.value--;
      paintTetrimino();
    }

    if (key.keyCode == keys.down) {
      falling = true;
      while(falling) {
        processing();
      }
    }

    if (key.keyCode === keys.zi) {
      if (tetrimino.position === 'north') { tetrimino.position = 'west'; return };
      if (tetrimino.position === 'west') { tetrimino.position = 'south'; return };
      if (tetrimino.position === 'south') { tetrimino.position = 'east'; return };
      if (tetrimino.position === 'east') { tetrimino.position = 'north'; return };
      paintTetrimino();
    }

    if (key.keyCode === keys.eks || key.keyCode ===keys.up) {
      if (tetrimino.position === 'north') { tetrimino.position = 'east'; return };
      if (tetrimino.position === 'east') { tetrimino.position = 'south'; return };
      if (tetrimino.position === 'south') { tetrimino.position = 'west'; return };
      if (tetrimino.position === 'west') { tetrimino.position = 'north'; return };
      paintTetrimino();
    }
  }

  const getTetriminoColor = (row, col) => {
    const matchMatrix = tetrimino.sides[tetrimino.position]
      .find((mino) => (tetriminoRow.value + mino[0]) === row && (tetriminoCol.value + mino[1]) === col);

    if (matchMatrix) {
      return tetrimino.color;
    }

    return null;
  }

  const createCells = () => {
    matrix.value = [];
    for (let r = 0; r <= 19; r++) {
      matrix.value.push([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[r].push({
          col: c,
          color: null,
          locked: false
        });
      }
    }
  };

  const paintTetrimino = () => {
    for (let r = 0; r <= 19; r++) {
      for (let c = 0; c <= 9; c++) {
        if (matrix.value[r] && !matrix.value[r][c].locked) {
          matrix.value[r][c].color = getTetriminoColor(r, c);
        }
      }
    }
  };

  const lockCells = () => {
    falling = false;
    tetrimino.sides[tetrimino.position].forEach((mino) => {
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].color = tetrimino.color;
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].locked = true;
    });
  }

  const reviewForLine = () => {
    let lockedLines = [];
    for (let r = 19; r >= 0; r--) {
      let totalLocked = 0;
      for (let c = 0; c <= 9; c++) {
        if (matrix.value[r][c].locked) {
          totalLocked++;
        }
      }
      if (totalLocked === 10) {
        lockedLines.push(r);
      }
    }

    lockedLines.forEach((line) => {
      points.value += 10;
      totalLinesCleared.value++;
      levelLinesCleared.value++;
      matrix.value.splice(line, 1);
    });

    lockedLines.forEach(() => {
      matrix.value.unshift([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[0].push({
          col: c,
          color: null,
          locked: false
        });
      }
    });
  };

  const reviewLevel = () => {
    if (linesToNextLevel.value <= 0) {
      levelLinesCleared.value = 0;
      level.value++;
      startInterval();
    }
  }
  
  const callTetrimino = () => {
    tetriminoRow.value = 0;
    tetriminoCol.value = 4;
    tetrimino = getTetrimino();
  }

  const processing = () => {
    const isOutOfRange = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoRow.value + mino[0] + 1 >= 20);

    const hasBlockedWayDown = tetrimino.sides[tetrimino.position]
      .filter((mino) => matrix.value[tetriminoRow.value + mino[0] + 1]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]].locked);
    
    if (isOutOfRange.length === 0 && hasBlockedWayDown.length === 0) {
      tetriminoRow.value++;
    } else {
      lockCells();
      reviewForLine();
      reviewLevel();
      callTetrimino();
    }
  };

  const startInterval = () => {
    clearInterval(interval);
    interval = setInterval(processing, levelProperties[level.value].speed);
  };

  watch(() => tetriminoRow.value, () => {
    paintTetrimino();
  });

  createCells();
  listenKeyboard();
  startInterval();

  return {
    tetrimino,
    matrix,
    level,
    points,
    totalLinesCleared,
    levelLinesCleared,
    linesToNextLevel
  }
})
