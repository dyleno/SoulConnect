<template>
  <section class="premium-success-wrapper">
    <div class="success-card">
      <div class="icon-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="check-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 class="success-title">🎉 Betaling geslaagd!</h1>

      <p class="success-message">
        Dank je wel! Je bent nu een <strong>Premium lid</strong>.
      </p>

      <p v-if="sessionId" class="session-display">
        📄 Sessie ID: <strong>{{ sessionId }}</strong>
      </p>

      <button class="btn-primary" @click="goToHome">
        Ga naar Home
      </button>
    </div>
  </section>
</template>

<script>
// import the confetti library
import JSConfetti from "js-confetti";

export default {
  name: "PremiumSuccess",
  computed: {
    sessionId() {
      return this.$route.query.session_id || null;
    },
  },
  mounted() {
    // create the confetti instance
    const jsConfetti = new JSConfetti();

    // fire confetti when the page loads
    jsConfetti.addConfetti({
      confettiColors: [
        "#ff1e5a",
        "#ff7096",
        "#ff5e7e",
        "#ff85a1",
        "#fbb1bd",
        "#fff"
      ],
      confettiNumber: 100,
      emojis: ["🎉", "✨", "💖"],
      emojiSize: 30,
    });

    console.log("✔ Stripe session ID:", this.sessionId);
  },
  methods: {
    goToHome() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.premium-success-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  padding: 20px;
  font-family: "Inter", sans-serif;
}

.success-card {
  background: #ffffff;
  width: 95%;
  max-width: 380px;
  border-radius: 18px;
  padding: 35px 24px;
  box-shadow: 0px 10px 32px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.icon-circle {
  background: #e6ffed;
  border-radius: 50%;
  width: 78px;
  height: 78px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 18px auto;
}

.check-icon {
  width: 40px;
  height: 40px;
  color: #22c55e;
}

.success-title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #202020;
  margin: 8px 0 12px;
}

.success-message {
  font-size: 1.15rem;
  margin-bottom: 14px;
  color: #333;
}

.session-display {
  font-size: 0.95rem;
  margin-bottom: 22px;
  color: #555;
}

.btn-primary {
  display: inline-block;
  background: #ff1e5a;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 12px 26px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease;
}

.btn-primary:hover {
  background: #e01752;
}
</style>
