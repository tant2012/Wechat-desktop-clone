<template>
  <div class="wrapper">
    <div class="search-wrapper">
      <input
        v-model="value"
        type="text"
        class="searchInput"
        placeholder="搜索"
      />
      <i v-if="!value" class="icon iconfont icon-search"></i>
      <div v-else @click="value = '' " class="searchInput-delete"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>

<style></style>
