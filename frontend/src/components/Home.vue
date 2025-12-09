<template>
  <section class="home">
    <!-- hearts -->
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
            <!-- Foto van JOU in sidebar -->
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
          <button class="nav-item active">
            <span class="nav-icon">♡</span>
            <span>Home</span>
          </button>
          <button class="nav-item" @click="$router.push('/chat')">
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

        <button class="logout-sidebar" @click="logout">
          Uitloggen
        </button>
      </aside>

      <!-- Content -->
      <main class="content">
        <header class="content-header">
          Love starts here — SoulConnect
        </header>

        <section class="content-main">
          <!-- KAART MET DYNAMISCHE TRANSITION -->
          <transition :name="transitionName" mode="out-in">
            <!-- er is nog een profiel -->
            <div
              v-if="currentProfile"
              :key="currentProfile.id"
              :class="['card', { 'card--expanded': isExpanded }]"
              @click="toggleExpand"
            >
              <div class="card-gradient"></div>

              <!-- Foto -->
              <div class="photo-container">
                <img
                  v-if="currentProfile.photoUrl"
                  :src="currentProfile.photoUrl"
                  alt="Profielfoto"
                  class="main-photo"
                />
                <div v-else class="photo-fallback">
                  {{ profileInitial }}
                </div>
              </div>

              <!-- Info overlay -->
              <div class="card-info">
                <h2 class="name-line">
                  {{ currentProfile.name }}
                  <span class="age">{{ currentProfile.age }}</span>
                </h2>

                <!-- tagline + interesses alleen in normale mode -->
                <div
                  class="extra-info"
                  :class="{ 'extra-info--hidden': isExpanded }"
                >
                  <p class="tagline">
                    {{ currentProfile.tagline }}
                  </p>

                  <div class="tags">
                    <span
                      v-for="tag in currentProfile.tags"
                      :key="tag"
                      class="tag"
                    >
                      {{ tag }}
                    </span>
                  </div>

                  <div class="card-footer">
                    <div class="pill">
                      Ingelogd als
                      <span class="pill-email">{{ user?.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- alle profielen geswipet -->
            <div v-else class="card card--empty" key="no-profiles">
              <div class="card-gradient"></div>
              <div class="card-info card-info--empty">
                <h2 class="name-line">Geen profielen meer</h2>
                <p class="tagline">
                  Je hebt alle profielen geswipet 🎉
                </p>
                <div class="tags">
                  <span class="tag">Kom later terug voor meer matches</span>
                </div>
              </div>
            </div>
          </transition>

          <!-- Swipe knoppen -->
          <div class="swipe-controls">
            <button
              class="circle-btn small undo"
              title="Terug"
              @click.stop="undoSwipe"
              :disabled="currentIndex === 0"
            >
              ↺
            </button>
            <button
              class="circle-btn large nope"
              title="Geen interesse"
              @click.stop="swipe('nope')"
              :disabled="!currentProfile"
            >
              ❌
            </button>
            <button
              class="circle-btn large like"
              title="Like"
              @click.stop="swipe('like')"
              :disabled="!currentProfile"
            >
              ❤️
            </button>
            <button
              class="circle-btn small superlike"
              title="Super like"
              @click.stop="swipe('superlike')"
              :disabled="!currentProfile"
            >
              ⭐
            </button>
          </div>
        </section>
      </main>
    </div>
  </section>
</template>

<script>
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default {
  name: "HomePage",
  data() {
    return {
      user: null,
      profiles: [],
      currentIndex: 0,
      lastSwipe: "neutral",
      photoUrl: "", // jouw eigen profielfoto in de sidebar
      isExpanded: false, // kaart uitgeklapt of niet
    };
  },
  computed: {
    currentProfile() {
      return this.profiles[this.currentIndex] || null;
    },
    profileInitial() {
      return this.currentProfile?.name?.charAt(0).toUpperCase() || "?";
    },
    myProfileId() {
      return this.user?.profile_id || null;
    },
    sidebarName() {
      if (!this.user) return "Gebruiker";
      return this.user.name || this.user.email?.split("@")[0] || "Gebruiker";
    },
    avatarInitial() {
      const n = this.sidebarName;
      return n ? n.charAt(0).toUpperCase() : "G";
    },
    transitionName() {
      if (this.lastSwipe === "like" || this.lastSwipe === "superlike")
        return "swipe-right";
      if (this.lastSwipe === "nope") return "swipe-left";
      return "card-swipe";
    },
  },

  async mounted() {
    const stored = localStorage.getItem("user");
    if (!stored) return this.$router.push("/login");

    this.user = JSON.parse(stored);

    await Promise.all([this.loadProfiles(), this.loadMyPhoto()]);
  },

  methods: {
    async loadProfiles() {
      if (!this.myProfileId) return;

      const res = await axios.get(
        `${API_BASE}/api/profiles/random?profile_id=${this.myProfileId}`
      );

      const basicProfiles = res.data.map((p) => ({
        ...p,
        tagline: p.bio || "Geen bio ingevuld",
        tags:
          Array.isArray(p.interests) || p.interests instanceof Array
            ? p.interests
            : typeof p.interests === "string"
            ? p.interests
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
        photoUrl: null,
      }));

      // voor elk profiel proberen we een foto op te halen
      const profilesWithPhotos = await Promise.all(
        basicProfiles.map(async (p) => {
          try {
            const photoRes = await axios.get(`${API_BASE}/api/photos/${p.id}`);
            const data = photoRes.data;
            if (data && data.image_url) {
              return {
                ...p,
                photoUrl: API_BASE + data.image_url,
              };
            }
          } catch (e) {
            console.warn("Geen foto gevonden voor profiel", p.id);
          }
          return p;
        })
      );

      this.profiles = profilesWithPhotos;
      this.currentIndex = 0;
      this.isExpanded = false;
    },

    // jouw eigen foto voor de sidebar
    async loadMyPhoto() {
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
        console.warn("Geen foto gevonden voor jouw profiel");
      }
    },

    async swipe(action) {
      if (!this.currentProfile) return;

      this.lastSwipe = action;
      this.isExpanded = false; // terug naar normale view bij swipe

      if ((action === "like" || action === "superlike") && this.myProfileId) {
        await axios.post(`${API_BASE}/api/matches`, {
          profile_id_1: this.myProfileId,
          profile_id_2: this.currentProfile.id,
        });
      }

      this.currentIndex++;
    },

    undoSwipe() {
      if (this.currentIndex > 0) {
        this.lastSwipe = "neutral";
        this.currentIndex--;
        this.isExpanded = false;
      }
    },

    toggleExpand() {
      if (!this.currentProfile) return;
      this.isExpanded = !this.isExpanded;
    },

    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
:global(html, body, #app) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

.home {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
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

/* Sidebar */
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

/* Content rechts */
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 16px 32px;
  min-height: 0;
}

/* Kaart */
.card {
  position: relative;
  width: min(420px, 100%);
  aspect-ratio: 3 / 4;
  background: #222;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  cursor: zoom-in;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.card:not(.card--expanded):hover {
  transform: translateY(-6px) scale(1.03);
  box-shadow: 0 22px 52px rgba(0, 0, 0, 0.45);
}

.card--expanded {
  transform: translateY(-14px) scale(1.1);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.6);
  cursor: zoom-out;
}

.card--empty {
  cursor: default;
}

.card-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 0%, #ffb6c9 0, transparent 55%),
    radial-gradient(circle at 90% 0%, #ffd1dc 0, transparent 60%);
  z-index: 0;
}

/* Foto */
.photo-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.main-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.card--expanded .main-photo {
  transform: scale(1.08);
}

.photo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  background: rgba(0, 0, 0, 0.4);
}

/* Info overlay (kleine, lage zwarte balk) */
.card-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px 20px 14px;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.55) 35%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 2;
}

