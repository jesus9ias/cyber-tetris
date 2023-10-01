<script setup>
import Cell from './components/Cell.vue';
import { useTetriminos } from '../stores/tetriminos';

const store = useTetriminos();

</script>

<template>
  <main>
    <p>Level: {{ store.level }}</p>
    <p>Points: {{ store.points }}</p>
    <p>Lines Cleared {{ store.totalLinesCleared }}</p>
    <p>Lines To Next Level: {{ store.linesToNextLevel }}</p>
    <div
      class="row"
      :key="r"
      v-for="(row, r) in store.matrix"
    >
      <cell
        :key="c"
        v-for="(col, c) in row"
        :cell="col"
      />
    </div>
  </main>
</template>

<style>
.row {
  display: flex;
}
</style>