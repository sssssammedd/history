/* script.js — initialize AOS, hook buttons and draw a Chart.js timeline */
document.addEventListener('DOMContentLoaded', function () {
  // Initialize AOS (Animate On Scroll)
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic' });
  }

  // Hero scroll button
  const heroScroll = document.getElementById('hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const next = document.querySelector('main') || document.getElementById('voice');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Scroll-to-top button
  const toTop = document.getElementById('to-top');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Tiny Chart.js line chart showing change in recognised land (example data)
  const ctx = document.getElementById('landChart');
  if (ctx && window.Chart) {
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1990','1995','2000','2005','2010','2015','2020','2025'],
        datasets: [{
          label: 'Recognised Native Title (%)',
          data: [2,5,12,18,25,30,38,40],
          borderColor: 'rgba(255,215,140,0.95)',
          backgroundColor: 'linear-gradient(180deg, rgba(255,215,140,0.12), rgba(255,215,140,0.04))',
          tension: 0.3,
          pointRadius: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false }, ticks: { color: '#d7d7d7' } },
          y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#d7d7d7' }, suggestedMin: 0 }
        },
        plugins: { legend: { labels: { color: '#d7d7d7' } } }
      }
    });

    // fix canvas height responsively
    ctx.style.height = '260px';
  }

  // Mabo bar chart (pre/post comparison)
  const maboCtx = document.getElementById('maboBar');
  if (maboCtx && window.Chart) {
    new Chart(maboCtx, {
      type: 'bar',
      data: {
        labels: ['Pre-Mabo (1990)', 'Post-Mabo (2000)'],
        datasets: [{
          label: '% area under recognised native title (approx)',
          data: [6, 25],
          backgroundColor: ['rgba(255,205,86,0.9)','rgba(255,159,64,0.9)']
        }]
      },
      options: { responsive:true, plugins:{ legend:{ display:false }, tooltip:{ enabled:true } }, scales:{ y:{ beginAtZero:true } } }
    });
    maboCtx.style.height = '180px';
  }

  // Smooth anchor scrolling for sticky nav
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // simple reveal for stalled stats (animate numbers on view)
  const statEls = document.querySelectorAll('#impact .glass .text-2xl');
  statEls.forEach(el => {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add('scale-105');
          setTimeout(() => el.classList.remove('scale-105'), 1200);
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  // small accessibility: add alt focusable names for images
  document.querySelectorAll('figure img').forEach(img => {
    if (!img.getAttribute('alt')) img.setAttribute('alt','Illustration');
  });
  
  // Timeline: click a card to open details (simple modal-like alert for now)
  const timeline = document.getElementById('timeline-slider');
  if (timeline) {
    timeline.querySelectorAll('article').forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const year = card.getAttribute('data-year') || '';
        const title = card.querySelector('h3')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        openModal(`${year} — ${title}`, `<p>${desc}</p>`);
      });
    });
  }

  // Quote carousel: rotate some quotes every 5s
  const quotes = [
    { text: 'The Mabo decision did not hand land back; it handed dignity back. – Noel Pearson' },
    { text: 'While great strides have been made, the struggle for true land justice continues. – AIATSIS Report 2023' },
    { text: 'The land still cries for justice. – Senator Pat Dodson' }
  ];
  let qIndex = 0;
  const qEl = document.querySelector('#quote-carousel');
  if (qEl) {
    qEl.textContent = quotes[qIndex].text;
    setInterval(() => {
      qIndex = (qIndex + 1) % quotes.length;
      qEl.textContent = quotes[qIndex].text;
    }, 5000);
  }

  // Mini-quiz modal (very simple): open prompt and show score
  const quizBtn = document.getElementById('open-quiz');
  if (quizBtn) {
    quizBtn.addEventListener('click', () => {
      const html = `
        <div>
          <h3 class="text-lg font-semibold mb-3">Mini Quiz</h3>
          <form id="quiz-form" class="space-y-3">
            <div>
              <label class="block text-sm">1) Which year was the Mabo decision?</label>
              <input name="q1" class="w-full mt-1 p-2 rounded bg-black/10 text-white" placeholder="e.g. 1992">
            </div>
            <div>
              <label class="block text-sm">2) Which Act followed the Mabo decision?</label>
              <input name="q2" class="w-full mt-1 p-2 rounded bg-black/10 text-white" placeholder="e.g. Native Title Act">
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <button type="button" id="quiz-submit" class="px-3 py-2 rounded bg-amber-300/20">Submit</button>
              <button type="button" id="quiz-cancel" class="px-3 py-2 rounded bg-white/6">Cancel</button>
            </div>
          </form>
        </div>`;
      openModal('Mini Quiz', html);
      document.getElementById('quiz-cancel').addEventListener('click', closeModal);
      document.getElementById('quiz-submit').addEventListener('click', () => {
        const form = document.getElementById('quiz-form');
        const q1 = form.q1.value || '';
        const q2 = form.q2.value || '';
        let score = 0;
        if (q1.trim() === '1992') score++;
        if (q2.toLowerCase().includes('native')) score++;
        openModal('Quiz Result', `<p>You scored ${score} / 2</p>`);
      });
    });
  }

  // Research log modal population (basic)
  const researchBtn = document.getElementById('open-research');
  if (researchBtn) {
    researchBtn.addEventListener('click', () => {
      // load from localStorage
      const stored = JSON.parse(localStorage.getItem('researchLog') || '[]');
      const rows = stored.map(r => `<tr class="border-t border-white/6"><td class="px-3 py-2">${r.date}</td><td class="px-3 py-2">${r.task}</td><td class="px-3 py-2">${r.notes}</td></tr>`).join('') || '';
      const html = `
        <div>
          <h3 class="text-lg font-semibold mb-3">Research Log</h3>
          <table class="min-w-full text-sm"><thead><tr class="text-[#d7d7d7]"><th class="px-3 py-2">Date</th><th class="px-3 py-2">Task</th><th class="px-3 py-2">Notes</th></tr></thead><tbody>${rows}</tbody></table>
          <div class="mt-3 flex gap-2 justify-end">
            <button id="add-log" class="px-3 py-2 rounded bg-amber-300/20">Add Entry</button>
            <button id="close-log" class="px-3 py-2 rounded bg-white/6">Close</button>
          </div>
        </div>`;
      openModal('Research Log', html);
      document.getElementById('close-log').addEventListener('click', closeModal);
      document.getElementById('add-log').addEventListener('click', () => {
        const date = prompt('Date (e.g. Oct 21)');
        const task = prompt('Task');
        const notes = prompt('Notes / Sources');
        if (date && task) {
          const arr = JSON.parse(localStorage.getItem('researchLog') || '[]');
          arr.push({ date, task, notes });
          localStorage.setItem('researchLog', JSON.stringify(arr));
          closeModal();
          researchBtn.click(); // reopen to refresh
        }
      });
    });
  }

  // Pledge handling
  const pledgeBtn = document.getElementById('pledge-btn');
  if (pledgeBtn) {
    pledgeBtn.addEventListener('click', () => {
      const html = `
        <div>
          <h3 class="text-lg font-semibold mb-3">Symbolic Pledge of Awareness</h3>
          <p class="text-sm text-[#d7d7d7]">Enter your name to sign a symbolic pledge to learn, listen, and act respectfully towards Indigenous land justice.</p>
          <input id="pledge-name" class="mt-3 w-full p-2 rounded bg-black/10 text-white" placeholder="Your name">
          <div class="mt-3 flex justify-end gap-2">
            <button id="pledge-submit" class="px-3 py-2 rounded bg-amber-300/20">Sign</button>
            <button id="pledge-cancel" class="px-3 py-2 rounded bg-white/6">Cancel</button>
          </div>
        </div>`;
      openModal('Pledge', html);
      document.getElementById('pledge-cancel').addEventListener('click', closeModal);
      document.getElementById('pledge-submit').addEventListener('click', () => {
        const name = document.getElementById('pledge-name').value || 'Anonymous';
        const list = JSON.parse(localStorage.getItem('pledges') || '[]');
        list.push({ name, date: new Date().toISOString() });
        localStorage.setItem('pledges', JSON.stringify(list));
        openModal('Pledge Signed', `<p>Thank you, ${name}. Your symbolic pledge was recorded.</p>`);
      });
    });
  }

  // Audio toggle stub (no audio file included) — placeholder for ambient audio
  const audioToggle = document.getElementById('audio-toggle');
  const ambient = document.getElementById('ambient-audio');
  if (audioToggle && ambient) {
    audioToggle.addEventListener('click', () => {
      const on = audioToggle.getAttribute('aria-pressed') === 'true';
      if (!on) {
        ambient.play().catch(()=>{});
        audioToggle.setAttribute('aria-pressed','true');
        audioToggle.textContent = 'Audio: On';
      } else {
        ambient.pause();
        audioToggle.setAttribute('aria-pressed','false');
        audioToggle.textContent = 'Audio: Off';
      }
    });
  }

  // Modal helpers
  const modal = document.getElementById('modal');
  const backdrop = document.getElementById('modal-backdrop');
  let lastActiveElement = null;
  function openModal(title, html) {
    lastActiveElement = document.activeElement;
    modal.innerHTML = `<div><div class="flex justify-between items-center mb-3"><h3 class=\"text-lg font-semibold\">${title}</h3><button id=\"modal-close\" class=\"p-2\">✕</button></div>${html}</div>`;
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    modal.setAttribute('tabindex','-1');
    modal.focus();
    document.getElementById('modal-close').addEventListener('click', closeModal);
    // focus trap
    trapFocus(modal);
  }
  function closeModal() {
    modal.classList.add('hidden');
    backdrop.classList.add('hidden');
    modal.innerHTML = '';
    if (lastActiveElement) lastActiveElement.focus();
  }

  function trapFocus(container) {
    const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    function handleKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // backtab
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      } else if (e.key === 'Escape') {
        closeModal();
      }
    }
    container.addEventListener('keydown', handleKey);
    backdrop.addEventListener('click', closeModal);
  }
});