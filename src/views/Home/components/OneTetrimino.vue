<script setup>
import { ref } from 'vue';
import Cell from './Cell.vue';

const props = defineProps({
  tetrimino: {
    type: Object,
    default: () => ({})
  }
});

const matrix = ref([]);

const getTetriminoColor = (row, col) => {
  const matchMatrix = props.tetrimino && props.tetrimino.sides[props.tetrimino.position]
    .find((mino) => mino[0] === row && mino[1] === col);

  if (matchMatrix) {
    return { color: props.tetrimino.color, secondaryColor: props.tetrimino.secondaryColor };
  }

  return { color: null, secondaryColor: null };
}

const paintTetrimino = () => {
    for (let r = 0; r <= 3; r++) {
      for (let c = 0; c <= 3; c++) {
        if (matrix.value[r] && !matrix.value[r][c].locked) {
          const { color, secondaryColor } = getTetriminoColor(r, c);
          matrix.value[r][c].color = color;
          matrix.value[r][c].secondaryColor = secondaryColor;
        }
      }
    }
  };

const createCells = () => {
  matrix.value = [];
  for (let r = 0; r <= 3; r++) {
    matrix.value.push([]);
    for (let c = 0; c <= 3; c++) {
      matrix.value[r].push({
        col: c,
        color: null,
        locked: false
      });
    }
  }
};

createCells();
paintTetrimino();
</script>

<template>
  <div
      class="row"
      :key="r"
      v-for="(row, r) in matrix"
    >
      <cell
        :key="c"
        v-for="(col, c) in row"
        :cell="col"
      />
    </div>
</template>