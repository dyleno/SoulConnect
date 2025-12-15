<template>
  <section class="home">
    <!-- hearts -->
    <div class="heart-animation">
      <span class="heart" style="left: 12%; animation-delay: 0s;">❤</span>
      <span class="heart" style="left: 30%; animation-delay: 1.5s;">❤</span>
      <span class="heart" style="left: 55%; animation-delay: 3s;">❤</span>
      <span class="heart" style="left: 75%; animation-delay: 0.8s;">❤</span>
      <span class="heart" style="left: 90%; animation-delay: 2.3s;">❤</span>
    </div>
 
    <div class="app-shell">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-user">
          <div class="sidebar-avatar">
            <span class="sidebar-avatar-initial" v-if="!photoUrl">
              {{ avatarInitial }}
            </span>
            <img
              v-else
              :src="photoUrl"
              alt="Profielfoto"
              class="sidebar-avatar-image"
            />
          </div>
          <div class="sidebar-user-text">
            <div class="sidebar-user-name">{{ sidebarName }}</div>
            <button class="sidebar-link" @click="$router.push('/profiel')">
              Bekijk profiel
            </button>
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
          <button class="nav-item active">
            <span class="nav-icon">⚙️</span>
            <span>Instellingen</span>
          </button>
          <button class="nav-item" @click="$router.push('/premium')">
            <span class="nav-icon">★</span>
            <span>Premium</span>
          </button>
        </nav>
 
        <button class="logout-sidebar" @click="logout">
          Uitloggen
        </button>
      </aside>
 
      <!-- Content -->
      <main class="content">
        <header class="content-header">
          Beheer je SoulConnect profiel
        </header>
 
        <section class="content-main">
          <div class="settings-card">
            <h2 class="title">Instellingen</h2>
            <p class="subtitle">Pas je profiel, foto en interesses aan</p>
 
            <!-- Avatar upload -->
            <div class="avatar-upload">
              <div class="avatar-preview" @click="triggerFile">
                <img
                  v-if="photoUrl"
                  :src="photoUrl"
                  alt="Profielfoto"
                />
                <span v-else>{{ avatarInitial }}</span>
                <div class="avatar-edit-pill">Duidelijke gezichtsfoto wijzigen</div>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden-input"
                @change="onFileChange"
              />
            </div>
           
            <!-- NAAM -->
            <div class="field">
              <label>Naam</label>
              <input
                type="text"
                v-model="form.name"
                :disabled="nameChangeBlocked"
              />
              <p v-if="nameChangeBlocked" class="cooldown-text">
                Je hebt je naam recent gewijzigd. Je kunt je naam opnieuw wijzigen op
                <strong>{{ nameChangeAvailableAtFormatted }}</strong>.
              </p>
            </div>
 
            <!-- LOCATIE -->
            <div class="field">
              <label>Locatie</label>
              <input type="text" v-model="form.location" />
            </div>
 
            <!-- POSTCODE -->
            <div class="field">
              <label>Postcode</label>
              <input type="text" v-model="form.postalCode" />
            </div>
 
            <!-- GEBOORTEDATUM -->
            <div class="field">
              <label>Geboortedatum</label>
              <input type="date" v-model="form.birthdate" />
            </div>
 
            <!-- BIO -->
            <div class="field">
              <label>Bio</label>
              <textarea v-model="form.bio"></textarea>
            </div>
 
            <!-- ONE-LINER -->
            <div class="field">
              <label>One-liner over jezelf</label>
              <input
                type="text"
                v-model="form.oneLiner"
                placeholder="Bijv. 'Avontuurlijke foodie met zwak voor slechte woordgrappen.'"
              />
            </div>
 
            <!-- RELATIE-VALUES -->
            <div class="field">
              <label>Wat waardeer je in een relatie?</label>
              <textarea
                v-model="form.relationshipValues"
                placeholder="Bijv. eerlijkheid, humor, vertrouwen..."
              ></textarea>
            </div>
 
            <!-- WAT ZOEK JE IN PARTNER -->
            <div class="field">
              <label>Wat zoek je in een partner?</label>
              <textarea
                v-model="form.relationshipLookingFor"
                placeholder="Beschrijf wat voor persoon je hoopt te ontmoeten."
              ></textarea>
            </div>
 
            <!-- GEZOCHT GESLACHT/GENDER -->
            <div class="field">
              <label>Gezochte geslacht/gender</label>
              <select v-model="form.desiredGender">
                <option value="">Maak een keuze</option>
                <option value="Man">Man</option>
                <option value="Vrouw">Vrouw</option>
                <option value="Alle geslachten">Alle geslachten</option>
              </select>
            </div>
 
            <!-- RELATIEVORM -->
            <div class="field">
              <label>Relatievorm die je zoekt</label>
              <div class="chips-grid">
                <div
                  v-for="type in relationshipTypesAvailable"
                  :key="type"
                  class="chip-item"
                  :class="{ active: form.relationshipType.includes(type) }"
                  @click="toggleRelationshipType(type)"
                >
                  {{ type }}
                </div>
              </div>
            </div>
 
            <!-- HUISDIEREN -->
            <div class="field">
              <label>Huisdieren</label>
              <select v-model="form.pets">
                <option value="">Geen antwoord</option>
                <option value="Geen">Geen</option>
                <option value="Hond">Hond(en)</option>
                <option value="Kat">Kat(ten)</option>
                <option value="Anders">Andere huisdieren</option>
              </select>
            </div>
 
            <!-- KINDEREN -->
            <div class="field">
              <label>Heeft kinderen</label>
              <select v-model="form.hasChildren">
                <option value="">Geen antwoord</option>
                <option value="Ja">Ja</option>
                <option value="Nee">Nee</option>
                <option value="Co-ouderschap">Co-ouderschap</option>
              </select>
            </div>
 
            <!-- KINDERWENS -->
            <div class="field">
              <label>Kinderwens</label>
              <select v-model="form.wantsChildren">
                <option value="">Geen antwoord</option>
                <option value="Ja">Ja</option>
                <option value="Nee">Nee</option>
                <option value="Misschien">Misschien</option>
              </select>
            </div>
 
            <!-- OPLEIDINGSNIVEAU -->
            <div class="field">
              <label>Opleidingsniveau</label>
              <select v-model="form.educationLevel">
                <option value="">Geen antwoord</option>
                <option value="VMBO">VMBO</option>
                <option value="MBO">MBO</option>
                <option value="HAVO">HAVO</option>
                <option value="VWO">VWO</option>
                <option value="HBO">HBO</option>
                <option value="WO-bachelor">WO-bachelor</option>
                <option value="WO-master">WO-master</option>
                <option value="Overig">Overig</option>
              </select>
            </div>
 
            <!-- TALEN -->
            <div class="field">
              <label>Talen</label>
              <input
                type="text"
                v-model="form.languages"
                placeholder="Bijv. Nederlands, Engels, Spaans"
              />
            </div>
 
            <!-- BRANCHE / BEROEP -->
            <div class="field">
              <label>Branche</label>
              <input
                type="text"
                v-model="form.industry"
                placeholder="Bijv. IT, zorg, onderwijs..."
              />
            </div>
 
            <div class="field">
              <label>Beroep</label>
              <input
                type="text"
                v-model="form.profession"
                placeholder="Bijv. front-end developer, verpleegkundige..."
              />
            </div>
 
            <!-- INTERESSES -->
            <label class="interests-label">Interesses</label>
            <div class="interest-grid">
              <div
                v-for="tag in availableInterests"
                :key="tag"
                class="interest-item"
                :class="{ active: form.interests.includes(tag) }"
                @click="toggleInterest(tag)"
              >
                {{ tag }}
              </div>
            </div>
 
            <!-- VOORWAARDEN + AVG -->
            <div class="field terms-field">
              <label class="terms-label">
                <input
                  type="checkbox"
                  v-model="form.termsAccepted"
                />
                <span>
                  Ik ga akkoord met de voorwaarden en het privacybeleid (AVG).
                </span>
              </label>
            </div>
 
            <button class="save-btn" @click="saveSettings">
              ✔ Instellingen opslaan
            </button>
 
            <p v-if="message" class="msg">{{ message }}</p>
          </div>
        </section>
      </main>
    </div>
  </section>
