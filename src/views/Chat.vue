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
          @click="selectedIndex = index"
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
import { inject, ref, computed, nextTick } from "vue";
import axios from "axios";
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
    let selectedIndex = ref(0);
    const user = inject("user");
    const searchValue = ref("");
    let wrapper = ref(null);

    const recents = computed(() => {
      return inject("recents");
    });
    const currentUser = computed(() => {
      return inject("recents")[selectedIndex.value];
    });

    const searchList = computed(() => {
      return inject("recents").filter((r) =>
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

        if (currentUser.value.user.robot) {
          const url = "/api/v2";
          const postData = {
            reqType: 0,
            perception: {
              inputText: {
                text: content.value,
              },
              selfInfo: {
                location: {
                  city: "河北省",
                  province: "邯郸市",
                  street: "中华路",
                },
              },
            },
            userInfo: {
              apiKey: "25d308027eb147d6b440b78db3d8ab23",
              userId: 123,
            },
          };
          const { data } = await axios.post(url, postData);
          currentUser.value.messages.push({
            time: Date.now(),
            content: data.results[0].values.text,
            self: false,
          });
        }

        content.value = "";

        nextTick(() => {
          this.wrapper.scrollTop = this.wrapper.scrollHeight;
        });
      }
    }

    function formatTime(time) {
      return time ? dayjs(time).format("HH:mm") : "";
    }

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
      Search,
    };
  },
};
</script>

<style></style>
