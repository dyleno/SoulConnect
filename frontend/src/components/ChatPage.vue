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
            <!-- FOTO ALS DIE BESTAAT, ANDERS INITIAAL -->
            <span class="sidebar-avatar-initial" v-if="!photoUrl">
              {{ avatarInitial }}
            </span>
            <img
              v-else
              :src="photoUrl"
              alt="Profielfoto"
              class="sidebar-avatar-image"
            />
          </div>
          <div class="sidebar-user-text">
            <div class="sidebar-user-name">{{ sidebarName }}</div>
            <button class="sidebar-link" @click="$router.push('/profiel')">
              Bekijk profiel
            </button>
          </div>
        </div>

        <nav class="nav">
          <button class="nav-item" @click="$router.push('/home')">
            <span class="nav-icon">♡</span>
            <span>Home</span>
          </button>

          <button class="nav-item active" @click="$router.push('/chat')">
            <span class="nav-icon">💬</span>
            <span>Berichten</span>
          </button>

          <button class="nav-item">
            <span class="nav-icon">🔍</span>
            <span>Zoeken</span>
          </button>

          <button class="nav-item" @click="$router.push('/instellingen')">
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
          <!-- Match lijst -->
          <div class="match-list">
            <div class="match-list-header">Alle Matches</div>

            <div
              v-for="m in matches"
              :key="m.id"
              class="match-item"
              :class="{ selected: activeMatch && m.id === activeMatch.id }"
              @click="selectMatch(m)"
            >
              <div class="match-avatar" @click.stop="openProfileCard(m.profile)">
                <!-- FOTO VAN ANDER PROFIEL OF INITIAAL -->
                <img
                  v-if="m.profile.photoUrl"
                  :src="m.profile.photoUrl"
                  alt="Profielfoto"
                  class="match-avatar-img"
                />
                <span v-else>
                  {{ m.profile.name.charAt(0).toUpperCase() }}
                </span>
              </div>
              <div class="match-info">
                <div class="match-name">
                  {{ m.profile.name }}, {{ m.profile.age }}
                </div>
                <div class="match-last">
                  Laatst online
                  {{ formatLastOnline(m.profile.last_online) }}
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
                <div
                  class="chat-avatar"
                  @click="openProfileCard(activeMatch.profile)"
                >
                  <!-- FOTO VAN ANDER PROFIEL OF INITIAAL -->
                  <img
                    v-if="activeMatch.profile.photoUrl"
                    :src="activeMatch.profile.photoUrl"
                    alt="Profielfoto"
                    class="chat-avatar-img"
                  />
                  <span v-else>
                    {{ activeMatch.profile.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div class="chat-user">
                  <div class="chat-name">
                    {{ activeMatch.profile.name }},
                    {{ activeMatch.profile.age }}
                  </div>
                  <div class="chat-location">
                    {{ activeMatch.profile.location || "Onbekende locatie" }}
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

              <!-- MESSAGES -->
              <div class="messages" ref="messagesContainer">
                <div
                  v-for="msg in activeMatch.messages"
                  :key="msg.id"
                  class="message"
                  :class="msg.from === 'me' ? 'me' : 'them'"
                >
                  <div class="msg-text">{{ msg.text }}</div>
                  <div class="msg-time">
                    {{ formatMessageTime(msg.time) }}
                  </div>
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
              <div class="empty-chat">
                Selecteer een match om te beginnen ✨
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>

    <!-- PROFIEL-KAART MODAL -->
    <transition name="modal-fade">
      <div
        v-if="showProfileCard && modalProfile"
        class="profile-modal"
        @click.self="closeProfileCard"
      >
        <div class="profile-card-zoom">
          <button class="profile-close" @click="closeProfileCard">
            ✕
          </button>

          <div class="profile-card-inner">
            <!-- Foto -->
            <div class="profile-photo-container">
              <img
                v-if="modalProfile.photoUrl"
                :src="modalProfile.photoUrl"
                alt="Profielfoto"
                class="profile-main-photo"
              />
              <div v-else class="profile-photo-fallback">
                {{ modalProfile.name.charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Info overlay -->
            <div class="profile-info">
              <h2 class="profile-name-line">
                {{ modalProfile.name }}
                <span class="profile-age">{{ modalProfile.age }}</span>
              </h2>

              <p class="profile-tagline">
                {{ modalTagline }}
              </p>

              <div class="profile-tags" v-if="modalTags.length">
                <span
                  v-for="tag in modalTags"
                  :key="tag"
                  class="profile-tag"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="profile-extra">
                <span v-if="modalProfile.location">📍 {{ modalProfile.location }}</span>
                <span v-if="modalProfile.gender">⚧ {{ modalProfile.gender }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";

const API_BASE = "http://localhost:3000";

export default {
  name: "ChatPage",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      newMessage: "",
      matches: [], // [{ id, profile: {...}, messages: [...] }]
      activeMatch: null,
      photoUrl: "", // profielfoto in sidebar
      showProfileCard: false,
      modalProfile: null,
      socket: null, // <== Socket.IO client
    };
  },
  computed: {
    myProfileId() {
      return this.user?.profile_id || null;
    },
    sidebarName() {
      if (!this.user) return "Gebruiker";
      return (
        this.user.name ||
        this.user.email?.split("@")[0] ||
        "Gebruiker"
      );
    },
    avatarInitial() {
      const n = this.sidebarName;
      return n ? n.charAt(0).toUpperCase() : "G";
    },
    modalTagline() {
      if (!this.modalProfile) return "";
      return this.modalProfile.bio || "Nog geen bio ingevuld.";
    },
    modalTags() {
      if (!this.modalProfile) return [];
      const ints = this.modalProfile.tags || this.modalProfile.interests;
      if (Array.isArray(ints)) return ints;
      if (typeof ints === "string") {
        return ints
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
      return [];
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

    // socket connect
    this.socket = io(API_BASE);

    this.socket.on("connect", () => {
      console.log("Socket connected", this.socket.id);
    });

    // nieuwe messages realtime ontvangen
    this.socket.on("message_created", (msg) => {
      const match = this.matches.find((m) => m.id === msg.match_id);
      if (!match) return;

      match.messages.push({
        id: msg.id,
        text: msg.content,
        time: msg.created_at,
        from: msg.sender_id === this.myProfileId ? "me" : "them",
      });

      if (this.activeMatch && this.activeMatch.id === msg.match_id) {
        this.$nextTick(() => this.scrollToBottom());
      }
    });

    this.socket.on("message_error", (err) => {
      console.error("Socket message error", err);
    });

    // Matches én eigen foto ophalen
    await Promise.all([this.fetchMatches(), this.loadPhoto()]);
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    async fetchMatches() {
      try {
        const res = await axios.get(`${API_BASE}/api/matches`, {
          params: { profile_id: this.myProfileId },
        });

        const baseMatches = res.data.map((m) => ({
          id: m.id,
          profile: {
            ...m.profile,
            tags:
              Array.isArray(m.profile.interests) ||
              m.profile.interests instanceof Array
                ? m.profile.interests
                : typeof m.profile.interests === "string"
                ? m.profile.interests
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
          },
          messages: (m.messages || []).map((msg) => ({
            id: msg.id,
            text: msg.content,
            time: msg.created_at,
            from: msg.sender_id === this.myProfileId ? "me" : "them",
          })),
        }));

        const matchesWithPhotos = await Promise.all(
          baseMatches.map(async (m) => {
            try {
              const photoRes = await axios.get(
                `${API_BASE}/api/photos/${m.profile.id}`
              );
              const data = photoRes.data;
              if (data && data.image_url) {
                m.profile.photoUrl = API_BASE + data.image_url;
              } else {
                m.profile.photoUrl = null;
              }
            } catch (e) {
              console.warn("Geen foto voor match-profiel", m.profile.id);
              m.profile.photoUrl = null;
            }
            return m;
          })
        );

        this.matches = matchesWithPhotos;

        if (this.matches.length > 0) {
          this.activeMatch = this.matches[0];

          // join room voor eerste match
          if (this.socket && this.activeMatch) {
            this.socket.emit("join_match", this.activeMatch.id);
          }

          this.$nextTick(() => this.scrollToBottom());
        }
      } catch (err) {
        console.error("Kon matches niet ophalen", err);
      }
    },

    async loadPhoto() {
      if (!this.user?.profile_id) return;

      try {
        const photoRes = await axios.get(
          `${API_BASE}/api/photos/${this.user.profile_id}`
        );
        const data = photoRes.data;
        if (data && data.image_url) {
          this.photoUrl = API_BASE + data.image_url;
        }
      } catch (e) {
        console.warn("Geen foto gevonden voor dit profiel");
      }
    },

    selectMatch(m) {
      if (this.socket && this.activeMatch) {
        this.socket.emit("leave_match", this.activeMatch.id);
      }

      this.activeMatch = m;

      if (this.socket && this.activeMatch) {
        this.socket.emit("join_match", this.activeMatch.id);
      }

      this.$nextTick(() => this.scrollToBottom());
    },

    async sendMessage() {
      if (!this.newMessage.trim() || !this.activeMatch || !this.myProfileId) {
        return;
      }

      const payload = {
        match_id: this.activeMatch.id,
        sender_id: this.myProfileId,
        content: this.newMessage.trim(),
      };

      if (this.socket && this.socket.connected) {
        this.socket.emit("send_message", payload);
      } else {
        console.warn("Socket niet verbonden, kan bericht niet realtime sturen");
      }

      this.newMessage = "";
      // server stuurt het bericht terug via "message_created"
    },

    async deleteConversation(match) {
      if (!match) return;

      if (
        !confirm(
          `Weet je zeker dat je de chat met ${match.profile.name} permanent wilt verwijderen?`
        )
      ) {
        return;
      }

      try {
        await axios.delete(`${API_BASE}/api/matches/${match.id}`);

        if (this.socket) {
          this.socket.emit("leave_match", match.id);
        }

        this.matches = this.matches.filter((m) => m.id !== match.id);
        if (this.activeMatch?.id === match.id) {
          this.activeMatch = this.matches[0] || null;

          if (this.activeMatch && this.socket) {
            this.socket.emit("join_match", this.activeMatch.id);
          }

          this.$nextTick(() => this.scrollToBottom());
        }
      } catch (err) {
        console.error("Kon match niet verwijderen", err);
      }
    },

    formatLastOnline(ts) {
      if (!ts) return "onbekend";

      const d = new Date(ts);
      const now = new Date();
      const diffMs = now - d;
      const diffMin = Math.floor(diffMs / 60000);
      const diffH = Math.floor(diffMin / 60);
      const diffD = Math.floor(diffH / 24);

      if (diffMin < 1) return "zojuist";
      if (diffMin < 60) return `${diffMin} min geleden`;
      if (diffH < 24) return `${diffH} uur geleden`;
      return `${diffD} dagen geleden`;
    },

    formatMessageTime(ts) {
      if (!ts) return "";
      const d = new Date(ts);
      const h = d.getHours().toString().padStart(2, "0");
      const m = d.getMinutes().toString().padStart(2, "0");
      return `${h}:${m}`;
    },

    scrollToBottom() {
      const el = this.$refs.messagesContainer;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    },

    openProfileCard(profile) {
      if (!profile) return;
      this.modalProfile = profile;
      this.showProfileCard = true;
    },

    closeProfileCard() {
      this.showProfileCard = false;
      this.modalProfile = null;
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
  overflow: hidden;
}

.sidebar-avatar-initial {
  font-weight: 700;
  font-size: 1.1rem;
}

/* FOTO in sidebar */
.sidebar-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Content */
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
  overflow: hidden;
  cursor: pointer;
}

/* FOTO bij match */
.match-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  overflow: hidden;
  cursor: pointer;
}

/* FOTO in chat header */
.chat-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Messages – invisible scrollbar + smooth */
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  scrollbar-width: none; /* Firefox */
  scroll-behavior: smooth;
}

.messages::-webkit-scrollbar {
  display: none; /* Chrome / Edge / Safari */
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
  background: #df406a;
}

.message.them {
  align-self: flex-start;
  background: rgba(202, 58, 58, 0.3);
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

/* PROFIEL MODAL */
.profile-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.profile-card-zoom {
  width: min(420px, 100% - 32px);
  aspect-ratio: 3 / 4;
  border-radius: 30px;
  background: #000;
  overflow: hidden;
  position: relative;
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.7);
}

.profile-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

/* close button */
.profile-close {
  position: absolute;
  top: 12px;
  right: 14px;
  z-index: 3;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  cursor: pointer;
}

/* foto */
.profile-photo-container {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.profile-main-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-photo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  background: rgba(0, 0, 0, 0.5);
}

/* info overlay */
.profile-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 20px 20px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.55) 35%,
    rgba(0, 0, 0, 0.95) 100%
  );
  z-index: 2;
}

.profile-name-line {
  font-size: 1.7rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.profile-age {
  font-size: 1.3rem;
  font-weight: 600;
}

.profile-tagline {
  margin-top: 6px;
  font-size: 0.95rem;
  opacity: 0.95;
}

.profile-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.profile-tag {
  font-size: 0.78rem;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.profile-extra {
  margin-top: 10px;
  font-size: 0.8rem;
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* modal animatie */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .profile-card-zoom,
.modal-fade-leave-active .profile-card-zoom {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.modal-fade-enter-from .profile-card-zoom {
  transform: translateY(20px) scale(0.92);
  opacity: 0.6;
}

.modal-fade-leave-to .profile-card-zoom {
  transform: translateY(10px) scale(0.95);
  opacity: 0.7;
}

/* Responsive gedrag zoals Home.vue */
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
