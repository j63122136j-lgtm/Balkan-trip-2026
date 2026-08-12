巴爾幹 Travel Dashboard v3
============================

檔案結構：
- index.html    → 網站版面（通常不需要改）
- itinerary.js → 行程資料（以後主要改這個）
- app.js        → 顯示、分頁、清單與備忘功能（通常不需要改）

如何使用：
1. 三個檔案放在同一個資料夾。
2. 雙擊 index.html 即可開啟。
3. 以後行程變動，只修改 itinerary.js 的 window.TRIP_DATA.days。
4. 若放上 GitHub Pages，直接上傳三個檔案即可。

更新單日行程範例：
在 itinerary.js 找到 day: 16，修改 morning / afternoon / evening / hotel / transport / note。
儲存後重新整理 index.html 即會套用。

注意：
- Checklist 與 Notes 用 browser localStorage 儲存；換電腦或清除瀏覽器資料後不會同步。
- Google Maps 按鈕會以該日 city 欄位進行搜尋。
