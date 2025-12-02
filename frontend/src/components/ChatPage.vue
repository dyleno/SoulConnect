<template>
  <section class="chat-page">
    <!-- Hearts zoals op Home -->
    <div class="heart-animation">
      <span class="heart" style="left: 12%; animation-delay: 0s;">❤</span>
      <span class="heart" style="left: 30%; animation-delay: 1.5s;">❤</span>
      <span class="heart" style="left: 55%; animation-delay: 3s;">❤</span>
      <span class="heart" style="left: 75%; animation-delay: 0.8s;">❤</span>
      <span class="heart" style="left: 90%; animation-delay: 2.3s;">❤</span>
    </div>

    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            <span class="sidebar-avatar-initial">
              {{ avatarInitial }}
            </span>
          </div>
          <div class="sidebar-user-text">
            <div class="sidebar-user-name">Gebruiker</div>
            <button class="sidebar-link">Bekijk profiel</button>
          </div>
        </div>

        <nav class="nav">
          <!-- NIET actief op chat -->
          <button class="nav-item" @click="$router.push('/home')">
            <span class="nav-icon">♡</span>
            <span>Home</span>
          </button>

          <!-- WÉL actief op chat -->
          <button class="nav-item active" @click="$router.push('/chat')">
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

          <button class="nav-item" @click="$router.push('/premium')">
            <span class="nav-icon">★</span>
            <span>Premium</span>
          </button>
        </nav>

        <button class="logout-sidebar" @click="logout">Uitloggen</button>
      </aside>

      <!-- Chat Layout -->
      <main class="content">
        <header class="content-header">
          Love starts here — SoulConnect
        </header>

        <div class="content-main chat-body">
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
                <div class="match-last">
                  Laatst online {{ m.lastOnline || 'onbekend' }}
                </div>
              </div>
            </div>

            <div v-if="matches.length === 0" class="no-matches">
              Nog geen matches. Swipe wat naar rechts 😉
            </div>
          </div>

          <!-- Chat Window -->
          <div class="chat-window">
            <template v-if="activeMatch">
              <div class="chat-header">
                <div class="chat-avatar">{{ activeMatch.initial }}</div>
                <div class="chat-user">
                  <div class="chat-name">
                    {{ activeMatch.name }}, {{ activeMatch.age }}
                  </div>
                  <div class="chat-location">
                    {{ activeMatch.location || "Onbekende locatie" }}
                  </div>
                </div>

                <!-- Chat verwijderen -->
                <button
                  class="delete-chat-btn"
                  @click="deleteConversation(activeMatch)"
                  title="Verwijder chat"
                >
                  🗑
                </button>
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
import axios from "axios";

