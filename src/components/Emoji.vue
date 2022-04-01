<template>
  <div class="emoji">
    <i class="icon iconfont icon-look" @click="value = !value"></i>
    <div class="emojiBox" v-show="value">
      <li v-for="emoji in emojis" 
      :key="emoji.code"
      @click="handleEmojiClick(emoji.code)">
        <img
          :src="'/images/emoji/' + emoji.file"
          :data="emoji.code"
          :title="emoji.title"
        />
      </li>
    </div>
  </div>
</template>

<script>
import { inject } from '@vue/runtime-core';

export default {
  props: ["modelValue"],
  emits: ["update:modelValue", "update"],
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
  setup(_,context) {
    const emojis = inject('emojis')

    function handleEmojiClick(code){
      context.emit('update', code)
    };
    return {emojis, handleEmojiClick};
  },
};
</script>

<style></style>
