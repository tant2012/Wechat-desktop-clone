<template>
  <div class="user-list">
    <!-- 搜索框 -->
    <Search v-model="searchValue"></Search>
    <!-- 聊天用户列表 -->
    <div class="msg-list">
      <ul>
        <li
          v-for="(item, index) in searchList"
          :key="item.user.id"
          :class="{ active: selectedIndex === index }"
          @click="handleChatbox(index)"
          class="session-list"
        >
          <div class="list-left">
            <img
              width="42"
              height="42"
              :alt="item.user.nickname"
              :src="'/images/face/' + item.user.icon"
              class="avatar"
            />
          </div>
          <div class="list-right">
            <p class="name">{{ item.user.nickname }}</p>
            <span class="time">{{ lastTime(item.messages) }}</span>
            <p class="last-msg">{{ lastContent(item.messages) }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="chat-list">
    <!-- 聊天内容区域 -->
    <div class="message">
      <!-- 聊天框头部 -->
      <header class="header">
        <div class="friendname">{{ currentUser?.user?.nickname }}</div>
      </header>
      <div class="message-wrapper" ref="wrapper">
        <ul>
          <li
            v-for="(msg, index) in currentUser?.messages"
            :key="index"
            class="message-item"
          >
            <div class="time">
              <span>{{ formatTime(msg.time) }}</span>
            </div>
            <div class="message-main" :class="{ self: msg.self }">
              <img
                width="36"
                height="36"
                :src="
                  msg.self
                    ? '/images/face/' + user?.icon
                    : '/images/face/' + currentUser?.user?.icon
                "
                class="avatar"
              />
              <div class="content">
                <div class="text">{{ msg.content }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 消息发送区 -->
    <div class="send-text">
      <!-- emoji -->
      <Emoji @update="handleUpdate" v-model="showEmoji"></Emoji>
      <!-- 发送消息框 -->
      <textarea
        @keypress.enter.prevent="handleSend"
        v-model="content"
        @click="showEmoji = false"
      ></textarea>
      <div class="send" @click="handleSend">
        <span>发送(Enter)</span>
      </div>
      <div class="warn" v-show="showWarn">
        <div class="description">不能发送空白信息</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/chat.less";
import { inject, ref, computed, nextTick, onMounted } from "vue";
import { io } from "socket.io-client";
import Search from "../components/Search.vue";
import Emoji from "../components/Emoji.vue";
import dayjs from "dayjs";

export default {
  components: {
    Search,
    Emoji,
  },
  setup() {
    let content = ref("");
    let showEmoji = ref(false);
    let showWarn = ref(false);
    const user = inject("user");
    const searchValue = ref("");
    let selectedIndex = ref(JSON.parse(localStorage.getItem("selectedIndex")));
    let wrapper = ref(null);
    let friends = inject("friends");
    let socket = null;

    const recents = computed(() => {
      return inject("recents");
    });
    const currentUser = computed(() => {
      return recents.value[selectedIndex.value];
    });

    const searchList = computed(() => {
      return recents.value.filter((r) =>
        r.user.nickname.startsWith(searchValue.value)
      );
    });

    function handleUpdate(code) {
      content.value += code;
    }
    function lastTime(messages) {
      return formatTime(messages[messages.length - 1]?.time);
    }
    function lastContent(messages) {
      return messages[messages.length - 1]?.content;
    }

    async function handleSend() {
      if (!currentUser.value) {
        return alert("请选择要聊天的好友");
      }
      if (content.value.trim().length <= 0) {
        showWarn.value = true;
        setTimeout(() => {
          showWarn.value = false;
        }, 2000);
      } else {
        currentUser.value.messages.push({
          time: Date.now(),
          content: content.value,
          self: true,
        });

        const index = recents.value.findIndex(
          (r) => r.user.id === currentUser.value.user.id
        );
        if (index > -1) recents.value.splice(index, 1, recents.value[index]);

        window.localStorage.setItem("recents", JSON.stringify(recents.value));

        socket.emit("message", {
          from: user.id,
          to: currentUser.value.user.id,
          content: content.value,
          type: "user",
        });
        content.value = "";

        nextTick(() => {
          this.wrapper.scrollTop = this.wrapper.scrollHeight;
        });
      }
    }

    function formatTime(time) {
      return time ? dayjs(time).format("HH:mm") : "";
    }

    function handleChatbox(index) {
      selectedIndex.value = index;
      window.localStorage.setItem(
        "selectedIndex",
        JSON.stringify(selectedIndex.value)
      );
    }

    onMounted(() => {
      socket = io("http://127.0.0.1:5500", {
        path: "/mychat",
        transports: ["websocket"],
        query: {
          user: JSON.stringify(user),
        },
      });

      socket.on("connect", () => {
        console.log("连接成功");

        socket.on("disconnect", () => {
          console.log("断开连接");
        });

        socket.on("message", ({ from, to, content, type }) => {
          let recent = recents.value.find((r) => r.user.id === from);

          if (!recent) {
            // 如果最近聊天列表中不存在，再去好友列表中查找(把friends定义到全局的state中)
            const currentUser = computed(() => {
              let user = null;
              for (let i = 0; i < friends.value.length; i++) {
                const f = friends.value[i];
                user = f.users.find((u) => u.id === from);

                if (user) {
                  break;
                }
                return user;
              }
            });
            console.log(from, to);

            // 构建最新好友列表中的项目
            recent = {
              user: {
                id: currentUser?.value?.id,
                nickname: currentUser?.value?.nickname,
                icon: currentUser?.value?.icon,
                robot: currentUser?.value?.robot,
              },
              messages: [],
            };

            // 把recent添加到recents中
            recents.value.unshift(recent);
          }

          recent.messages.push({
            self: false,
            content: content,
            time: Date.now(),
          });

          const index = recents.value.findIndex(
            (r) => r.user.id === currentUser.value.user.id
          );
          if (index > -1) recents.value.splice(index, 1, recents.value[index]);

          window.localStorage.setItem("recents", JSON.stringify(recents.value));

          this.$nextTick(() => {
            this.wrapper.scrollTop = this.wrapper.scrollHeight;
          });
        });
      });
    });
    return {
      showEmoji,
      searchValue,
      handleUpdate,
      content,
      showWarn,
      lastContent,
      lastTime,
      selectedIndex,
      currentUser,
      recents,
      handleSend,
      user,
      formatTime,
      wrapper,
      searchList,
      index,
      handleChatbox,
      socket,
      Search,
    };
  },
};
</script>

<style></style>
