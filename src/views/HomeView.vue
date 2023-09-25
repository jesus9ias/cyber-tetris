<script setup>
import Cell from './components/Cell.vue';
import { useTetriminos } from '../stores/tetriminos';

const { matrix } = useTetriminos();

</script>

<template>
  <main>
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
  </main>
</template>

<style>
.row {
  display: flex;
}
</style>