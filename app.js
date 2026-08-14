(() => {
  const D = window.TRIP_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const fmt = n => new Intl.NumberFormat('zh-TW',{style:'currency',currency:'TWD',maximumFractionDigits:0}).format(Number(n)||0);
  const STORE = {theme:'balkan_v3_theme',budget:'balkan_v3_budget',packing:'balkan_v3_packing',checks:'balkan_v3_checks',notes:'balkan_v3_notes',weather:'balkan_v3_weather',rates:'balkan_v3_rates'};
  let activeDay = 1;
  let deferredPrompt = null;

  function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function load(k,fallback){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fallback}catch{return fallback}}
  function maps(q){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}

  function setScreen(target){
    $$('.screen').forEach(x=>x.classList.toggle('active',x.dataset.screen===target));
    $$('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.target===target));
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(observeReveals,80);
  }
  $$('[data-target]').forEach(b=>b.addEventListener('click',()=>setScreen(b.dataset.target)));

  function initTheme(){
    const stored=localStorage.getItem(STORE.theme);
    const dark=stored?stored==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark',dark);
    $('#theme-toggle').addEventListener('click',()=>{const d=!document.documentElement.classList.contains('dark');document.documentElement.classList.toggle('dark',d);localStorage.setItem(STORE.theme,d?'dark':'light')});
  }

  function resolveActiveDay(){
    const start=new Date(`${D.meta.startDate}T00:00:00`), end=new Date(`${D.meta.endDate}T23:59:59`), now=new Date();
    if(now<start){activeDay=1;return}
    if(now>end){activeDay=D.days.length;return}
    activeDay=Math.min(Math.floor((now-start)/86400000)+1,D.days.length);
  }

  function flightDateTime(f){
    const [m,d]=f.date.split('/').map(Number);
    const [h,min]=f.depart.split(':').map(Number);
    return new Date(2026,m-1,d,h,min||0);
  }

  function nextFlight(){
    const now=new Date();
    const list=D.flights.map(f=>({...f,dt:flightDateTime(f)}));
    const f=list.find(x=>x.dt>=now)||list[list.length-1];
    const depTerminal=f.fromTerminal||'待確認';
    const arrTerminal=f.toTerminal||'待確認';
    const statusLabel=f.status==='booked'?'已訂 / 已出票':(f.status||'待確認');
    $('#next-flight-status').textContent=f.status==='booked'?'✓ BOOKED':'CHECK';
    $('#next-flight').innerHTML=`
      <div class="flight-route"><b class="airport-code">${f.from}</b><span class="flight-line"></span><b class="airport-code">${f.to}</b></div>
      <div class="flight-meta flight-meta-grid">
        <div><span>時間</span><b>${f.date} · ${f.depart} → ${f.arrive}</b></div>
        <div><span>航班</span><b>${f.code} · ${f.airline}</b></div>
        <div><span>出發航廈</span><b>${f.from} · ${depTerminal}</b></div>
        <div><span>抵達航廈</span><b>${f.to} · ${arrTerminal}</b></div>
      </div>
      <div class="flight-state"><span class="status-dot"></span>${statusLabel}</div>`;
  }

  function eventDate(day,event){
    const [m,d]=day.date.split('/').map(Number);
    const [h,min]=event.time.split(':').map(Number);
    return new Date(2026,m-1,d,h||0,min||0);
  }

  function nextAttraction(){
    const now=new Date();
    const attractionTypes=new Set(['walk','coffee','food','boat']);
    const beforeTrip=now < new Date(`${D.meta.startDate}T00:00:00`);
    let found=null;
    for(const day of D.days){
      for(const e of day.events){
        if(!attractionTypes.has(e.type)) continue;
        if(beforeTrip || eventDate(day,e)>=now){found={day,event:e};break}
      }
      if(found) break;
    }
    if(!found){
      const day=D.days[D.days.length-1];
      const event=day.events.find(e=>attractionTypes.has(e.type))||day.events[0];
      found={day,event};
    }
    const {day,event}=found;
    $('#next-attraction').innerHTML=`
      <div class="next-stop-title"><span>${day.date} · Day ${day.day}</span><h3>${event.title}</h3><p>${event.detail}</p></div>
      <div class="next-stop-meta"><span>${event.time}</span><span>${event.duration}</span><span>${day.city}</span></div>
      <div class="card-actions">
        <a class="primary-link" href="${maps(event.map)}" target="_blank" rel="noopener">Google Maps ↗</a>
        <button class="text-btn inline" data-open-day="${day.day}">查看 Day ${day.day} →</button>
      </div>`;
  }

  function tomorrowFocus(){
    const now=new Date();
    const start=new Date(`${D.meta.startDate}T00:00:00`), end=new Date(`${D.meta.endDate}T23:59:59`);
    let targetDay;
    if(now<start) targetDay=D.days[0];
    else if(now>end) targetDay=D.days[D.days.length-1];
    else targetDay=D.days[Math.min(activeDay,D.days.length-1)];
    $('#tomorrow-day-badge').textContent=`DAY ${targetDay.day}`;
    const highlights=targetDay.events.slice(0,3).map(e=>`<li><b>${e.time}</b><span>${e.title}</span></li>`).join('');
    $('#tomorrow-focus').innerHTML=`
      <h3>${targetDay.city}</h3>
      <p>${targetDay.summary}</p>
      <ul class="tomorrow-list">${highlights}</ul>
      <button class="text-btn inline" data-open-day="${targetDay.day}">打開明日 Timeline →</button>`;
  }

  function bindOpenDayButtons(){
    $$('[data-open-day]').forEach(btn=>btn.addEventListener('click',()=>{
      activeDay=Number(btn.dataset.openDay)||1;
      renderTabs();renderDay();updateWeather();setScreen('trip');
    }));
  }

  const weatherCode = c => ({0:['☀︎','晴朗'],1:['☀︎','大致晴朗'],2:['◒','局部多雲'],3:['☁︎','陰天'],45:['≋','霧'],48:['≋','霧'],51:['☂','毛毛雨'],53:['☂','毛毛雨'],55:['☂','毛毛雨'],61:['☂','小雨'],63:['☂','雨'],65:['☂','大雨'],71:['❄︎','小雪'],73:['❄︎','雪'],75:['❄︎','大雪'],80:['☂','陣雨'],81:['☂','陣雨'],82:['☂','強陣雨'],95:['ϟ','雷雨']}[c]||['◌','天氣']);
  async function updateWeather(){
    const day=D.days[activeDay-1]||D.days[0], city=D.weatherCities[day.weatherKey]||D.weatherCities.Ljubljana;
    $('#weather-city').textContent=city.label;
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    try{
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('weather'); const j=await r.json();
      const [ic,txt]=weatherCode(j.current.weather_code); const item={city:city.label,temp:Math.round(j.current.temperature_2m),icon:ic,text:txt,max:Math.round(j.daily.temperature_2m_max[0]),min:Math.round(j.daily.temperature_2m_min[0]),at:Date.now()};save(STORE.weather,item);paintWeather(item);
    }catch{const cached=load(STORE.weather,null);if(cached)paintWeather(cached,true);else{$('#weather-text').textContent='目前離線，尚無快取天氣'}}
  }
  function paintWeather(w,cached=false){$('#weather-city').textContent=w.city;$('#weather-temp').textContent=`${w.temp}°`;$('#weather-icon').textContent=w.icon;$('#weather-text').textContent=`${w.text}${cached?' · cached':''}`;$('#weather-range').textContent=`H ${w.max}° · L ${w.min}°`}
  $('#refresh-weather').addEventListener('click',updateWeather);

  function renderTabs(){
    $('#day-tabs').innerHTML=D.days.map(d=>`<button class="day-tab ${d.day===activeDay?'active':''}" data-day="${d.day}"><b>Day ${d.day}</b><small>${d.date}</small></button>`).join('');
    $$('.day-tab').forEach(b=>b.addEventListener('click',()=>{activeDay=+b.dataset.day;renderTabs();renderDay();updateWeather();}));
  }
  function renderDay(){
    const d=D.days[activeDay-1];
    $('#day-detail').innerHTML=`<article class="day-hero reveal"><div class="day-hero-top"><div><span class="kicker">${d.country} · ${d.theme}</span><h2>${d.city}</h2><p>${d.summary}</p></div><span class="stay-pill">🏨 ${d.stay}</span></div></article><article class="timeline-card glass reveal"><div class="timeline">${d.events.map(e=>`<div class="timeline-row"><div class="timeline-time">${e.time}</div><div class="timeline-dot"></div><div class="timeline-content"><h3>${e.title}</h3><p>${e.detail}</p><div class="timeline-bottom"><span class="duration">${e.duration}</span><a class="map-link" href="${maps(e.map)}" target="_blank" rel="noopener">Google Maps ↗</a></div></div></div>`).join('')}</div></article>`;
    setTimeout(observeReveals,20);
  }

  const currencyMeta={
    EUR:{name:'歐元',symbol:'€'},THB:{name:'泰銖',symbol:'฿'},TRY:{name:'土耳其里拉',symbol:'₺'},
    BAM:{name:'波士尼亞馬克',symbol:'KM'},CHF:{name:'瑞士法郎',symbol:'CHF'},CNY:{name:'人民幣',symbol:'¥'}
  };
  let currentRate=null;
  function getRateCache(){return load(STORE.rates,{})}
  function setRateCache(code,rate,date){const all=getRateCache();all[code]={rate,date,at:Date.now()};save(STORE.rates,all)}
  function paintCurrency(){
    const code=$('#currency-select').value, amount=Number($('#currency-amount').value)||0, meta=currencyMeta[code];
    if(!currentRate||currentRate.code!==code){$('#currency-output').textContent='—';return}
    $('#currency-output').textContent=fmt(amount*currentRate.rate);
    const source=currentRate.cached?'快取':'即時';
    $('#currency-rate-note').textContent=`1 ${code} ≈ ${currentRate.rate.toFixed(currentRate.rate<1?4:3)} TWD · ${source}${currentRate.date?` · ${currentRate.date}`:''}`;
  }
  async function updateRate(force=false){
    const code=$('#currency-select').value;
    const cached=getRateCache()[code];
    if(!force&&cached&&Date.now()-cached.at<6*3600000){currentRate={code,...cached,cached:true};paintCurrency();return}
    $('#currency-rate-note').textContent='更新匯率中…';
    const lc=code.toLowerCase();
    const urls=[
      `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${lc}.json`,
      `https://latest.currency-api.pages.dev/v1/currencies/${lc}.json`
    ];
    for(const url of urls){
      try{
        const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('rate');
        const j=await r.json(), rate=Number(j[lc]?.twd);
        if(!rate)throw new Error('TWD rate unavailable');
        setRateCache(code,rate,j.date||'');currentRate={code,rate,date:j.date||'',at:Date.now(),cached:false};paintCurrency();return;
      }catch(_){ }
    }
    if(cached){currentRate={code,...cached,cached:true};paintCurrency();$('#currency-rate-note').textContent+=` · 目前離線`;}
    else{currentRate=null;$('#currency-output').textContent='—';$('#currency-rate-note').textContent='目前無法取得匯率，連線後再試一次。'}
  }
  function initCurrency(){
    const sel=$('#currency-select'), amt=$('#currency-amount');
    sel.addEventListener('change',()=>{currentRate=null;updateRate(true)});
    amt.addEventListener('input',paintCurrency);
    $('#refresh-rate').addEventListener('click',()=>updateRate(true));
    updateRate();
  }

  function renderBudget(){
    let b=load(STORE.budget,D.budgetDefaults);
    const totalPlan=b.reduce((s,x)=>s+(+x.planned||0),0),totalSpent=b.reduce((s,x)=>s+(+x.spent||0),0),remaining=totalPlan-totalSpent;
    $('#budget-dashboard').innerHTML=`<div class="budget-summary"><div class="budget-stat glass"><small>PLANNED</small><b>${fmt(totalPlan)}</b></div><div class="budget-stat glass"><small>SPENT</small><b>${fmt(totalSpent)}</b></div><div class="budget-stat glass"><small>REMAINING</small><b>${fmt(remaining)}</b></div></div><div class="budget-list glass">${b.map(x=>`<div class="budget-row"><label>${x.label}</label><div><span class="budget-label">計畫</span><input inputmode="numeric" data-budget="${x.id}" data-field="planned" value="${x.planned}"></div><div><span class="budget-label">實際</span><input inputmode="numeric" data-budget="${x.id}" data-field="spent" value="${x.spent}"></div></div>`).join('')}</div>`;
    $$('[data-budget]').forEach(i=>i.addEventListener('change',()=>{b=b.map(x=>x.id===i.dataset.budget?{...x,[i.dataset.field]:Number(i.value)||0}:x);save(STORE.budget,b);renderBudget()}));
  }

  function renderPacking(){
    let state=load(STORE.packing,{});
    $('#packing-dashboard').innerHTML=D.packing.map((g,gi)=>`<section class="packing-group glass reveal"><h2>${g.group}</h2>${g.items.map((item,ii)=>{const k=`${gi}-${ii}`,checked=!!state[k];return `<label class="check-item ${checked?'done':''}"><input type="checkbox" data-pack="${k}" ${checked?'checked':''}><span>${item}</span></label>`}).join('')}</section>`).join('');
    $$('[data-pack]').forEach(x=>x.addEventListener('change',()=>{state[x.dataset.pack]=x.checked;save(STORE.packing,state);renderPacking()}));setTimeout(observeReveals,20);
  }

  function renderFlights(){
    $('#flight-list').innerHTML=D.flights.map(f=>`<div class="flight-item"><div class="flight-item-top"><div><b>${f.from} → ${f.to}</b><small>${f.date} · ${f.depart} → ${f.arrive} · ${f.code}</small></div><span class="booked">✓ BOOKED</span></div><small>${f.airline}</small></div>`).join('')
  }

  const defaultChecks=['十六湖門票確認','Split 跳島 Tour voucher','Mostar → Sarajevo 班次','09/29 Sarajevo → Dubrovnik 早班交通','09/30 DBV 機場交通','Geneva 住宿','eSIM / 漫遊方案','旅遊保險文件離線下載'];
  function renderChecks(){
    let list=load(STORE.checks,defaultChecks.map((text,i)=>({id:i+1,text,done:false})));
    $('#checklist').innerHTML=list.map(x=>`<div class="custom-check"><input type="checkbox" data-check="${x.id}" ${x.done?'checked':''}><span class="${x.done?'done':''}">${x.text}</span><button data-delete="${x.id}">×</button></div>`).join('');
    $$('[data-check]').forEach(c=>c.addEventListener('change',()=>{list=list.map(x=>x.id===+c.dataset.check?{...x,done:c.checked}:x);save(STORE.checks,list);renderChecks()}));
    $$('[data-delete]').forEach(c=>c.addEventListener('click',()=>{list=list.filter(x=>x.id!==+c.dataset.delete);save(STORE.checks,list);renderChecks()}));
  }
  $('#add-check').addEventListener('click',()=>{const i=$('#check-input'),t=i.value.trim();if(!t)return;const list=load(STORE.checks,[]);list.push({id:Date.now(),text:t,done:false});save(STORE.checks,list);i.value='';renderChecks()});
  $('#reset-checklist').addEventListener('click',()=>{localStorage.removeItem(STORE.checks);renderChecks()});
  const notes=$('#notes');notes.value=localStorage.getItem(STORE.notes)||'';notes.addEventListener('input',()=>localStorage.setItem(STORE.notes,notes.value));

  function network(){const el=$('#network-state');el.textContent=navigator.onLine?'ONLINE':'OFFLINE';el.classList.toggle('offline',!navigator.onLine)}window.addEventListener('online',network);window.addEventListener('offline',network);
  function observeReveals(){const els=$$('.reveal:not(.visible)');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e))}
  function parallax(){const y=window.scrollY;$$('[data-parallax]').forEach(e=>e.style.transform=`translateY(${y*Number(e.dataset.parallax)}px)`)}window.addEventListener('scroll',()=>requestAnimationFrame(parallax),{passive:true});

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#install-btn').hidden=false;});
  async function install(){if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}else alert('iPhone：Safari → 分享 →「加入主畫面」。')}
  $('#install-btn').addEventListener('click',install);$('#install-btn-more').addEventListener('click',install);
  if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));

  initTheme();tripProgress();nextFlight();todayFocus();renderTabs();renderDay();initCurrency();renderBudget();renderPacking();renderFlights();renderChecks();network();updateWeather();observeReveals();
})();
