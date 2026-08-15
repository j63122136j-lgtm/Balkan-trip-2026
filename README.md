# Balkan Trip Dashboard v4

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

## Day 可用欄位

每一天可包含：

- 基本資料：`day`、`date`、`country`、`city`、`weatherKey`、`stay`、`theme`、`summary`
- `photo`：真實地點照片 URL、alt、credit、source
- `lodging`：住宿區域、原因、停車/動線、地圖查詢
- `food[]`：餐廳、必吃、地圖；可選真實料理照片
- `events[]`：時間、類型、標題、目的、怎麼去、耗時、Google Maps 查詢

照片採 Wikimedia Commons 的授權圖片並顯示來源；餐廳營業、交通班次、邊境等待與票價仍應在出發前再次確認。
