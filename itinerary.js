// ============================================================
// 巴爾幹旅行資料檔
// 之後只要修改這個檔案，index.html 會自動套用最新行程。
// ============================================================

window.TRIP_DATA = {
  meta: {
    title: "巴爾幹半島 19 天探索之旅",
    subtitle: "Bangkok → Istanbul → Slovenia → Croatia → Bosnia → Geneva → Taipei",
    dateRange: "2026.09.14 — 10.02",
    travelers: 2,
    baggage: "Allpa 35L × 2",
    theme: "Balkan Backpacking 2026"
  },

  summary: {
    days: 19,
    countries: 7,
    nights: 16,
    returnTicketTwd: 32242,
    returnRoute: "DBV → GVA → PVG → TPE"
  },

  regions: [
    { id: "thailand", name: "🇹🇭 泰國", color: "amber" },
    { id: "turkey", name: "🇹🇷 土耳其", color: "orange" },
    { id: "slovenia", name: "🇸🇮 斯洛維尼亞", color: "emerald" },
    { id: "croatia", name: "🇭🇷 克羅埃西亞", color: "cyan" },
    { id: "bosnia", name: "🇧🇦 波士尼亞", color: "blue" },
    { id: "switzerland", name: "🇨🇭 瑞士", color: "rose" },
    { id: "return", name: "✈️ 回程", color: "violet" }
  ],

  days: [
    {
      day: 1, date: "09/14", weekday: "週一", region: "thailand", country: "泰國",
      city: "Bangkok", hotel: "Bangkok", transport: "THSR + Flight + MRT",
      morning: "出發準備／前往桃園機場",
      afternoon: "台灣 → 曼谷",
      evening: "TPE → DMK｜21:20 → 00:15｜SL395",
      note: "抵達後直接前往住宿，保留體力。"
    },
    {
      day: 2, date: "09/15", weekday: "週二", region: "thailand", country: "泰國",
      city: "Bangkok", hotel: "Bangkok", transport: "Walk + MRT",
      morning: "Bangkok 市區慢遊",
      afternoon: "咖啡／採買／按摩",
      evening: "Bangkok 夜間行程",
      note: "完整休息日，為後續長程飛行留體力。"
    },
    {
      day: 3, date: "09/16", weekday: "週三", region: "thailand", country: "泰國 / 轉機",
      city: "Bangkok → Istanbul", hotel: "Flight", transport: "MRT + Flight",
      morning: "Bangkok",
      afternoon: "Bangkok 最後採買／回飯店整理",
      evening: "BKK → IST｜晚間起飛，夜宿機上",
      note: "建議提早到 BKK，長程飛行前吃飽、補水。"
    },
    {
      day: 4, date: "09/17", weekday: "週四", region: "turkey", country: "土耳其 / 斯洛維尼亞",
      city: "Istanbul → Ljubljana", hotel: "Ljubljana", transport: "Flight + Bus",
      morning: "Istanbul 轉機停留，可視體力進市區短遊",
      afternoon: "返回 IST、準備飛往斯洛維尼亞",
      evening: "IST → LJU｜18:15 → 19:30｜TK1063",
      note: "抵達 Ljubljana 後入住，第一晚不排重行程。"
    },
    {
      day: 5, date: "09/18", weekday: "週五", region: "slovenia", country: "斯洛維尼亞",
      city: "Bohinj / Bled", hotel: "Ljubljana", transport: "Bus + Walk",
      morning: "前往 Bohinj / Lake Bled",
      afternoon: "Lake Bled + Vintgar Gorge 健行",
      evening: "返回 Ljubljana",
      note: "山湖日，建議穿防滑鞋並帶薄外套。"
    },
    {
      day: 6, date: "09/19", weekday: "週六", region: "slovenia", country: "斯洛維尼亞",
      city: "Ljubljana", hotel: "Ljubljana", transport: "Walk / KKDAY",
      morning: "Ljubljana 或周邊 KKDAY 行程",
      afternoon: "舊城／河畔咖啡館／自由活動",
      evening: "Ljubljana 河畔晚餐",
      note: "保留彈性：可依天候決定 Postojna Cave 或市區慢遊。"
    },
    {
      day: 7, date: "09/20", weekday: "週日", region: "croatia", country: "斯洛維尼亞 → 克羅埃西亞",
      city: "Ljubljana → Zagreb", hotel: "Zagreb", transport: "Bus + Walk",
      morning: "Ljubljana 最後散步／早餐",
      afternoon: "Ljubljana → Zagreb；Dolac Market、老城",
      evening: "Zagreb 市中心晚餐",
      note: "Zagreb 壓縮為一晚，保留核心景點即可。"
    },
    {
      day: 8, date: "09/21", weekday: "週一", region: "croatia", country: "克羅埃西亞",
      city: "Zagreb → Plitvice", hotel: "Plitvice", transport: "Bus + Walk",
      morning: "Museum of Broken Relationships／Zagreb 市區",
      afternoon: "Zagreb → Plitvice Lakes",
      evening: "湖區住宿、提早休息",
      note: "移動到十六湖前一晚，隔天可完整玩國家公園。"
    },
    {
      day: 9, date: "09/22", weekday: "週二", region: "croatia", country: "克羅埃西亞",
      city: "Plitvice Lakes", hotel: "Plitvice", transport: "Walk + Park shuttle",
      morning: "十六湖上半區",
      afternoon: "十六湖下半區／木棧道與瀑布",
      evening: "湖區晚餐、整理照片",
      note: "整天保留給十六湖，不趕車。"
    },
    {
      day: 10, date: "09/23", weekday: "週三", region: "croatia", country: "克羅埃西亞",
      city: "Plitvice → Zadar", hotel: "Zadar", transport: "Bus + Walk",
      morning: "十六湖補完／悠閒早餐",
      afternoon: "Plitvička Jezera → Zadar｜約 15:15 → 17:00",
      evening: "Sea Organ + Greeting to the Sun 日落",
      note: "Zadar 一晚，主打海邊黃昏與舊城。"
    },
    {
      day: 11, date: "09/24", weekday: "週四", region: "croatia", country: "克羅埃西亞",
      city: "Zadar → Split", hotel: "Split", transport: "Bus + Walk",
      morning: "Zadar → Split｜約 09:30 → 11:45",
      afternoon: "戴克里先宮、Riva 海濱",
      evening: "Split 古城夜遊",
      note: "住宿盡量靠近舊城或巴士站，方便隔天跳島。"
    },
    {
      day: 12, date: "09/25", weekday: "週五", region: "croatia", country: "克羅埃西亞",
      city: "Split / Islands", hotel: "Split", transport: "Boat / KKDAY",
      morning: "藍洞／Vis 跳島集合",
      afternoon: "Stiniva、Pakleni Islands 等跳島行程",
      evening: "返回 Split、海鮮晚餐",
      note: "海象不佳時保留替代市區行程。"
    },
    {
      day: 13, date: "09/26", weekday: "週六", region: "bosnia", country: "克羅埃西亞 → 波士尼亞",
      city: "Split → Mostar", hotel: "Mostar", transport: "Bus + Walk",
      morning: "Split → Mostar｜約 07:30 → 12:10",
      afternoon: "Mostar 老橋、Neretva 河、老城",
      evening: "Mostar 老城晚餐",
      note: "跨境日，護照與台胞證分開保管。"
    },
    {
      day: 14, date: "09/27", weekday: "週日", region: "bosnia", country: "波士尼亞",
      city: "Mostar", hotel: "Mostar", transport: "Walk / Local tour",
      morning: "Mostar 深度探索",
      afternoon: "可選 Blagaj / Počitelj / Kravica 短途",
      evening: "Mostar 慢遊／河畔晚餐",
      note: "若要增加 Sarajevo 時間，可把這天下午提前移動。"
    },
    {
      day: 15, date: "09/28", weekday: "週一", region: "bosnia", country: "波士尼亞",
      city: "Mostar → Sarajevo", hotel: "Sarajevo", transport: "Train / Bus + Walk",
      morning: "Mostar 悠閒早餐、最後散步",
      afternoon: "Mostar → Sarajevo（班次待最終確認）",
      evening: "Sarajevo 夜景／Baščaršija 初探",
      note: "優先選景觀佳的火車，實際班次近日期再鎖定。"
    },
    {
      day: 16, date: "09/29", weekday: "週二", region: "bosnia", country: "波士尼亞 → 克羅埃西亞",
      city: "Sarajevo → Dubrovnik", hotel: "Dubrovnik", transport: "Early Bus / Transfer + Walk",
      morning: "盡早離開 Sarajevo 前往 Dubrovnik",
      afternoon: "Dubrovnik Old Town、Stradun、港口",
      evening: "Dubrovnik 夜間古城／海邊晚餐",
      note: "新版行程關鍵移動日：越早抵達 Dubrovnik 越好。"
    },
    {
      day: 17, date: "09/30", weekday: "週三", region: "croatia", country: "克羅埃西亞 → 瑞士",
      city: "Dubrovnik → Geneva", hotel: "Geneva", transport: "Walk + Airport Bus + Flight",
      morning: "Dubrovnik 城牆、Old Town、咖啡",
      afternoon: "前往 DBV；15:30 → 17:25 GVA｜U21506",
      evening: "Geneva 入住；湖畔／舊城晚餐",
      note: "已訂回程第一段。DBV 建議 13:15–13:30 前抵達。"
    },
    {
      day: 18, date: "10/01", weekday: "週四", region: "switzerland", country: "瑞士 → 中國大陸",
      city: "Geneva → Shanghai", hotel: "Flight", transport: "Train + Flight",
      morning: "Geneva 早餐、Lake Geneva／Old Town 短遊",
      afternoon: "GVA → PVG｜12:00 起飛｜MU218",
      evening: "長程飛行",
      note: "GVA 前一晚已進市區，上午仍可短逛。"
    },
    {
      day: 19, date: "10/02", weekday: "週五", region: "return", country: "中國大陸 → 台灣",
      city: "Shanghai → Taipei", hotel: "Home", transport: "Flight",
      morning: "05:30 抵達 PVG；轉機 6h50",
      afternoon: "PVG → TPE｜12:20 → 14:25｜MU5007",
      evening: "回家休息",
      note: "回程已訂；兩人總價 NT$32,242。"
    }
  ],

  checklistDefaults: [
    "護照與台胞證",
    "旅遊保險與電子保單",
    "Allpa 35L × 2／行李秤",
    "歐規轉接頭／USB-C 充電器／行動電源",
    "eSIM／備用網路方案",
    "十六湖門票／跳島行程憑證",
    "Mostar → Sarajevo 交通確認",
    "09/29 Sarajevo → Dubrovnik 早班交通",
    "09/30 Dubrovnik → DBV 機場交通",
    "Geneva 住宿與機場往返"
  ]
};
