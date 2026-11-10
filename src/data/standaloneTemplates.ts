/**
 * Standalone HTML/JS Templates for export with Firebase Realtime Database
 * Meets user's explicit request: "เขียนโค้ดแยก 2 ไฟล์ คือหน้าตอบและหน้า Dashboard พร้อมอธิบายวิธีตั้งค่า Firebase และ deploy ทีละขั้น"
 */

export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Firebase SDK (v9 compat for easy single-file running) -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .rating-btn { transition: all 0.15s ease-out; }
    .rating-btn:active { transform: scale(0.92); }
  </style>
</head>
<body class="bg-slate-50 min-h-screen text-slate-800 pb-12">

  <!-- Header -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
    <div class="max-w-md mx-auto px-4 py-3.5 flex items-center justify-between">
      <div>
        <h1 class="text-base font-bold text-slate-900 leading-tight">แบบประเมินความพึงพอใจ</h1>
        <p class="text-xs text-slate-500">โครงการฝึกอบรมเชิงปฏิบัติการ</p>
      </div>
      <div class="text-right">
        <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-medium">สเกล 1-5</span>
      </div>
    </div>
  </header>

  <main class="max-w-md mx-auto px-4 pt-4">

    <!-- Duplicate Prevention Notification View -->
    <div id="alreadySubmittedView" class="hidden bg-white rounded-2xl border border-slate-200 p-6 text-center my-6 shadow-sm">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
        ✓
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">ท่านได้ส่งแบบประเมินแล้ว</h2>
      <p class="text-sm text-slate-600 mb-6 leading-relaxed">
        ระบบบันทึกความเห็นของท่านเรียบร้อยแล้ว ขอบคุณที่สละเวลาให้ข้อมูลเพื่อการพัฒนาในครั้งต่อไป
      </p>
      <button onclick="resetSubmission()" class="text-xs text-slate-500 underline hover:text-indigo-600">
        ส่งแบบประเมินใหม่อีกครั้ง (สำหรับทดสอบ)
      </button>
    </div>

    <!-- Survey Form View -->
    <form id="evaluationForm" class="space-y-4">
      <div class="bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-3.5 text-xs leading-relaxed">
        💡 <strong>คำชี้แจง:</strong> กรุณาเลือกคะแนนความพึงพอใจในแต่ละด้าน (1 = น้อยที่สุด, 5 = มากที่สุด) ข้อมูลของท่านเป็นแบบนิรนาม
      </div>

      <!-- Question 1 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-600 uppercase">ข้อที่ 1</span>
          <span id="label_q1" class="text-xs font-medium text-slate-400">ยังไม่เลือก</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1">ด้านเนื้อหาหลักสูตร</h3>
        <p class="text-xs text-slate-500 mb-3">ความครอบคลุม ชัดเจน และตรงตามวัตถุประสงค์ของการอบรม</p>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q1', 1)" class="q1-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="1">
            <span class="text-base">1</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อยสุด</span>
          </button>
          <button type="button" onclick="selectScore('q1', 2)" class="q1-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="2">
            <span class="text-base">2</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อย</span>
          </button>
          <button type="button" onclick="selectScore('q1', 3)" class="q1-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="3">
            <span class="text-base">3</span>
            <span class="text-[10px] text-slate-400 font-normal">ปานกลาง</span>
          </button>
          <button type="button" onclick="selectScore('q1', 4)" class="q1-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="4">
            <span class="text-base">4</span>
            <span class="text-[10px] text-slate-400 font-normal">มาก</span>
          </button>
          <button type="button" onclick="selectScore('q1', 5)" class="q1-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="5">
            <span class="text-base">5</span>
            <span class="text-[10px] text-slate-400 font-normal">มากสุด</span>
          </button>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-600 uppercase">ข้อที่ 2</span>
          <span id="label_q2" class="text-xs font-medium text-slate-400">ยังไม่เลือก</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1">ด้านวิทยากรผู้สอน</h3>
        <p class="text-xs text-slate-500 mb-3">ความรู้ ความเชี่ยวชาญ เทคนิคการถ่ายทอด และการตอบคำถาม</p>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q2', 1)" class="q2-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="1">
            <span class="text-base">1</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อยสุด</span>
          </button>
          <button type="button" onclick="selectScore('q2', 2)" class="q2-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="2">
            <span class="text-base">2</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อย</span>
          </button>
          <button type="button" onclick="selectScore('q2', 3)" class="q2-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="3">
            <span class="text-base">3</span>
            <span class="text-[10px] text-slate-400 font-normal">ปานกลาง</span>
          </button>
          <button type="button" onclick="selectScore('q2', 4)" class="q2-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="4">
            <span class="text-base">4</span>
            <span class="text-[10px] text-slate-400 font-normal">มาก</span>
          </button>
          <button type="button" onclick="selectScore('q2', 5)" class="q2-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="5">
            <span class="text-base">5</span>
            <span class="text-[10px] text-slate-400 font-normal">มากสุด</span>
          </button>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-600 uppercase">ข้อที่ 3</span>
          <span id="label_q3" class="text-xs font-medium text-slate-400">ยังไม่เลือก</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1">ด้านการนำไปใช้ประโยชน์</h3>
        <p class="text-xs text-slate-500 mb-3">สามารถนำความรู้และทักษะไปประยุกต์ใช้ในการทำงานจริง</p>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q3', 1)" class="q3-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="1">
            <span class="text-base">1</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อยสุด</span>
          </button>
          <button type="button" onclick="selectScore('q3', 2)" class="q3-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="2">
            <span class="text-base">2</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อย</span>
          </button>
          <button type="button" onclick="selectScore('q3', 3)" class="q3-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="3">
            <span class="text-base">3</span>
            <span class="text-[10px] text-slate-400 font-normal">ปานกลาง</span>
          </button>
          <button type="button" onclick="selectScore('q3', 4)" class="q3-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="4">
            <span class="text-base">4</span>
            <span class="text-[10px] text-slate-400 font-normal">มาก</span>
          </button>
          <button type="button" onclick="selectScore('q3', 5)" class="q3-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="5">
            <span class="text-base">5</span>
            <span class="text-[10px] text-slate-400 font-normal">มากสุด</span>
          </button>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-600 uppercase">ข้อที่ 4</span>
          <span id="label_q4" class="text-xs font-medium text-slate-400">ยังไม่เลือก</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1">ด้านสื่อและเอกสารประกอบ</h3>
        <p class="text-xs text-slate-500 mb-3">เอกสาร สไลด์ แบบฝึกหัด และกิจกรรมประกอบการเรียนรู้</p>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q4', 1)" class="q4-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="1">
            <span class="text-base">1</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อยสุด</span>
          </button>
          <button type="button" onclick="selectScore('q4', 2)" class="q4-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="2">
            <span class="text-base">2</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อย</span>
          </button>
          <button type="button" onclick="selectScore('q4', 3)" class="q4-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="3">
            <span class="text-base">3</span>
            <span class="text-[10px] text-slate-400 font-normal">ปานกลาง</span>
          </button>
          <button type="button" onclick="selectScore('q4', 4)" class="q4-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="4">
            <span class="text-base">4</span>
            <span class="text-[10px] text-slate-400 font-normal">มาก</span>
          </button>
          <button type="button" onclick="selectScore('q4', 5)" class="q4-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="5">
            <span class="text-base">5</span>
            <span class="text-[10px] text-slate-400 font-normal">มากสุด</span>
          </button>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div class="flex items-start justify-between mb-2">
          <span class="text-xs font-semibold text-indigo-600 uppercase">ข้อที่ 5</span>
          <span id="label_q5" class="text-xs font-medium text-slate-400">ยังไม่เลือก</span>
        </div>
        <h3 class="text-sm font-bold text-slate-900 mb-1">ด้านสถานที่และการให้บริการ</h3>
        <p class="text-xs text-slate-500 mb-3">ห้องอบรม โสตทัศนูปกรณ์ อาหารว่าง และการประสานงาน</p>
        <div class="grid grid-cols-5 gap-2">
          <button type="button" onclick="selectScore('q5', 1)" class="q5-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="1">
            <span class="text-base">1</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อยสุด</span>
          </button>
          <button type="button" onclick="selectScore('q5', 2)" class="q5-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="2">
            <span class="text-base">2</span>
            <span class="text-[10px] text-slate-400 font-normal">น้อย</span>
          </button>
          <button type="button" onclick="selectScore('q5', 3)" class="q5-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="3">
            <span class="text-base">3</span>
            <span class="text-[10px] text-slate-400 font-normal">ปานกลาง</span>
          </button>
          <button type="button" onclick="selectScore('q5', 4)" class="q5-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="4">
            <span class="text-base">4</span>
            <span class="text-[10px] text-slate-400 font-normal">มาก</span>
          </button>
          <button type="button" onclick="selectScore('q5', 5)" class="q5-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold" data-val="5">
            <span class="text-base">5</span>
            <span class="text-[10px] text-slate-400 font-normal">มากสุด</span>
          </button>
        </div>
      </div>

      <!-- Feedback / Suggestions (Optional) -->
      <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <label for="feedbackText" class="block text-sm font-bold text-slate-900 mb-1">
          ข้อเสนอแนะเพิ่มเติม <span class="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
        </label>
        <p class="text-xs text-slate-500 mb-2">สิ่งที่ประทับใจ หรือข้อที่ควรปรับปรุงสำหรับการจัดอบรมครั้งต่อไป</p>
        <textarea id="feedbackText" rows="3" placeholder="พิมพ์ข้อเสนอแนะของท่านที่นี่..." class="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>

      <!-- Submit Button -->
      <div class="pt-2">
        <button type="submit" id="submitBtn" class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed">
          ส่งแบบประเมินความพึงพอใจ
        </button>
      </div>
    </form>

    <!-- Success View -->
    <div id="successView" class="hidden bg-white rounded-2xl border border-slate-200 p-6 text-center my-6 shadow-sm">
      <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
        ✓
      </div>
      <h2 class="text-xl font-bold text-slate-900 mb-2">ส่งแบบประเมินสำเร็จแล้ว!</h2>
      <p class="text-sm text-slate-600 mb-4 leading-relaxed">
        ระบบบันทึกคะแนนของท่านและส่งต่อไปยังหน้าจอ Dashboard ผู้จัดงานแบบเรียลไทม์แล้ว
      </p>
      <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
        ขอบพระคุณที่ร่วมเป็นส่วนหนึ่งในการพัฒนาหลักสูตร
      </div>
    </div>
  </main>

  <script>
    // --- 1. Firebase Configuration ---
    // ใส่ config ที่ได้จาก Firebase Console ของท่านตรงนี้:
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    // ตรวจสอบการเชื่อมต่อ Firebase
    let db = null;
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
      }
    } catch(err) {
      console.warn("Firebase not configured, fallback to local storage mode", err);
    }

    const state = {
      q1: 0,
      q2: 0,
      q3: 0,
      q4: 0,
      q5: 0
    };

    const ratingLabels = {
      1: 'น้อยที่สุด (1)',
      2: 'น้อย (2)',
      3: 'ปานกลาง (3)',
      4: 'มาก (4)',
      5: 'มากที่สุด (5)'
    };

    // Check duplicate submission
    function checkDeviceSubmission() {
      const submitted = localStorage.getItem('training_eval_submitted_token');
      if (submitted) {
        document.getElementById('alreadySubmittedView').classList.remove('hidden');
        document.getElementById('evaluationForm').classList.add('hidden');
      }
    }

    function selectScore(qKey, score) {
      state[qKey] = score;

      // Update button styles
      const buttons = document.querySelectorAll('.' + qKey + '-btn');
      buttons.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-val'));
        if (val === score) {
          btn.className = qKey + '-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border-2 border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-xs';
        } else {
          btn.className = qKey + '-btn rating-btn flex flex-col items-center justify-center py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 font-bold';
        }
      });

      // Update label
      const label = document.getElementById('label_' + qKey);
      if (label) {
        label.innerText = ratingLabels[score] || '';
        label.className = 'text-xs font-semibold text-indigo-600';
      }
    }

    // Submit handler
    document.getElementById('evaluationForm').addEventListener('submit', function(e) {
      e.preventDefault();

      // Check required questions
      for (let i = 1; i <= 5; i++) {
        if (!state['q' + i]) {
          alert('กรุณาให้คะแนนข้อที่ ' + i + ' ให้ครบถ้วน');
          return;
        }
      }

      const feedback = document.getElementById('feedbackText').value.trim();
      const submissionId = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const payload = {
        id: submissionId,
        timestamp: Date.now(),
        scores: state,
        feedback: feedback || null
      };

      const btn = document.getElementById('submitBtn');
      btn.disabled = true;
      btn.innerText = 'กำลังส่งข้อมูล...';

      // Save to Firebase Realtime Database if available
      if (db) {
        db.ref('submissions/' + submissionId).set(payload)
          .then(onSuccess)
          .catch(function(err) {
            console.error(err);
            // Fallback save locally
            saveLocalAndFinish(payload);
          });
      } else {
        saveLocalAndFinish(payload);
      }
    });

    function saveLocalAndFinish(payload) {
      // Save local backup
      const existing = JSON.parse(localStorage.getItem('training_eval_submissions_v1') || '[]');
      existing.unshift(payload);
      localStorage.setItem('training_eval_submissions_v1', JSON.stringify(existing));
      onSuccess();
    }

    function onSuccess() {
      localStorage.setItem('training_eval_submitted_token', 'true');
      document.getElementById('evaluationForm').classList.add('hidden');
      document.getElementById('successView').classList.remove('hidden');

      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    }

    function resetSubmission() {
      localStorage.removeItem('training_eval_submitted_token');
      location.reload();
    }

    window.onload = checkDeviceSubmission;
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Realtime Dashboard ผลการประเมินการอบรม</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
  <!-- Firebase SDK -->
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js"></script>
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .num { font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif; font-variant-numeric: tabular-nums; }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">

  <!-- Top Bar for Projector -->
  <header class="bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></div>
      <h1 class="text-xl md:text-2xl font-bold tracking-tight text-white">
        Dashboard ผลการประเมินความพึงพอใจการอบรม
      </h1>
      <span class="text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md">Realtime</span>
    </div>

    <div class="flex items-center gap-3">
      <button onclick="exportCSV()" class="px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-700">
        📥 ดาวน์โหลด CSV
      </button>
      <button onclick="toggleFullscreen()" class="px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
        ⛶ โหมดเต็มจอ
      </button>
    </div>
  </header>

  <main class="max-w-7xl mx-auto p-6 space-y-6">

    <!-- KPI Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Total Responses -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <span class="text-xs uppercase font-semibold text-slate-400">จำนวนผู้ตอบแบบสอบถาม</span>
        <div class="mt-2 flex items-baseline gap-3">
          <span id="totalCount" class="text-5xl font-extrabold text-white num">0</span>
          <span class="text-sm text-slate-400">คน</span>
        </div>
        <p class="text-xs text-slate-400 mt-2">อัปเดตแบบเรียลไทม์ทันทีที่มีผู้ส่งข้อมูล</p>
      </div>

      <!-- Overall Mean Score -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6">
        <span class="text-xs uppercase font-semibold text-slate-400">คะแนนเฉลี่ยรวม (สเกล 1-5)</span>
        <div class="mt-2 flex items-baseline gap-3">
          <span id="overallMean" class="text-5xl font-extrabold text-emerald-400 num">0.00</span>
          <span class="text-sm text-slate-400">/ 5.00</span>
        </div>
        <div class="mt-2">
          <span id="overallLikert" class="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            ยังไม่มีข้อมูล
          </span>
        </div>
      </div>

      <!-- Live QR Code Card for Audience Scan -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold text-white mb-1">สแกนเพื่อร่วมประเมิน</h3>
          <p class="text-xs text-slate-400 mb-2">สแกน QR Code ผ่านมือถือ</p>
          <button onclick="promptChangeSurveyUrl()" class="text-xs text-indigo-400 hover:underline">
            ตั้งค่าลิงก์แบบสอบถาม
          </button>
        </div>
        <div class="bg-white p-2 rounded-xl shrink-0">
          <img id="qrImage" src="" alt="Scan QR Code" class="w-24 h-24 object-contain">
        </div>
      </div>
    </div>

    <!-- 5 Questions Evaluation Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Left Column: Bar Charts (2 cols) -->
      <div class="lg:col-span-2 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-5">
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-4">
          <h2 class="text-lg font-bold text-white">ผลการประเมินรายข้อ (ค่าเฉลี่ยและระดับความพึงพอใจ)</h2>
          <span class="text-xs text-slate-400">เกณฑ์ 5 ระดับ</span>
        </div>

        <div id="questionsContainer" class="space-y-4">
          <!-- Filled by JS -->
        </div>
      </div>

      <!-- Right Column: Latest Feedback Stream -->
      <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-4">
          <h2 class="text-lg font-bold text-white">ข้อเสนอแนะล่าสุด</h2>
          <span id="feedbackCount" class="text-xs text-slate-400 num">0 รายการ</span>
        </div>

        <div id="feedbackList" class="space-y-3 overflow-y-auto max-h-[460px] pr-1 flex-1">
          <p class="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>
        </div>
      </div>
    </div>
  </main>

  <script>
    // --- 1. Firebase Configuration ---
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    const questionsList = [
      { id: 1, title: 'ด้านเนื้อหาหลักสูตร', desc: 'ความชัดเจน ความครอบคลุม และตรงตามวัตถุประสงค์' },
      { id: 2, title: 'ด้านวิทยากรผู้สอน', desc: 'ความรู้ ความเชี่ยวชาญ เทคนิคการสอน และตอบข้อซักถาม' },
      { id: 3, title: 'ด้านการนำไปใช้ประโยชน์', desc: 'สามารถนำความรู้ไปประยุกต์ใช้ในการปฏิบัติงานจริงได้' },
      { id: 4, title: 'ด้านสื่อและเอกสารประกอบ', desc: 'ความเข้าใจง่ายของสไลด์ เอกสาร และแบบฝึกหัด' },
      { id: 5, title: 'ด้านสถานที่และการให้บริการ', desc: 'ความพร้อมของห้องอบรม โสตทัศนูปกรณ์ และอาหารว่าง' }
    ];

    let submissionsData = [];
    let surveyUrl = localStorage.getItem('training_survey_target_url') || window.location.href.replace('dashboard.html', 'index.html');

    function updateQR() {
      const qrEl = document.getElementById('qrImage');
      qrEl.src = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' + encodeURIComponent(surveyUrl);
    }
    updateQR();

    function promptChangeSurveyUrl() {
      const newUrl = prompt('ระบุ URL สำหรับผู้ตอบแบบสอบถาม:', surveyUrl);
      if (newUrl) {
        surveyUrl = newUrl;
        localStorage.setItem('training_survey_target_url', newUrl);
        updateQR();
      }
    }

    // Likert interpretation
    function getLikert(mean) {
      if (mean >= 4.51) return { level: 'มากที่สุด', bg: 'bg-emerald-950 text-emerald-300 border-emerald-800' };
      if (mean >= 3.51) return { level: 'มาก', bg: 'bg-teal-950 text-teal-300 border-teal-800' };
      if (mean >= 2.51) return { level: 'ปานกลาง', bg: 'bg-yellow-950 text-yellow-300 border-yellow-800' };
      if (mean >= 1.51) return { level: 'น้อย', bg: 'bg-amber-950 text-amber-300 border-amber-800' };
      return { level: 'น้อยที่สุด', bg: 'bg-rose-950 text-rose-300 border-rose-800' };
    }

    function renderDashboard(submissions) {
      submissionsData = submissions;
      const count = submissions.length;
      document.getElementById('totalCount').innerText = count;

      if (count === 0) {
        document.getElementById('overallMean').innerText = '0.00';
        document.getElementById('overallLikert').innerText = 'ยังไม่มีข้อมูล';
        renderQuestionBars([]);
        renderFeedbacks([]);
        return;
      }

      // Calculate question means
      const qStats = questionsList.map(q => {
        const scores = submissions.map(s => s.scores['q' + q.id] || 0);
        const sum = scores.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        return { ...q, mean: mean, likert: getLikert(mean) };
      });

      // Overall Mean
      const overall = qStats.reduce((a, b) => a + b.mean, 0) / 5;
      document.getElementById('overallMean').innerText = overall.toFixed(2);
      const overallLikert = getLikert(overall);
      const likertEl = document.getElementById('overallLikert');
      likertEl.innerText = overallLikert.level;
      likertEl.className = 'text-xs font-semibold px-2.5 py-1 rounded-md border ' + overallLikert.bg;

      renderQuestionBars(qStats);

      const feedbacks = submissions.filter(s => s.feedback && s.feedback.trim() !== '');
      renderFeedbacks(feedbacks);
    }

    function renderQuestionBars(stats) {
      const container = document.getElementById('questionsContainer');
      const r = 38;
      const c = 2 * Math.PI * r;
      container.innerHTML = stats.map(item => {
        const percent = Math.min(100, (item.mean / 5) * 100);
        const offset = c - (percent / 100) * c;
        let strokeColor = '#6366f1';
        if (item.mean >= 4.51) strokeColor = '#6366f1';
        else if (item.mean >= 3.51) strokeColor = '#10b981';
        else if (item.mean >= 2.51) strokeColor = '#f59e0b';
        else if (item.mean >= 1.51) strokeColor = '#f97316';
        else strokeColor = '#f43f5e';

        return \`
          <div class="p-4 bg-slate-900/70 rounded-2xl border border-slate-700/60 flex items-center gap-5">
            <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg class="w-20 h-20 transform -rotate-90">
                <circle cx="40" cy="40" r="\${r}" stroke="currentColor" stroke-width="7" class="text-slate-800" fill="transparent" />
                <circle cx="40" cy="40" r="\${r}" stroke="\${strokeColor}" stroke-width="7" stroke-dasharray="\${c}" stroke-dashoffset="\${offset}" stroke-linecap="round" class="transition-all duration-700 ease-out" fill="transparent" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span class="text-base font-bold text-white num leading-none">\${item.mean.toFixed(2)}</span>
                <span class="text-[9px] text-slate-400 mt-0.5">\${Math.round(percent)}%</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-bold text-white">ข้อ \${item.id}: \${item.title}</span>
                <span class="text-[10px] px-2 py-0.5 rounded border \${item.likert.bg}">\${item.likert.level}</span>
              </div>
              <p class="text-[11px] text-slate-400 mb-1.5 leading-relaxed">\${item.desc}</p>
              <span class="text-[10px] text-slate-500 font-mono">คะแนนเต็ม 5.00</span>
            </div>
          </div>
        \`;
      }).join('');
    }

    function renderFeedbacks(feedbacks) {
      const container = document.getElementById('feedbackList');
      document.getElementById('feedbackCount').innerText = feedbacks.length + ' รายการ';
      if (feedbacks.length === 0) {
        container.innerHTML = '<p class="text-xs text-slate-500 py-8 text-center">ยังไม่มีข้อเสนอแนะเพิ่มเติม</p>';
        return;
      }
      container.innerHTML = feedbacks.slice(0, 15).map(f => \`
        <div class="p-3 bg-slate-900/70 border border-slate-700/60 rounded-xl text-xs text-slate-300 leading-relaxed">
          "\${f.feedback}"
        </div>
      \`).join('');
    }

    // Connect to Firebase Realtime Database
    try {
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();
        db.ref('submissions').on('value', function(snapshot) {
          const val = snapshot.val();
          if (val) {
            const list = Object.values(val);
            renderDashboard(list);
          } else {
            renderDashboard([]);
          }
        });
      } else {
        // Fallback: poll or read localStorage
        const local = JSON.parse(localStorage.getItem('training_eval_submissions_v1') || '[]');
        renderDashboard(local);
        window.addEventListener('storage', () => {
          const updated = JSON.parse(localStorage.getItem('training_eval_submissions_v1') || '[]');
          renderDashboard(updated);
        });
      }
    } catch(e) {
      console.warn(e);
    }

    // CSV Export
    function exportCSV() {
      if (submissionsData.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }
      const headers = ['ลำดับ', 'ข้อ 1 (เนื้อหา)', 'ข้อ 2 (วิทยากร)', 'ข้อ 3 (การนำไปใช้)', 'ข้อ 4 (สื่อ)', 'ข้อ 5 (สถานที่)', 'คะแนนเฉลี่ย', 'ข้อเสนอแนะ'];
      const rows = submissionsData.map((s, idx) => {
        const avg = (s.scores.q1 + s.scores.q2 + s.scores.q3 + s.scores.q4 + s.scores.q5) / 5;
        const fb = s.feedback ? '"' + s.feedback.replace(/"/g, '""') + '"' : '""';
        return [idx + 1, s.scores.q1, s.scores.q2, s.scores.q3, s.scores.q4, s.scores.q5, avg.toFixed(2), fb].join(',');
      });
      const csv = '\\uFEFF' + [headers.join(','), ...rows].join('\\r\\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'training-evaluation-dashboard.csv';
      a.click();
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  </script>
</body>
</html>`;

export const FIREBASE_SETUP_GUIDE_MD = `# คู่มือการติดตั้ง Firebase Realtime Database & วิธี Deploy ฟรีทีละขั้น

คู่มือนี้สำหรับผู้ใช้งานที่ต้องการนำโค้ด HTML ทั้ง 2 ไฟล์ (\`index.html\` และ \`dashboard.html\`) ไปใช้งานจริง โดยใช้ **Firebase Realtime Database (แพ็กเกจฟรี Spark Plan)** รองรับการส่งคะแนนและอัปเดต Dashboard ทันทีแบบเรียลไทม์

---

## ขั้นตอนที่ 1: สร้าง Firebase Project และเปิด Realtime Database (ฟรี 100%)

1. เข้าเว็บไซต์ [https://console.firebase.google.com](https://console.firebase.google.com) และลงชื่อเข้าใช้ด้วยบัญชี Google
2. คลิกปุ่ม **"Add project"** (เพิ่มโปรเจกต์)
   - ตั้งชื่อโปรเจกต์ เช่น \`training-evaluation-app\`
   - เลือกเปิด/ปิด Google Analytics (ปิดได้เพื่อความสะดวกรวดเร็ว) แล้วคลิก **Create project**
3. เมื่อโปรเจกต์สร้างเสร็จแล้ว ที่เมนูด้านซ้าย ให้คลิกที่ **Build** > **Realtime Database**
4. คลิกปุ่ม **"Create Database"**
   - **Database location**: เลือก \`Singapore (asia-southeast1)\` หรือ \`United States (us-central1)\` (แนะนำ Singapore เพื่อความเร็วในไทย)
   - **Security rules**: เลือก **"Start in test mode"** (โหมดทดสอบ) แล้วคลิก **Enable**

---

## ขั้นตอนที่ 2: ตั้งค่า Database Rules (เพื่อให้ผู้ตอบส่งคะแนนได้โดยไม่ต้องล็อกอิน)

1. ในหน้า **Realtime Database** ให้คลิกแท็บ **"Rules"** (กฎ) ด้านบน
2. แก้ไขโค้ด Rules เป็นดังนี้:

\`\`\`json
{
  "rules": {
    "submissions": {
      ".read": true,
      ".write": true
    }
  }
}
\`\`\`

3. คลิกปุ่ม **"Publish"** (เผยแพร่)
*หมายเหตุ: กฎนี้เปิดให้ทุกคนเขียนข้อมูลลงในพาธ \`submissions\` และอ่านผลบนหน้าจอ Dashboard ได้โดยไม่ต้องล็อกอิน เหมาะกับงานสัมมนาและแบบประเมินนิรนาม*

---

## ขั้นตอนที่ 3: รับค่า firebaseConfig ไปใส่ในไฟล์ HTML

1. ใน Firebase Console คลิกไอคอน ⚙️ (รูปเฟือง) ข้าง Project Overview ที่มุมซ้ายบน แล้วเลือก **Project settings**
2. เลื่อนลงมาที่หมวด **"Your apps"** ด้านล่าง คลิกไอคอนเว็บ **\`</>\`** เพื่อเพิ่ม Web App
   - ตั้งชื่อ App เช่น \`Evaluation Web\`
   - ไม่ต้องติ๊กช่อง Firebase Hosting ในขั้นตอนนี้ คลิก **Register app**
3. ระบบจะแสดงตัวแปร \`firebaseConfig\` ตัวอย่างเช่น:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyB3vX...",
  authDomain: "training-evaluation-app.firebaseapp.com",
  databaseURL: "https://training-evaluation-app-asia-southeast1.firebasedatabase.app",
  projectId: "training-evaluation-app",
  storageBucket: "training-evaluation-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd1234..."
};
\`\`\`

4. นำชุด \`firebaseConfig\` นี้ ไปวางแทนที่ \`YOUR_API_KEY\` ในทั้ง 2 ไฟล์:
   - ไฟล์ **\`index.html\`** (หน้าสำหรับผู้ตอบ)
   - ไฟล์ **\`dashboard.html\`** (หน้า Dashboard สำหรับผู้จัด)

---

## ขั้นตอนที่ 4: วิธี Deploy ฟรี (เลือกวิธีที่สะดวกที่สุด)

### ตัวเลือก A: Deploy ด้วย GitHub Pages (ง่ายที่สุด ไม่ต้องลงโปรแกรม)
1. เข้า [https://github.com](https://github.com) และสร้าง Repository ใหม่ (แบบ Public)
2. อัปโหลดทั้ง 2 ไฟล์ (\`index.html\` และ \`dashboard.html\`) ขึ้น GitHub
3. ไปที่แท็บ **Settings** > **Pages**
4. ในส่วน **Build and deployment** ให้เลือก Branch \`main\` และโฟลเดอร์ \`/ (root)\` แล้วคลิก **Save**
5. รอ 1 นาที GitHub จะให้ URL เช่น:
   - หน้าผู้เข้าอบรม: \`https://username.github.io/reponame/\`
   - หน้า Dashboard: \`https://username.github.io/reponame/dashboard.html\`

---

### ตัวเลือก B: Deploy ด้วย Firebase Hosting (แพ็กเกจฟรีของ Google)
1. ติดตั้ง Firebase CLI ในคอมพิวเตอร์:
   \`\`\`bash
   npm install -g firebase-tools
   \`\`\`
2. ล็อกอินและเริ่มต้นโปรเจกต์:
   \`\`\`bash
   firebase login
   firebase init hosting
   \`\`\`
   - เลือกโปรเจกต์ที่สร้างไว้ในขั้นตอนที่ 1
   - โฟลเดอร์ public directory: กด Enter ใช้ \`public\`
   - นำไฟล์ \`index.html\` และ \`dashboard.html\` ใส่ไว้ในโฟลเดอร์ \`public/\`
3. สั่ง Deploy ขึ้นระบบ:
   \`\`\`bash
   firebase deploy --only hosting
   \`\`\`
4. คุณจะได้รับ URL \`https://training-evaluation-app.web.app\` นำไปใช้งานได้ทันที!
`;
