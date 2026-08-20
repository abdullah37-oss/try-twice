const qualificationRules = {
  'FSc Pre-Engineering': ['FSc Pre-Engineering eligibility', 'Minimum 60% marks in FSc Pre-Engineering. Confirm the current-year criteria with Admissions.'],
  'FSc Pre-Medical/Computer Science': ['FSc Pre-Medical / Computer Science eligibility', 'Equivalent qualification may be considered subject to current policy. Confirm compatibility with Admissions.'],
  'A-Level': ['A-Level eligibility', 'A-Level is accepted with IBCC equivalency. Minimum 60% equivalent marks must be submitted by the deadline.'],
  DAE: ['DAE eligibility', 'Relevant DAE with 60% marks from a recognized Board of Technical Education is required.']
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function initAdmissions() {
  const steps = $$('.form-step');
  const stepDots = $$('.step');
  const nextBtn = $('#nextBtn');
  const prevBtn = $('#prevBtn');
  const qualification = $('#qualification');
  const eligibility = $('#eligibilityBox');
  const localFee = $('#localFeePanel');
  const foreignFee = $('#foreignFeePanel');
  if (!steps.length || !nextBtn || !prevBtn) return;

  let currentStep = 0;
  const renderEligibility = () => {
    const rule = qualificationRules[qualification.value];
    if (rule && eligibility) eligibility.innerHTML = `<strong>${rule[0]}</strong><p>${rule[1]}</p>`;
  };
  const updateUI = () => {
    steps.forEach((step, index) => step.classList.toggle('active', index === currentStep));
    stepDots.forEach((dot, index) => dot.classList.toggle('active', index === currentStep));
    prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-flex';
    nextBtn.textContent = currentStep === steps.length - 2 ? 'Submit' : 'Next';
  };
  const valid = () => {
    const current = steps[currentStep];
    if (current.dataset.step === '4' && (!$('#fullName')?.value.trim() || !$('#mobile')?.value.trim() || !$('#email')?.value.trim())) {
      alert('Please complete your full name, mobile number, and email address.');
      return false;
    }
    return true;
  };
  const summary = () => {
    const name = $('#fullName')?.value.trim() || 'Applicant';
    const ref = `IIEE-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    if ($('#referenceNumber')) $('#referenceNumber').textContent = ref;
    if ($('#summaryDetails')) $('#summaryDetails').innerHTML = `<strong>Applicant:</strong> ${name}<br><strong>Program:</strong> B.E. Industrial Electronics Engineering<br><strong>Qualification:</strong> ${qualification.value}`;
    if ($('#whatsappLink')) $('#whatsappLink').href = `https://wa.me/9232199244218?text=${encodeURIComponent(`Hello IIEE Admissions, my name is ${name}. Reference Number: ${ref}.`)}`;
  };
  nextBtn.addEventListener('click', () => { if (valid() && currentStep < steps.length - 1) { currentStep += 1; updateUI(); if (currentStep === steps.length - 1) summary(); } });
  prevBtn.addEventListener('click', () => { if (currentStep > 0) { currentStep -= 1; updateUI(); } });
  qualification?.addEventListener('change', renderEligibility);
  $$('input[name="applicantType"]').forEach((radio) => radio.addEventListener('change', () => { localFee?.classList.toggle('active', radio.value === 'local' && radio.checked); foreignFee?.classList.toggle('active', radio.value === 'foreign' && radio.checked); }));
  renderEligibility();
  updateUI();
}

function initFaq() {
  $$('.faq-question').forEach((button) => button.addEventListener('click', () => button.parentElement.classList.toggle('active')));
}

function initReader() {
  const backdrop = $('.reader-backdrop');
  const title = $('#readerTitle');
  const leftCanvas = $('#leftPage');
  const rightCanvas = $('#rightPage');
  const spread = $('.book-spread');
  const download = $('#readerDownload');
  const indicator = $('#readerIndicator');
  if (!backdrop) return;
  const magazines = {
    chronicles: { title: 'IIEE Chronicles · 2024–25', pdf: 'assets/IIEE%20Chronicles%202024-25.pdf' },
    archive: { title: 'IIEE Chronicles · 2025–26', pdf: 'assets/IIEE%20Chronicles%202025-26%20(2).pdf' }
  };
  let pdfDocument = null;
  let activeKey = null;
  let pageStart = 1;
  let dragStart = null;
  let pdfLoader = null;
  let isTurning = false;
  const isMobileReader = () => window.matchMedia('(max-width: 600px)').matches;

  const loadPdfJs = () => {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfLoader) return pdfLoader;
    pdfLoader = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; resolve(window.pdfjsLib); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return pdfLoader;
  };

  const drawPage = async (pageNumber, canvas) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (!pdfDocument || pageNumber > pdfDocument.numPages) return;
    const page = await pdfDocument.getPage(pageNumber);
    const baseViewport = page.getViewport({ scale: 1 });
    const availableWidth = Math.max(260, canvas.parentElement.clientWidth / 2 - 18);
    const scale = Math.min(1.8, availableWidth / baseViewport.width);
    const viewport = page.getViewport({ scale });
    const ratio = window.devicePixelRatio || 1;
    canvas.width = viewport.width * ratio;
    canvas.height = viewport.height * ratio;
    canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;
    await page.render({ canvasContext: context, viewport, transform: [ratio, 0, 0, ratio, 0, 0] }).promise;
  };

  const renderSpread = async (direction = '') => {
    if (!pdfDocument) return;
    spread.classList.remove('turn-forward', 'turn-back');
    if (direction) {
      spread.classList.add(direction === 'next' ? 'turn-forward' : 'turn-back');
      await new Promise((resolve) => setTimeout(resolve, 180));
    }
    if (isMobileReader()) {
      rightCanvas.getContext('2d').clearRect(0, 0, rightCanvas.width, rightCanvas.height);
      await drawPage(pageStart, leftCanvas);
      indicator.textContent = `Page ${pageStart} of ${pdfDocument.numPages}`;
    } else {
      await Promise.all([drawPage(pageStart, leftCanvas), drawPage(pageStart + 1, rightCanvas)]);
      indicator.textContent = `Pages ${pageStart}–${Math.min(pageStart + 1, pdfDocument.numPages)} of ${pdfDocument.numPages}`;
    }
    spread.classList.remove('turn-forward', 'turn-back');
  };

  const turn = async (direction) => {
    if (!pdfDocument || isTurning) return;
    const increment = isMobileReader() ? 1 : 2;
    const nextStart = direction === 'next' ? pageStart + increment : pageStart - increment;
    if (nextStart >= 1 && nextStart <= pdfDocument.numPages) {
      isTurning = true;
      pageStart = nextStart;
      await renderSpread(direction);
      isTurning = false;
    }
  };

  const openMagazine = async (key) => {
    const item = magazines[key];
    activeKey = key;
    title.textContent = item.title;
    download.href = item.pdf;
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    indicator.textContent = 'Loading magazine…';
    try {
      const pdfjs = await loadPdfJs();
      pdfDocument = await pdfjs.getDocument(item.pdf).promise;
      pageStart = 1;
      isTurning = false;
      await renderSpread();
    } catch (error) {
      indicator.textContent = 'Use Open PDF in new tab to read this magazine.';
      console.error('Unable to render magazine PDF:', error);
    }
  };

  $$('.magazine').forEach((button) => button.addEventListener('click', () => openMagazine(button.dataset.magazine)));
  $('.shelf-link')?.addEventListener('click', (event) => { event.preventDefault(); openMagazine('chronicles'); });
  $('.reader-close')?.addEventListener('click', () => { backdrop.classList.remove('open'); backdrop.setAttribute('aria-hidden', 'true'); });
  $('.reader-next')?.addEventListener('click', () => turn('next'));
  $('.reader-prev')?.addEventListener('click', () => turn('prev'));
  $('.book-next-zone')?.addEventListener('click', () => turn('next'));
  $('.book-prev-zone')?.addEventListener('click', () => turn('prev'));
  spread?.addEventListener('pointerdown', (event) => { dragStart = event.clientX; spread.setPointerCapture?.(event.pointerId); });
  spread?.addEventListener('pointerup', (event) => { if (dragStart === null) return; const distance = event.clientX - dragStart; dragStart = null; if (Math.abs(distance) > 55) turn(distance < 0 ? 'next' : 'prev'); });
  backdrop.addEventListener('click', (event) => { if (event.target === backdrop) backdrop.classList.remove('open'); });
}

function initMobileMenu() {
  $$('.mobile-menu').forEach((button) => {
    button.addEventListener('click', () => {
      const nav = button.parentElement.querySelector('.main-nav');
      nav?.classList.toggle('open');
    });
  });
}

initAdmissions();
initFaq();
initReader();
initMobileMenu();
