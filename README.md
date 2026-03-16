# Sharsheret Server (Node.js)

## תקציר
API פשוט לניהול משתמשים, מוצרים והזמנות עם Express + MongoDB (Mongoose).

## הפעלה מקומית
1. התקן תלויות:
   ```bash
   npm install
   ```
2. תגדיר קובץ `.env` עם משתנה:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   ```
3. הפעל ב-dev (nodemon):
   ```bash
   npm run dev
   ```

## מבנה נתיבים (Endpoints)
בסיס: `http://localhost:4400/api`

### משתמשים (Users)
- `POST /user` - יצירת משתמש חדש
- `POST /login` - התחברות (מחזיר פרטי משתמש)
- `GET /user` - קבלת רשימת משתמשים
- `POST /updateuser` - עדכון משתמש (דורש אימות בסיסי)
- `DELETE /deleteuser` - מחיקת משתמש

### מוצרים (Items)
- `GET /product` - קבלת רשימת מוצרים (pagination optional)
- `GET /byid/:id` - קבלת מוצר לפי SKU
- `POST /product` - יצירת מוצר
- `PUT /product/:id` - עדכון מוצר לפי SKU
- `DELETE /product/:id` - מחיקת מוצר לפי SKU

### הזמנות (Orders)
- `POST /order` - יצירת הזמנה
- `GET /orders` - קבלת כל ההזמנות
- `GET /ordersbyid/:userId` - קבלת הזמנות של משתמש
- `DELETE /order` - מחיקת הזמנה (דורש פרטי משתמש והזמנה)
- `PUT /order` - עדכון סטטוס משלוח (admin)

## הערות
- משתמשים מוחזקים ב-DB עם `role` (`user`/`admin`).
- מוצר מזוהה לפי `SKU` (מספר ייחודי).
- הזמנות משתמשות ב-`customerId` (ObjectId) כדי להפנות למשתמש.

---
*הקובץ הזה מתעדכן ככל שה-API מתפתח.*
