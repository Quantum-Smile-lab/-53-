// ============================================================
// app.js — Quantum Smile (Updated)
// ============================================================

// ===== STATE =====
let currentSubject = null;
let currentChapter = null;
let allQuestions   = [];
let currentQ       = 0;
let score          = 0;
let wrongAnswers   = [];
let answered       = false;

// ===== DOM =====
const screens        = document.querySelectorAll('.screen');
const loadingOverlay = document.getElementById('loadingOverlay');
const subjectsGrid   = document.getElementById('subjectsGrid');

// ===== STARS =====
function createStars() {
  const container = document.getElementById('stars');
  container.innerHTML = '';

  // نجوم بيضاء صغيرة عادية
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star white';
    const size = Math.random() * 1.8 + 0.4;
    star.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      top:    ${Math.random() * 100}%;
      left:   ${Math.random() * 100}%;
      --dur:  ${Math.random() * 3 + 2}s;
      --op:   ${Math.random() * 0.5 + 0.2};
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(star);
  }

  // نجوم ذهبية صغيرة
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    star.className = 'star gold';
    const size = Math.random() * 2 + 0.8;
    star.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      top:    ${Math.random() * 100}%;
      left:   ${Math.random() * 100}%;
      --dur:  ${Math.random() * 4 + 2}s;
      --op:   ${Math.random() * 0.7 + 0.3};
      animation-delay: ${Math.random() * 6}s;
    `;
    container.appendChild(star);
  }

  // نجوم بيضاء كبيرة لامعة ذات أشعة
  const brightPositions = [
    { top: 8,  left: 15 },
    { top: 12, left: 75 },
    { top: 25, left: 90 },
    { top: 45, left: 5  },
    { top: 60, left: 55 },
    { top: 70, left: 85 },
    { top: 85, left: 30 },
    { top: 90, left: 70 },
  ];

  brightPositions.forEach(pos => {
    const star = document.createElement('div');
    star.className = 'star bright';
    const size = Math.random() * 4 + 4;
    star.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      top:    ${pos.top + (Math.random() * 4 - 2)}%;
      left:   ${pos.left + (Math.random() * 4 - 2)}%;
      --dur:  ${Math.random() * 3 + 3}s;
      --op:   ${Math.random() * 0.4 + 0.6};
      animation: twinkleBright var(--dur) ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
    `;
    container.appendChild(star);
  });

  // نجوم ذهبية كبيرة لامعة ذات أشعة
  const brightGoldPositions = [
    { top: 18, left: 40 },
    { top: 35, left: 20 },
    { top: 50, left: 78 },
    { top: 75, left: 12 },
    { top: 80, left: 92 },
  ];

  brightGoldPositions.forEach(pos => {
    const star = document.createElement('div');
    star.className = 'star bright-gold';
    const size = Math.random() * 3 + 3;
    star.style.cssText = `
      width:  ${size}px;
      height: ${size}px;
      top:    ${pos.top + (Math.random() * 4 - 2)}%;
      left:   ${pos.left + (Math.random() * 4 - 2)}%;
      --dur:  ${Math.random() * 4 + 3}s;
      --op:   ${Math.random() * 0.4 + 0.6};
      animation: twinkleBright var(--dur) ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    container.appendChild(star);
  });
}

// ===== SHOW SCREEN =====
function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== INIT =====
async function init() {
  createStars();
  try {
    const res      = await fetch('subjects.json');
    const subjects = await res.json();
    await renderSubjects(subjects);
    loadingOverlay.classList.add('hidden');
    showScreen('home');
  } catch (err) {
    loadingOverlay.querySelector('.loading-text').textContent =
      '⚠️ Error. Open with Live Server.';
  }
}

// ===== RENDER SUBJECTS =====
async function renderSubjects(subjects) {
  subjectsGrid.innerHTML = '';
  for (const subject of subjects) {
    let chapCount = 0;
    try {
      const res  = await fetch(subject.file);
      const info = await res.json();
      chapCount  = info.chapters ? info.chapters.length : 0;
    } catch {}

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.innerHTML = `
      <span class="subject-icon">${subject.icon}</span>
      <div class="subject-name">${subject.name}</div>
      <div class="subject-chapters">${chapCount} chapters</div>
    `;
    card.addEventListener('click', () => openSubject(subject));
    subjectsGrid.appendChild(card);
  }
}

// ===== OPEN SUBJECT =====
async function openSubject(subject) {
  loadingOverlay.classList.remove('hidden');
  currentSubject = subject;

  try {
    const res  = await fetch(subject.file);
    const info = await res.json();

    document.getElementById('chapterIcon').textContent        = subject.icon;
    document.getElementById('chapterSubjectName').textContent = subject.name;

    const grid = document.getElementById('chaptersGrid');
    grid.innerHTML = '';

    info.chapters.forEach((ch, i) => {
      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div class="chapter-num">${i + 1}</div>
        <div class="chapter-name">${ch.name}</div>
      `;
      card.addEventListener('click', () => openChapter(ch));
      grid.appendChild(card);
    });

    loadingOverlay.classList.add('hidden');
    showScreen('chapters');

  } catch {
    loadingOverlay.classList.add('hidden');
    alert('Failed to load subject.');
  }
}

