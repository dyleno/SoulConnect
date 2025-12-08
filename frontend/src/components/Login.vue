<template>
  <section class="auth-container">
    <header class="top-header" @click="$router.push('/')">
      <span class="logo">❤️ SoulConnect</span>
    </header>

    <div class="auth-card">
      <h2>Inloggen</h2>

      <form @submit.prevent="login">
        <input type="email" v-model="email" placeholder="Email" required />
        <input
          type="password"
          v-model="password"
          placeholder="Wachtwoord"
          required
        />

        <button class="btn" :disabled="loading">
          {{ loading ? "Bezig met inloggen..." : "Inloggen" }}
        </button>
      </form>

      <p v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </p>

      <p class="register-text">
        Nog geen account?
        <router-link class="register-link" to="/register">
          Registreren
        </router-link>
      </p>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    async login() {
      this.errorMessage = "";
      this.loading = true;

      try {
        const response = await axios.post("http://localhost:3000/login", {
          email: this.email.trim(),
          password: this.password,
        });

        // User opslaan (met profile_id, name, age, email)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // 👉 Na inloggen naar home
        this.$router.push("/home");
      } catch (err) {
        console.error(err);
        this.errorMessage =
          err?.response?.data?.message ||
          "Inloggen is mislukt. Controleer je gegevens.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
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
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
}

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

h2 {
  font-size: 2rem;
  color: #ff1e5a;
  font-weight: 800;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 14px;
  border: 2px solid #ffd1dd;
  border-radius: 12px;
  margin-top: 14px;
  font-size: 1rem;
  transition: 0.25s ease;
  background: #fff;
}

input:focus {
  border-color: #ff4670;
  box-shadow: 0 0 8px rgba(255, 70, 110, 0.4);
}

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

/* Disabled state */
.btn[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
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

.error-text {
  margin-top: 12px;
  color: #e63946;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInBackground {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
