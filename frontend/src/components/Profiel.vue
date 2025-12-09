<template>
  <section class="profile-page">
    <!-- TERUG BUTTON BOVEN SCHERM -->
    <button class="back-btn" @click="$router.back()">
      ← Terug
    </button>

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
      <!-- JOUW SWIPE-KAART -->
      <div class="card">
        <div class="card-gradient"></div>

        <!-- FOTO’S BOVENIN (grote kaartfoto) -->
        <div class="photo-container" @click="triggerFile">
          <img
            v-if="currentPhotoUrl"
            :src="currentPhotoUrl"
            alt="Profielfoto"
            class="main-photo"
          />
          <div v-else class="photo-fallback">
            {{ initial }}
          </div>

          <!-- NAVIGATIE TUSSEN FOTO'S -->
          <button
            v-if="photos.length > 1"
            class="photo-nav left"
            @click.stop="prevPhoto"
          >
            ‹
          </button>
          <button
            v-if="photos.length > 1"
            class="photo-nav right"
            @click.stop="nextPhoto"
          >
            ›
          </button>
        </div>

        <!-- INFO ONDERIN KAART -->
        <div class="card-info">
          <h2 class="name-line">
            {{ displayName }}
            <span class="age" v-if="age">{{ age }}</span>
          </h2>

          <p class="tagline">
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

          <div class="tags" v-if="profile.interests?.length">
            <span class="tag" v-for="tag in profile.interests" :key="tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <div class="pill">
            Klik op je foto om nieuwe foto's te uploaden
          </div>
        </div>
      </div>

      <!-- verborgen file input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden-input"
        @change="onFileChange"
      />

      <!-- Dots onder kaart voor foto’s -->
      <div v-if="photos.length > 1" class="photo-dots">
        <span
          v-for="(p, i) in photos"
          :key="i"
          class="dot"
          :class="{ active: i === activePhotoIndex }"
          @click="setPhoto(i)"
        ></span>
      </div>

      <!-- Thumbnails -->
      <div v-if="photos.length" class="thumbs">
        <div
          v-for="(p, i) in photos"
          :key="i"
          class="thumb"
          :class="{ active: i === activePhotoIndex }"
          @click="setPhoto(i)"
        >
          <img :src="p" alt="Thumbnail" />
        </div>
      </div>

      <button class="edit-btn" @click="$router.push('/instellingen')">
        ✏ Profiel bewerken
      </button>
    </div>
  </section>
</template>

<script>
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default {
  name: "ProfilePage",

  data() {
    return {
      user: null,
      profile: {},
      photoUrl: "", // hoofdfoto
      photos: [],
      activePhotoIndex: 0,
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
    currentPhotoUrl() {
      if (this.photos.length > 0) {
        return this.photos[this.activePhotoIndex] || this.photos[0];
      }
      return this.photoUrl || "";
    },
  },

  async mounted() {
    const stored = localStorage.getItem("user");
    if (!stored) return this.$router.push("/login");

    this.user = JSON.parse(stored);

    if (this.user.photo_url) {
      this.photoUrl = this.user.photo_url;
      this.photos = [this.user.photo_url];
      this.activePhotoIndex = 0;
    }

    await this.loadProfile();
  },

  methods: {
    async loadProfile() {
      const res = await axios.get(
        `${API_BASE}/api/profiles/${this.user.profile_id}`
      );
      this.profile = res.data || {};

      if (typeof this.profile.interests === "string") {
        this.profile.interests = this.profile.interests
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }

      // meerdere foto’s ophalen
      try {
        const photoRes = await axios.get(
          `${API_BASE}/api/photos/${this.user.profile_id}`
        );
        const data = photoRes.data;

        let urls = [];
        if (Array.isArray(data)) {
          urls = data
            .map((p) => p.image_url)
            .filter(Boolean)
            .map((u) => API_BASE + u);
        } else if (data && data.image_url) {
          urls = [API_BASE + data.image_url];
        }

        if (urls.length) {
          this.photos = urls;
          this.photoUrl = urls[0];
          this.activePhotoIndex = 0;
        }
      } catch (err) {
        console.warn("Geen kaart-foto('s) gevonden", err);
      }
    },

    triggerFile() {
      this.$refs.fileInput.click();
    },

    async onFileChange(e) {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      for (const file of files) {
        const fd = new FormData();
        fd.append("image", file);
        fd.append("profile_id", this.user.profile_id);

        try {
          const res = await axios.post(`${API_BASE}/api/photos/upload`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.data && res.data.image_url) {
            const url = API_BASE + res.data.image_url;
            this.photos.push(url);
            this.photoUrl = this.photos[0];
            this.activePhotoIndex = this.photos.length - 1;
          }
        } catch (err) {
          console.error("Uploaden van foto is mislukt.", err);
        }
      }

      e.target.value = "";
    },

    nextPhoto() {
      if (!this.photos.length) return;
      this.activePhotoIndex =
        (this.activePhotoIndex + 1) % this.photos.length;
    },

    prevPhoto() {
      if (!this.photos.length) return;
      this.activePhotoIndex =
        (this.activePhotoIndex - 1 + this.photos.length) %
        this.photos.length;
    },

    setPhoto(i) {
      if (i < 0 || i >= this.photos.length) return;
      this.activePhotoIndex = i;
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

/* BACK BUTTON BOVEN SCHERM */
.back-btn {
  position: absolute;
  left: 16px;
  top: 16px;
  z-index: 5;
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.4);
}

/* hoofd container */
.profile-card {
  width: 420px;
  padding: 26px 26px 22px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(12px);
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: popIn 0.8s ease-out;
  position: relative;
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

/* kaart */
.card {
  position: relative;
  width: 100%;
  background: #222;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 10% 0%, #ffb6c9 0, transparent 50%),
    radial-gradient(circle at 90% 0%, #ffd1dc 0, transparent 55%),
    linear-gradient(180deg, rgba(0, 0, 0, 0.3), #000);
  z-index: 0;
}

/* grote foto */
.photo-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-height: 300px;
  overflow: hidden;
  cursor: pointer;
  z-index: 1;
}

.main-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  background: rgba(0, 0, 0, 0.4);
}

/* nav pijlen */
.photo-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.photo-nav.left {
  left: 10px;
}

.photo-nav.right {
  right: 10px;
}

/* zwarte info balk – compact */
.card-info {
  position: relative;
  padding: 14px 18px;
  margin-top: auto;
  z-index: 1;
  text-align: left;
}

.name-line {
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.age {
  font-size: 1.2rem;
  font-weight: 600;
}

.tagline {
  margin-top: 4px;
  font-size: 0.85rem;
  opacity: 0.9;
}

.info-list {
  margin-top: 6px;
  opacity: 0.85;
  font-size: 0.78rem;
}

.info-line {
  margin: 3px 0;
}

.tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-footer {
  position: relative;
  padding: 6px 16px 10px;
  z-index: 1;
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* dots & thumbs */
.photo-dots {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.dot.active {
  background: #fff;
}

.thumbs {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.thumb {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active {
  border-color: #fff;
}

.hidden-input {
  display: none;
}

.edit-btn {
  margin-top: 18px;
  width: 100%;
  padding: 11px;
  background: white;
  color: #ff1e5a;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1rem;
  transition: 0.25s;
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.35);
}
</style>