// ===== OPEN CHAPTER =====
function openChapter(chapter) {
  currentChapter = chapter;
  document.getElementById('typeIcon').textContent        = currentSubject.icon;
  document.getElementById('typeSubjectLabel').textContent = currentSubject.name;
  document.getElementById('typeChapterName').textContent = chapter.name;
  showScreen('typeSelect');
}

// ===== PDF =====
document.getElementById('btnPDF').addEventListener('click', () => {
  if (currentChapter && currentChapter.pdf) {
    window.open(currentChapter.pdf, '_blank');
  } else {
    alert('No PDF available for this chapter yet.');
  }
});

// ===== QUIZ =====
document.getElementById('btnQuiz').addEventListener('click', async () => {
  if (!currentChapter || !currentChapter.quiz) {
    alert('No quiz available for this chapter yet.');
    return;
  }
  await startQuiz(currentChapter.quiz, currentChapter.name);
});

// ===== START QUIZ =====
async function startQuiz(quizFile, chapterName) {
  loadingOverlay.classList.remove('hidden');
  try {
    const res    = await fetch(quizFile);
    allQuestions = await res.json();
    allQuestions = shuffle(allQuestions);
    allQuestions.forEach(q => q.topic = chapterName);

    currentQ     = 0;
    score        = 0;
    wrongAnswers = [];

    // تسجيل حل اختبار جديد
    const studyID    = getOrCreateStudyID();
    const quizCount  = incrementQuiz();
    const visitCount = parseInt(localStorage.getItem('qs_visit_count') || '0');
    submitToForm(studyID, visitCount, quizCount);

    loadingOverlay.classList.add('hidden');
    document.getElementById('headerSubject').textContent = currentSubject.name;
    document.getElementById('headerChapter').textContent = chapterName;
    showScreen('quiz');
    renderQuestion();
  } catch {
    loadingOverlay.classList.add('hidden');
    alert('Failed to load quiz.');
  }
}

// ===== SHUFFLE =====
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ===== RENDER QUESTION =====
function renderQuestion() {
  if (currentQ >= allQuestions.length) {
    showResult();
    return;
  }

  answered = false;
  const q  = allQuestions[currentQ];

  document.getElementById('qCurrent').textContent    = currentQ + 1;
  document.getElementById('qTotal').textContent      = allQuestions.length;
  document.getElementById('qScore').textContent      = score;
  document.getElementById('qNum').textContent        = currentQ + 1;
  document.getElementById('qTopicTag').textContent   = q.topic || 'General';
  document.getElementById('progressFill').style.width =
    ((currentQ / allQuestions.length) * 100) + '%';
  document.getElementById('questionText').textContent = q.question;

  const optionsList = document.getElementById('optionsList');
  optionsList.innerHTML = '';
  const letters = ['A','B','C','D','E','F'];

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `
      <span class="option-letter">${letters[i]}</span>
      <span class="option-text">${opt}</span>
      <span class="option-icon"></span>
    `;
    btn.addEventListener('click', () => selectAnswer(btn, i, q));
    optionsList.appendChild(btn);
  });

  document.getElementById('feedbackBox').className = 'feedback-box';
  document.getElementById('btnSkip').style.display = '';
  document.getElementById('btnNext').style.display = 'none';
}

