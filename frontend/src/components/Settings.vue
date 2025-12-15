<template>
  <div class="settings-page">
    
    <!-- Hearts Animation -->
    <div class="heart-animation">
      <span
        v-for="n in 15"
        :key="n"
        class="heart"
        :style="{ left: Math.random() * 100 + '%' }"
      >
        ❤
      </span>
    </div>

    <div class="app-shell">

      <!-- SIDEBAR -->
      <div class="sidebar">
        <div class="sidebar-user">

          <div class="sidebar-avatar">
            <img 
              v-if="profilePhoto" 
              :src="profilePhoto" 
              class="sidebar-avatar-img" 
            >
            <span v-else class="sidebar-avatar-initial">G</span>
          </div>

          <div>
            <div style="font-weight: 700;">Gebruiker</div>
            <small style="opacity: 0.8;">Bekijk profiel</small>
          </div>
        </div>

        <div class="nav">

          <RouterLink to="/home" class="nav-item">
            <span>🏠</span> Home
          </RouterLink>

          <RouterLink to="/chat" class="nav-item">
            <span>💬</span> Berichten
          </RouterLink>

          <RouterLink to="/search" class="nav-item">
            <span>🔍</span> Zoeken
          </RouterLink>

          <RouterLink to="/settings" class="nav-item active">
            <span>⚙️</span> Instellingen
          </RouterLink>

          <RouterLink to="/premium" class="nav-item">
            <span>⭐</span> Premium
          </RouterLink>

        </div>

        <button class="logout-sidebar">Log uit</button>
      </div>

      <!-- MAIN CONTENT -->
      <div class="content">
        <div class="content-header">
          Love starts here — SoulConnect
        </div>

        <div class="content-main">
          <div class="settings-container">

            <!-- USER HEADER -->
            <div class="user-header">
              <div class="user-left">

                <!-- PROFILE PHOTO UPLOADER -->
                <label class="user-avatar-big upload-wrapper">
                  
                  <!-- Preview / Default -->
                  <img 
                    v-if="profilePhoto" 
                    :src="profilePhoto" 
                    class="profile-preview"
                  >
                  <span v-else>👤</span>

                  <!-- Hidden file input -->
                  <input 
                    type="file" 
                    accept="image/*" 
                    class="photo-input"
                    @change="uploadPhoto"
                  />
                </label>

                <div>
                  <h1 class="username">Gebruiker</h1>
                  <p class="tagline">Voeg je one liner toe…</p>
                </div>

                <!-- Premium Button -->
                <RouterLink to="/premium" class="upgrade-badge-btn">
                  Upgrade naar premium ⭐
                </RouterLink>
              </div>

              <div class="right-box">
                <div class="right-label">email</div>
                <div class="right-label">wachtwoord</div>
              </div>

            </div>

            <!-- INFORMATION SECTIONS -->
            <div class="info-sections">

              <!-- LEFT SECTION -->
              <div class="info-block">

                <h2>
                  Mijn gegevens 
                  <span class="edit-btn" @click="startEditPersonal">✏️</span>
                </h2>

                <!-- DISPLAY MODE -->
                <div v-if="!editingPersonal">
                  <div class="info-row"><span>Gender</span><span>- {{ personal.gender }}</span></div>
                  <div class="info-row"><span>Leeftijd</span><span>- {{ personal.age }}</span></div>
                  <div class="info-row"><span>Interesses</span><span>- {{ personal.interests }}</span></div>
                  <div class="info-row"><span>Werk</span><span>- {{ personal.job }}</span></div>
                  <div class="info-row"><span>Locatie</span><span>- {{ personal.location }}</span></div>
                </div>

                <!-- EDIT MODE -->
                <div v-else class="edit-form">

                  <label>Gender:</label>
                  <input v-model="tempPersonal.gender" />

                  <label>Leeftijd:</label>
                  <input v-model="tempPersonal.age" />

                  <label>Interesses:</label>
                  <input v-model="tempPersonal.interests" />

                  <label>Werk:</label>
                  <input v-model="tempPersonal.job" />

                  <label>Locatie:</label>
                  <input v-model="tempPersonal.location" />

                  <div class="edit-buttons">
                    <button class="save-btn" @click="savePersonal">Opslaan</button>
                    <button class="cancel-btn" @click="cancelPersonal">Annuleren</button>
                  </div>
                </div>

              </div>

              <!-- DIVIDER -->
              <div class="divider"></div>

              <!-- RIGHT SECTION -->
              <div class="info-block">

                <h2>
                  Mijn voorkeuren 
                  <span class="edit-btn" @click="startEditPreferences">✏️</span>
                </h2>

                <!-- DISPLAY MODE -->
                <div v-if="!editingPreferences">
                  <div class="info-row"><span>Gender</span><span>- {{ preferences.gender }}</span></div>
                  <div class="info-row"><span>Leeftijd</span><span>- {{ preferences.ageRange }}</span></div>
                  <div class="info-row"><span>Interesses</span><span>- {{ preferences.interests }}</span></div>
                  <div class="info-row"><span>Locatie</span><span>- {{ preferences.distance }}</span></div>
                </div>

                <!-- EDIT MODE -->
                <div v-else class="edit-form">

                  <label>Gender:</label>
                  <input v-model="tempPreferences.gender" />

                  <label>Leeftijd:</label>
                  <input v-model="tempPreferences.ageRange" />

                  <label>Interesses:</label>
                  <input v-model="tempPreferences.interests" />

                  <label>Locatie:</label>
                  <input v-model="tempPreferences.distance" />

                  <div class="edit-buttons">
                    <button class="save-btn" @click="savePreferences">Opslaan</button>
                    <button class="cancel-btn" @click="cancelPreferences">Annuleren</button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";

