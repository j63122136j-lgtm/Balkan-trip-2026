# Balkan Trip Dashboard v4.5.0

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

## v4.5.0 更新

- 路線改為 Zagreb 連住 2 晚 → 09/22 飛 Split → Split 連住 2 晚，取消十六湖住宿與移動。
- 09/23 保留完整跳島日，09/24 用市場、咖啡與 Marjan 第一觀景台收尾，再搭 17:30 跨境巴士。
- 首頁新增行前注意事項：土耳其 e-Visa、護照、ETIAS／EES、台胞證、Vintgar 指定時段與關鍵票券。
- 新增待訂 ZAG → SPU 航班提示，並區分已訂與待訂航班。
- 新增 `route-map.html`，以交通方式分色顯示新版路線。

## v4.4.0 更新

- Budget 改為固定／預計支出、每日消費與目前旅行總花費，不再顯示預算上限與剩餘額。
- 每個 Day 分頁新增精簡消費記錄，可輸入分類、項目與新台幣金額並逐筆刪除。
- 住宿共 16 晚：曼谷兩晚共 NT$3,300；其餘 14 晚先以每晚 NT$3,500 估列。
- 每日消費、Checklist 與 Pack 使用不含版本號的 localStorage key，後續更新 dashboard 不會因版本變更而消失；舊版 Checklist／Pack 會自動沿用。
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

2026-08-23 更新 Bangkok 住宿為 Metropolis Suites Bangkok（Sukhumvit 39），兩晚 NT$3,300、每日拆分 NT$1,650。主行程維持 Ljubljana 連住、Bled 當日來回、Zagreb 不租車，取消十六湖，改由 Zagreb 飛 Split 並在 Split 連住兩晚，再由 Mostar、Sarajevo、Dubrovnik 前往 Geneva。
