<script setup>
import { useTetriminos } from '@/composables/useTetriminos';
import Cell from './Cell.vue';

const { matrix, createCells, paintTetrimino } = useTetriminos();

const props = defineProps({
  tetrimino: {
    type: Object,
    default: () => ({})
  }
});

createCells(3, 3);
paintTetrimino(3, 3, props.tetrimino);
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