.card-info--empty {
  background: rgba(0, 0, 0, 0.7);
}

/* alleen naam + leeftijd blijven in expanded mode */
.name-line {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.age {
  font-size: 1.25rem;
  font-weight: 600;
}

/* tagline/interesses/fp info blok */
.extra-info {
  margin-top: 6px;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.extra-info--hidden {
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
}

.tagline {
  font-size: 0.9rem;
  opacity: 0.9;
}

.tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  font-size: 0.72rem;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-footer {
  margin-top: 10px;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pill-email {
  font-weight: 600;
}

/* Swipe controls */
.swipe-controls {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
}

.circle-btn {
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: white;
  color: #ff1e5a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  transition: 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-btn.small {
  width: 58px;
  height: 58px;
  font-size: 1.6rem;
}

.circle-btn.large {
  width: 80px;
  height: 80px;
  font-size: 2rem;
}

.circle-btn.undo {
  color: #f6c945;
}

.circle-btn.nope {
  color: #ff3b3b;
}

.circle-btn.like {
  color: #24c476;
}

.circle-btn.superlike {
  color: #3ec5ff;
}

.circle-btn:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
}

.circle-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.97);
}

.circle-btn:disabled {
  opacity: 0.4;
  cursor: default;
  box-shadow: none;
}

/* TRANSITIONS tussen profielen */
.card-swipe-enter-active,
.card-swipe-leave-active {
  transition: all 0.35s ease;
}

.card-swipe-enter-from {
  opacity: 0;
  transform: translateY(25px) scale(0.96);
}

.card-swipe-leave-to {
  opacity: 0;
  transform: translateY(-25px) scale(0.96);
}

/* swipe LINKS */
.swipe-left-enter-active,
.swipe-left-leave-active {
  transition: all 0.35s ease;
}

.swipe-left-enter-from {
  opacity: 0;
  transform: translateX(60px) scale(0.96);
}

.swipe-left-leave-to {
  opacity: 0;
  transform: translateX(-140px) rotate(-10deg) scale(0.9);
}

/* swipe RECHTS */
.swipe-right-enter-active,
.swipe-right-leave-active {
  transition: all 0.35s ease;
}

.swipe-right-enter-from {
  opacity: 0;
  transform: translateX(-60px) scale(0.96);
}

.swipe-right-leave-to {
  opacity: 0;
  transform: translateX(140px) rotate(10deg) scale(0.9);
}

/* Responsiveness */
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

  .content-main {
    padding-inline: 8px;
  }
}
</style>
