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
    const dayPill=$('#day-weather-pill');
    if(dayPill)dayPill.innerHTML=`<b>◌</b><span>${city.label}</span><strong>--°</strong>`;
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    try{
      const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error('weather'); const j=await r.json();
      const [ic,txt]=weatherCode(j.current.weather_code); const item={city:city.label,temp:Math.round(j.current.temperature_2m),icon:ic,text:txt,max:Math.round(j.daily.temperature_2m_max[0]),min:Math.round(j.daily.temperature_2m_min[0]),at:Date.now()};save(STORE.weather,item);paintWeather(item);
    }catch{const cached=load(STORE.weather,null);if(cached&&cached.city===city.label)paintWeather(cached,true);else{$('#weather-text').textContent='目前離線，尚無此城市的快取天氣';if(dayPill)dayPill.innerHTML=`<b>◌</b><span>${city.label}</span><strong>離線</strong>`}}
  }
  function paintWeather(w,cached=false){
    $('#weather-city').textContent=w.city;$('#weather-temp').textContent=`${w.temp}°`;$('#weather-icon').textContent=w.icon;$('#weather-text').textContent=`${w.text}${cached?' · cached':''}`;$('#weather-range').textContent=`H ${w.max}° · L ${w.min}°`;
    const dayPill=$('#day-weather-pill');
    if(dayPill)dayPill.innerHTML=`<b>${w.icon}</b><span>${w.city}</span><strong>${w.temp}°</strong>`;
  }
  $('#refresh-weather').addEventListener('click',updateWeather);

  function renderTabs(){
    $('#day-tabs').innerHTML=D.days.map(d=>`<button class="day-tab ${d.day===activeDay?'active':''}" data-day="${d.day}"><b>Day ${d.day}</b><small>${d.date}</small></button>`).join('');
    $$('.day-tab').forEach(b=>b.addEventListener('click',()=>{activeDay=+b.dataset.day;renderTabs();renderDay();updateWeather();}));
  }

  const eventGuides={
    '前往桃園機場':{why:'前往 TPE 辦理 SL395 報到；把晚餐、安檢與臨時狀況的緩衝一起留進去。',how:'依出發地搭機場捷運或預約車前往桃園機場；目標最晚起飛前 3 小時抵達。'},
    'TPE → DMK':{why:'搭乘 SL395 前往曼谷廊曼機場，正式開始旅程。',how:'在 TPE 依看板找到 Thai Lion Air 櫃檯；抵達 DMK、入境取行李後再前往住宿。'},
    '入住 Bangkok':{why:'午夜抵達後直接休息，不再安排宵夜或跨區移動。',how:'DMK 入境後以 Grab／機場排班計程車直達住宿；深夜不建議拖行李轉乘多段大眾運輸。'},
    '前往 BKK':{why:'為了搭乘 22:45 的 TK069，建議約 19:00 前抵達 BKK 完成報到與安檢。',how:'先搭 MRT／BTS 接到 Makkasan 或 Phaya Thai，再轉 Airport Rail Link 直達 Suvarnabhumi；兩個 Allpa 若遇尖峰可改 Grab。'},
    'BKK → IST':{why:'搭乘 TK069 夜航前往伊斯坦堡，隔天清晨抵達。',how:'抵達 BKK 後依看板找 Turkish Airlines 國際線報到櫃檯，完成托運、證照查驗與安檢。'},
    '抵達 IST':{why:'04:45 抵達，這段有長轉機時間；是否進城以入境速度、睡眠與行李狀態決定。',how:'若進市區，可用 M11 地鐵轉市區軌道交通，或搭 Havaist；先確認回程動線再離開機場。'},
    'Istanbul 短停留':{why:'利用長轉機看 Sultanahmet 一帶，但不以塞滿景點為目標。',how:'IST 往返市區以 M11 轉地鐵／電車或 Havaist；建議最晚約 14:00 開始回機場。'},
    'IST → LJU':{why:'搭乘 TK1063 前往 Ljubljana，正式進入斯洛維尼亞與巴爾幹段。',how:'回到 IST 後依看板前往 Turkish Airlines 出發區；至少提前 2.5 小時回到機場。'},
    '入住 Ljubljana':{why:'抵達後只安排進城與入住，保留隔天湖區早起體力。',how:'LJU 機場外搭 Ljubljana Airport 公車，或預約 Shuttle／GoOpti 直達市區住宿。'},
    'Ljubljana → Bled':{why:'早出發避開湖區人潮，保留完整環湖與 Bohinj／Vintgar 時間。',how:'從 Ljubljana Bus Station 搭巴士到 Bled Union；下車後步行約 5 分鐘即可到湖邊。'},
    'Bled → Bohinj / Vintgar':{why:'依天氣二選一：晴天優先 Bohinj，步道狀況合適再選 Vintgar。',how:'Bohinj 搭區域巴士前往 Ribčev Laz／Ukanc；Vintgar 依季節接駁或巴士資訊，班次近日期確認。'},
    '返回 Ljubljana':{why:'回市區吃晚餐與休息，不在湖區拖到末班交通。',how:'從 Bohinj／Bled 搭區域巴士回 Ljubljana Bus Station；上車前再次確認末班時間。'},
    'Ljubljana → Zagreb':{why:'上午完成跨境，讓下午仍有完整時間走 Zagreb 核心區。',how:'從 Ljubljana Bus Station 搭跨境巴士到 Zagreb Autobusni kolodvor；護照放隨身，抵達後搭電車或 Taxi 進中心。'},
    'Zagreb → Plitvice':{why:'下午先住進湖區，換取隔天一早入園、避開旅行團。',how:'從 Zagreb Autobusni kolodvor 搭城際巴士；依住宿位置確認 Entrance 1、Entrance 2 或沿線站點下車。'},
    '入住湖區':{why:'提早休息並整理隔天健走裝備。',how:'從巴士下車點步行或請住宿接送；先確認住宿離入口與站牌的距離。'},
    'Plitvice → Zadar':{why:'下午離開山區，趕上 Zadar 海風琴與日落時段。',how:'從 Plitvice 沿線巴士站搭城際巴士到 Zadar Bus Station；班次與上車站近日期再次確認。'},
    'Zadar → Split':{why:'上午南下，中午抵達後把下午完整留給 Split 古城。',how:'從 Zadar Central Bus Station 搭城際巴士到 Split Bus Station；車站就在港口與古城東側，步行即可進核心區。'},
    '寄放行李 / Check-in':{why:'先放下 Allpa，再用輕裝走 Split 古城。',how:'從 Split Bus Station／港口步行前往 Old Town 周邊住宿；依入住時間寄放行李。'},
    '港口集合':{why:'依跳島 Tour 的指定時間完成報到，避免錯過高速艇。',how:'住宿在 Old Town／港口周邊可步行前往；集合碼頭與櫃檯以 voucher 為準。'},
    'Split → Mostar':{why:'早班跨境，讓中午後仍能完整走 Mostar 老城。',how:'從 Split Bus Station 搭跨境巴士到 Mostar Bus Station；護照與訂票憑證放隨身，邊境時間可能浮動。'},
    'Check-in / 寄放背包':{why:'放下背包後直接進 Stari Most 與 Old Bazaar。',how:'Mostar Bus Station 到 Old Town 約步行 20–25 分鐘；炎熱或背包較重時改搭 Taxi。'},
    '周邊半日遊（可選）':{why:'把 Blagaj、Počitelj、Kravica 串成一趟，避免逐點轉乘浪費時間。',how:'優先預訂 Mostar 出發的小團／包車；三地分散，大眾運輸不適合在半天內全部完成。'},
    'Mostar → Sarajevo':{why:'優先搭景觀火車穿越 Neretva 河谷；無合適班次再切換巴士。',how:'由 Mostar Railway Station 上車至 Sarajevo；車票與 2026 班次近日期確認，備案為 Mostar Bus Station。'},
    'Baščaršija 初探':{why:'抵達當晚先熟悉老城動線，隔天跨境前不再安排遠點。',how:'Sarajevo 車站到 Baščaršija 可搭電車或 Taxi；進老城後以步行為主。'},
    'Sarajevo → Dubrovnik':{why:'全程最關鍵的移動日；越早抵達，留給 Dubrovnik 的有效時間越多。',how:'優先早班跨境巴士或預約 Transfer，從 Sarajevo 車站／指定點出發；護照隨身，抵達 Dubrovnik Gruž Bus Station。'},
    '寄放 Allpa / Check-in':{why:'先放下背包，再進古城走 Stradun 與 Old Port。',how:'Gruž Bus Station 到 Pile Gate 搭市區巴士或 Taxi，約 15–25 分鐘；避免背包走古城階梯。'},
    'Old Town → DBV':{why:'前往 DBV 搭乘 15:30 的 U21506；廉航需預留行李與安檢時間。',how:'從 Pile／Gruž 搭 Airport Shuttle 或 Taxi 到 Dubrovnik Airport；建議起飛前至少 2.5 小時抵達。'},
    'DBV → GVA':{why:'搭乘 easyJet U21506 前往 Geneva，完成巴爾幹主段。',how:'依 easyJet App 完成線上報到並確認行李規則；抵達 GVA 後搭直達火車前往 Genève-Cornavin。'},
    'Cornavin → GVA':{why:'前往 GVA 搭乘 12:00 的 MU218，長程航班需保留報到時間。',how:'從 Genève-Cornavin 搭直達火車到 Genève Aéroport，車程約 7 分鐘；加上候車與步行抓約 20 分鐘。'},
    'GVA → PVG':{why:'搭乘 MU218 前往上海浦東，隔天轉機回台。',how:'在 GVA 依看板找 China Eastern 報到區；確認行李是否直掛 TPE 與 PVG 轉機方式。'},
    '抵達 PVG':{why:'保留 6h50 轉機緩衝，先完成轉機安檢與下一段登機確認。',how:'跟隨 International Transfer／Transfer 指標，不入境市區；確認 MU5007 登機門與行李狀態。'},
    'PVG → TPE':{why:'搭乘 MU5007 返回桃園，旅程最後一段。',how:'提早回到登機門等候；抵達 TPE 後完成入境、取行李與海關。'},
    '抵達台灣':{why:'Balkan 2026 完成。',how:'依抵達航廈搭機場捷運、接送或排班計程車返家。'}
  };
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
    return {why:guide.why||e.detail,how:guide.how||fallback[e.type]||'依 Google Maps 導航與現場指示前往。'};
  }
  function renderDay(){
    const d=D.days[activeDay-1];
    const city=D.weatherCities[d.weatherKey]||D.weatherCities.Ljubljana;
    $('#day-detail').innerHTML=`<article class="day-hero reveal"><div class="day-hero-top"><div><span class="kicker">${d.country} · ${d.theme}</span><h2>${d.city}</h2><p>${d.summary}</p></div><span class="day-weather-pill" id="day-weather-pill"><b>◌</b><span>${city.label}</span><strong>--°</strong></span></div></article><article class="timeline-card glass reveal"><div class="timeline">${d.events.map(e=>{const g=guideFor(e),kind=eventKinds[e.type]||['•','行程'];return `<div class="timeline-row"><div class="timeline-time">${e.time}</div><div class="timeline-dot"></div><div class="timeline-content"><div class="timeline-title-row"><h3>${e.title}</h3><span class="event-kind">${kind[0]} ${kind[1]}</span></div><p class="event-purpose">${g.why}</p><div class="event-how"><b>怎麼去</b><p>${g.how}</p></div><div class="timeline-bottom"><span class="duration">◷ ${e.duration}</span><a class="map-link" href="${maps(e.map)}" target="_blank" rel="noopener">Google Maps ↗</a></div></div></div>`}).join('')}</div></article>`;
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
  if('serviceWorker' in navigator)window.addEventListener('load',()=>{
    let refreshing=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(refreshing)return;
      refreshing=true;
      location.reload();
    });
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>reg.update()).catch(()=>{});
  });

  initTheme();resolveActiveDay();updateTripCountdown();nextFlight();nextAttraction();tomorrowFocus();renderTabs();renderDay();initCurrency();renderBudget();renderPacking();renderFlights();renderChecks();bindOpenDayButtons();network();updateWeather();observeReveals();
})();