/* -----------------------------
   BASIC CONFIG
----------------------------- */
const USER_ID = 1; // static for now (until login system is finished)
const API = "http://localhost:3000/api";

/* -----------------------------
   PROFILE PHOTO UPLOAD
----------------------------- */
const profilePhoto = ref(null);

function uploadPhoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    profilePhoto.value = e.target.result;
    saveProfilePhoto(e.target.result);
  };
  reader.readAsDataURL(file);
}

// Drag-and-drop support
function handleDrop(e) {
  const file = e.dataTransfer.files[0];
  if (file) uploadPhoto({ target: { files: [file] } });
}

function handleDragOver(e) {
  e.preventDefault();
}

/* SAVE PROFILE PHOTO TO BACKEND */
async function saveProfilePhoto(base64) {
  try {
    await axios.post(`${API}/uploadPhoto/${USER_ID}`, {
      photo: base64,
    });
  } catch (err) {
    console.error("Photo upload failed:", err);
  }
}

/* LOAD PROFILE PHOTO */
async function loadProfilePhoto() {
  try {
    const res = await axios.get(`${API}/getPhoto/${USER_ID}`);
    if (res.data?.photo) {
      profilePhoto.value = res.data.photo;
    }
  } catch (err) {
    console.error("Failed to load photo:", err);
  }
}

/* -----------------------------
   EDIT STATES
----------------------------- */
const editingPersonal = ref(false);
const editingPreferences = ref(false);

/* -----------------------------
   USER DATA (LIVE)
----------------------------- */
const personal = reactive({
  gender: "",
  age: "",
  interests: "",
  job: "",
  location: "",
});

const preferences = reactive({
  gender: "",
  ageRange: "",
  interests: "",
  distance: "",
});

/* TEMPORARY EDIT MODEL */
const tempPersonal = reactive({});
const tempPreferences = reactive({});

/* -----------------------------
   LOAD SAVED DATA (ON PAGE OPEN)
----------------------------- */
async function loadPersonal() {
  try {
    const res = await axios.get(`${API}/getPersonal/${USER_ID}`);
    Object.assign(personal, res.data);
  } catch (err) {
    console.error("Failed to load personal:", err);
  }
}

async function loadPreferences() {
  try {
    const res = await axios.get(`${API}/getPreferences/${USER_ID}`);
    Object.assign(preferences, res.data);
  } catch (err) {
    console.error("Failed to load preferences:", err);
  }
}

onMounted(() => {
  loadPersonal();
  loadPreferences();
  loadProfilePhoto();
});

/* -----------------------------
   START EDITING
----------------------------- */
function startEditPersonal() {
  Object.assign(tempPersonal, personal);
  editingPersonal.value = true;
}

function startEditPreferences() {
  Object.assign(tempPreferences, preferences);
  editingPreferences.value = true;
}

/* -----------------------------
   SAVE TO BACKEND
----------------------------- */
async function savePersonal() {
  try {
    await axios.post(`${API}/updatePersonal/${USER_ID}`, tempPersonal);
    Object.assign(personal, tempPersonal);
    editingPersonal.value = false;
  } catch (err) {
    console.error("Failed to save:", err);
  }
}

