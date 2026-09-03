# Balkan Trip Dashboard v4.17.0

## v4.17.0 更新

- Split 09/22–09/23 兩晚住宿確認為 Airbnb／Ul. Antuna Branka Šimića 2，兩晚共 NT$4,614。
- Split 住宿卡、Google Maps 導航、港口／跨境巴士動線與 Budget 已同步更新。
- 住宿總額更新為 NT$45,793，旅程預計總支出更新為 NT$159,692。

## v4.16.0 更新

- 09/26 Mostar → Sarajevo 改為 19:56 → 21:54 季節景觀火車；19:15 前到站，保留約 41 分鐘。
- Sarajevo 09/26–09/28 兩晚住宿確認為 Azize Šaćirbegović 124 B&B，兩晚共 NT$3,000。
- 住宿總額更新為 NT$48,179，旅程預計總支出更新為 NT$162,078。

## v4.15.0 更新

- 全程車站／碼頭動線加入明確到站目標；到站至發車一律至少保留 15 分鐘，長途與跨境班次保留 45–70 分鐘。
- 09/20 Ljubljana → Zagreb 改搭 16:45 → 19:10 火車，較晚班更從容。
- 09/22 Zagreb → Split 於 07:45 前到站，為約 08:40 直達巴士保留約 55 分鐘。
- 09/23 跳島於 07:15 前抵達碼頭；09/26 Mostar 火車及 09/28 Sarajevo 巴士均提早出發。

## v4.14.0 更新

- D4 Istanbul 航線完整連接至 Ljubljana。
- 補上 D7 Ljubljana → Zagreb 巴士路線。
- D13 火車路線更正為 Mostar → Sarajevo，不再由 Blagaj 起線。

## v4.13.1 更新

- 首頁改為 network-first，避免 GitHub Pages 更新後仍被舊 Service Worker 畫面卡住。
- 路線圖加入版本參數，部署新版時不會沿用舊圖片快取。

## v4.13.0 更新

- 移除手機無法正常使用的互動式道路地圖與 `route-map.html`。
- 首頁恢復固定版 Balkan 路線圖，不再依賴外部地圖服務或載入圖磚。
- 路線更新為 Ljubljana → Zagreb → Split → Mostar → Sarajevo → Dubrovnik。
- 移除 Plitvice Lakes 與租車路線，Zagreb → Split 改為巴士。
- Day 標示更新為 D4、D5、D6、D7、D9、D11、D12、D13、D15 與 D17。

## v4.12.0 更新

- 完整淘汰原本的國界示意圖，改成可拖曳、縮放的街道路網底圖。
- 保留真實海岸、道路、城市與國界資訊，手機版地圖加高以便操作。
- 每個主要住宿城市只標示抵達首日，點選 Day 標記可查看該段重點。
- 巴士、火車、船程與航班方向分色；首頁與全螢幕版共用同一份路線資料。
- 底圖採 OpenStreetMap 並保留必要的圖資標示。

## v4.11.0 更新

- Ljubljana 09/17–09/19 三晚住宿正式確認為 Gosposvetska cesta 4, Ljubljana 1000。
- 三晚住宿總額更新為 NT$13,343，依每日 Budget 精確分攤為 NT$4,448、NT$4,448、NT$4,447。
- 三個 Day 頂部住宿卡統一改為實際地址與 Google Maps 導航，並移除原本每晚 NT$3,500 的暫估。
- Budget 已確認住宿統計改為曼谷、Ljubljana、Mostar三筆實際金額，其餘住宿仍暫估每晚 NT$3,500。

## v4.10.1 更新

- 修正每日圖片清單覆蓋 Day 10 本機照片的問題，Split／Islands 現在會穩定顯示 Hvar 海岸實景。

一套可重用、offline-first 的旅行 dashboard。這版已把「畫面模板」與「旅程內容」分開。

## 資料夾

- `index.html`：網站入口；換旅程時只需改資料檔的 `<script>` 路徑與少量首頁文案。
- `template/app.js`：通用顯示、天氣、匯率、localStorage、PWA 邏輯。
- `template/styles.css`：通用版型與 RWD。
- `trips/balkan-2026.js`：本次航班、19 天行程、住宿區域、餐廳、照片與官方來源。
- `assets/icons/`：PWA / Apple touch icons，請一起 commit。
- `manifest.webmanifest`、`sw.js`：安裝到主畫面與離線快取。

## 套用到下一趟旅行

1. 複製 `trips/balkan-2026.js`，例如改成 `trips/japan-2027.js`。
2. 保留 `window.TRIP_DATA` 的欄位結構，替換 `meta`、`flights`、`days`、`weatherCities`、`packing` 等資料。
3. 在 `index.html` 把 `trips/balkan-2026.js` 改成新檔名。
4. 修改首頁 slogan / subtitle（若需要）；`template/` 不必改。
5. 每次發布更新 `sw.js` 的 `VERSION`，避免舊快取卡住。

## v4.10.0 更新

- 09/18 移除 KKday，改成 Ljubljana → Postojna Cave Park 公共交通自由行；串接 10:40／12:05 官方季節接駁、Predjama Castle 與 14:00 Postojna Cave 場次。
- 行前清單與打包票券同步改為官方雙景點套票、園區接駁現金及 Ljubljana ↔ Postojna 公共交通備案。
- 09/17 Istanbul 改為無門票快閃：Blue Mosque／Hagia Sophia 外觀、土耳其早餐、Arasta Bazaar 紀念品、köfte 與 baklava。
- 來源移除 KKday，改列 Postojna Cave 官方票券及接駁資訊。

## v4.9.0 更新

