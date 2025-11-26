<template>
  <section class="home">
    <!-- Floating hearts achter alles -->
    <div class="heart-animation">
      <span class="heart" style="left: 12%; animation-delay: 0s;">❤</span>
      <span class="heart" style="left: 30%; animation-delay: 1.5s;">❤</span>
      <span class="heart" style="left: 55%; animation-delay: 3s;">❤</span>
      <span class="heart" style="left: 75%; animation-delay: 0.8s;">❤</span>
      <span class="heart" style="left: 90%; animation-delay: 2.3s;">❤</span>
    </div>

    

    <div class="app-shell">
      <!-- Sidebar zoals wireframe -->
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
          <button class="nav-item active">
            <span class="nav-icon">♡</span>
            <span>Home</span>
          </button>
          <button class="nav-item">
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

        <button class="logout-sidebar" @click="logout">
          Uitloggen
        </button>
      </aside>

      <!-- Hoofdcontent -->
      <main class="content">
        <header class="content-header">
          Love starts here — SoulConnect
        </header>

        <section class="content-main">
          <!-- Tinder-achtige kaart -->
          <div class="card">
            <div class="card-gradient"></div>

            <div class="card-top">
              <div class="avatar-circle">
                <span class="avatar-initial">
                  {{ avatarInitial }}
                </span>
              </div>
            </div>

            <div class="card-info">
              <h2 class="name-line">
                {{ displayName }}
                <span v-if="displayAge" class="age">{{ displayAge }}</span>
              </h2>
              <p class="tagline">
                Klaar om echte vibes te swipen 🔥
              </p>

              <div class="tags">
                <span class="tag">✨ New here</span>
                <span class="tag">💬 Open voor chat</span>
                <span class="tag">❤️ SoulConnect member</span>
              </div>
            </div>

            <div class="card-footer">
              <div class="pill">
                Ingelogd als
                <span class="pill-email">{{ user?.email }}</span>
              </div>
            </div>
          </div>

          <!-- Swipe knoppen zoals wireframe, in jouw stijl -->
          <div class="swipe-controls">
            <button class="circle-btn small undo" title="Terug">
              ↺
            </button>
            <button class="circle-btn large nope" title="Geen interesse">
              ❌
            </button>
            <button class="circle-btn large like" title="Like">
              ❤️
            </button>
            <button class="circle-btn small superlike" title="Super like">
              ⭐
            </button>
          </div>

          
        </section>
      </main>
    </div>
  </section>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      user: null,
    };
  },
  computed: {
    displayName() {
      if (!this.user) return "Bella";
      return this.user.name || this.user.email?.split("@")[0] || "Bella";
    },
    displayAge() {
      if (!this.user || !this.user.age) return 21;
      return `${this.user.age}`;
    },
    avatarInitial() {
      const n = this.displayName;
      return n ? n.charAt(0).toUpperCase() : "S";
    },
  },
  mounted() {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        this.user = JSON.parse(stored);
      } catch (e) {
        console.error("Kon user niet parsen uit localStorage", e);
        this.user = null;
      }
    }

    if (!this.user) {
      this.$router.push("/login");
    }
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
/* zorg dat er niets "achter" .home zichtbaar is */
:global(html, body, #app) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;     /* geen scrollbars */
  background: transparent;  /* geen zwarte achtergrond */
}

/* Home vult altijd het volledige scherm */
.home {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  display: flex;
  flex-direction: column;
  color: #fff;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  position: fixed;   /* <<< belangrijk */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;  /* geen scrollbars binnen de home zelf */
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

/* Browser bar (bovenste) */
.browser-bar {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 3;
}

.browser-left {
  display: flex;
  gap: 4px;
}

.browser-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.browser-title {
  font-weight: 600;
  font-size: 0.9rem;
}

.browser-url {
  flex: 1;
  margin: 0 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.35);
  font-size: 0.8rem;
}

.browser-search {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Layout */
.app-shell {
  flex: 1;
  display: flex;
  min-height: 0; /* voorkomt scroll */
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

/* Nav */
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

/* Kaart en styling: uit je eerste versie */
.card {
  position: relative;
  width: min(420px, 100%);
  aspect-ratio: 3 / 4;
  background: #222;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: cardPop 0.8s ease-out forwards;
}

@keyframes cardPop {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.95) rotate(-1deg);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

.card-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 0%, #ffb6c9 0, transparent 50%),
    radial-gradient(circle at 90% 0%, #ffd1dc 0, transparent 55%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.2), #000);
  z-index: 0;
}

.card-top {
  position: relative;
  padding: 18px 18px 0;
  display: flex;
  justify-content: flex-start;
  z-index: 1;
}

.avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 3px solid rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.avatar-initial {
  font-size: 2.1rem;
  font-weight: 800;
}

.card-info {
  position: relative;
  padding: 18px 20px;
  margin-top: auto;
  z-index: 1;
}

.name-line {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.age {
  font-size: 1.4rem;
  font-weight: 600;
}

.tagline {
  margin-top: 6px;
  font-size: 0.98rem;
  opacity: 0.92;
}

.tags {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 0.78rem;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-footer {
  position: relative;
  padding: 10px 20px 18px;
  z-index: 1;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pill-email {
  font-weight: 600;
}

/* Swipe controls: ook uit je eerste versie, maar met kleuren per knop */
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

.circle-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
}

.circle-btn:active {
  transform: translateY(-1px) scale(0.97);
}

.hint {
  margin-top: 12px;
  font-size: 0.85rem;
  opacity: 0.9;
  text-align: center;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sidebar {
    width: 200px;
  }
}

@media (max-width: 640px) {
  .browser-bar {
    font-size: 0.8rem;
  }

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
