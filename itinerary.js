window.TRIP_DATA = {
  meta: {
    title: "Balkan 2026",
    subtitle: "Bangkok · Istanbul · Slovenia · Croatia · Bosnia · Geneva",
    dateRange: "2026.09.14 — 10.02",
    startDate: "2026-09-14",
    endDate: "2026-10-02",
    travelers: 2,
    bags: "Allpa 35L × 2",
    returnPrice: 32242,
    currency: "TWD"
  },

  route: [
    "Bangkok","Istanbul","Ljubljana","Bled","Zagreb","Plitvice","Zadar","Split","Mostar","Sarajevo","Dubrovnik","Geneva","Shanghai","Taipei"
  ],

  weatherCities: {
    Bangkok: { lat: 13.7563, lon: 100.5018, label: "Bangkok" },
    Istanbul: { lat: 41.0082, lon: 28.9784, label: "Istanbul" },
    Ljubljana: { lat: 46.0569, lon: 14.5058, label: "Ljubljana" },
    Bled: { lat: 46.3692, lon: 14.1136, label: "Lake Bled" },
    Zagreb: { lat: 45.8150, lon: 15.9819, label: "Zagreb" },
    Plitvice: { lat: 44.8808, lon: 15.6163, label: "Plitvice" },
    Zadar: { lat: 44.1194, lon: 15.2314, label: "Zadar" },
    Split: { lat: 43.5081, lon: 16.4402, label: "Split" },
    Mostar: { lat: 43.3438, lon: 17.8078, label: "Mostar" },
    Sarajevo: { lat: 43.8563, lon: 18.4131, label: "Sarajevo" },
    Dubrovnik: { lat: 42.6507, lon: 18.0944, label: "Dubrovnik" },
    Geneva: { lat: 46.2044, lon: 6.1432, label: "Geneva" },
    Shanghai: { lat: 31.2304, lon: 121.4737, label: "Shanghai" },
    Taipei: { lat: 25.0330, lon: 121.5654, label: "Taipei" }
  },

  flights: [
    { date:"09/14", code:"SL395", from:"TPE", to:"DMK", depart:"21:20", arrive:"00:15+1", airline:"Thai Lion Air", status:"booked", fromTerminal:"待確認", toTerminal:"待確認" },
    { date:"09/16", code:"TK069", from:"BKK", to:"IST", depart:"22:45", arrive:"04:45+1", airline:"Turkish Airlines", status:"booked", fromTerminal:"待確認", toTerminal:"待確認" },
    { date:"09/17", code:"TK1063", from:"IST", to:"LJU", depart:"18:15", arrive:"19:30", airline:"Turkish Airlines", status:"booked", fromTerminal:"待確認", toTerminal:"待確認" },
    { date:"09/30", code:"U21506", from:"DBV", to:"GVA", depart:"15:30", arrive:"17:25", airline:"easyJet", status:"booked", fromTerminal:"待確認", toTerminal:"T1" },
    { date:"10/01", code:"MU218", from:"GVA", to:"PVG", depart:"12:00", arrive:"05:30+1", airline:"China Eastern", status:"booked", fromTerminal:"T1", toTerminal:"T1" },
    { date:"10/02", code:"MU5007", from:"PVG", to:"TPE", depart:"12:20", arrive:"14:25", airline:"China Eastern", status:"booked", fromTerminal:"T1", toTerminal:"T2" }
  ],

  budgetDefaults: [
    { id:"flights", label:"機票", planned: 77838, spent: 77838 },
    { id:"stays", label:"住宿", planned: 52000, spent: 0 },
    { id:"transport", label:"陸路交通", planned: 15000, spent: 0 },
    { id:"activities", label:"門票 / Tour", planned: 18000, spent: 0 },
    { id:"food", label:"餐飲", planned: 36000, spent: 0 },
    { id:"misc", label:"其他", planned: 12000, spent: 0 }
  ],

  packing: [
    { group:"證件", items:["護照","台胞證","旅遊保險電子保單","信用卡 × 2","少量 EUR 現金"] },
    { group:"背包", items:["Allpa 35L × 2","Packable 小包 / Sling","行李秤","收納袋 / Packing Cubes"] },
    { group:"衣物", items:["快乾短袖 × 3","長袖薄層 × 1","薄刷毛 / 中層 × 1","防風防雨外套 × 1","長褲 × 2","內著 4–5 日份","健走襪 × 3"] },
    { group:"鞋履", items:["Keen Jasper","Teva 涼鞋","防磨貼 / 水泡貼"] },
    { group:"3C", items:["USB-C 充電器","歐規雙圓孔轉接頭","行動電源","eSIM","備用充電線"] },
    { group:"巴爾幹重點", items:["十六湖門票","跳島憑證","Mostar → Sarajevo 交通","Sarajevo → Dubrovnik 早班交通","Geneva 住宿"] }
  ],

  days: [
    {
      day:1,date:"09/14",weekday:"週一",country:"泰國",city:"Bangkok",weatherKey:"Bangkok",stay:"Bangkok",theme:"Departure",
      summary:"台北出發，午夜抵達曼谷。",
      events:[
        { time:"18:00", type:"move", title:"前往桃園機場", detail:"預留報到與晚餐時間", duration:"約 2h", map:"Taoyuan International Airport" },
        { time:"21:20", type:"flight", title:"TPE → DMK", detail:"SL395 · Thai Lion Air", duration:"3h55", map:"Don Mueang International Airport" },
        { time:"00:45", type:"stay", title:"入住 Bangkok", detail:"抵達後直接休息", duration:"—", map:"Bangkok" }
      ]
    },
    {
      day:2,date:"09/15",weekday:"週二",country:"泰國",city:"Bangkok",weatherKey:"Bangkok",stay:"Bangkok",theme:"Reset",
      summary:"完整休息日，咖啡、按摩、採買，不排硬景點。",
      events:[
        { time:"10:00", type:"coffee", title:"慢早餐 + 咖啡", detail:"用走路 / MRT 為主", duration:"2h", map:"Bangkok coffee" },
        { time:"13:00", type:"walk", title:"Bangkok 自由活動", detail:"採買、按摩、街區散步", duration:"4–5h", map:"Bangkok" },
        { time:"19:00", type:"food", title:"晚餐", detail:"長程飛行前一天不要排太晚", duration:"1.5h", map:"Bangkok dinner" }
      ]
    },
    {
      day:3,date:"09/16",weekday:"週三",country:"泰國",city:"Bangkok → Istanbul",weatherKey:"Bangkok",stay:"Flight",theme:"Long haul",
      summary:"曼谷最後半天，晚上飛伊斯坦堡。",
      events:[
        { time:"10:00", type:"walk", title:"Bangkok 最後散步", detail:"行李保持輕量", duration:"3h", map:"Bangkok" },
        { time:"17:30", type:"move", title:"前往 BKK", detail:"市區 → Suvarnabhumi", duration:"約 1h", map:"Suvarnabhumi Airport" },
        { time:"22:45", type:"flight", title:"BKK → IST", detail:"TK069 · Turkish Airlines", duration:"約 10h", map:"Istanbul Airport" }
      ]
    },
    {
      day:4,date:"09/17",weekday:"週四",country:"土耳其 → 斯洛維尼亞",city:"Istanbul → Ljubljana",weatherKey:"Istanbul",stay:"Ljubljana",theme:"Europe begins",
      summary:"伊斯坦堡長轉機後進入巴爾幹。",
      events:[
        { time:"04:45", type:"flight", title:"抵達 IST", detail:"視體力決定是否進市區", duration:"—", map:"Istanbul Airport" },
        { time:"08:00", type:"walk", title:"Istanbul 短停留", detail:"若入市區，務必預留回機場時間", duration:"5–6h", map:"Sultanahmet Istanbul" },
        { time:"18:15", type:"flight", title:"IST → LJU", detail:"TK1063", duration:"2h15", map:"Ljubljana Jože Pučnik Airport" },
        { time:"20:15", type:"stay", title:"入住 Ljubljana", detail:"機場巴士 / Shuttle 進城", duration:"約 45m", map:"Ljubljana" }
      ]
    },
    {
      day:5,date:"09/18",weekday:"週五",country:"斯洛維尼亞",city:"Bled / Bohinj",weatherKey:"Bled",stay:"Ljubljana",theme:"Alpine lakes",
      summary:"布萊德湖與阿爾卑斯湖區，視天氣安排 Vintgar。",
      events:[
        { time:"07:30", type:"move", title:"Ljubljana → Bled", detail:"巴士為主", duration:"約 1h10", map:"Lake Bled" },
        { time:"09:00", type:"walk", title:"Lake Bled 環湖", detail:"湖畔步行約 6 km", duration:"約 1h30–2h", map:"Lake Bled" },
        { time:"12:00", type:"move", title:"Bled → Bohinj / Vintgar", detail:"依天氣擇一優先", duration:"約 30–60m", map:"Lake Bohinj" },
        { time:"18:00", type:"move", title:"返回 Ljubljana", detail:"晚餐放回市區", duration:"約 1h20", map:"Ljubljana" }
      ]
    },
    {
      day:6,date:"09/19",weekday:"週六",country:"斯洛維尼亞",city:"Ljubljana",weatherKey:"Ljubljana",stay:"Ljubljana",theme:"Slow city",
      summary:"市區慢遊；天氣不好就切換 Postojna Cave。",
      events:[
        { time:"09:00", type:"walk", title:"Ljubljana Old Town", detail:"Prešeren Square → Triple Bridge → Central Market", duration:"步行 20–30m", map:"Prešeren Square Ljubljana" },
        { time:"11:30", type:"walk", title:"Ljubljana Castle", detail:"步行上山或纜車", duration:"2h", map:"Ljubljana Castle" },
        { time:"15:00", type:"coffee", title:"河畔咖啡時間", detail:"保留真正的空白時間", duration:"1–2h", map:"Ljubljanica river cafes" },
        { time:"19:00", type:"food", title:"河畔晚餐", detail:"隔天跨境，不拖太晚", duration:"1.5h", map:"Ljubljana Old Town restaurants" }
      ]
    },
    {
      day:7,date:"09/20",weekday:"週日",country:"克羅埃西亞",city:"Ljubljana → Zagreb",weatherKey:"Zagreb",stay:"Zagreb",theme:"Cross-border",
      summary:"上午離開斯洛維尼亞，下午集中攻略 Zagreb 核心區。",
      events:[
        { time:"09:00", type:"move", title:"Ljubljana → Zagreb", detail:"跨境巴士", duration:"約 2–2.5h", map:"Zagreb Bus Station" },
        { time:"13:00", type:"walk", title:"Ban Jelačić Square → Dolac", detail:"市中心點位非常集中", duration:"步行 5–10m", map:"Dolac Market Zagreb" },
        { time:"15:00", type:"walk", title:"Upper Town", detail:"Stone Gate · St. Mark's Church", duration:"2h", map:"St. Mark's Church Zagreb" },
        { time:"19:00", type:"food", title:"Zagreb 晚餐", detail:"住宿盡量靠中心或巴士站", duration:"1.5h", map:"Zagreb city centre restaurants" }
      ]
    },
    {
      day:8,date:"09/21",weekday:"週一",country:"克羅埃西亞",city:"Zagreb → Plitvice",weatherKey:"Plitvice",stay:"Plitvice",theme:"To the lakes",
      summary:"上午補 Zagreb，下午移動十六湖，換取隔天完整公園日。",
      events:[
        { time:"09:30", type:"walk", title:"Museum of Broken Relationships", detail:"開館時間近日期再確認", duration:"1–1.5h", map:"Museum of Broken Relationships Zagreb" },
        { time:"12:00", type:"food", title:"午餐 + 取行李", detail:"不要壓到下午巴士", duration:"1h", map:"Zagreb" },
        { time:"14:00", type:"move", title:"Zagreb → Plitvice", detail:"巴士南下", duration:"約 2–2.5h", map:"Plitvice Lakes National Park Entrance 1" },
        { time:"17:00", type:"stay", title:"入住湖區", detail:"早睡，隔天走完整天", duration:"—", map:"Plitvice Lakes" }
      ]
    },
    {
      day:9,date:"09/22",weekday:"週二",country:"克羅埃西亞",city:"Plitvice Lakes",weatherKey:"Plitvice",stay:"Plitvice",theme:"National park",
      summary:"十六湖完整一天，不安排跨城移動。",
      events:[
        { time:"08:00", type:"walk", title:"入園", detail:"優先避開旅行團高峰", duration:"—", map:"Plitvice Lakes National Park" },
        { time:"08:30", type:"walk", title:"Lower Lakes", detail:"木棧道 + Veliki Slap", duration:"2–3h", map:"Veliki Slap" },
        { time:"12:00", type:"walk", title:"船 / Shuttle 串聯園區", detail:"依現場動線調整", duration:"3–4h", map:"Kozjak Lake" },
        { time:"17:00", type:"stay", title:"回住宿休息", detail:"鞋襪曬乾、整理裝備", duration:"—", map:"Plitvice Lakes" }
      ]
    },
    {
      day:10,date:"09/23",weekday:"週三",country:"克羅埃西亞",city:"Plitvice → Zadar",weatherKey:"Zadar",stay:"Zadar",theme:"Adriatic sunset",
      summary:"上午保留彈性，下午前往 Zadar，看海風琴日落。",
      events:[
        { time:"09:00", type:"walk", title:"十六湖補完 / 慢早餐", detail:"不再硬塞新景點", duration:"2h", map:"Plitvice Lakes" },
        { time:"15:15", type:"move", title:"Plitvice → Zadar", detail:"巴士", duration:"約 1h45", map:"Zadar Bus Station" },
        { time:"17:30", type:"walk", title:"Zadar Old Town", detail:"巴士站 → 舊城可搭市區交通", duration:"約 20–30m", map:"Zadar Old Town" },
        { time:"18:30", type:"walk", title:"Sea Organ 日落", detail:"Greeting to the Sun 一起看", duration:"1.5h", map:"Sea Organ Zadar" }
      ]
    },
    {
      day:11,date:"09/24",weekday:"週四",country:"克羅埃西亞",city:"Zadar → Split",weatherKey:"Split",stay:"Split",theme:"Roman coast",
      summary:"中午抵 Split，下午完整留給古城。",
      events:[
        { time:"09:30", type:"move", title:"Zadar → Split", detail:"巴士沿亞得里亞海南下", duration:"約 2h15", map:"Split Bus Station" },
        { time:"12:15", type:"stay", title:"寄放行李 / Check-in", detail:"優先住 Old Town / Bus Station 周邊", duration:"30m", map:"Split Old Town" },
        { time:"13:30", type:"walk", title:"Diocletian's Palace", detail:"宮殿區步行串聯", duration:"3h", map:"Diocletian's Palace" },
        { time:"18:30", type:"walk", title:"Riva + 古城夜景", detail:"晚餐留在舊城", duration:"2h", map:"Riva Split" }
      ]
    },
    {
      day:12,date:"09/25",weekday:"週五",country:"克羅埃西亞",city:"Split / Islands",weatherKey:"Split",stay:"Split",theme:"Island day",
      summary:"跳島一日遊；海象不佳直接切換 Split 慢遊。",
      events:[
        { time:"07:30", type:"move", title:"港口集合", detail:"依 Tour voucher 為準", duration:"步行約 10–20m", map:"Split Port" },
        { time:"08:00", type:"boat", title:"Blue Cave / Vis", detail:"高速艇行程", duration:"全天", map:"Blue Cave Croatia" },
        { time:"13:00", type:"boat", title:"Stiniva / Pakleni", detail:"實際停靠依海況", duration:"—", map:"Stiniva Cove" },
        { time:"18:30", type:"food", title:"回 Split 晚餐", detail:"隔天早班跨境", duration:"1.5h", map:"Split seafood" }
      ]
    },
    {
      day:13,date:"09/26",weekday:"週六",country:"波士尼亞",city:"Split → Mostar",weatherKey:"Mostar",stay:"Mostar",theme:"Bosnia begins",
      summary:"早班跨境進 Mostar，中午後直接進老城。",
      events:[
        { time:"07:30", type:"move", title:"Split → Mostar", detail:"跨境巴士，證件放隨身", duration:"約 4h40", map:"Mostar Bus Station" },
        { time:"12:30", type:"stay", title:"Check-in / 寄放背包", detail:"Old Town 徒步即可", duration:"30m", map:"Mostar Old Town" },
        { time:"13:30", type:"walk", title:"Stari Most + Old Bazaar", detail:"老橋兩側慢慢走", duration:"3h", map:"Stari Most Mostar" },
        { time:"18:30", type:"food", title:"Neretva 河畔晚餐", detail:"傍晚光線最好", duration:"1.5h", map:"Mostar Old Town restaurants" }
      ]
    },
    {
      day:14,date:"09/27",weekday:"週日",country:"波士尼亞",city:"Mostar",weatherKey:"Mostar",stay:"Mostar",theme:"Flexible Bosnia",
      summary:"Mostar 深度日；可換成 Blagaj / Počitelj / Kravica。",
      events:[
        { time:"08:30", type:"walk", title:"Mostar 晨間老城", detail:"旅行團到前拍照", duration:"1.5h", map:"Stari Most Mostar" },
        { time:"10:30", type:"move", title:"周邊半日遊（可選）", detail:"Blagaj / Počitelj / Kravica", duration:"4–6h", map:"Blagaj Tekija" },
        { time:"17:00", type:"coffee", title:"Bosnian coffee", detail:"回 Mostar 放空", duration:"1h", map:"Mostar coffee" },
        { time:"19:00", type:"food", title:"Mostar 晚餐", detail:"若要多留 Sarajevo，可改今天下午移動", duration:"1.5h", map:"Mostar" }
      ]
    },
    {
      day:15,date:"09/28",weekday:"週一",country:"波士尼亞",city:"Mostar → Sarajevo",weatherKey:"Sarajevo",stay:"Sarajevo",theme:"Scenic rail",
      summary:"上午 Mostar 收尾，下午景觀火車 / 巴士進 Sarajevo。",
      events:[
        { time:"09:00", type:"walk", title:"Mostar 最後散步", detail:"老橋周邊早餐", duration:"2h", map:"Mostar Old Town" },
        { time:"14:00", type:"move", title:"Mostar → Sarajevo", detail:"優先景觀火車；班次近日期確認", duration:"約 2–3h", map:"Sarajevo Railway Station" },
        { time:"18:00", type:"walk", title:"Baščaršija 初探", detail:"車站 → 老城可搭電車 / Taxi", duration:"2h", map:"Baščaršija" },
        { time:"20:00", type:"food", title:"Sarajevo 晚餐", detail:"Ćevapi / Bosnian coffee", duration:"1.5h", map:"Baščaršija restaurants" }
      ]
    },
    {
      day:16,date:"09/29",weekday:"週二",country:"波士尼亞 → 克羅埃西亞",city:"Sarajevo → Dubrovnik",weatherKey:"Dubrovnik",stay:"Dubrovnik",theme:"Critical transfer",
      summary:"新版最重要的移動日：越早抵 Dubrovnik 越好。",
      events:[
        { time:"06:30", type:"move", title:"Sarajevo → Dubrovnik", detail:"早班巴士 / Transfer；班次待鎖定", duration:"約 5–6h", map:"Dubrovnik Bus Station" },
        { time:"13:00", type:"stay", title:"寄放 Allpa / Check-in", detail:"Gruž → Old Town 約 15–25m 車程", duration:"30m", map:"Pile Gate Dubrovnik" },
        { time:"14:00", type:"walk", title:"Dubrovnik Old Town", detail:"Pile Gate → Stradun → Old Port", duration:"3–4h", map:"Dubrovnik Old Town" },
        { time:"19:00", type:"food", title:"古城晚餐 + 夜景", detail:"把最精華的夜晚留給 Dubrovnik", duration:"2h", map:"Dubrovnik Old Town restaurants" }
      ]
    },
    {
      day:17,date:"09/30",weekday:"週三",country:"克羅埃西亞 → 瑞士",city:"Dubrovnik → Geneva",weatherKey:"Dubrovnik",stay:"Geneva",theme:"Dubrovnik finale",
      summary:"上午城牆，午後起飛；這也是選 Geneva 方案的價值。",
      events:[
        { time:"08:00", type:"walk", title:"Dubrovnik City Walls", detail:"開門後第一批進場最佳", duration:"約 1.5–2h", map:"Dubrovnik City Walls" },
        { time:"10:15", type:"coffee", title:"Old Town 咖啡 + 最後散步", detail:"控制在中午前回住宿", duration:"1.5h", map:"Dubrovnik Old Town coffee" },
        { time:"12:30", type:"move", title:"Old Town → DBV", detail:"Airport shuttle / Taxi", duration:"約 30–40m", map:"Dubrovnik Airport" },
        { time:"15:30", type:"flight", title:"DBV → GVA", detail:"U21506 · easyJet", duration:"1h55", map:"Geneva Airport" },
        { time:"18:30", type:"walk", title:"Geneva 夜間散步", detail:"Cornavin → Lake Geneva 約 10–15m 步行", duration:"2h", map:"Jet d'Eau Geneva" }
      ]
    },
    {
      day:18,date:"10/01",weekday:"週四",country:"瑞士 → 中國大陸",city:"Geneva → Shanghai",weatherKey:"Geneva",stay:"Flight",theme:"Bonus Switzerland",
      summary:"Geneva 早餐 + 湖畔，午間飛上海。",
      events:[
        { time:"07:30", type:"coffee", title:"Geneva 早餐", detail:"住 Cornavin 一帶最省移動", duration:"1h", map:"Geneva Cornavin coffee" },
        { time:"08:30", type:"walk", title:"Lake Geneva / Old Town", detail:"只走近距離，不跨城", duration:"1h", map:"Geneva Old Town" },
        { time:"09:30", type:"move", title:"Cornavin → GVA", detail:"火車約 7 分鐘，另留候車時間", duration:"約 20m", map:"Geneva Airport" },
        { time:"12:00", type:"flight", title:"GVA → PVG", detail:"MU218 · China Eastern", duration:"約 11h30", map:"Shanghai Pudong International Airport" }
      ]
    },
    {
      day:19,date:"10/02",weekday:"週五",country:"中國大陸 → 台灣",city:"Shanghai → Taipei",weatherKey:"Shanghai",stay:"Home",theme:"Home",
      summary:"浦東轉機 6h50，下午回台。",
      events:[
        { time:"05:30", type:"flight", title:"抵達 PVG", detail:"保留充足轉機 buffer", duration:"—", map:"Shanghai Pudong International Airport" },
        { time:"06:30", type:"coffee", title:"機場早餐 / 休息", detail:"不建議 6h50 特地進市區", duration:"3–4h", map:"Shanghai Pudong International Airport" },
        { time:"12:20", type:"flight", title:"PVG → TPE", detail:"MU5007 · China Eastern", duration:"2h05", map:"Taoyuan International Airport" },
        { time:"14:25", type:"stay", title:"抵達台灣", detail:"Balkan 2026 完成", duration:"—", map:"Taipei" }
      ]
    }
  ]
};
