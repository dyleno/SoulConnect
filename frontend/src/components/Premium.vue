<template>
  <section class="home">
    <!-- Floating hearts like homepage -->
    <div class="heart-animation">
      <span class="heart" style="left: 12%; animation-delay: 0s;">❤</span>
      <span class="heart" style="left: 30%; animation-delay: 1.5s;">❤</span>
      <span class="heart" style="left: 55%; animation-delay: 3s;">❤</span>
      <span class="heart" style="left: 75%; animation-delay: 0.8s;">❤</span>
      <span class="heart" style="left: 90%; animation-delay: 2.3s;">❤</span>
    </div>

    <div class="app-shell">
      <!-- SAME SIDEBAR AS HOME -->
      <aside class="sidebar">
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            <!-- PROFIELFOTO IN SIDEBAR -->
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
            <div class="sidebar-user-name">{{ displayName }}</div>
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

          <button class="nav-item active" @click="$router.push('/premium')">
            <span class="nav-icon">★</span>
            <span>Premium</span>
          </button>
        </nav>

        <button class="logout-sidebar" @click="logout">
          Uitloggen
        </button>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="content">
        <header class="content-header">
          Word Premium — SoulConnect
        </header>

        <section class="content-main">
          <div class="premium-card">
            <div class="price-tag">€7,99/m</div>

            <ul class="features">
              <li>Alle berichtenfuncties</li>
              <li>Oneindige likes</li>
              <li>Meer matches</li>
              <li>Premium badge</li>
            </ul>

            <button class="buy-btn">
              Activeer Premium
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
  name: "Premium",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
      photoUrl: "", // profielfoto in sidebar
    };
  },
  computed: {
    displayName() {
      if (!this.user) return "Gebruiker";
      return this.user.name || this.user.email?.split("@")[0] || "Gebruiker";
    },
    avatarInitial() {
      const n = this.displayName;
      return n ? n.charAt(0).toUpperCase() : "S";
    },
  },
  async mounted() {
    if (!this.user) {
      this.$router.push("/login");
      return;
    }
    await this.loadMyPhoto();
  },
  methods: {
    async loadMyPhoto() {
      if (!this.user?.profile_id) return;
      try {
        const res = await axios.get(
          `${API_BASE}/api/photos/${this.user.profile_id}`
        );
        const data = res.data;
        if (data && data.image_url) {
          this.photoUrl = API_BASE + data.image_url;
        }
      } catch (e) {
        console.warn("Geen profielfoto gevonden voor premium sidebar");
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
:global(html, body, #app) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: transparent;
}

/* Zelfde page layout als Home.vue */
.home {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
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

/* Content identiek aan Home.vue */
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
  align-items: center;
  justify-content: center;
  padding: 10px 16px 32px;
  min-height: 0;
}

/* Premium card styling */
.premium-card {
  background: white;
  width: 360px;
  max-width: 100%;
  padding: 35px;
  border-radius: 20px;
  text-align: center;
  color: #ff1e5a;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.3);
}

.price-tag {
  font-size: 2.4rem;
  font-weight: 900;
}

.features {
  list-style: none;
  padding: 0;
  margin-top: 20px;
  color: #444;
  font-size: 1.1rem;
  font-weight: 600;
}

.features li {
  margin: 10px 0;
}

.buy-btn {
  margin-top: 25px;
  padding: 12px 22px;
  background: #ff1e5a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
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
