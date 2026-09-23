// ============================================================
// 1. CONFIGURATION (Dono WhatsApp Numbers & Dono Gmails)
// ============================================================
// Pehla WhatsApp Number (Country code '92' ke sath)
const HOST_WHATSAPP_1 = "923370723980"; 

// Doosra WhatsApp Number
const HOST_WHATSAPP_2 = "923126611363"; 

// Pehli Gmail Address
const HOST_GMAIL_1 = "usamaali0723980@gmail.com"; 

// Doosri Gmail Address
const HOST_GMAIL_2 = "zaidbhakkar70@gmail.com"; 

// Wedding Event Date (17 Oct 2026, 12:00 PM)
const TARGET_DATE = new Date('October 17, 2026 12:00:00').getTime();


// ============================================================
// 2. ENVELOPE ANIMATION & INSTANT AUDIO UNLOCK
// ============================================================
const waxSealBtn = document.getElementById('waxSealBtn');
const envelopeShell = document.getElementById('envelopeShell');
const envelopeOverlay = document.getElementById('envelopeOverlay');
const audioToggle = document.getElementById('audioToggle');

// Global audio element
const bgMusic = new Audio('./music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.5;

// Seal Button Click: Music instant start hoga
waxSealBtn.addEventListener('click', function() {
  bgMusic.play().then(() => {
    audioToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  }).catch((err) => {
    console.log('Audio playback error:', err);
  });

  envelopeShell.classList.add('is-open');

  setTimeout(() => {
    envelopeOverlay.classList.add('hidden-overlay');
  }, 2600);
});

// Floating Music Toggle Button
audioToggle.addEventListener('click', function() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      audioToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }).catch(e => console.log(e));
  } else {
    bgMusic.pause();
    audioToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
});


// ============================================================
// 3. INTERACTIVE SCRATCH TO REVEAL CARD
// ============================================================
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const scratchFill = document.getElementById('scratchFill');
const scratchNotice = document.getElementById('scratchNotice');

let isDrawing = false;
let cardRevealed = false;

function setupScratchCanvas() {
  const w = canvas.width;
  const h = canvas.height;

  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#dfb44f');
  grad.addColorStop(0.3, '#ffdf85');
  grad.addColorStop(0.5, '#c59b27');
  grad.addColorStop(0.8, '#f9e099');
  grad.addColorStop(1, '#9b6e14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 350; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.45)' : 'rgba(80,50,5,0.2)';
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = '#855d0a';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, w - 24, h - 24);

  ctx.fillStyle = '#402c03';
  ctx.font = 'bold 15px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.fillText('SCRATCH WITH FINGER', w / 2, h / 2 - 12);
  ctx.font = 'italic 14px Cormorant Garamond, serif';
  ctx.fillText('✦ To Reveal Our Date ✦', w / 2, h / 2 + 15);
}

function doScratch(x, y) {
  if (cardRevealed) return;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2, false);
  ctx.fill();
  calcScratchPercentage();
}

function getCoords(e) {
  const rect = canvas.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : e.clientX;
  const cy = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (cx - rect.left) * (canvas.width / rect.width),
    y: (cy - rect.top) * (canvas.height / rect.height)
  };
}

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const c = getCoords(e);
  doScratch(c.x, c.y);
});
window.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const c = getCoords(e);
  doScratch(c.x, c.y);
});
window.addEventListener('mouseup', () => { isDrawing = false; });

canvas.addEventListener('touchstart', (e) => {
  isDrawing = true;
  const c = getCoords(e);
  doScratch(c.x, c.y);
}, { passive: true });

canvas.addEventListener('touchmove', (e) => {
  if (!isDrawing) return;
  const c = getCoords(e);
  doScratch(c.x, c.y);
}, { passive: true });

canvas.addEventListener('touchend', () => { isDrawing = false; });

function calcScratchPercentage() {
  if (cardRevealed) return;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let cleared = 0;
  const len = data.length;

  for (let i = 3; i < len; i += 16) {
    if (data[i] === 0) cleared += 4;
  }

  const percent = Math.min(100, Math.round((cleared / (len / 4)) * 100));
  scratchFill.style.width = percent + '%';

  if (percent >= 40) {
    cardRevealed = true;
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => { canvas.style.display = 'none'; }, 600);
    scratchNotice.innerHTML = '🎉 <strong style="color:#27ae60;">Revealed! You are warmly invited!</strong>';
    scratchFill.style.width = '100%';
  }
}

