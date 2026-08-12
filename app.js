(function () {
  const DATA = window.TRIP_DATA;
  let activeRegion = 'all';

  function money(n) {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(n);
  }

  function getRegion(id) {
    return DATA.regions.find(r => r.id === id) || { name: id };
  }

  function regionPill(regionId) {
    const region = getRegion(regionId);
    return `<span class="region-pill">${region.name}</span>`;
  }

  function renderHero() {
    document.getElementById('trip-title').textContent = DATA.meta.title;
    document.getElementById('trip-subtitle').textContent = DATA.meta.subtitle;
    document.getElementById('trip-dates').textContent = DATA.meta.dateRange;
    document.getElementById('stat-days').textContent = DATA.summary.days;
    document.getElementById('stat-countries').textContent = DATA.summary.countries;
    document.getElementById('stat-bags').textContent = DATA.meta.baggage;
    document.getElementById('stat-return').textContent = money(DATA.summary.returnTicketTwd);
    document.title = `${DATA.meta.title} | Travel Dashboard`;
  }

  function renderRegionTabs() {
    const tabs = [
      { id: 'all', name: '🌍 全部行程' },
      ...DATA.regions
    ];
    document.getElementById('region-tabs').innerHTML = tabs.map(tab => `
      <button class="tab-btn ${activeRegion === tab.id ? 'active' : ''}" data-region="${tab.id}">${tab.name}</button>
    `).join('');

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeRegion = btn.dataset.region;
        renderRegionTabs();
        renderDays();
      });
    });
  }

  function mapUrl(day) {
    const q = encodeURIComponent(day.city || day.country);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  }

  function renderDays() {
    const days = activeRegion === 'all' ? DATA.days : DATA.days.filter(d => d.region === activeRegion);
    const html = days.map(day => `
      <article class="day-card">
        <div class="day-head">
          <div class="day-number">Day ${day.day}</div>
          <div class="date-block">
            <strong>${day.date}</strong><span>${day.weekday}</span>
          </div>
          <div class="grow"></div>
          ${regionPill(day.region)}
        </div>

        <div class="day-title-row">
          <div>
            <div class="country-label">${day.country}</div>
            <h3>${day.city}</h3>
          </div>
          <a class="map-btn" href="${mapUrl(day)}" target="_blank" rel="noopener">地圖 ↗</a>
        </div>

        <div class="day-grid">
          <section><span>早晨</span><p>${day.morning}</p></section>
          <section><span>午後</span><p>${day.afternoon}</p></section>
          <section><span>晚間</span><p>${day.evening}</p></section>
        </div>

        <div class="meta-row">
          <div>🏨 <b>${day.hotel}</b></div>
          <div>🚆 <b>${day.transport}</b></div>
        </div>

        ${day.note ? `<div class="note">${day.note}</div>` : ''}
      </article>
    `).join('');

    document.getElementById('days-container').innerHTML = html || '<div class="empty">此區沒有行程。</div>';
  }

  function renderRoute() {
    const route = [
      'Taipei', 'Bangkok', 'Istanbul', 'Ljubljana', 'Bled / Bohinj', 'Zagreb',
      'Plitvice', 'Zadar', 'Split', 'Mostar', 'Sarajevo', 'Dubrovnik', 'Geneva', 'Shanghai', 'Taipei'
    ];
    document.getElementById('route-line').innerHTML = route.map((city, idx) => `
      <div class="route-node">
        <span class="route-dot"></span>
        <span>${city}</span>
        ${idx < route.length - 1 ? '<span class="route-arrow">→</span>' : ''}
      </div>
    `).join('');
  }

  function getChecklist() {
    try {
      const stored = JSON.parse(localStorage.getItem('balkan_checklist_v3'));
      if (Array.isArray(stored)) return stored;
    } catch (_) {}
    return DATA.checklistDefaults.map((text, i) => ({ id: i + 1, text, checked: false }));
  }

  function saveChecklist(items) {
    localStorage.setItem('balkan_checklist_v3', JSON.stringify(items));
  }

  function renderChecklist() {
    const items = getChecklist();
    document.getElementById('checklist-list').innerHTML = items.map(item => `
      <label class="check-item">
        <input type="checkbox" data-id="${item.id}" ${item.checked ? 'checked' : ''}>
        <span class="${item.checked ? 'done' : ''}">${item.text}</span>
        <button type="button" class="delete-item" data-delete="${item.id}" aria-label="刪除">×</button>
      </label>
    `).join('');

    document.querySelectorAll('#checklist-list input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => {
        const id = Number(input.dataset.id);
        const next = getChecklist().map(item => item.id === id ? { ...item, checked: input.checked } : item);
        saveChecklist(next);
        renderChecklist();
      });
    });

    document.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = Number(btn.dataset.delete);
        saveChecklist(getChecklist().filter(item => item.id !== id));
        renderChecklist();
      });
    });
  }

  function initChecklistControls() {
    document.getElementById('add-check-item').addEventListener('click', () => {
      const input = document.getElementById('check-input');
      const text = input.value.trim();
      if (!text) return;
      const items = getChecklist();
      items.push({ id: Date.now(), text, checked: false });
      saveChecklist(items);
      input.value = '';
      renderChecklist();
    });

    document.getElementById('check-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('add-check-item').click();
    });

    document.getElementById('reset-checklist').addEventListener('click', () => {
      localStorage.removeItem('balkan_checklist_v3');
      renderChecklist();
    });
  }

  function initNotes() {
    const notes = document.getElementById('notes');
    notes.value = localStorage.getItem('balkan_notes_v3') || '';
    notes.addEventListener('input', () => localStorage.setItem('balkan_notes_v3', notes.value));
  }

  function initViewSwitch() {
    document.querySelectorAll('[data-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
        document.getElementById(`${btn.dataset.view}-view`).classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderHero();
    renderRegionTabs();
    renderDays();
    renderRoute();
    renderChecklist();
    initChecklistControls();
    initNotes();
    initViewSwitch();
  });
})();