async function savePreferences() {
  try {
    await axios.post(`${API}/updatePreferences/${USER_ID}`, tempPreferences);
    Object.assign(preferences, tempPreferences);
    editingPreferences.value = false;
  } catch (err) {
    console.error("Failed to save:", err);
  }
}

/* -----------------------------
   CANCEL EDITING
----------------------------- */
function cancelPersonal() {
  editingPersonal.value = false;
}

function cancelPreferences() {
  editingPreferences.value = false;
}
</script>


<style scoped>

.photo-input {
  display: none;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.sidebar-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.upgrade-badge-btn {
  padding: 8px 14px;
  background: white;
  color: #ff1e5a;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: 0.2s ease;
  display: inline-block;
}

.upgrade-badge-btn:hover {
  background: #ffe5ec;
}

/* NAV ITEMS */
.nav-item {
  text-decoration: none;
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
}

.nav-item:hover {
  background: rgba(255,255,255,0.14);
}

.router-link-active,
.nav-item.active {
  background: rgba(255,255,255,0.18) !important;
}

/* PAGE BACKGROUND */
.settings-page {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #ff5e7e 0%, #ff1e5a 100%);
  font-family: "Inter", sans-serif;
  color: #fff;
  overflow: hidden;
  position: fixed;
  inset: 0;
}

/* Hearts */
.heart-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: -10%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}
.heart {
  position: absolute;
  font-size: 2.2rem;
  opacity: 0;
  animation: floatUp 10s linear infinite;
  color: rgba(255, 255, 255, 0.35);
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(0.8); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-120vh) scale(1.3); opacity: 0; }
}

/* Layout */
.app-shell {
  display: flex;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* SIDEBAR */
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
  padding: 10px 14px;
  align-items: center;
  gap: 10px;
}
.sidebar-avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid rgba(255,255,255,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.25);
}
.sidebar-avatar-initial {
  font-size: 1.1rem;
  font-weight: bold;
}

/* NAVIGATION */
.nav {
  display: flex;
  flex-direction: column;
}
.nav-item {
  background: transparent;
  border: none;
  padding: 10px 18px;
  text-align: left;
  color: #fff;
  cursor: pointer;
  display: flex;
  gap: 10px;
  align-items: center;
}
.nav-item.active {
  background: rgba(255,255,255,0.18);
}

.logout-sidebar {
  margin-top: auto;
  margin: 12px;
  padding: 8px 10px;
  background: rgba(255,255,255,0.18);
  color: white;
  border: none;
  border-radius: 999px;
  cursor: pointer;
}

/* CONTENT */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.content-header {
  height: 40px;
  padding: 0 18px;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}
.content-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}

/* USER HEADER */
.settings-container {
  width: 95%;
  max-width: 1250px;
  backdrop-filter: blur(4px);
}

.user-header {
  display: flex;
  justify-content: space-between;
  padding: 20px 5px;
  border-bottom: 2px solid rgba(255,255,255,0.4);
}

.user-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-avatar-big {
  width: 120px;
  height: 120px;
  border: 6px solid white;
  border-radius: 50%;
  font-size: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.tagline {
  opacity: 0.85;
}

.upgrade-badge {
  padding: 8px 14px;
  background: white;
  color: #ff1e5a;
  border-radius: 12px;
  font-weight: 600;
}

.right-box {
  width: 160px;
  height: 150px;
  border: 2px solid rgba(255,255,255,0.7);
  border-radius: 12px;
  padding: 10px 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.right-label {
  font-size: 1.1rem;
}

/* INFO BLOCKS */
.info-sections {
  display: flex;
  margin-top: 20px;
}

.info-block {
  flex: 1;
  padding: 15px;
}

.info-block h2 {
  margin-bottom: 14px;
  border-bottom: 2px solid white;
  padding-bottom: 4px;
  font-size: 1.4rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  font-size: 1.1rem;
}

/* DIVIDER */
.divider {
  width: 2px;
  background: rgba(255,255,255,0.55);
}

/* EDITING */
.edit-btn {
  cursor: pointer;
  font-size: 1rem;
  margin-left: 8px;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-form input {
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 1rem;
}

.edit-buttons {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.save-btn {
  background: #ff1e5a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background: #aaaaaa;
  color: black;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

</style>
