<template>
  <section class="chat-page">
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            <span class="sidebar-avatar-initial">{{ userInitial }}</span>
          </div>
          <div class="sidebar-user-text">
            <div class="sidebar-user-name">Gebruiker</div>
            <button class="sidebar-link">Bekijk profiel</button>
          </div>
        </div>

        <nav class="nav">
          <button class="nav-item" @click="$router.push('/home')">
            <span class="nav-icon">♡</span>
            <span>Home</span>
          </button>

          <button class="nav-item active">
            <span class="nav-icon">💬</span>
            <span>Berichten</span>
          </button>

          <button class="nav-item">
            <span class="nav-icon">🔍</span>
            <span>Zoeken</span>
          </button>

          <button class="nav-item">
            <span class="nav-icon">⚙️</span>
            <span>Instellingen</span>
          </button>

          <button class="nav-item">
            <span class="nav-icon">★</span>
            <span>Premium</span>
          </button>
        </nav>

        <button class="logout-sidebar" @click="logout">Uitloggen</button>
      </aside>

      <!-- Chat Layout -->
      <main class="chat-content">
        <header class="content-header">
          Love starts here — SoulConnect
        </header>

        <div class="chat-body">
          <!-- Matches List -->
          <div class="match-list">
            <div class="match-list-header">Alle Matches</div>

            <div
              v-for="m in matches"
              :key="m.id"
              class="match-item"
              :class="{ selected: m.id === activeMatch?.id }"
              @click="selectMatch(m)"
            >
              <div class="match-avatar">{{ m.initial }}</div>
              <div class="match-info">
                <div class="match-name">{{ m.name }}, {{ m.age }}</div>
                <div class="match-last">Laatst online {{ m.lastOnline }}</div>
              </div>
            </div>
          </div>

          <!-- Chat Window -->
          <div class="chat-window">
            <template v-if="activeMatch">
              <div class="chat-header">
                <div class="chat-avatar">{{ activeMatch.initial }}</div>
                <div class="chat-user">
                  <div class="chat-name">{{ activeMatch.name }}, {{ activeMatch.age }}</div>
                  <div class="chat-location">{{ activeMatch.location }}</div>
                </div>
              </div>

              <div class="messages">
                <div
                  v-for="msg in activeMatch.messages"
                  :key="msg.id"
                  class="message"
                  :class="msg.from === 'me' ? 'me' : 'them'"
                >
                  <div class="msg-text">{{ msg.text }}</div>
                  <div class="msg-time">{{ msg.time }}</div>
                </div>
              </div>

              <!-- Input -->
              <div class="input-bar">
                <input
                  type="text"
                  v-model="newMessage"
                  placeholder="Typ een bericht..."
                  @keyup.enter="sendMessage"
                />
                <button class="send-btn" @click="sendMessage">✈️</button>
              </div>
            </template>

            <template v-else>
              <div class="empty-chat">Selecteer een match om te beginnen ✨</div>
            </template>
          </div>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
export default {
  name: "ChatPage",
  data() {
    return {
      userInitial: "G",
      newMessage: "",
      matches: [
        {
          id: 1,
          name: "Lotte",
          age: 19,
          initial: "L",
          lastOnline: "13 min geleden",
          location: "Limburg",
          messages: [
            { id: 1, text: "Heyy", time: "56 min geleden", from: "them" },
            { id: 2, text: "Jij altijd hihi x", time: "zojuist", from: "me" }
          ]
        }
      ],
      activeMatch: null
    };
  },
  methods: {
    selectMatch(m) {
      this.activeMatch = m;
    },
    sendMessage() {
      if (!this.newMessage.trim()) return;

      this.activeMatch.messages.push({
        id: Date.now(),
        text: this.newMessage,
        time: "zojuist",
        from: "me"
      });

      this.newMessage = "";
    },
    logout() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
/* Reuse your SoulConnect styling colors */
.chat-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  color: white;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

.app-shell {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Sidebar matches Home.vue */
.sidebar {
  width: 230px;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

.sidebar-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.18);
}

.logout-sidebar {
  margin-top: auto;
  margin: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 20px;
  border: none;
  color: white;
}

/* Chat layout */
.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.18);
  font-size: 0.9rem;
}

.chat-body {
  display: flex;
  flex: 1;
  height: 100%;
}

/* Matches list */
.match-list {
  width: 260px;
  background: rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.25);
  overflow-y: auto;
}

.match-list-header {
  padding: 12px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.match-item {
  display: flex;
  padding: 12px;
  gap: 10px;
  cursor: pointer;
}
.match-item.selected {
  background: rgba(255, 255, 255, 0.2);
}

.match-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.match-info {
  display: flex;
  flex-direction: column;
  font-size: 0.85rem;
}

/* Chat window */
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.22);
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.chat-avatar {
  width: 46px;
  height: 46px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
}

.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 60%;
  padding: 12px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
}

.message.me {
  align-self: flex-end;
  background: #ff8cab;
}

.message.them {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.3);
}

.msg-time {
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* Input */
.input-bar {
  display: flex;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(0, 0, 0, 0.15);
}

input {
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 0.9rem;
}

.send-btn {
  margin-left: 10px;
  background: white;
  border: none;
  padding: 10px 14px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