setupScratchCanvas();


// ============================================================
// 4. LIVE COUNTDOWN TIMER
// ============================================================
const timer = setInterval(() => {
  const now = new Date().getTime();
  const diff = TARGET_DATE - now;

  if (diff < 0) {
    clearInterval(timer);
    document.getElementById('countdown').innerHTML = "<h3 style='color:var(--gold-primary); font-family:var(--font-serif);'>Celebrations Have Begun!</h3>";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').innerText = String(d).padStart(2, '0');
  document.getElementById('hours').innerText = String(h).padStart(2, '0');
  document.getElementById('minutes').innerText = String(m).padStart(2, '0');
  document.getElementById('seconds').innerText = String(s).padStart(2, '0');
}, 1000);


// ============================================================
// 5. RSVP HANDLERS (Dono Numbers aur Dono Emails par Delivery)
// ============================================================
function readFormData() {
  const name = document.getElementById('guestName').value.trim();
  const status = document.getElementById('attendingStatus').value;
  const count = document.getElementById('guestCount').value;
  const message = document.getElementById('guestMessage').value.trim();

  if (!name) {
    alert('Please enter your full name.');
    return null;
  }
  if (!status) {
    alert('Please select whether you will attend.');
    return null;
  }

  return { name, status, count, message };
}

// 1. WhatsApp Button (Dono Numbers par Chat Open Karega)
document.getElementById('sendWhatsApp').addEventListener('click', () => {
  const data = readFormData();
  if (!data) return;

  const rawMsg = 
    `*Wedding RSVP | Usama & Jaweria*\n\n` +
    `*Guest Name:* ${data.name}\n` +
    `*Attendance:* ${data.status}\n` +
    `*Total Persons:* ${data.count}\n` +
    `*Prayers & Wishes:* ${data.message || 'Heartiest congratulations!'}\n\n` +
    `*Venue:* Sittara Marriage Hall, Bhakkar`;

  const encodedMsg = encodeURIComponent(rawMsg);

  // Pehle WhatsApp number par chat open karein
  window.open(`https://api.whatsapp.com/send?phone=${HOST_WHATSAPP_1}&text=${encodedMsg}`, '_blank');

  // Agar doosra number mojood hai to 400ms ke gap ke sath uski chat bhi open karein
  if (HOST_WHATSAPP_2 && HOST_WHATSAPP_2 !== HOST_WHATSAPP_1) {
    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?phone=${HOST_WHATSAPP_2}&text=${encodedMsg}`, '_blank');
    }, 400);
  }
});

// 2. Direct Gmail Button (Dono Gmails par ek sath message send karega)
document.getElementById('sendEmail').addEventListener('click', () => {
  const data = readFormData();
  if (!data) return;

  const subject = `RSVP - Wedding of Usama & Jaweria (${data.name})`;
  const bodyText = `Wedding Invitation RSVP Response\n\n` +
                   `Guest Name: ${data.name}\n` +
                   `Attendance Status: ${data.status}\n` +
                   `Total Persons: ${data.count}\n` +
                   `Warm Wishes: ${data.message || 'Heartiest congratulations!'}\n\n` +
                   `Venue: Sittara Marriage Hall, Bhakkar`;

  let targetEmails = HOST_GMAIL_1;
  if (HOST_GMAIL_2 && HOST_GMAIL_2 !== HOST_GMAIL_1) {
    targetEmails = `${HOST_GMAIL_1},${HOST_GMAIL_2}`;
  }

  const gmailComposeURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetEmails)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const mailtoURL = `mailto:${targetEmails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

  const newTab = window.open(gmailComposeURL, '_blank');
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    window.location.href = mailtoURL;
  }
});


// ============================================================
// 6. DYNAMIC PERSONALIZATION (ROBUST & FAMILY DETECTION FIX)
// ============================================================
let globalCleanGuestName = '';
let isSingleGuestMode = false;

window.addEventListener('DOMContentLoaded', () => {
  // Query string nikal kar decode karein
  const rawSearch = window.location.search || '';
  
  if (rawSearch.includes('guest=')) {
    // 1. Puri query string se guest part nikaalein taake '&' par parameter na tootay
    let rawGuestPart = rawSearch.split('guest=')[1] || '';
    
    // Agar URL me koi aur doosra parameter '?' ya '&key=' ki form me ho
    let cleanGuestString = decodeURIComponent(rawGuestPart.replace(/\+/g, ' ')).trim();

    // Check karein kya string me 'family' lafz mojood hai
    const isFamily = cleanGuestString.toLowerCase().includes('family');

    if (isFamily) {
      // Agar '&' ki wajah se break hua ho ya direct likha ho to clean naam ensure karein
      // Example: "Usama & Family"
      let baseName = cleanGuestString.split(/&|family/i)[0].trim();
      globalCleanGuestName = baseName ? `${baseName} & Family` : cleanGuestString;
    } else {
      // Single person ka simple naam
      globalCleanGuestName = cleanGuestString;
    }

    // 2. Envelope ke bottom par personalized naam
    const envelopeInviteText = document.querySelector('.invited-txt');
    if (envelopeInviteText) {
      envelopeInviteText.innerHTML = `DEAR ${globalCleanGuestName.toUpperCase()}<br><span style="font-size:0.75rem; letter-spacing:2px;">YOU ARE INVITED</span>`;
    }

    // 3. Scratch card me dynamic guest name
    const scratchSub = document.querySelector('.hidden-p');
    if (scratchSub) {
      scratchSub.innerText = `Specially Invited: ${globalCleanGuestName}`;
    }

    // 4. RSVP form me name auto-fill
    const nameInput = document.getElementById('guestName');
    if (nameInput) {
      nameInput.value = globalCleanGuestName;
    }

    // 5. SMART CHECK: Family vs Single Guest
    const countWrapper = document.getElementById('guestCountWrapper');
    const guestCountSelect = document.getElementById('guestCount');

    const eventArrival = document.getElementById('eventArrival');
    const eventBarat = document.getElementById('eventBarat');
    const eventWalima = document.getElementById('eventWalima');
    const timelineGrid = document.querySelector('.timeline-grid');

    if (!isFamily) {
      // --- SINGLE GUEST (SIRF WALIMA INVITE) ---
      isSingleGuestMode = true;

      // A. Total Persons hide karein aur 1 Person par lock karein
      if (countWrapper && guestCountSelect) {
        guestCountSelect.value = "1 Person";
        countWrapper.style.display = 'none';

        const fieldGrid = document.querySelector('.field-grid');
        if (fieldGrid) {
          fieldGrid.style.gridTemplateColumns = '1fr';
        }
      }

      // B. Arrival aur Barat hide karein
      if (eventArrival) eventArrival.style.display = 'none';
      if (eventBarat) eventBarat.style.display = 'none';

      // C. Walima wale card ko center align karein
      if (timelineGrid) {
        timelineGrid.style.display = 'flex';
        timelineGrid.style.justifyContent = 'center';
      }
      if (eventWalima) {
        eventWalima.style.maxWidth = '420px';
        eventWalima.style.width = '100%';
        eventWalima.classList.add('highlight-box');
      }

      // D. Dates ko Walima (18th Oct) par update karein
      const badgeDate = document.querySelector('.wedding-badge span');
      if (badgeDate) badgeDate.innerText = "OCTOBER 18, 2026 (WALIMA)";

      const letterDate = document.querySelector('.letter-date');
      if (letterDate) letterDate.innerText = "18 OCTOBER 2026";

      const footDate = document.querySelector('.foot-date');
      if (footDate) footDate.innerText = "18th October 2026 • Sittara Marriage Hall, Bhakkar";

    } else {
      // --- FAMILY GUEST (FULL BARAT + WALIMA INVITE) ---
      isSingleGuestMode = false;
      if (eventArrival) eventArrival.style.display = 'block';
      if (eventBarat) eventBarat.style.display = 'block';
    }
  }
});


// ============================================================
// 7. MULTI-LANGUAGE SWITCHER (ENGLISH <-> URDU)
// ============================================================
const langToggleBtn = document.getElementById('langToggleBtn');
const langText = document.getElementById('langText');
let activeLanguage = 'en';

const urduTranslations = {
  honorText: "ہم آپ کو دل کی اتھاہ گہرائیوں سے دعوت دیتے ہیں<br>شادی خانہ آبادی برائے",
  groomParents: "فرزندِ ارجمند: محترم و محترمہ ذوالفقار علی",
  brideParents: "دخترِ نیک اختر: محترم و محترمہ اشرف",
  weddingBadge: "۱۷ - ۱۸ اکتوبر ۲۰۲۶",
  weddingBadgeWalimaOnly: "۱۸ اکتوبر ۲۰۲۶ (دعوتِ ولیمہ)",
  scrollDown: "نیچے تشریف لائیں",
  coupleHeading: "خوش و خرم جوڑا",
  groomDesig: "دولہا",
  brideDesig: "دلہن",
  scratchHeading: "دعوت نامہ کھولیں",
  scratchDesc: "تاریخ اور خصوصی دعوت نامہ دیکھنے کے لیے کارڈ کو انگلی سے کھرچیں",
  scratchNotice: "تاریخ جاننے کے لیے کارڈ کو آہستہ سے کھرچیں",
  timerHeading: "شادی کی تقریب میں باقی وقت",
  timelineHeading: "پروگرامِ تقریب",
  timelineDesc: "ہماری خوشیوں کو دوبالا کرنے کے لیے لازمی شرکت فرمائیں",
  arrivalTitle: "آمدِ مہمانِ گرامی",
  arrivalDate: "ہفتہ، ۱۷ اکتوبر ۲۰۲۶",
  arrivalDesc: "معزز مہمانوں اور اہل خانہ کا پرخلوص استقبال۔",
  baratTitle: "بارات و نکاح",
  baratDesc: "سنتِ نبوی ﷺ کے مطابق نکاح اور بعد ازاں دعوتِ طعام۔",
  walimaTitle: "دعوتِ ولیمہ",
  walimaDate: "اتوار، ۱۸ اکتوبر ۲۰۲۶",
  walimaDesc: "نوبیاہتا جوڑے کے اعزاز میں پروقار عشائیہ۔",
  venueHeading: "مقامِ تقریب",
  venueGuide: "تمام معزز مہمانوں کے آرام اور گاڑیوں کی پارکنگ کے بہترین انتظامات موجود ہیں۔",
  venueMapBtn: "گوگل میپ پر دیکھیں",
  rsvpHeading: "اطلاعِ آمد (RSVP)",
  rsvpDesc: "برائے مہربانی اپنی شرکت کی تصدیق فرمائیں تاکہ ہم آپ کا شایانِ شان استقبال کر سکیں",
  footMsg: "ہم آپ کی آمد اور مبارک دعاؤں کے منتظر ہیں!"
};

const englishOriginals = {
  honorText: "We are honored to welcome you to<br>the Wedding ceremony of..",
  groomParents: "Son of Mr. & Mrs. Zulfiqar Ali",
  brideParents: "Daughter of Mr. & Mrs. Ashraf",
  weddingBadge: "OCTOBER 17 - 18, 2026",
  weddingBadgeWalimaOnly: "OCTOBER 18, 2026 (WALIMA)",
  scrollDown: "SCROLL DOWN",
  coupleHeading: "The Happy Couple",
  groomDesig: "The Groom",
  brideDesig: "The Bride",
  scratchHeading: "Scratch To Reveal",
  scratchDesc: "Scratch the gold card below with your finger or mouse to unveil the wedding message",
  scratchNotice: "Scratch gently to reveal our date!",
  timerHeading: "Counting Down To The Big Day",
  timelineHeading: "Wedding Itinerary",
  timelineDesc: "Please join us for every special celebration",
  arrivalTitle: "Guests Arrival",
  arrivalDate: "Saturday, 17th October 2026",
  arrivalDesc: "Warm reception and welcoming of all guests and family members.",
  baratTitle: "Wedding Ceremony (Barat)",
  baratDesc: "The sacred Nikah ritual followed by wedding luncheon.",
  walimaTitle: "Reception (Walima)",
  walimaDate: "Sunday, 18th October 2026",
  walimaDesc: "Royal dinner banquet to celebrate the newlywed couple.",
  venueHeading: "Wedding Venue",
  venueGuide: "Indoor air-conditioned banquet facilities and parking arrangements made for your comfort.",
  venueMapBtn: "Open in Google Maps",
  rsvpHeading: "RSVP",
  rsvpDesc: "Kindly confirm your presence so we may warmly receive you",
  footMsg: "We look forward to celebrating this memorable day with you!"
};

function applyLanguage(lang) {
  const t = lang === 'ur' ? urduTranslations : englishOriginals;

  if (lang === 'ur') {
    document.body.classList.add('lang-ur');
    if (langText) langText.innerText = 'English';
  } else {
    document.body.classList.remove('lang-ur');
    if (langText) langText.innerText = 'Urdu';
  }

  // Hero Section
  const honorEl = document.querySelector('.honor-text');
  if (honorEl) honorEl.innerHTML = t.honorText;

  const parentsLines = document.querySelectorAll('.hero-inner .parents-line');
  if (parentsLines.length >= 2) {
    parentsLines[0].innerText = t.groomParents;
    parentsLines[1].innerText = t.brideParents;
  }

  const badgeEl = document.querySelector('.wedding-badge span');
  if (badgeEl) {
    badgeEl.innerText = isSingleGuestMode ? t.weddingBadgeWalimaOnly : t.weddingBadge;
  }

  const scrollEl = document.querySelector('.scroll-link span');
  if (scrollEl) scrollEl.innerText = t.scrollDown;

  // Couple Section
  const coupleHead = document.querySelector('.couple-area h2');
  if (coupleHead) coupleHead.innerText = t.coupleHeading;

  const desigEls = document.querySelectorAll('.designation');
  if (desigEls.length >= 2) {
    desigEls[0].innerText = t.groomDesig;
    desigEls[1].innerText = t.brideDesig;
  }

  const parentageEls = document.querySelectorAll('.parentage');
  if (parentageEls.length >= 2) {
    parentageEls[0].innerText = t.groomParents;
    parentageEls[1].innerText = t.brideParents;
  }

  // Scratch Area
  const scratchHead = document.querySelector('.scratch-area h2');
  if (scratchHead) scratchHead.innerText = t.scratchHeading;

  const scratchSub = document.querySelector('.scratch-area .sub-desc');
  if (scratchSub) {
    scratchSub.innerText = globalCleanGuestName 
      ? (lang === 'ur' ? `خصوصی مدعو: ${globalCleanGuestName}` : `Specially Invited: ${globalCleanGuestName}`)
      : t.scratchDesc;
  }

  if (scratchNotice && !cardRevealed) {
    scratchNotice.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> ${t.scratchNotice}`;
  }

  // Timer Section
  const timerHead = document.querySelector('.timer-title');
  if (timerHead) timerHead.innerText = t.timerHeading;

  // Timeline / Itinerary
  const timelineHead = document.querySelector('.events-area h2');
  if (timelineHead) timelineHead.innerText = t.timelineHeading;

  const timelineSub = document.querySelector('.events-area .sub-desc');
  if (timelineSub) timelineSub.innerText = t.timelineDesc;

  const eventArrival = document.getElementById('eventArrival');
  const eventBarat = document.getElementById('eventBarat');
  const eventWalima = document.getElementById('eventWalima');

  if (eventArrival) {
    eventArrival.querySelector('h3').innerText = t.arrivalTitle;
    eventArrival.querySelector('.event-day').innerText = t.arrivalDate;
    eventArrival.querySelector('.event-text').innerText = t.arrivalDesc;
  }

  if (eventBarat) {
    eventBarat.querySelector('h3').innerText = t.baratTitle;
    eventBarat.querySelector('.event-day').innerText = t.arrivalDate;
    eventBarat.querySelector('.event-text').innerText = t.baratDesc;
  }

  if (eventWalima) {
    eventWalima.querySelector('h3').innerText = t.walimaTitle;
    eventWalima.querySelector('.event-day').innerText = t.walimaDate;
    eventWalima.querySelector('.event-text').innerText = t.walimaDesc;
  }

  // Venue Section
  const venueHead = document.querySelector('.venue-area h2');
  if (venueHead) venueHead.innerText = t.venueHeading;

  const venueGuideEl = document.querySelector('.venue-guide');
  if (venueGuideEl) venueGuideEl.innerText = t.venueGuide;

  const mapBtn = document.querySelector('.venue-details .btn-gold');
  if (mapBtn) {
    mapBtn.innerHTML = `<i class="fa-solid fa-diamond-turn-right"></i> ${t.venueMapBtn}`;
  }

  // RSVP Section
  const rsvpHead = document.querySelector('.rsvp-area h2');
  if (rsvpHead) rsvpHead.innerText = t.rsvpHeading;

  const rsvpSub = document.querySelector('.rsvp-area .sub-desc');
  if (rsvpSub) rsvpSub.innerText = t.rsvpDesc;

  // Footer Message
  const footMsgEl = document.querySelector('.foot-msg');
  if (footMsgEl) footMsgEl.innerText = t.footMsg;
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    activeLanguage = activeLanguage === 'en' ? 'ur' : 'en';
    applyLanguage(activeLanguage);
  });
}