// ===== SELECT ANSWER =====
function selectAnswer(btn, index, q) {
if (answered) return;
answered = true;

const buttons = document.querySelectorAll('.option-btn');
buttons.forEach(b => b.disabled = true);

const isCorrect = index === q.correct;

if (isCorrect) {

btn.classList.add('correct');
btn.querySelector('.option-icon').textContent = '✓';

score++;
document.getElementById('qScore').textContent = score;

showFeedback(
  true,
  `✓ Correct!

${q.explanation || ''}`
);

} else {

btn.classList.add('wrong');
btn.querySelector('.option-icon').textContent = '✗';

buttons[q.correct].classList.add('show-correct');
buttons[q.correct].querySelector('.option-icon').textContent = '✓';

showFeedback(
  false,
  `✗ Wrong!

Correct Answer:
${q.options[q.correct]}

Explanation:
${q.explanation || 'No explanation available.'}`
);

wrongAnswers.push({
  question:      q.question,
  topic:         q.topic,
  userAnswer:    q.options[index],
  correctAnswer: q.options[q.correct],
  explanation:   q.explanation || '',
  qNum:          currentQ + 1,
});

}

document.getElementById('btnSkip').style.display = 'none';
document.getElementById('btnNext').style.display = '';
}
// ===== FEEDBACK =====
function showFeedback(correct, msg) {
  const box = document.getElementById('feedbackBox');
  box.className = `feedback-box show ${correct ? 'correct' : 'wrong'}`;
  document.getElementById('feedbackIcon').textContent = correct ? '✓' : '✗';
  document.getElementById('feedbackText').textContent = msg;
}

// ===== SKIP =====
document.getElementById('btnSkip').addEventListener('click', () => {
  currentQ++;
  renderQuestion();
});

// ===== NEXT =====
document.getElementById('btnNext').addEventListener('click', () => {
  currentQ++;
  renderQuestion();
});

// ===== SHOW RESULT =====
function showResult() {
  showScreen('result');

  const total = allQuestions.length;
  const pct   = Math.round((score / total) * 100);
  const wrong = total - score;

  setTimeout(() => {
    document.getElementById('ringFill').style.strokeDashoffset =
      345 - (pct / 100) * 345;
  }, 100);

  document.getElementById('scorePct').textContent   = pct + '%';
  document.getElementById('resCorrect').textContent = score;
  document.getElementById('resWrong').textContent   = wrong;
  document.getElementById('resTotal').textContent   = total;

  if (pct >= 90) {
    document.getElementById('resultEmoji').textContent    = '🏆';
    document.getElementById('resultTitle').textContent    = 'Excellent!';
    document.getElementById('resultSubtitle').textContent = 'Outstanding performance!';
  } else if (pct >= 70) {
    document.getElementById('resultEmoji').textContent    = '🎉';
    document.getElementById('resultTitle').textContent    = 'Well Done!';
    document.getElementById('resultSubtitle').textContent = 'Great job, keep it up!';
  } else if (pct >= 50) {
    document.getElementById('resultEmoji').textContent    = '📚';
    document.getElementById('resultTitle').textContent    = 'Good Effort!';
    document.getElementById('resultSubtitle').textContent = 'Review and try again.';
  } else {
    document.getElementById('resultEmoji').textContent    = '💪';
    document.getElementById('resultTitle').textContent    = 'Keep Studying!';
    document.getElementById('resultSubtitle').textContent = 'You can do better!';
  }

  renderWrongReview();
}

// ===== WRONG REVIEW =====
function renderWrongReview() {
  const section = document.getElementById('wrongReviewSection');
  section.innerHTML = '';

  if (wrongAnswers.length === 0) {
    section.innerHTML =
      '<div class="no-wrong-msg">🎉 Perfect Score! No wrong answers!</div>';
    return;
  }

  const title = document.createElement('div');
  title.className = 'wrong-review-title';
  title.innerHTML = `❌ Wrong Answers <span>${wrongAnswers.length}</span>`;
  section.appendChild(title);

  wrongAnswers.forEach(item => {
    const div = document.createElement('div');
    div.className = 'wrong-item';
    div.innerHTML = `
      <div class="wrong-item-meta">
        <span class="wrong-item-num">Q${item.qNum}</span>
        <span class="wrong-item-topic">${item.topic}</span>
      </div>
      <div class="wrong-item-q">${item.question}</div>
      <div class="wrong-item-answers">
        <div class="answer-row user-wrong">
          <span class="answer-row-icon">✗</span>
          <span class="answer-row-label">Your Answer</span>
          <span>${item.userAnswer}</span>
        </div>
        <div class="answer-row correct-ans">
          <span class="answer-row-icon">✓</span>
          <span class="answer-row-label">Correct</span>
          <span>${item.correctAnswer}</span>
        </div>
      </div>
    `;
    section.appendChild(div);
  });
}

