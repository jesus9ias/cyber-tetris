import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';
import getTetrimino from '../tetriminos/getTetrimino';

export const useOperations = defineStore('operation', () => {
  const nextQueue = ref([getTetrimino(), getTetrimino(), getTetrimino(), getTetrimino(), getTetrimino()]);
  const holdQueue = ref([]);
  let tetrimino = getTetrimino();
  const tetriminoRow = ref(0);
  const tetriminoCol = ref(3);


  const levelProperties = {
    1: { lines: 10, speed: 1000 },
    2: { lines: 8, speed: 793 },
    3: { lines: 5, speed: 618 },
    4: { lines: 5, speed: 473 },
    5: { lines: 5, speed: 355 },
    6: { lines: 5, speed: 262 },
    7: { lines: 5, speed: 190 },
    8: { lines: 5, speed: 135 },
    9: { lines: 5, speed: 94 },
    10: { lines: 5, speed: 64 },
    11: { lines: 5, speed: 43 },
    12: { lines: 5, speed: 28 },
    13: { lines: 5, speed: 18 },
    14: { lines: 5, speed: 11 },
    15: { lines: 5, speed: 7 }
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
    enter: 13, //Accept
    left: 37, //Move Left
    up: 38, //Rotate Right
    right: 39, //Move Right
    down: 40, //Soft Drop
    space: 32, //Hard Drop
    pi: 80, //Pause
    ar: 82, //Restart
    zi: 90, //Rotate Left
    eks: 88, //Rotate Right
    ech: 72 //Hold
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

    if (key.keyCode == keys.space) {
      falling = true;
      while(falling) {
        stepDown();
      }
    }

    if (key.keyCode == keys.down) {
      stepDown();
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

    if (key.keyCode === keys.ech) {
      if (holdQueue.value.length === 1) {
        const aux = holdQueue.value.shift();
        holdQueue.value.push(tetrimino);
        tetriminoRow.value = 0;
        tetriminoCol.value = 4;
        tetrimino = aux;
      } else {
        holdQueue.value.push(tetrimino);
        callTetrimino();
      }
    }
  }

  const getTetriminoColor = (row, col) => {
    const matchMatrix = tetrimino.sides[tetrimino.position]
      .find((mino) => (tetriminoRow.value + mino[0]) === row && (tetriminoCol.value + mino[1]) === col);

    if (matchMatrix) {
      return { color: tetrimino.color, secondaryColor: tetrimino.secondaryColor };
    }

    return { color: null, secondaryColor: null };
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
          const { color, secondaryColor } = getTetriminoColor(r, c);
          matrix.value[r][c].color = color;
          matrix.value[r][c].secondaryColor = secondaryColor;
        }
      }
    }
  };

  const lockCells = () => {
    falling = false;
    tetrimino.sides[tetrimino.position].forEach((mino) => {
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].color = tetrimino.color;
      matrix.value[tetriminoRow.value + mino[0]][tetriminoCol.value + mino[1]].secondaryColor = tetrimino.secondaryColor;
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
      totalLinesCleared.value++;
      levelLinesCleared.value++;
      matrix.value.splice(line, 1);
    });

    updateScore(lockedLines.length);

    lockedLines.forEach(() => {
      matrix.value.unshift([]);
      for (let c = 0; c <= 9; c++) {
        matrix.value[0].push({
          col: c,
          color: null,
          secondaryColor: null,
          locked: false
        });
      }
    });
  };

  const updateScore = (lockedLines) => {
    if (lockedLines < 1) {
      return;
    }
    points.value += ((lockedLines * 100) + ((lockedLines - 1) * 100)) * level.value;
  }

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
    moveQueue();

    const {
      isOutOfRange,
      hasBlockedWayDown
    } = getRestrictions();
  
    if (isOutOfRange.length > 0 || hasBlockedWayDown.length > 0) {
      restart();
    }
  }

  const restart = () => {
    level.value = 1;
    points.value = 0
    totalLinesCleared.value = 0
    levelLinesCleared.value = 0
    startInterval();
    createCells();
    callTetrimino();
  };

  const getRestrictions = () => {
    const isOutOfRange = tetrimino.sides[tetrimino.position]
      .filter((mino) => tetriminoRow.value + mino[0] + 1 >= 20);

    const hasBlockedWayDown = tetrimino.sides[tetrimino.position]
      .filter((mino) => matrix.value[tetriminoRow.value + mino[0] + 1]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]]
        && matrix.value[tetriminoRow.value + mino[0] + 1][tetriminoCol.value + mino[1]].locked);
      
      return {
        isOutOfRange,
        hasBlockedWayDown
      }
  }

  const stepDown = () => {
    const {
      isOutOfRange,
      hasBlockedWayDown
    } = getRestrictions();
  
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
    interval = setInterval(stepDown, levelProperties[level.value].speed);
  };

  const moveQueue = () => {
    tetrimino = nextQueue.value.shift();
    nextQueue.value.push(getTetrimino());
  }

  watch(() => tetriminoRow.value, () => {
    paintTetrimino();
  });

  createCells();
  listenKeyboard();
  startInterval();

  return {
    tetrimino,
    matrix,
    nextQueue,
    holdQueue,
    level,
    points,
    totalLinesCleared,
    levelLinesCleared,
    linesToNextLevel
  }
})