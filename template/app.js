(() => {
  const D = window.TRIP_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const fmt = n => new Intl.NumberFormat('zh-TW',{style:'currency',currency:'TWD',maximumFractionDigits:0}).format(Number(n)||0);
  const NS=(D.meta.title||'trip').toLowerCase().replace(/[^a-z0-9]+/g,'_');
  const STORE={
    theme:`${NS}_theme`, notes:`${NS}_notes`, weather:`${NS}_weather`, rates:`${NS}_rates`,
    expenses:`${NS}_expenses`, packing:`${NS}_packing`, checks:`${NS}_checks`,
    preflight:`${NS}_preflight`, customChecks:`${NS}_custom_checks`,
    flightApiKey:`${NS}_flight_api_key`, flightLive:`${NS}_flight_live`
  };
  let activeDay = 1;
  let deferredPrompt = null;

  function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function load(k,fallback){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fallback}catch{return fallback}}
  function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function maps(q){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`}
  function migrateVersionedStore(target,suffix){
    if(localStorage.getItem(target)!==null)return;
    const key=Object.keys(localStorage).filter(k=>k.startsWith(`${NS}_`)&&k.endsWith(`_${suffix}`)&&k!==target).sort().reverse()[0];
    if(key)localStorage.setItem(target,localStorage.getItem(key));
  }
  migrateVersionedStore(STORE.packing,'packing');
  migrateVersionedStore(STORE.checks,'checks');

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
    if(now<start){activeDay=0;return}
    if(now>end){activeDay=D.days.length;return}
    activeDay=Math.min(Math.floor((now-start)/86400000)+1,D.days.length);
  }

  function updateTripCountdown(){
    const toLocalDate=iso=>{const [y,m,d]=iso.split('-').map(Number);return new Date(y,m-1,d)};
    const today=new Date();today.setHours(0,0,0,0);
    const start=toLocalDate(D.meta.startDate),end=toLocalDate(D.meta.endDate);
    const daysToGo=Math.round((start-today)/86400000);
    const number=$('#countdown-number'),label=$('#countdown-label'),orb=$('#trip-countdown');
    if(daysToGo>0){
      number.textContent=daysToGo;
      label.textContent='DAYS TO GO';
      orb.title=`距離出發還有 ${daysToGo} 天`;
    }else if(daysToGo===0){
      number.textContent='GO';
      label.textContent='TODAY';
      orb.title='今天出發';
    }else if(today<=end){
      const tripDay=Math.min(Math.round((today-start)/86400000)+1,D.days.length);
      number.textContent=tripDay;
      label.textContent='TRIP DAY';
      orb.title=`旅程第 ${tripDay} 天`;
    }else{
      number.textContent='✓';
      label.textContent='COMPLETE';
      orb.title='旅程完成';
    }
  }

  function flightDateTime(f){
    const [m,d]=f.date.split('/').map(Number);
    const [h,min]=f.depart.split(':').map(Number);
    return new Date(2026,m-1,d,h,min||0);
  }

  function baggageMarkup(f,compact=false){
    const b=f.baggage||{};
    if(compact&&b.summary)return `<div class="baggage-brief"><span>行李</span><b>${b.summary}</b></div>`;
    const items=[
      ['🎒','個人物品',b.personal],
      ['🧳','手提行李',b.cabin],
      ['▣','託運行李',b.checked]
    ].filter(x=>x[2]);
    if(!items.length)return '';
    return `<div class="flight-baggage">${items.map(([icon,label,value])=>`<div class="baggage-item"><span class="baggage-icon">${icon}</span><div><small>${label}</small><b>${value}</b></div></div>`).join('')}</div>`;
  }

  function flightCode(f){return String(f.code||'').toUpperCase().match(/[A-Z0-9]{2,3}\s?\d{1,4}/)?.[0]?.replace(/\s/g,'')||''}
  function nextFlightRecord(){
    const now=new Date();
    const list=D.flights.map(f=>({...f,dt:flightDateTime(f)}));
    return list.find(x=>x.dt>=new Date(now.getTime()-16*3600000))||list[list.length-1];
  }
  function liveClock(value){return value&&String(value).includes(' ')?String(value).split(' ')[1].slice(0,5):''}
  function nextFlight(live=null,message=''){
    const f=nextFlightRecord();
    const depTerminal=live?.dep_terminal||f.fromTerminal||'待確認';
    const arrTerminal=live?.arr_terminal||f.toTerminal||'待確認';
    const depGate=live?.dep_gate?` · Gate ${live.dep_gate}`:'';
    const arrGate=live?.arr_gate?` · Gate ${live.arr_gate}`:'';
    const depTime=liveClock(live?.dep_estimated)||liveClock(live?.dep_actual)||f.depart;
    const arrTime=liveClock(live?.arr_estimated)||liveClock(live?.arr_actual)||f.arrive;
    const statusMap={scheduled:'準時／已排定',active:'飛行中','en-route':'飛行中',landed:'已抵達',cancelled:'已取消',diverted:'轉降'};
    const liveLabel=live?.status?statusMap[live.status]||live.status:'';
    const delay=Number(live?.dep_delayed||live?.arr_delayed||0);
    const statusLabel=liveLabel?`${liveLabel}${delay>0?` · 延誤 ${delay} 分`:''}`:(f.status==='booked'?'已訂 / 已出票':(f.status||'待確認'));
    $('#next-flight-status').textContent=liveLabel?(live.status==='cancelled'?'⚠ CANCELLED':'● LIVE'):(f.status==='booked'?'✓ BOOKED':'CHECK');
    $('#next-flight-status').classList.toggle('live',!!liveLabel&&live.status!=='cancelled');
    $('#next-flight-status').classList.toggle('alert',live?.status==='cancelled');
    $('#next-flight').innerHTML=`
      <div class="flight-route"><b class="airport-code">${f.from}</b><span class="flight-line"></span><b class="airport-code">${f.to}</b></div>
      <div class="flight-meta flight-meta-grid">
        <div><span>${live?'即時／預估時間':'時間'}</span><b>${f.date} · ${depTime} → ${arrTime}</b></div>
        <div><span>航班</span><b>${f.code} · ${f.airline}</b></div>
        <div><span>出發航廈</span><b>${f.from} · ${depTerminal}${depGate}</b></div>
        <div><span>抵達航廈</span><b>${f.to} · ${arrTerminal}${arrGate}</b></div>
      </div>
      ${baggageMarkup(f,true)}
      <div class="flight-state"><span class="status-dot"></span><span>${statusLabel}</span></div>
      <p class="flight-live-note">${message|| (live?`AirLabs 即時資料 · ${new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})} 更新`:'顯示訂票資料')}</p>`;
  }

  async function updateFlightStatus(force=false){
    const f=nextFlightRecord(),code=flightCode(f),now=Date.now(),hours=(f.dt-now)/3600000;
    const cached=load(STORE.flightLive,null);
    if(!force&&cached?.code===code&&now-cached.at<5*60000){nextFlight(cached.data,'AirLabs 快取 · 5 分鐘內自動沿用');return}
    if(hours<-20){nextFlight(null,'這趟航程已完成。');return}
    if(hours>10){nextFlight(null,`即時狀態將於起飛前約 10 小時開放；目前還有 ${Math.ceil(hours/24)} 天。`);return}
    const key=localStorage.getItem(STORE.flightApiKey)||'';
    if(!key){nextFlight(null,'尚未設定 AirLabs API key；可到 More → 即時航班設定。');return}
    nextFlight(null,'正在更新即時航班資料…');
    try{
      const url=`https://airlabs.co/api/v9/flight?flight_iata=${encodeURIComponent(code)}&api_key=${encodeURIComponent(key)}`;
      const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('flight api');
      const j=await r.json();if(j.error)throw new Error(j.error.message||'flight api');
      const live=j.response||j;
      if(!live||String(live.dep_iata||'').toUpperCase()!==f.from||String(live.arr_iata||'').toUpperCase()!==f.to)throw new Error('flight not in live window');
      save(STORE.flightLive,{code,data:live,at:Date.now()});nextFlight(live);
    }catch(_){
      if(cached?.code===code)nextFlight(cached.data,'即時更新失敗，顯示最近一次快取。');
      else nextFlight(null,'目前查不到這一班的即時資料；請稍後再試或以航空公司通知為準。');
    }
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
    if(beforeTrip){
      const state=load(STORE.preflight,{}),steps=D.dayZero?.steps||[];
      const pendingIndex=steps.findIndex(x=>!state[x.id]);
      const index=pendingIndex<0?steps.length:pendingIndex;
      const step=pendingIndex<0?null:steps[pendingIndex];
      $('#next-stop-heading').textContent='接下來的準備';
      $('#next-attraction').innerHTML=`<div class="next-stop-title"><span>Day 0 · ${step?`STEP ${String(index+1).padStart(2,'0')}`:'ALL DONE'}</span><h3>${esc(step?.title||'行前準備完成')}</h3><p>${esc(step?.action||'所有必要項目都已完成。')}</p></div><div class="next-stop-meta"><span>${esc(step?.priority||'DONE')}</span><span>出發前</span><span>Day 0</span></div><div class="card-actions">${step?`<a class="primary-link" href="${esc(step.url)}" target="_blank" rel="noopener">官方資料 ↗</a>`:''}<button class="text-btn inline" data-open-day="0">查看 Day 0 →</button></div>`;
      return;
    }
    $('#next-stop-heading').textContent='接下來的景點';
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
    if(now<start){
      const state=load(STORE.preflight,{}),pending=(D.dayZero?.steps||[]).filter(x=>!state[x.id]);
      $('#tomorrow-day-badge').textContent='DAY 0';
      const highlights=(pending.length?pending.slice(0,3):[{title:'行前準備已完成',priority:'DONE'}]).map((x,i)=>`<li><b>${pending.length?`STEP ${String((D.dayZero.steps.indexOf(x)+1)).padStart(2,'0')}`:'✓'}</b><span>${esc(x.title)}</span></li>`).join('');
      $('#tomorrow-focus').innerHTML=`<h3>Day 0 · 行前準備</h3><p>${esc(D.dayZero?.summary||'')}</p><ul class="tomorrow-list">${highlights}</ul><button class="text-btn inline" data-open-day="0">打開 Day 0 Timeline →</button>`;
      return;
    }
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
    document.addEventListener('click',e=>{const btn=e.target.closest('[data-open-day]');if(!btn)return;
      activeDay=Number(btn.dataset.openDay);
      renderTabs();renderDay();updateWeather();setScreen('trip');
    });
  }

  const weatherCode = c => ({0:['☀︎','晴朗'],1:['☀︎','大致晴朗'],2:['◒','局部多雲'],3:['☁︎','陰天'],45:['≋','霧'],48:['≋','霧'],51:['☂','毛毛雨'],53:['☂','毛毛雨'],55:['☂','毛毛雨'],61:['☂','小雨'],63:['☂','雨'],65:['☂','大雨'],71:['❄︎','小雪'],73:['❄︎','雪'],75:['❄︎','大雪'],80:['☂','陣雨'],81:['☂','陣雨'],82:['☂','強陣雨'],95:['ϟ','雷雨']}[c]||['◌','天氣']);
  async function updateWeather(){
    const day=D.days[activeDay-1]||D.days[0], city=D.weatherCities[day.weatherKey]||D.weatherCities.Ljubljana;
    $('#weather-city').textContent=city.label;
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    try{
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('weather'); const j=await r.json();
      const [ic,txt]=weatherCode(j.current.weather_code); const item={city:city.label,temp:Math.round(j.current.temperature_2m),icon:ic,text:txt,max:Math.round(j.daily.temperature_2m_max[0]),min:Math.round(j.daily.temperature_2m_min[0]),at:Date.now()};save(STORE.weather,item);paintWeather(item);
    }catch{const cached=load(STORE.weather,null);if(cached&&cached.city===city.label)paintWeather(cached,true);else{$('#weather-text').textContent='目前離線，尚無此城市的快取天氣'}}
  }
  function paintWeather(w,cached=false){
    $('#weather-city').textContent=w.city;$('#weather-temp').textContent=`${w.temp}°`;$('#weather-icon').textContent=w.icon;$('#weather-text').textContent=`${w.text}${cached?' · cached':''}`;$('#weather-range').textContent=`H ${w.max}° · L ${w.min}°`;
  }
  $('#refresh-weather').addEventListener('click',updateWeather);

  function renderTabs(){
    const dayZero=`<button class="day-tab day-zero-tab ${activeDay===0?'active':''}" data-day="0"><b>Day 0</b><small>行前</small></button>`;
    $('#day-tabs').innerHTML=dayZero+D.days.map(d=>`<button class="day-tab ${d.day===activeDay?'active':''}" data-day="${d.day}"><b>Day ${d.day}</b><small>${d.date}</small></button>`).join('');
    $$('.day-tab').forEach(b=>b.addEventListener('click',()=>{activeDay=+b.dataset.day;renderTabs();renderDay();updateWeather();}));
  }

  const eventGuides={};
  const eventKinds={move:['↗','交通'],flight:['✈','航班'],walk:['●','步行'],coffee:['☕','休息'],food:['◐','用餐'],stay:['⌂','住宿'],boat:['≈','船程']};
  function guideFor(e){
    const guide=eventGuides[e.title]||{};
    const fallback={
      move:'依行程標示的巴士／火車為主；班次、月台與上車點請在出發前再次確認。',
      flight:'依航班看板辦理報到與登機；國際線原則上提前 2.5–3 小時抵達機場。',
      walk:'景點之間以步行串聯；開啟 Google Maps 導航，下雨或體力不足時改搭市區交通。',
      coffee:'依當下位置選順路店家，以步行為主，不為單一店家大幅折返。',
      food:'優先選當下街區的順路餐廳；步行前往並保留現場候位時間。',
      stay:'依住宿確認信的地址開啟導航；入住前先確認寄放行李與門禁方式。',
      boat:'集合碼頭、報到時間與停靠點以 Tour voucher 及當日海況通知為準。'
    };
    return {why:e.why||guide.why||e.detail,how:e.how||guide.how||fallback[e.type]||'依 Google Maps 導航與現場指示前往。'};
  }

  const expenseCategories=['餐飲','交通','住宿','門票','咖啡／小吃','購物','其他'];
  function getExpenses(){
    const stored=load(STORE.expenses,null);
    if(Array.isArray(stored))return stored;
    const legacy={transport:0,food:0,misc:0};
    Object.keys(localStorage).filter(k=>k.startsWith(`${NS}_`)&&k.endsWith('_budget')).forEach(k=>{
      const rows=load(k,[]);if(!Array.isArray(rows))return;
      rows.forEach(x=>{if(x.id in legacy)legacy[x.id]=Math.max(legacy[x.id],Number(x.spent)||0)});
    });
    const labels={transport:['交通','舊版交通支出'],food:['餐飲','舊版餐飲支出'],misc:['其他','舊版其他支出']};
    const migrated=Object.entries(legacy).filter(([,amount])=>amount>0).map(([key,amount],i)=>({id:`legacy-${key}-${i}`,day:0,date:'舊版',category:labels[key][0],item:labels[key][1],amount,createdAt:Date.now()}));
    save(STORE.expenses,migrated);
    return migrated;
  }
  function dayExpenseCard(d){
    const rows=getExpenses().filter(x=>x.day===d.day);
    const total=rows.reduce((sum,x)=>sum+(Number(x.amount)||0),0);
    return `<article class="expense-card expense-card-compact glass reveal"><div class="expense-card-head"><h2>Day ${d.day} 記帳</h2><strong>${fmt(total)}</strong></div><div class="expense-form"><select id="expense-category" aria-label="消費分類">${expenseCategories.map(x=>`<option>${x}</option>`).join('')}</select><input id="expense-item" maxlength="40" placeholder="項目，例如：晚餐"><label><span>NT$</span><input id="expense-amount" inputmode="numeric" type="number" min="0" step="1" placeholder="金額"></label><button id="add-expense" type="button">＋ 記錄</button></div>${rows.length?`<div class="day-expense-list">${rows.map(x=>`<div><span class="expense-category">${esc(x.category)}</span><b>${esc(x.item)}</b><strong>${fmt(x.amount)}</strong><button type="button" data-delete-expense="${esc(x.id)}" aria-label="刪除 ${esc(x.item)}">×</button></div>`).join('')}</div>`:''}</article>`;
  }
  function bindExpenseCard(d){
    const add=$('#add-expense'),amount=$('#expense-amount');if(!add||!amount)return;
    const create=()=>{
      const item=$('#expense-item').value.trim(),value=Math.round(Number(amount.value)||0);
      if(!item||value<=0)return;
      const rows=getExpenses();
      rows.push({id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,day:d.day,date:d.date,category:$('#expense-category').value,item,amount:value,createdAt:Date.now()});
      save(STORE.expenses,rows);renderDay();renderBudget();
    };
    add.addEventListener('click',create);
    amount.addEventListener('keydown',e=>{if(e.key==='Enter')create()});
    $$('[data-delete-expense]').forEach(btn=>btn.addEventListener('click',()=>{
      save(STORE.expenses,getExpenses().filter(x=>String(x.id)!==btn.dataset.deleteExpense));renderDay();renderBudget();
    }));
  }
  function renderDay(){
    if(activeDay===0){renderDayZero();return}
    const d=D.days[activeDay-1];
    const heroPhoto=d.photo?`<figure class="day-photo"><img src="${d.photo.src}" alt="${d.photo.alt}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').remove()"><figcaption>${d.photo.alt} · <a href="${d.photo.source}" target="_blank" rel="noopener">${d.photo.credit}</a></figcaption></figure>`:'';
    const lodging=d.lodging?`<a class="day-stay-link" href="${d.lodging.url||maps(d.lodging.map||d.lodging.area)}" target="_blank" rel="noopener"><span>⌂ 今晚住宿</span><b>${esc(d.lodging.area)}</b><i>Google Maps 導航 ↗</i></a>`:'';
    const food=d.food?.length?`<section class="discovery-section discovery-food"><span class="kicker">EAT HERE</span><h2>順路必吃</h2><div class="food-list">${d.food.map(x=>`${x.image?`<figure class="food-photo"><img src="${x.image.src}" alt="${x.image.alt}" loading="lazy" referrerpolicy="no-referrer" onerror="this.closest('figure').remove()"><figcaption><a href="${x.image.source}" target="_blank" rel="noopener">${x.image.credit}</a></figcaption></figure>`:''}<a href="${maps(x.map)}" target="_blank" rel="noopener"><b>${x.name}</b><span>${x.dish}</span><i>Maps ↗</i></a>`).join('')}</div></section>`:'';
    const local=d.localStops?.length?`<section class="discovery-section discovery-local"><span class="kicker">LOCAL STOPS</span><h2>咖啡・小吃・城市杯</h2><div class="local-stop-list">${d.localStops.map(x=>`<a href="${maps(x.map)}" target="_blank" rel="noopener"><span class="stop-kind">${x.kind}</span><b>${x.name}</b><p>${x.note}</p><i>Maps ↗</i></a>`).join('')}</div></section>`:'';
    const discovery=(food||local)?`<article class="discovery-card ${food&&local?'':'single'} glass reveal"><div class="discovery-grid">${food}${local}</div><small>以順路為原則；營業時間、休假、訂位與城市杯庫存請當天確認。</small></article>`:'';
    const itinerary=`<article class="itinerary-card glass reveal"><div class="compact-itinerary">${d.events.map(e=>{const g=guideFor(e),kind=eventKinds[e.type]||['•','行程'];return `<div class="itinerary-row"><time>${esc(e.time)}</time><span class="itinerary-dot"></span><div class="itinerary-main"><div><h3>${esc(e.title)}</h3><span class="event-kind">${kind[0]} ${kind[1]}</span></div><p>${esc(g.why)}</p></div><div class="itinerary-how"><b>怎麼去</b><span>${esc(g.how)}</span></div><div class="itinerary-actions"><span class="duration">◷ ${esc(e.duration)}</span><a class="map-link" href="${maps(e.map)}" target="_blank" rel="noopener">Maps ↗</a></div></div>`}).join('')}</div></article>`;
    $('#day-detail').innerHTML=`<article class="day-hero reveal"><div class="day-hero-top"><div><span class="kicker">${esc(d.country)} · ${esc(d.theme)}</span><h2>${esc(d.city)}</h2><p>${esc(d.summary)}</p></div><div class="day-hero-tools">${lodging}</div></div>${heroPhoto}</article>${itinerary}${dayExpenseCard(d)}${discovery}`;
    bindExpenseCard(d);
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
    const state=currentRate.cached?'快取':currentRate.provider;
    $('#currency-rate-note').textContent=`1 ${code} ≈ ${currentRate.rate.toFixed(currentRate.rate<1?4:3)} TWD · ${state}${currentRate.date?` · ${currentRate.date}`:''}`;
  }
  async function updateRate(force=false){
    const code=$('#currency-select').value;
    const cached=getRateCache()[code];
    if(!force&&cached&&Date.now()-cached.at<12*3600000){currentRate={code,...cached,cached:true};paintCurrency();return}
    $('#currency-rate-note').textContent='更新匯率中…';
    const providers=[
      {
        name:'Frankfurter',
        url:`https://api.frankfurter.dev/v2/rate/${code}/TWD`,
        parse:j=>({rate:Number(j.rate),date:j.date||''})
      },
      {
        name:'ExchangeRate-API',
        url:`https://open.er-api.com/v6/latest/${code}`,
        parse:j=>({rate:Number(j.rates?.TWD),date:j.time_last_update_utc?new Date(j.time_last_update_utc).toISOString().slice(0,10):''})
      }
    ];
    for(const provider of providers){
      try{
        const r=await fetch(provider.url,{cache:'no-store'});if(!r.ok)throw new Error('rate');
        const j=await r.json(), {rate,date}=provider.parse(j);
        if(!rate)throw new Error('TWD rate unavailable');
        setRateCache(code,rate,date);currentRate={code,rate,date,at:Date.now(),cached:false,provider:provider.name};paintCurrency();return;
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
    const lodgingDays=D.days.filter(d=>d.lodging?.nightlyPrice);
    const lodgingTotal=lodgingDays.reduce((sum,d)=>sum+Number(d.lodging.nightlyPrice),0);
    const confirmedNights=lodgingDays.filter(d=>d.lodging.costStatus==='已確認');
    const estimatedNights=lodgingDays.filter(d=>d.lodging.costStatus!=='已確認');
    const confirmedTotal=confirmedNights.reduce((s,d)=>s+Number(d.lodging.nightlyPrice),0);
    const fixed=[...(D.fixedExpenses||[]),{
      id:'stays',label:'住宿',amount:lodgingTotal,status:'部分確認',
      note:`${lodgingDays.length} 晚：已確認 ${confirmedNights.length} 晚共 ${fmt(confirmedTotal)}（曼谷 ${fmt(3300)}、Ljubljana ${fmt(13343)}、Mostar ${fmt(4036)}）；其餘 ${estimatedNights.length} 晚以每晚 ${fmt(3500)} 估列`
    }];
    const expenses=getExpenses();
    const fixedTotal=fixed.reduce((sum,x)=>sum+(Number(x.amount)||0),0);
    const spentTotal=expenses.reduce((sum,x)=>sum+(Number(x.amount)||0),0);
    const categoryTotals=expenseCategories.map(category=>({category,amount:expenses.filter(x=>x.category===category).reduce((sum,x)=>sum+(Number(x.amount)||0),0)})).filter(x=>x.amount>0);
    const grouped=[...new Set(expenses.map(x=>x.day))].sort((a,b)=>a-b).map(day=>{
      const rows=expenses.filter(x=>x.day===day),tripDay=D.days.find(d=>d.day===day);
      return {day,date:tripDay?.date||rows[0]?.date||'',city:tripDay?.city||'舊版匯入',rows,total:rows.reduce((sum,x)=>sum+(Number(x.amount)||0),0)};
    });
    $('#budget-dashboard').innerHTML=`<div class="cost-summary"><div class="cost-stat glass"><small>FIXED / ESTIMATED</small><b>${fmt(fixedTotal)}</b><span>機票＋16 晚住宿</span></div><div class="cost-stat glass"><small>DAILY SPEND</small><b>${fmt(spentTotal)}</b><span>${expenses.length} 筆旅途消費</span></div><div class="cost-stat total glass"><small>CURRENT TOTAL</small><b>${fmt(fixedTotal+spentTotal)}</b><span>目前預計旅行總花費</span></div></div><section class="cost-panel glass"><div class="cost-panel-head"><div><span class="kicker">KNOWN COSTS</span><h2>已有／預計支出</h2></div><strong>${fmt(fixedTotal)}</strong></div><div class="fixed-cost-list">${fixed.map(x=>`<div class="fixed-cost-row"><div><b>${esc(x.label)}</b><span>${esc(x.note)}</span></div><em>${esc(x.status)}</em><strong>${fmt(x.amount)}</strong></div>`).join('')}</div></section><section class="cost-panel glass"><div class="cost-panel-head"><div><span class="kicker">TRIP SPENDING</span><h2>每日消費總計</h2></div><strong>${fmt(spentTotal)}</strong></div>${categoryTotals.length?`<div class="category-totals">${categoryTotals.map(x=>`<span>${esc(x.category)} <b>${fmt(x.amount)}</b></span>`).join('')}</div>`:''}${grouped.length?`<div class="daily-cost-groups">${grouped.map(g=>`<article><div class="daily-cost-head"><div><b>${g.day?`Day ${g.day} · ${g.date}`:'舊版匯入'}</b><span>${esc(g.city)}</span></div><strong>${fmt(g.total)}</strong></div>${g.rows.map(x=>`<div class="daily-cost-row"><span>${esc(x.category)}</span><b>${esc(x.item)}</b><strong>${fmt(x.amount)}</strong></div>`).join('')}</article>`).join('')}</div>`:'<div class="budget-empty"><b>還沒有每日消費</b><span>進入任一天的行程分頁，就能新增當日支出。</span></div>'}</section><p class="cost-note">固定支出不必在每日消費重複輸入；每日紀錄儲存在目前瀏覽器，清除網站資料或更換裝置不會自動同步。</p>`;
  }

  function packingMarkup(){
    let state=load(STORE.packing,{});
    return D.packing.map((g,gi)=>`<section class="packing-group glass reveal"><h2>${g.group}</h2>${g.items.map((item,ii)=>{const k=`${gi}-${ii}`,checked=!!state[k];return `<label class="check-item ${checked?'done':''}"><input type="checkbox" data-pack="${k}" ${checked?'checked':''}><span>${item}</span></label>`}).join('')}</section>`).join('');
  }

  function renderDayZero(){
    const steps=D.dayZero?.steps||[];
    const state=load(STORE.preflight,{});
    const done=steps.filter(x=>state[x.id]).length;
    const percent=steps.length?Math.round(done/steps.length*100):0;
    $('#day-detail').innerHTML=`
      <article class="day-hero day-zero-hero reveal">
        <div class="day-hero-top"><div><span class="kicker">BEFORE DEPARTURE · PRIORITY ROUTE</span><h2>${esc(D.dayZero?.title||'Day 0 · 行前準備')}</h2><p>${esc(D.dayZero?.summary||'')}</p></div><span class="day-zero-progress"><b>${done}/${steps.length}</b><small>完成 ${percent}%</small></span></div>
      </article>
      <article class="timeline-card preflight-timeline glass reveal"><div class="timeline">${steps.map((x,i)=>`<div class="timeline-row ${state[x.id]?'is-done':''}"><div class="timeline-time">STEP ${String(i+1).padStart(2,'0')}</div><label class="preflight-check" aria-label="完成 ${esc(x.title)}"><input type="checkbox" data-preflight="${esc(x.id)}" ${state[x.id]?'checked':''}><span></span></label><div class="timeline-content"><div class="timeline-title-row"><h3>${esc(x.title)}</h3><span class="event-kind">${esc(x.priority)}</span></div><p class="event-purpose">${esc(x.why)}</p><div class="event-how"><b>完成這一站</b><p>${esc(x.action)}</p></div><div class="timeline-bottom"><a class="map-link" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.linkLabel||'官方連結')} ↗</a></div></div></div>`).join('')}</div></article>
      <section class="day-zero-section-head"><div><span class="kicker">PACK LAST</span><h2>Allpa 35L × 2</h2></div><p>證件與訂票完成後，再依分類收尾。</p></section>
      <div class="packing-dashboard day-zero-packing">${packingMarkup()}</div>
      <article class="card glass day-zero-custom"><div class="card-head"><div><span class="kicker">EXTRA TASKS</span><h2>臨時待辦</h2></div><button class="tiny-btn" id="reset-checklist">清空</button></div><div class="add-row"><input id="check-input" placeholder="新增這趟旅行的臨時待辦…"><button id="add-check">＋</button></div><div id="checklist"></div></article>`;
    $$('[data-preflight]').forEach(x=>x.addEventListener('change',()=>{state[x.dataset.preflight]=x.checked;save(STORE.preflight,state);renderDayZero();nextAttraction();tomorrowFocus()}));
    $$('[data-pack]').forEach(x=>x.addEventListener('change',()=>{const packing=load(STORE.packing,{});packing[x.dataset.pack]=x.checked;save(STORE.packing,packing);renderDayZero()}));
    renderChecks();
    setTimeout(observeReveals,20);
  }

  function renderFlights(){
    $('#flight-list').innerHTML=D.flights.map(f=>{const booked=f.status==='booked';return `<div class="flight-item"><div class="flight-item-top"><div><b>${f.from} → ${f.to}</b><small>${f.date} · ${f.depart} → ${f.arrive} · ${f.code}</small></div><span class="booked ${booked?'':'planned'}">${booked?'✓ BOOKED':'○ 待訂'}</span></div><small>${f.airline}</small>${baggageMarkup(f)}</div>`}).join('')
  }

  function initFlightStatus(){
    const input=$('#flight-api-key'),saveBtn=$('#save-flight-api'),clearBtn=$('#clear-flight-api'),state=$('#flight-api-state');
    const paintKeyState=()=>{const has=!!localStorage.getItem(STORE.flightApiKey);state.textContent=has?'✓ 已設定':'未設定';state.classList.toggle('planned',!has);input.value=has?'••••••••••••':''};
    saveBtn.addEventListener('click',()=>{const key=input.value.trim();if(!key||key.includes('•'))return;localStorage.setItem(STORE.flightApiKey,key);localStorage.removeItem(STORE.flightLive);paintKeyState();updateFlightStatus(true)});
    clearBtn.addEventListener('click',()=>{localStorage.removeItem(STORE.flightApiKey);localStorage.removeItem(STORE.flightLive);input.value='';paintKeyState();updateFlightStatus(true)});
    input.addEventListener('focus',()=>{if(input.value.includes('•'))input.value='' });
    $('#refresh-flight').addEventListener('click',()=>updateFlightStatus(true));
    paintKeyState();updateFlightStatus();
    setInterval(()=>{if(!document.hidden)updateFlightStatus()},5*60000);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateFlightStatus()});
  }

  function renderTripReferences(){
    const audit=$('#trip-audit'),sources=$('#trip-sources');
    if(audit)audit.innerHTML=(D.tripNotes||[]).map(x=>`<div class="audit-item"><b>${x.title}</b><p>${x.text}</p></div>`).join('')||'<p class="muted">此旅程沒有額外健檢備註。</p>';
    if(sources)sources.innerHTML=(D.sources||[]).map(x=>`<a class="source-link" href="${x.url}" target="_blank" rel="noopener"><span>${x.label}</span><b>↗</b></a>`).join('');
  }

  function renderChecks(){
    const root=$('#checklist'),input=$('#check-input'),add=$('#add-check'),reset=$('#reset-checklist');if(!root)return;
    let list=load(STORE.customChecks,[]);
    root.innerHTML=list.length?list.map(x=>`<div class="custom-check"><input type="checkbox" data-check="${esc(x.id)}" ${x.done?'checked':''}><span class="${x.done?'done':''}">${esc(x.text)}</span><button data-delete="${esc(x.id)}">×</button></div>`).join(''):'<p class="expense-empty">沒有額外待辦；上方 Day 0 已包含必要項目。</p>';
    $$('[data-check]').forEach(c=>c.addEventListener('change',()=>{list=list.map(x=>String(x.id)===c.dataset.check?{...x,done:c.checked}:x);save(STORE.customChecks,list);renderChecks()}));
    $$('[data-delete]').forEach(c=>c.addEventListener('click',()=>{list=list.filter(x=>String(x.id)!==c.dataset.delete);save(STORE.customChecks,list);renderChecks()}));
    add.onclick=()=>{const text=input.value.trim();if(!text)return;list.push({id:Date.now(),text,done:false});save(STORE.customChecks,list);input.value='';renderChecks()};
    input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();add.click()}};
    reset.onclick=()=>{localStorage.removeItem(STORE.customChecks);renderChecks()};
  }
  const notes=$('#notes');notes.value=localStorage.getItem(STORE.notes)||'';notes.addEventListener('input',()=>localStorage.setItem(STORE.notes,notes.value));

  function network(){const el=$('#network-state');el.textContent=navigator.onLine?'ONLINE':'OFFLINE';el.classList.toggle('offline',!navigator.onLine)}window.addEventListener('online',network);window.addEventListener('offline',network);
  function observeReveals(){const els=$$('.reveal:not(.visible)');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});els.forEach(e=>io.observe(e))}
  function parallax(){const y=window.scrollY;$$('[data-parallax]').forEach(e=>e.style.transform=`translateY(${y*Number(e.dataset.parallax)}px)`)}window.addEventListener('scroll',()=>requestAnimationFrame(parallax),{passive:true});

  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#install-btn').hidden=false;});
  async function install(){if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null}else alert('iPhone：Safari → 分享 →「加入主畫面」。')}
  $('#install-btn').addEventListener('click',install);$('#install-btn-more').addEventListener('click',install);
  if('serviceWorker' in navigator)window.addEventListener('load',()=>{
    let refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;
      refreshing=true;
      location.reload();
    });
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});
  });

  document.title=`${D.meta.title} · Travel Dashboard`;
  const brand=$('.brand-button b');if(brand)brand.textContent=D.meta.title;
  $('#top-date').textContent=D.meta.dateRange.replace('2026.','').replace(' — ',' — ');
  initTheme();resolveActiveDay();updateTripCountdown();nextFlight();nextAttraction();tomorrowFocus();renderTabs();renderDay();initCurrency();renderBudget();renderFlights();renderTripReferences();bindOpenDayButtons();initFlightStatus();network();updateWeather();observeReveals();
})();
