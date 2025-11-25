<template>
  <section class="home">
    <!-- Top bar -->
        <header class="top-bar">
      <div class="logo" @click="$router.push('/')">
        ❤️ SoulConnect
      </div>

      <div class="user-chip" v-if="user">
        <span class="user-name">
          {{ displayName }}
          <span v-if="displayAge">• {{ displayAge }}</span>
        </span>
        <button class="logout-btn" @click="logout">Uitloggen</button>
      </div>
    </header>

    <!-- Floating hearts -->
    <div class="heart-animation">
      <span class="heart" style="left: 12%; animation-delay: 0s;">❤</span>
      <span class="heart" style="left: 30%; animation-delay: 1.5s;">❤</span>
      <span class="heart" style="left: 55%; animation-delay: 3s;">❤</span>
      <span class="heart" style="left: 75%; animation-delay: 0.8s;">❤</span>
      <span class="heart" style="left: 90%; animation-delay: 2.3s;">❤</span>
    </div>

    <!-- Main content -->
    <main class="main">
      <!-- Profile card (Tinder style) -->
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
            <span v-if="displayAge" class="age"> {{ displayAge }}</span>
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

      <!-- Swipe buttons -->
      <div class="swipe-controls">
        <button class="circle-btn small">
          ❌
        </button>
        <button class="circle-btn large">
          ❤️
        </button>
        <button class="circle-btn small">
          ⭐
        </button>
      </div>

      <!-- Info onder kaart -->
      <div class="hint">
        Swipe-style actions komen hier later.
        Voor nu kun je alvast genieten van de vibes ⚡
      </div>
    </main>
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
      if (!this.user) return "SoulConnector";
      return this.user.name || this.user.email?.split("@")[0] || "SoulConnector";
    },
    displayAge() {
      if (!this.user || !this.user.age) return null;
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

    // als iemand /home opent zonder ingelogd te zijn
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
  top: 0;
  left: 0;
  overflow: hidden;
}

/* Top bar */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 26px;
  z-index: 5;
}

.logo {
  font-weight: 900;
  font-size: 1.4rem;
  letter-spacing: 0.02em;
  cursor: pointer;
  user-select: none;
  transition: 0.25s ease;
}

.logo:hover {
  transform: scale(1.05);
  text-shadow: 0 0 18px rgba(255, 255, 255, 0.7);
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  padding: 6px 14px;
  backdrop-filter: blur(8px);
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.logout-btn {
  border: none;
  outline: none;
  background: #ff6a88;
  color: white;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.logout-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
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

/* Main layout */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 16px 32px;
  position: relative;
  z-index: 2;
}

/* Tinder-like card */
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

/* card footer */
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

.circle-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
}

.circle-btn:active {
  transform: translateY(-1px) scale(0.97);
}

/* hint */
.hint {
  margin-top: 12px;
  font-size: 0.85rem;
  opacity: 0.9;
  text-align: center;
}

/* Responsiveness */
@media (max-width: 480px) {
  .top-bar {
    padding-inline: 16px;
  }

  .card {
    border-radius: 24px;
  }

  .name-line {
    font-size: 1.6rem;
  }

  .swipe-controls {
    gap: 20px;
  }

  .circle-btn.large {
    width: 72px;
    height: 72px;
  }
}
</style>
