<template>
  <section class="landing">
    
    <div class="content">
      <h1 class="title fade-in">SoulConnect❤</h1>
      <p class="subtitle slide-up">
        Vind echte connecties die passen bij jouw vibe.
      </p>

      <div class="buttons fade-in-delayed">
        <router-link to="/login" class="btn primary">Inloggen</router-link>
        <router-link to="/register" class="btn secondary">Registreren</router-link>
      </div>
    </div>
    <div class="heart-animation">
    <span class="heart" style="left: 15%; animation-delay: 0s;">❤</span>
    <span class="heart" style="left: 30%; animation-delay: 2s;">❤</span>
    <span class="heart" style="left: 50%; animation-delay: 4s;">❤</span>
    <span class="heart" style="left: 70%; animation-delay: 1s;">❤</span>
    <span class="heart" style="left: 85%; animation-delay: 3s;">❤</span>
</div>

    <div class="heart-animation"></div>
  </section>
  
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
.landing {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: fixed; 
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  color: white;
  font-family: "Inter", sans-serif;
}

.content {
  width: 100%;
  max-width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -1px;
}

.subtitle {
  font-size: 1.3rem;
  margin-top: 10px;
  opacity: 0.9;
}

.buttons {
  margin-top: 40px;
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.25s ease;
}

.primary {
  background: white;
  color: #ff1e5a;
}

.primary:hover {
  background: #ffe5ec;
}

.secondary {
  border: 2px solid white;
  color: white;
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Animaties */
.fade-in {
  animation: fadeIn 1s ease forwards;
}

.fade-in-delayed {
  opacity: 0;
  animation: fadeIn 1.4s ease forwards;
}

.slide-up {
  opacity: 0;
  animation: slideUp 1s ease forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
/* --- BUTTON ANIMATIES (Tinder style) --- */
.btn {
  padding: 14px 32px;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.25s ease;
  position: relative;
  overflow: hidden;
}

.btn:hover {
  transform: scale(1.08);
}

.primary:hover {
  background: #ffffff;
  box-shadow: 0 0 25px rgba(255, 255, 255, 0.4);
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 25px rgba(255,255,255,0.4);
}

/* Glow pulse around buttons */
.btn::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 30px;
  background: rgba(255,255,255,0.4);
  opacity: 0;
  transition: 0.3s ease;
}

.btn:hover::after {
  opacity: 0.25;
}

.heart-animation {
  position: absolute;
  bottom: -10%;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.35);
  font-size: 2rem;
  animation: floatUp 8s linear infinite;
  opacity: 0;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  20% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) scale(1.4);
    opacity: 0;
  }
}

</style>
