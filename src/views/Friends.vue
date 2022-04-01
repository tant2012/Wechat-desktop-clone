<template>
  <div class="friend-wrapper">
    <!-- 搜索框 -->
    <Search v-model="searchValue"></Search>
    <!-- 好友列表 -->
    <div class="friend-list">
      <ul>
        <li v-for="(item, index) in friends" :key="index" class="friend-item">
          <div class="list-title">{{ item.letter }}</div>
          <div
            v-for="user in item.users"
            :key="user.id"
            :class="{ active: selectedUserId === user.id }"
            @click="selectedUserId = user.id"
            class="friend-info"
          >
            <img
              width="36"
              height="36"
              :src="'/images/face/' + user.icon"
              class="avatar"
            />
            <div class="remark">{{ user.nickname }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div class="friend-info">
    <!-- 好友详情 -->
    <div class="info-wrapper">
      <div class="friend-info">
        <div class="es-info">
          <div class="left">
            <div class="people">
              <div class="nickname">{{ currentUser?.nickname }}</div>
              <div
                :class="
                  currentUser?.sex === 'male' ? 'gender-male' : 'gender-female'
                "
              ></div>
            </div>
            <div class="signature">{{ currentUser?.summary }}</div>
          </div>
          <div class="right">
            <img
              class="avatar"
              width="60"
              height="60"
              :src="'/images/face/' + currentUser?.icon"
            />
          </div>
        </div>
        <div class="detInfo">
          <div class="remark">
            <span>备&nbsp;&nbsp;&nbsp;注</span>{{ currentUser?.remark }}
          </div>
          <div class="area">
            <span>地&nbsp;&nbsp;&nbsp;区</span>{{ currentUser?.area }}
          </div>
          <div class="wxid"><span>微信号</span>{{ currentUser?.wxid }}</div>
        </div>
        <div class="send" @click="handleSend">
          <span>发消息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/friend.less";
import { computed, ref, inject } from "vue";
import Search from "../components/Search.vue";
import router from "../router";

export default {
  components: {
    Search,
  },
  setup() {
    const searchValue = ref("");

    let friends = inject("friends");
    const currentUser = computed(() => {
      let user = null;
      if (friends.value) {
        for (let i = 0; i < friends.value.length; i++) {
          const friend = friends.value[i];

          user = friend.users.find((u) => u.id === selectedUserId.value);
          if (user) {
            break;
          }
        }

        return user;
      }
    });
    let selectedUserId = ref(0);
    let recents = inject("recents");
    let user = inject("user");

    function handleSend() {
      const recent = {
        user: {
          id: this.currentUser?.id,
          nickname: this.currentUser?.nickname,
          icon: this.currentUser?.icon,
          robot: this.currentUser?.robot,
        },
        messages: [],
      };

      const index = recents.findIndex((r) => r.user.id === recent.user.id);
      if (index <= -1) {
        recents.unshift(recent);
      } else {
        const tmp = recents.splice(index, 1);
        recents.unshift(tmp[0]);
      }

      window.localStorage.setItem("recents", JSON.stringify(recents));

      router.push("/chat");
    }

    return {
      searchValue,
      friends,
      selectedUserId,
      currentUser,
      handleSend,
      recents,
      user,
      Search,
    };
  },
};
</script>

<style></style>
