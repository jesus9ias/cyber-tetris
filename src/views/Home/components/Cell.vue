<script setup>
defineProps({
  cell: {
    type: Object,
    default: () => ({})
  },
});
</script>

<template>
  <div
    class="cell"
    :style="{
      background: cell.colors[0],
      borderTopColor: cell.colors[1],
      borderRightColor: cell.colors[2],
      borderBottomColor: cell.colors[2],
      borderLeftColor: cell.colors[1]
    }"
  >
  </div>
</template>

<style>
.cell {
  width: 20px;
  height: 20px;
  border-width: 3px;
  border-style: solid;
  background: #110e0f;
  border-bottom-color: #171719;
  border-right-color: #171719;
  border-left-color: #000002;
  border-top-color: #000002;
}
</style>