export default {
  name: "ChatPage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      newMessage: "",
      matches: [], // wordt via API gevuld
      activeMatch: null,
    };
  },
  computed: {
    displayName() {
      if (!this.user) return "Bella";
      return this.user.name || this.user.email?.split("@")[0] || "Bella";
    },
    avatarInitial() {
      const n = this.displayName;
      return n ? n.charAt(0).toUpperCase() : "S";
    },
    myProfileId() {
      return this.user?.profile_id || null;
    },
  },
  async mounted() {
    if (!this.user) {
      this.$router.push("/login");
      return;
    }
    if (!this.myProfileId) {
      console.error("Geen profile_id gevonden voor user");
      return;
    }
    await this.fetchMatches();
  },
  methods: {
    async fetchMatches() {
      try {
        // Verwacht JSON zoals:
        // [
        //   {
        //     id: 10,
        //     other_profile: { id, name, birthdate, bio, gender, interests, location? },
        //     last_online: "...",
        //     messages: [
        //       { id, match_id, sender_id, content, created_at }
        //     ]
        //   }
        // ]
        const res = await axios.get("/api/matches", {
          params: { profile_id: this.myProfileId },
        });

        this.matches = res.data.map((m) => {
          const p = m.other_profile;
          return {
            id: m.id,
            profile_id: p.id,
            name: p.name,
            age: m.age || 0, // evt. berekenen op backend uit birthdate
            location: p.location || "",
            initial: p.name?.charAt(0).toUpperCase() || "?",
            lastOnline: m.last_online || "",
            messages: (m.messages || []).map((msg) => ({
              id: msg.id,
              text: msg.content,
              time: msg.created_at,
              from: msg.sender_id === this.myProfileId ? "me" : "them",
            })),
          };
        });

        if (this.matches.length > 0) {
          this.activeMatch = this.matches[0];
        }
      } catch (err) {
        console.error("Kon matches niet ophalen", err);
      }
    },

    selectMatch(m) {
      this.activeMatch = m;
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.activeMatch || !this.myProfileId) {
        return;
      }

      const text = this.newMessage.trim();

      try {
        const res = await axios.post("/api/messages", {
          match_id: this.activeMatch.id,
          sender_id: this.myProfileId,
          content: text,
        });

        const msgFromServer = res.data; // { id, match_id, sender_id, content, created_at }

        this.activeMatch.messages.push({
          id: msgFromServer.id,
          text: msgFromServer.content,
          time: msgFromServer.created_at,
          from: "me",
        });

        this.newMessage = "";
      } catch (err) {
        console.error("Kon bericht niet versturen", err);
      }
    },

    async deleteConversation(match) {
      if (!match) return;

      if (
        !confirm(
          `Weet je zeker dat je de chat met ${match.name} permanent wilt verwijderen?`
        )
      ) {
        return;
      }

      try {
        await axios.delete(`/api/matches/${match.id}`);
        // door ON DELETE CASCADE in je SQL worden messages automatisch verwijderd

        this.matches = this.matches.filter((m) => m.id !== match.id);
        if (this.activeMatch?.id === match.id) {
          this.activeMatch = this.matches[0] || null;
        }
      } catch (err) {
        console.error("Kon match niet verwijderen", err);
      }
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* Zelfde global reset */
:global(html, body, #app) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

/* Page layout gelijk aan Home.vue, maar selector = .chat-page */
.chat-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  position: fixed;
  inset: 0;
  overflow: hidden;
}

/* Hearts */
.heart-animation {
  position: absolute;
  bottom: -10%;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.35);
  font-size: 2.2rem;
  animation: floatUp 10s linear infinite;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  100% {
    transform: translateY(-120vh) scale(1.4);
    opacity: 0;
  }
}

/* Layout */
.app-shell {
  flex: 1;
  display: flex;
  min-height: 0;
  z-index: 2;
}

/* Sidebar – identiek aan Home.vue */
.sidebar {
  width: 230px;
  background: rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  padding-top: 10px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 10px;
}

.sidebar-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
}

.sidebar-avatar-initial {
  font-weight: 700;
  font-size: 1.1rem;
}

.sidebar-user-text {
  display: flex;
  flex-direction: column;
}

.sidebar-user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.sidebar-link {
  padding: 0;
  margin-top: 2px;
  border: none;
  background: none;
  font-size: 0.75rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.nav {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  text-align: left;
  color: rgba(255, 255, 255, 0.9);
  transition: background 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.18);
}

.nav-icon {
  width: 20px;
  text-align: center;
}

.logout-sidebar {
  margin-top: auto;
  margin: 12px;
  padding: 8px 10px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  cursor: pointer;
  font-size: 0.8rem;
}

/* Content, gelijk aan Home.vue maar met chat-body erin */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-header {
  height: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 18px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  background: rgba(0, 0, 0, 0.18);
}

.content-main {
  flex: 1;
  min-height: 0;
}

/* Chat layout */
.chat-body {
  display: flex;
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

.no-matches {
  padding: 12px;
  font-size: 0.85rem;
  opacity: 0.85;
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
  margin-right: 10px;
}

.delete-chat-btn {
  margin-left: auto;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 1.1rem;
}

.delete-chat-btn:hover {
  color: #ffd1dc;
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

/* Responsive sidebar gedrag zoals Home.vue */
@media (max-width: 720px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 640px) {
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    padding-bottom: 6px;
  }

  .nav {
    flex-direction: row;
    flex: 1;
    overflow-x: auto;
  }

  .nav-item {
    flex: 1;
    justify-content: center;
  }

  .logout-sidebar {
    margin-top: 0;
  }

  .chat-body {
    flex-direction: column;
  }

  .match-list {
    width: 100%;
    max-height: 180px;
  }
}
</style>
