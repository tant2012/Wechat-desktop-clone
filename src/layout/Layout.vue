<template>
  <div id="app">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <section>
        <header>
          <img :src="`/images/face/` + user.icon" class="avatar" />
        </header>
        <nav>
          <!-- <a href="/chat" class="icon iconfont icon-msg active"></a> -->
          <!-- <a href="/friends" class="icon iconfont icon-friend"></a>
          <a href="#" class="icon iconfont icon-collection"></a> -->
          <router-link to="/chat" class="icon iconfont icon-msg"></router-link>
          <router-link to="/friends" class="icon iconfont icon-friend"></router-link>
          <router-link
            to="/collection"
            class="icon iconfont icon-collection"
          ></router-link>
        </nav>
        <footer>
          <i class="icon iconfont icon-more"></i>
        </footer>
      </section>
    </div>
    <div class="main">
      <!-- 聊天窗口 -->
      <div class="container">
        <!-- 主内容 -->
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/chat.less";
import { inject } from "vue";

export default {
  setup() {
    const user = inject("user");

    return { user };
  },
};
</script>

<style></style>