</template>
 
<script>
import axios from "axios";
 
const NAME_COOLDOWN_KEY = "lastNameChangeAt";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
 
export default {
  name: "SettingsPage",
 
  data() {
    return {
      user: null,
      form: {
        name: "",
        location: "",
        bio: "",
        interests: [],
 
        // NIEUWE VELDEN
        oneLiner: "",
        relationshipValues: "",
        relationshipLookingFor: "",
        desiredGender: "",
        birthdate: "",
        postalCode: "",
        relationshipType: [],
        termsAccepted: false,
        pets: "",
        hasChildren: "",
        wantsChildren: "",
        educationLevel: "",
        languages: "",
        industry: "",
        profession: "",
      },
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
      relationshipTypesAvailable: [
        "Vriendschappelijk",
        "Relatie",
        "LAT",
        "FWB",
        "ONS",
      ],
      message: "",
      photoUrl: "",
      originalName: "",        // naam zoals uit backend geladen
      lastNameChangeAt: null,  // timestamp (ms sinds epoch)
    };
  },
 
  computed: {
    sidebarName() {
      if (!this.user) return "Gebruiker";
      return (
        this.form.name ||
        this.user.name ||
        this.user.email?.split("@")[0] ||
        "Gebruiker"
      );
    },
    avatarInitial() {
      const n = this.sidebarName;
      return n ? n.charAt(0).toUpperCase() : "G";
    },
 
    // true = naam mag nu NIET gewijzigd worden
    nameChangeBlocked() {
      if (!this.lastNameChangeAt) return false;
      const diff = Date.now() - this.lastNameChangeAt;
      return diff < SEVEN_DAYS_MS;
    },
 
    // Datum/tijd waarop naam weer gewijzigd mag worden
    nameChangeAvailableAtFormatted() {
      if (!this.lastNameChangeAt) return "";
      const availableAt = new Date(this.lastNameChangeAt + SEVEN_DAYS_MS);
      const dd = availableAt.getDate().toString().padStart(2, "0");
      const mm = (availableAt.getMonth() + 1).toString().padStart(2, "0");
      const yyyy = availableAt.getFullYear();
      const hh = availableAt.getHours().toString().padStart(2, "0");
      const min = availableAt.getMinutes().toString().padStart(2, "0");
      return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    },
  },
 
  async mounted() {
    const stored = localStorage.getItem("user");
    if (!stored) return this.$router.push("/login");
    this.user = JSON.parse(stored);
 
    // cooldown uit localStorage oppakken
    const storedCooldown = localStorage.getItem(NAME_COOLDOWN_KEY);
    if (storedCooldown) {
      const ts = parseInt(storedCooldown, 10);
      if (!Number.isNaN(ts)) {
        this.lastNameChangeAt = ts;
      }
    }
 
    await this.loadProfile();
  },
 
  methods: {
    async loadProfile() {
      try {
        // Profiel ophalen
        const res = await axios.get(
          "http://localhost:3000/api/profiles/" + this.user.profile_id
        );
        const p = res.data;
 
        this.form.name = p.name || "";
        this.form.location = p.location || "";
        this.form.bio = p.bio || "";
        this.form.interests = Array.isArray(p.interests)
          ? p.interests
          : typeof p.interests === "string"
          ? p.interests
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];
 
        // NIEUWE VELDEN UIT PROFIEL (indien aanwezig)
        this.form.oneLiner = p.one_liner || "";
        this.form.relationshipValues = p.relationship_values || "";
        this.form.relationshipLookingFor = p.relationship_looking_for || "";
        this.form.desiredGender = p.desired_gender || "";
        this.form.birthdate = p.birthdate || "";
        this.form.postalCode = p.postal_code || "";
        this.form.relationshipType =
          Array.isArray(p.relationship_type)
            ? p.relationship_type
            : typeof p.relationship_type === "string"
            ? p.relationship_type
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [];
        this.form.termsAccepted = !!p.terms_accepted;
        this.form.pets = p.pets || "";
        this.form.hasChildren = p.has_children || "";
        this.form.wantsChildren = p.wants_children || "";
        this.form.educationLevel = p.education_level || "";
        this.form.languages = p.languages || "";
        this.form.industry = p.industry || "";
        this.form.profession = p.profession || "";
 
        // originele naam bewaren voor vergelijking
        this.originalName = this.form.name;
 
        // Profielfoto ophalen
        try {
          const photoRes = await axios.get(
            "http://localhost:3000/api/photos/" + this.user.profile_id
          );
          const data = photoRes.data;
          if (data && data.image_url) {
            // backend geeft bv. "/uploads/xxx.png" → host ervoor plakken
            this.photoUrl = "http://localhost:3000" + data.image_url;
          }
        } catch (e) {
          console.warn("Geen foto gevonden voor dit profiel");
        }
      } catch (err) {
        console.error(err);
      }
    },
 
    toggleInterest(tag) {
      if (this.form.interests.includes(tag)) {
        this.form.interests = this.form.interests.filter((t) => t !== tag);
      } else {
        this.form.interests.push(tag);
      }
    },
 
    toggleRelationshipType(type) {
      if (this.form.relationshipType.includes(type)) {
        this.form.relationshipType = this.form.relationshipType.filter(
          (t) => t !== type
        );
      } else {
        this.form.relationshipType.push(type);
      }
    },
 
    async saveSettings() {
      try {
        const nameChanged = this.form.name !== this.originalName;
 
        // Als de naam gewijzigd is én er is nog cooldown → blokkeren
        if (nameChanged && this.nameChangeBlocked) {
          this.message = `Je kunt je naam pas op ${this.nameChangeAvailableAtFormatted} weer wijzigen.`;
          setTimeout(() => (this.message = ""), 3000);
          return;
        }
 
        // Voorwaarden + AVG verplicht
        if (!this.form.termsAccepted) {
          this.message =
            "Je moet de voorwaarden en AVG accepteren voordat je kunt opslaan.";
          setTimeout(() => (this.message = ""), 3000);
          return;
        }
 
        await axios.put(
          "http://localhost:3000/api/profiles/" + this.user.profile_id,
          {
            // bestaande velden
            name: this.form.name,
            location: this.form.location,
            bio: this.form.bio,
            interests: this.form.interests.join(","),
 
            // nieuwe velden (snake_case voor backend)
            one_liner: this.form.oneLiner,
            relationship_values: this.form.relationshipValues,
            relationship_looking_for: this.form.relationshipLookingFor,
            desired_gender: this.form.desiredGender,
            birthdate: this.form.birthdate,
            postal_code: this.form.postalCode,
            relationship_type: this.form.relationshipType.join(","),
            terms_accepted: this.form.termsAccepted,
            pets: this.form.pets,
            has_children: this.form.hasChildren,
            wants_children: this.form.wantsChildren,
            education_level: this.form.educationLevel,
            languages: this.form.languages,
            industry: this.form.industry,
            profession: this.form.profession,
          }
        );
 
        // Als de naam écht veranderd is en er was géén cooldown → nu cooldown starten
        if (nameChanged) {
          const now = Date.now();
          this.lastNameChangeAt = now;
          localStorage.setItem(NAME_COOLDOWN_KEY, String(now));
          this.originalName = this.form.name;
        }
 
        this.message = "Instellingen succesvol opgeslagen! 💖";
        setTimeout(() => (this.message = ""), 2000);
      } catch (err) {
        console.error(err);
        this.message = "Er ging iets mis bij het opslaan.";
        setTimeout(() => (this.message = ""), 2000);
      }
    },
 
    triggerFile() {
      this.$refs.fileInput.click();
    },
 
    async onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
 
      const fd = new FormData();
      fd.append("image", file); // MOET "image" heten → upload.single("image")
      fd.append("profile_id", this.user.profile_id);
 
      try {
        const res = await axios.post(
          "http://localhost:3000/api/photos/upload",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
 
        if (res.data && res.data.image_url) {
          this.photoUrl = "http://localhost:3000" + res.data.image_url;
        }
      } catch (err) {
        console.error(err);
        this.message = "Uploaden van foto is mislukt.";
        setTimeout(() => (this.message = ""), 2000);
      }
    },
 
    logout() {
      localStorage.removeItem("user");
      this.$router.push("/login");
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
  inset: 0;
  overflow: hidden;
}
 
/* hearts */
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
 
/* layout */
.app-shell {
  flex: 1;
  display: flex;
  min-height: 0;
  z-index: 2;
}
 
/* sidebar */
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
  overflow: hidden;
}
 
