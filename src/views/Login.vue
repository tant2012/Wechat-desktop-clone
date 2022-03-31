<template>
  <div class="container">
    <transition leave-active-class="login-active" @after-leave="afterLeave">
      <div class="login" v-if="showLogin">
        <div class="login-top">登录</div>
        <div class="login-center clearfix">
          <div class="login-center-img"><img src="images/name.png" /></div>
          <div class="login-center-input">
            <input
              type="text"
              v-model="wxid"
              placeholder="请输入您的用户名"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='请输入您的用户名'"
            />
            <div class="login-center-input-text">用户名</div>
          </div>
        </div>
        <div class="login-center clearfix">
          <div class="login-center-img"><img src="images/password.png" /></div>
          <div class="login-center-input">
            <input
              type="password"
              v-model="password"
              placeholder="请输入您的密码"
              onfocus="this.placeholder=''"
              onblur="this.placeholder='请输入您的密码'"
            />
            <div class="login-center-input-text">密码</div>
          </div>
        </div>

        <div class="login-button" @click="handleLogin">登录</div>
      </div></transition
    >

    <transition :duration="10000" enter-active-class="sk-rotating-plane-active">
      <div class="sk-rotating-plane" v-if="showRotate"></div
    ></transition>
  </div>
</template>

<script>
import "../assets/css/login.less";
import { ref, inject } from "vue";
import router from "../router";
import http from "../utils/http";

export default {
  setup() {
    let showLogin = ref(true);
    let showRotate = ref(false);
    const wxid = ref("");
    const password = ref("");
    let user = inject('user')

    async function handleLogin() {
      showLogin.value = false;

      try {
        const { data } = await http.post("/login", {
          wxid: wxid.value,
          password: password.value,
        });

        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          user = data.user;
          router.push("/chat");
        } else {
          alert("login failed");
          showLogin.value = true;
          showRotate.value = false;
        }
      } catch (e) {
        alert("server error");
        console.log(e)
      }
    }

    function afterLeave() {
      showRotate.value = true;
    }
    return { handleLogin, showLogin, showRotate, afterLeave, wxid, password, user };
  },
};
</script>

<style></style>
