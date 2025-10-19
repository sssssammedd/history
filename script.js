// script.js — Handles scroll-triggered reveal animations, chart drawing, and counter animations

// IntersectionObserver for scroll-triggered reveals
// Faster reveal for bottom-half elements
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.01 });
revealElements.forEach((el) => {
  observer.observe(el);
  el.style.transitionDelay = '0s'; // Consistent timing for all
});

// Counter animation for fact cards and chart counter
function animateCounter(el, target, duration = 1200) {
  if (!el) return;
  const start = 0;
  const end = parseInt(target, 10);
  const step = (timestamp, startTime) => {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      requestAnimationFrame((ts) => step(ts, startTime));
    } else {
      el.textContent = end.toLocaleString();
    }
  };
  requestAnimationFrame((ts) => step(ts, ts));
}

// Animate fact stats when visible
document.querySelectorAll('.fact-card').forEach(card => {
  const stat = card.querySelector('.fact-stat');
  const target = stat.getAttribute('data-count');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(stat, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(card);
});

// Animate chart counter
const chartCounter = document.querySelector('.chart-counter');
if (chartCounter) {
  const target = chartCounter.getAttribute('data-count');
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(chartCounter, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(chartCounter);
}

// Chart.js Pie and Bar charts (replace with real data as needed)
window.addEventListener('DOMContentLoaded', () => {
  // Pie Chart: Native Title vs Other Tenures
  const pie = document.getElementById('pieChart');
  if (pie && pie.getContext) {
    const ctx = pie.getContext('2d');
    // Example: 40% Native Title, 60% Other
    const data = [40, 60];
    const colors = ['#b51d1dff', '#efefef'];
    const total = data.reduce((a, b) => a + b, 0);
    let startAngle = -0.5 * Math.PI;
    data.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(110, 110);
      ctx.arc(110, 110, 100, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      startAngle += sliceAngle;
    });
    // Animate stroke (optional)
  }

  // Bar Chart: Native Title Claims by State (example data)
  const bar = document.getElementById('barChart');
  if (bar && bar.getContext) {
    const ctx = bar.getContext('2d');
    const states = ['NSW', 'QLD', 'WA', 'SA', 'NT', 'VIC', 'TAS'];
    const values = [120, 180, 220, 80, 150, 60, 30];
    const max = Math.max(...values);
    const barWidth = 28;
    values.forEach((val, i) => {
      const x = 40 + i * (barWidth + 18);
      const y = 160 - (val / max) * 120;
      ctx.fillStyle = '#b51d1dff';
      ctx.fillRect(x, y, barWidth, (val / max) * 120);
      ctx.font = '0.9rem Inter, Arial, sans-serif';
      ctx.fillStyle = '#1c1c1c';
      ctx.fillText(states[i], x, 175);
    });
  }
});

// Modal lightbox for gallery (optional, not implemented for brevity)
// Add your own JS if you want to expand images on click

// Accessibility: smooth scroll for all anchor links
document.querySelectorAll('a[href^=\"#\"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});