.sidebar-avatar-initial {
  font-weight: 700;
  font-size: 1.1rem;
}
 
.sidebar-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
 
/* content */
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
 
/* hoofd content scrollt */
.content-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 16px 32px;
  min-height: 0;
  overflow-y: auto;
}
 
/* settings card */
.settings-card {
  width: 430px;
  background: rgba(255, 255, 255, 0.18);
  padding: 40px;
  border-radius: 26px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: fadeSlide 0.8s ease-out;
}
 
@keyframes fadeSlide {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
 
.title {
  font-size: 2rem;
  font-weight: 800;
}
 
.subtitle {
  opacity: 0.9;
  margin-bottom: 25px;
}
 
/* avatar upload */
.avatar-upload {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
 
.avatar-preview {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
 
.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
 
.avatar-preview span {
  font-size: 2.2rem;
  font-weight: 800;
}
 
.avatar-edit-pill {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 2px 8px;
  border-radius: 999px;
}
 

.hidden-input {
  display: none;
}
 
/* form velden */
.field {
  display: flex;
  flex-direction: column;
  margin-top: 12px;
}
 
label {
  font-size: 0.95rem;
  margin-bottom: 4px;
}
 
input,
textarea,
select {
  padding: 13px;
  border-radius: 12px;
  border: 2px solid #ffc2d2;
  background: rgba(255, 255, 255, 0.8);
  font-family: inherit;
}
 
textarea {
  min-height: 80px;
}
 
input:focus,
textarea:focus,
select:focus {
  border-color: #ff1e5a;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  outline: none;
}
 
/* cooldown tekst */
.cooldown-text {
  margin-top: 6px;
  font-size: 0.8rem;
  color: #ffe0e9;
}
 
.cooldown-text strong {
  font-weight: 700;
}
 
.interests-label {
  margin-top: 20px;
  font-weight: 600;
}
 
.interest-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}
 
.interest-item {
  padding: 6px 12px;
  background: #ff5e7e;
  border-radius: 14px;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid #ffb4ce;
}
 
.interest-item.active {
  background: #ff1e5a;
  color: white;
  border-color: #ff0e4c;
}
 
/* relatievorm chips */
.chips-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}
 
.chip-item {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  font-size: 0.85rem;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.4);
}
 
.chip-item.active {
  background: #ff1e5a;
  border-color: #ff0e4c;
}
 
/* voorwaarden */
.terms-field {
  margin-top: 20px;
}
 
.terms-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}
 
.terms-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}
 
/* save button */
.save-btn {
  margin-top: 25px;
  width: 100%;
  padding: 14px;
  background: white;
  color: #ff1e5a;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  transition: 0.25s;
  border: none;
  cursor: pointer;
}
 
.save-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(255, 255, 255, 0.35);
}
 
.msg {
  margin-top: 12px;
  text-align: center;
  font-size: 0.9rem;
}
 
/* responsive */
@media (max-width: 720px) {
  .sidebar {
    width: 200px;
  }
}
 
@media (max-width: 640px) {
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
 
 