// ===== RETRY =====
document.getElementById('restartBtn').addEventListener('click', () => {
  currentQ     = 0;
  score        = 0;
  wrongAnswers = [];
  allQuestions = shuffle(allQuestions);
  document.getElementById('ringFill').style.strokeDashoffset = 345;
  showScreen('quiz');
  renderQuestion();
});

// ===== HOME =====
document.getElementById('homeBtn').addEventListener('click', () => {
  document.getElementById('ringFill').style.strokeDashoffset = 345;
  showScreen('home');
});

// ===== BACK BUTTONS =====
document.getElementById('backToHome').addEventListener('click',     () => showScreen('home'));
document.getElementById('backToChapters').addEventListener('click', () => showScreen('chapters'));
document.getElementById('backToType').addEventListener('click',     () => showScreen('typeSelect'));

// ===== COUNTDOWN =====
function startCountdown() {
  // ← غيّر التاريخ هنا
  const graduation = new Date('2027-06-22T00:00:00');

  function update() {
    const now  = new Date();
    const diff = graduation - now;

    if (diff <= 0) {
      const wrap = document.querySelector('.countdown-wrap');
      if (wrap) {
        wrap.innerHTML = `
          <div class="countdown-finished">
            🎓 مبروك التخرج! 🎉
          </div>`;
      }
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    function setVal(id, val) {
      const el = document.getElementById(id);
      if (!el) return;
      const str = String(val).padStart(2, '0');
      if (el.textContent !== str) {
        el.textContent = str;
        el.classList.remove('tick');
        void el.offsetWidth; // restart animation
        el.classList.add('tick');
        setTimeout(() => el.classList.remove('tick'), 300);
      }
    }

    setVal('cdDays',  days);
    setVal('cdHours', hours);
    setVal('cdMins',  mins);
    setVal('cdSecs',  secs);
  }

  update();
  setInterval(update, 1000);
}
// ===== STUDY ID =====
function generateStudyID() {
  const now    = new Date();
  const date   = now.toISOString().slice(0,10).replace(/-/g,'');
  const time   = now.toTimeString().slice(0,8).replace(/:/g,'');
  const ms     = String(now.getMilliseconds()).padStart(3,'0');
  const chars  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${date}-${time}-${ms}-${rand}`;
}

function getOrCreateStudyID() {
  let id = localStorage.getItem('qs_study_id');
  if (!id) {
    id = generateStudyID();
    localStorage.setItem('qs_study_id', id);
    localStorage.setItem('qs_first_visit', new Date().toISOString());
    localStorage.setItem('qs_visit_count', '0');
    localStorage.setItem('qs_quiz_count',  '0');
  }
  return id;
}

function incrementVisit() {
  const count = parseInt(localStorage.getItem('qs_visit_count') || '0') + 1;
  localStorage.setItem('qs_visit_count', String(count));
  return count;
}

function incrementQuiz() {
  const count = parseInt(localStorage.getItem('qs_quiz_count') || '0') + 1;
  localStorage.setItem('qs_quiz_count', String(count));
  return count;
}

// ===== GOOGLE FORM SUBMIT =====
function submitToForm(studyID, visitCount, quizCount) {
  const formURL = 'https://docs.google.com/forms/d/e/1FAIpQLSdM9WeD2E5fO4Flx5WAtH9cjVUs_DttGiEnzZKvXl8Is-ntfQ/formResponse';
  const data    = new FormData();
  data.append('entry.2005968291', studyID);
  data.append('entry.461461508',  String(visitCount));
  data.append('entry.1641756132', String(quizCount));

  // إرسال في الخلفية بدون أي popup
  fetch(formURL, {
    method: 'POST',
    body:   data,
    mode:   'no-cors',
  }).catch(() => {});
}

// ===== ANALYTICS INIT =====
function initAnalytics() {
  const studyID    = getOrCreateStudyID();
  const visitCount = incrementVisit();
  const quizCount  = parseInt(localStorage.getItem('qs_quiz_count') || '0');
  submitToForm(studyID, visitCount, quizCount);
}

// ===== START =====
startCountdown();
initAnalytics();
init();