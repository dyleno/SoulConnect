<template>
  <section class="profile-page">
    <!-- Floating hearts -->
    <div class="heart-animation">
      <span
        v-for="(h, i) in 7"
        :key="i"
        class="heart"
        :style="{ left: `${8 + i * 13}%`, animationDelay: `${i * 1.1}s` }"
      >
        ❤
      </span>
    </div>

    <div class="profile-card pop-in">
      <!-- Avatar / profielfoto -->
      <div class="pfp-wrapper">
        <div class="pfp-circle" @click="triggerFile">
          <img
            v-if="photoUrl"
            :src="photoUrl"
            alt="Profielfoto"
            class="pfp-img"
          />
          <span v-else>{{ initial }}</span>
          <div class="pfp-badge">
            📷
          </div>
        </div>
        <p class="pfp-hint">Klik om je profielfoto te wijzigen</p>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden-input"
          @change="onFileChange"
        />
      </div>

      <h2 class="name">
        {{ displayName }}
        <span class="age" v-if="age">{{ age }}</span>
      </h2>

      <p class="bio">
        {{ profile.bio || "Nog geen bio ingevuld." }}
      </p>

      <div class="info-list">
        <div class="info-line">
          📍 {{ displayLocation }}
        </div>
        <div class="info-line">
          ⚧ {{ displayGender }}
        </div>
      </div>

      <div class="tag-grid" v-if="profile.interests?.length">
        <span class="tag" v-for="tag in profile.interests" :key="tag">
          {{ tag }}
        </span>
      </div>

      <button class="edit-btn" @click="$router.push('/instellingen')">
        ✏ Profiel bewerken
      </button>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfilePage",

  data() {
    return {
      user: null,
      profile: {},
      photoUrl: "",
    };
  },

  computed: {
    displayName() {
      return this.profile.name || this.user?.name || "Naam onbekend";
    },
    displayLocation() {
      return this.profile.location || this.user?.location || "Geen locatie";
    },
    displayGender() {
      return this.profile.gender || this.user?.gender || "Niet ingevuld";
    },
    initial() {
      const n = this.displayName;
      return n ? n.charAt(0).toUpperCase() : "?";
    },
    age() {
      const dateStr = this.profile.birthdate || this.user?.birthdate;
      if (!dateStr) return null;
      const date = new Date(dateStr);
      const now = new Date();
      let a = now.getFullYear() - date.getFullYear();
      const m = now.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < date.getDate())) a--;
      return a;
    },
  },

  async mounted() {
    const stored = localStorage.getItem("user");
    if (!stored) return this.$router.push("/login");

    this.user = JSON.parse(stored);
    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      const res = await axios.get(
        "http://localhost:3000/api/profiles/" + this.user.profile_id
      );

      this.profile = res.data || {};

      if (typeof this.profile.interests === "string") {
        this.profile.interests = this.profile.interests
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // profielfoto ophalen
      try {
        const photoRes = await axios.get(
          "http://localhost:3000/api/photos/" + this.user.profile_id
        );
        const p = photoRes.data;
        if (p) {
          this.photoUrl = Array.isArray(p) ? p[0]?.image_url : p.image_url;
        }
      } catch (err) {
        console.warn("Geen profielfoto gevonden", err);
      }
    },

    triggerFile() {
      this.$refs.fileInput.click();
    },

    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("image", file);
      fd.append("profile_id", this.user.profile_id);

      const res = await axios.post(
        "http://localhost:3000/api/photos/upload",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      this.photoUrl = res.data.image_url;
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

.profile-page {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(140deg, #ff5e7e, #ff1e5a);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: white;
  font-family: "Inter", sans-serif;
}

/* kaart */
.profile-card {
  width: 430px;
  padding: 40px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  text-align: center;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
  animation: popIn 0.8s ease-out;
}

@keyframes popIn {
  0% {
    transform: scale(0.8) translateY(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* hearts */
.heart-animation {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
    transform: translateY(0);
    opacity: 0;
  }
  18% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(-120vh);
    opacity: 0;
  }
}

/* avatar */
.pfp-wrapper {
  margin-bottom: 10px;
}

.pfp-circle {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
  margin: 0 auto;
  border: 3px solid rgba(255, 255, 255, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.6rem;
  font-weight: 900;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.pfp-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pfp-badge {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #ff1e5a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border: 2px solid #fff;
}

.pfp-hint {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-top: 6px;
}

.hidden-input {
  display: none;
}

.name {
  font-size: 2rem;
  font-weight: 800;
  margin-top: 6px;
}

.age {
  font-size: 1.3rem;
  opacity: 0.8;
}

.bio {
  margin-top: 12px;
  font-size: 1rem;
  opacity: 0.95;
}

.info-list {
  margin-top: 18px;
  opacity: 0.9;
}

.info-line {
  margin: 4px 0;
}

.tag-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 18px;
  gap: 10px;
}

.tag {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(5px);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

.edit-btn {
  margin-top: 25px;
  width: 100%;
  padding: 12px;
  background: white;
  color: #ff1e5a;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.05rem;
  transition: 0.25s;
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.35);
}
</style>
