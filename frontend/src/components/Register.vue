<template>
  <section class="auth-container">
    <header class="top-header" @click="$router.push('/')">
      <span class="logo">❤️ SoulConnect</span>
    </header>

    <div class="auth-card">
      <h2>Registreren</h2>

      <form @submit.prevent="register">
        <!-- Naam -->
        <input
          type="text"
          v-model="name"
          placeholder="Naam"
          required
        />

        <!-- Leeftijd -->
        <input
          type="number"
          v-model.number="age"
          placeholder="Leeftijd"
          min="18"
          max="120"
          required
        />

        <!-- Email -->
        <input
          type="email"
          v-model="email"
          placeholder="Email"
          required
        />

        <!-- Bio -->
        <textarea
          v-model="bio"
          class="textarea"
          placeholder="Vertel iets over jezelf..."
          required
        ></textarea>

        <!-- Gender -->
        <select v-model="gender" class="select">
          <option disabled value="">Geslacht</option>
          <option value="man">Man</option>
          <option value="vrouw">Vrouw</option>
          <option value="anders">Anders</option>
        </select>

        <!-- Locatie -->
        <input
          type="text"
          v-model="location"
          placeholder="Locatie (bijv. Amsterdam)"
          required
        />

        <!-- INTERESSES -->
        <label class="tag-label">Kies jouw interesses:</label>

        <div class="tag-grid">
          <div
            v-for="tag in availableInterests"
            :key="tag"
            class="tag-item"
            :class="{ active: interests.includes(tag) }"
            @click="toggleInterest(tag)"
          >
            {{ tag }}
          </div>
        </div>

        <!-- Wachtwoord -->
        <input
          type="password"
          v-model="password"
          placeholder="Wachtwoord (min. 16 tekens)"
          minlength="16"
          required
        />

        <!-- Confirm -->
        <input
          type="password"
          v-model="confirmPassword"
          placeholder="Bevestig wachtwoord"
          minlength="16"
          required
        />

        <!-- Verzend-knop -->
        <button class="btn" :disabled="loading">
          {{ loading ? "Bezig met registreren..." : "Account aanmaken" }}
        </button>
      </form>

      <!-- Foutmelding -->
      <p v-if="errorMessage" class="error-text">
        {{ errorMessage }}
      </p>

      <!-- Succesmelding -->
      <p v-if="successMessage" class="success-text">
        {{ successMessage }}
      </p>

      <p class="register-text">
        Heb je al een account?
        <router-link class="register-link" to="/login">Inloggen</router-link>
      </p>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      name: "",
      age: "",
      email: "",
      bio: "",
      gender: "",
      location: "",
      password: "",
      confirmPassword: "",
      interests: [],
      availableInterests: [
        "Film",
        "Muziek maken",
        "Voetbal",
        "Reizen",
        "Koken",
        "Gamen",
        "Lezen",
        "Gym",
        "Wandelen",
        "Fotografie",
      ],

      errorMessage: "",
      successMessage: "",
      loading: false,
    };
  },

  methods: {
    toggleInterest(tag) {
      if (this.interests.includes(tag)) {
        this.interests = this.interests.filter((t) => t !== tag);
      } else {
        this.interests.push(tag);
      }
    },

    async register() {
      this.errorMessage = "";
      this.successMessage = "";
      this.loading = true;

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Wachtwoorden komen niet overeen.";
        this.loading = false;
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/register", {
          name: this.name,
          age: this.age,
          email: this.email.trim(),
          password: this.password,
          bio: this.bio,
          gender: this.gender,
          location: this.location,
          interests: this.interests.join(","),
        });

        localStorage.setItem("user", JSON.stringify(response.data.user));

        this.successMessage =
          response.data?.message || "Account succesvol aangemaakt!";

        this.$router.push("/home");
      } catch (err) {
        console.error(err);
        this.errorMessage =
          err?.response?.data?.message ||
          "Registreren is mislukt. Probeer het opnieuw.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* --- jouw originele styling, exact zoals je gaf --- */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;  /* NIEUW → kaart bovenaan beginnen */
  padding-top: 60px;        /* afstand van boven */
  padding-bottom: 60px;     /* voorkomt plakken onderaan */
  height: 100vh;
  width: 100vw;
  overflow-y: auto;         /* SCROLL FIX */
  overflow-x: hidden;
  background: linear-gradient(135deg, #ff5e7e, #ff1e5a);
  position: fixed;
  top: 0;
  left: 0;
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

input,
select {
  width: 100%;
  padding: 14px;
  border: 2px solid #ffd1dd;
  border-radius: 12px;
  margin-top: 14px;
  font-size: 1rem;
  transition: 0.25s ease;
}

textarea {
  width: 100%;
  padding: 14px;
  margin-top: 14px;
  border-radius: 12px;
  border: 2px solid #ffd1dd;
  min-height: 80px;
  resize: none;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #ff4670;
  box-shadow: 0 0 8px rgba(255, 70, 110, 0.4);
}

.tag-label {
  margin-top: 18px;
  font-weight: bold;
  color: #444;
  text-align: left;
  display: block;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.tag-item {
  background: #ffe5ee;
  border: 1px solid #ffb3c7;
  cursor: pointer;
  transition: 0.2s ease;
   padding: 5px 10px;
  font-size: 0.85rem;
  border-radius: 16px;
}

.tag-item.active {
  background: #ff4670;
  color: white;
  border-color: #ff2d56;
}
.register-text {
  margin-top: 12px;
  color: #444;
  font-size: 0.9rem;
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

.error-text {
  margin-top: 12px;
  color: #e63946;
  font-size: 0.9rem;
}

.success-text {
  margin-top: 12px;
  color: #2ecc71;
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
