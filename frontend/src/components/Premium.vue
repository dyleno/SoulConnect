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

          <button class="nav-item">
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
export default {
  name: "Premium",
  data() {
    return {
      user: JSON.parse(localStorage.getItem("user")) || null,
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
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
/* COPY EXACT SAME STYLING FROM HOME PAGE */
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
  font-family: "Inter", sans-serif;
  position: fixed;
  inset: 0;
  overflow: hidden;
}

/* Hearts animation */
.heart-animation {
  position: absolute;
  bottom: -10%;
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
  0% { transform: translateY(0) scale(0.8); opacity: 0; }
  20% { opacity: 0.9; }
  100% { transform: translateY(-120vh) scale(1.4); opacity: 0; }
}

/* Layout identical */
.app-shell {
  flex: 1;
  display: flex;
  z-index: 2;
}

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
  color: rgba(255, 255, 255, 0.9);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.18);
}

.logout-sidebar {
  margin-top: auto;
  margin: 12px;
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: none;
  color: #fff;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  height: 40px;
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
}

/* Premium card styling */
.premium-card {
  background: white;
  width: 360px;
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
  font-size: 1.2rem;
  font-weight: 600;
}

.features li {
  margin: 12px 0;
}

.buy-btn {
  margin-top: 25px;
  padding: 12px 22px;
  background: #ff1e5a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  cursor: pointer;
  width: 100%;
}
</style>
