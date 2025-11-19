<template>
  <section class="auth-container">

    <!-- 🔥 Tinder-Style Header -->
    <header class="top-header" @click="$router.push('/')">
      <span class="logo">❤️ SoulConnect</span>
    </header>

    <div class="auth-card">
      <h2>Registreren</h2>

      <form @submit.prevent="register">
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          v-model="password"
          placeholder="Wachtwoord (min. 16 tekens)"
          minlength="16"
          required
        />

        <button class="btn">Account aanmaken</button>
      </form>

      <p class="register-text">
        Heb je al een account?
        <router-link class="register-link" to="/login">Inloggen</router-link>
      </p>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      console.log("Register attempt", this.email, this.password);
    },
  },
};
</script>

<style scoped>
/* ------------------------------------------------ */
/* 🔥 Fullscreen Gradient Background */
/* ------------------------------------------------ */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #ff5e7e, #ff1e5a);
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  animation: fadeInBackground 0.8s ease-in-out;
}

/* ------------------------------------------------ */
/* 🔥 Tinder-like Header */
/* ------------------------------------------------ */
.top-header {
  position: absolute;
  top: 20px;
  left: 30px;
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  color: white;
  user-select: none;
  transition: 0.25s ease;
}

.top-header:hover {
  transform: scale(1.05);
  text-shadow: 0 0 15px rgba(255,255,255,0.6);
}

/* ------------------------------------------------ */
/* 🔥 Card Styling */
/* ------------------------------------------------ */
.auth-card {
  background: white;
  padding: 50px 40px;
  border-radius: 25px;
  width: 380px;
  text-align: center;
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.18);
  animation: fadeIn 0.7s ease-out;
  backdrop-filter: blur(5px);
}

/* Title */
h2 {
  font-size: 2rem;
  color: #ff1e5a;
  font-weight: 800;
  margin-bottom: 25px;
}

/* Inputs */
input {
  width: 100%;
  padding: 14px;
  border: 2px solid #ffd1dd;
  border-radius: 12px;
  margin-top: 14px;
  font-size: 1rem;
  transition: 0.25s ease;
}

input:focus {
  border-color: #ff4670;
  box-shadow: 0 0 8px rgba(255, 70, 110, 0.4);
}

/* Main button */
.btn {
  width: 100%;
  padding: 14px;
  margin-top: 25px;
  background: #ff4670;
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s ease;
}

.btn:hover {
  background: #ff2d56;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 50, 90, 0.35);
}

.register-text {
  margin-top: 18px;
  font-size: 0.95rem;
  color: #666;
}

.register-link {
  color: #ff1e5a !important;
  font-weight: 700;
  text-decoration: underline !important;
  transition: 0.25s ease !important;
}

.register-link:hover {
  color: #ff2e6a !important;
  text-shadow: 0 0 6px rgba(255, 50, 90, 0.4);
}

.register-link:visited {
  color: #ff1e5a !important;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(40px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes fadeInBackground {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