- 09/22 Zagreb → Split 取消國內線，改為約 08:40 → 13:50 的直達早班巴士；同步移除機場接駁與安檢動線。
- 路線圖將 Zagreb → Split 的交通方式由飛機改為巴士。
- Mostar 09/24–09/26 更新為已確認的 Adema Buća 23 B&B，兩晚各 NT$2,018，住宿導航改用實際 Google Maps 連結。

## v4.8.3 更新

- 頂欄移除與「查看行程」功能重複的 Day 0 按鈕。
- 路線圖放大並聚焦斯洛維尼亞、克羅埃西亞與波士尼亞；連住兩晚的城市只標示抵達第一天。
- Day 10 的 Hvar 實景照片改為網站內建圖片，避免外部轉址失效，並加入離線快取。
- 每日頂部移除重複天氣，只保留會跟著 Day 選擇切換城市的置頂天氣。

## v4.8.2 更新

- 修正 Day 10 失效的圖片網址，改用可正常載入並附來源標註的 Hvar 海上實景照片。

## v4.8.1 更新

- 將 Itinerary 標題與 Day 0–19 日期選單整併成單一橫列，移除獨立標題區，將導覽高度縮減約一半。
- 手機版保留橫向滑動選日，並進一步縮小按鈕與上下留白。

## v4.8.0 更新

- 將 Dashboard 的主要操作色改為 Pantone 1505 C 橘色，保留淺色／深色切換與交通狀態的語意色。
- 每日城市、照片、即時天氣與當晚住宿整合在同一個頂部 block；住宿僅保留 Google Maps 導航，價格仍留在資料層供 Budget 統計。
- 每日行程移至第二個 block，放大主要文字並改成桌機單列、手機緊湊堆疊，減少大片留白。
- Daily Spend 接在行程後方，餐飲與在地推薦移到頁面下段。

## v4.7.0 更新

- Route Overview 移除 Day 0 按鈕，地圖改回舊版的米白底、三國分色、粗國界與交通分色風格；路線則使用現行版本，沒有十六湖與租車段。
- Quick Convert 放大幣別、金額輸入與台幣結果，改善手機點選與快速判讀。
- 出發前的 Next Stop 與 Tomorrow / Focus 改為連動 Day 0，顯示下一個尚未完成的行前任務。
- Next Flight 新增 AirLabs 即時狀態：起飛前約 10 小時內可更新預估時間、航廈、登機門、延誤與航班狀態；API key 只保存在目前瀏覽器。

## v4.6.2 更新

- 將當下城市天氣整合進最上方導覽列，移除首頁獨立 Weather block。
- 桌機顯示城市、圖示、溫度、天況與高低溫；窄螢幕自動精簡，避免增加頂欄高度。

## v4.6.1 更新

- 移除獨立的大型 Hero block，將旅程標題與行程入口整合進最上方導覽列，桌機首頁直接進入路線圖與 Dashboard 內容。
- 手機仍使用精簡頂欄，不增加額外高度。

## v4.6.0 更新

- 將首頁行前注意、Pack 與 More Checklist 合併成單一 Day 0，依優先級排成可勾選的行前 Timeline。
- Day 0 依序處理護照、台胞證、土耳其 e-Visa、保險、入境規定、景點票券、關鍵交通、住宿離線資料、付款網路與最終打包。
- 最新路線圖直接放在首頁封面；Day 0 成為 Trip 的第一個分頁，Day 1–19 接續在後。
- 底部導覽精簡為 Home、Trip、Budget、More，行前資訊不再散落於三個頁面。

## v4.5.0 更新

- 路線改為 Zagreb 連住 2 晚 → 09/22 飛 Split → Split 連住 2 晚，取消十六湖住宿與移動。
- 09/23 保留完整跳島日，09/24 用市場、咖啡與 Marjan 第一觀景台收尾，再搭 17:30 跨境巴士。
- 新增待訂 ZAG → SPU 航班提示，並區分已訂與待訂航班。
- 新增 `route-map.html`，以交通方式分色顯示新版路線。

## v4.4.0 更新

- Budget 改為固定／預計支出、每日消費與目前旅行總花費，不再顯示預算上限與剩餘額。
- 每個 Day 分頁新增精簡消費記錄，可輸入分類、項目與新台幣金額並逐筆刪除。
- 當時住宿基準為：曼谷兩晚共 NT$3,300；其餘住宿先以每晚 NT$3,500 估列。Ljubljana 與 Mostar 後續已改為確認金額。
- 每日消費與打包勾選使用不含版本號的 localStorage key，後續更新 dashboard 不會因版本變更而消失；舊版 Pack 會自動沿用。
- 舊版 Budget 若已有交通、餐飲或其他實際支出，第一次開啟時會自動轉入每日消費總計。

## Day 可用欄位

每一天可包含：

- 基本資料：`day`、`date`、`country`、`city`、`weatherKey`、`stay`、`theme`、`summary`
- `photo`：真實地點照片 URL、alt、credit、source
- `lodging`：住宿區域、原因、停車/動線、地圖查詢
- `food[]`：餐廳、必吃、地圖；可選真實料理照片
- `localStops[]`：順路咖啡、小吃、夜市、補給與城市杯／紀念杯提示
- `events[]`：時間、類型、標題、目的、怎麼去、耗時、Google Maps 查詢

照片採 Wikimedia Commons 的授權圖片並顯示來源；餐廳營業、交通班次、邊境等待與票價仍應在出發前再次確認。

## 本次同步

2026-09-03 同步 Google 試算表最新住宿：Split 09/22–09/23 入住 Airbnb／Ul. Antuna Branka Šimića 2，兩晚共 NT$4,614；住宿導航、港口集合、跨境巴士動線及 Budget 均已更新。
