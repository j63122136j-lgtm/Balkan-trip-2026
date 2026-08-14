# Balkan 2026 Travel Dashboard 3.0

## GitHub Pages
將以下檔案全部放在 repository root：

- `index.html`
- `styles.css`
- `itinerary.js`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `icons/`

GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)`。

## 之後怎麼更新行程
只要修改 `itinerary.js`。畫面、PWA、預算與 localStorage 邏輯都在其他檔案。

## Weather
使用 Open-Meteo 免費 Forecast API，不需 API key。若網路失敗，會顯示 localStorage 中最近一次成功取得的天氣。

## Offline
Service Worker 會 precache app shell。第一次成功開啟網站後，核心 Dashboard 可離線使用。Google Maps 與即時天氣本身需要網路；天氣有 last-known fallback。

## iPhone 加入主畫面
Safari → 分享 → 加入主畫面。
