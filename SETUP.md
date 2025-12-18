# Universitet Moddiy-Texnik Baza Tizimi - O'rnatish Bo'yicha To'liq Yo'riqnoma

## 1. TALABLAR

Sizning kompyuteringizda quyidagilar o'rnatilgan bo'lishi kerak:

- **Node.js** (v18 yoki yuqori) - https://nodejs.org/
- **PostgreSQL** (v14 yoki yuqori)
- **pgAdmin** (allaqachon mavjud deb yozilgan)
- **Git** (ixtiyoriy)

---

## 2. MA'LUMOTLAR BAZASINI SOZLASH

### 2.1. pgAdmin orqali ma'lumotlar bazasi yaratish

1. **pgAdmin**ni oching
2. PostgreSQL serveringizga ulanish (odatda `localhost`)
3. O'ng tugmani bosing va **Create > Database** tanlang
4. Ma'lumotlar bazasi nomi: `unomimyuni`
5. Owner: `postgres` (yoki sizning user)
6. **Save** bosing

**YOKI** SQL orqali yaratish:

1. pgAdmin ichida **Query Tool**ni oching
2. `scripts/01-create-database.sql` faylini oching
3. Run (F5) bosing

### 2.2. PostgreSQL ma'lumotlarini tekshiring

Sizga kerak bo'ladi:
- **Host**: `localhost`
- **Port**: `5432` (default)
- **User**: `postgres` (yoki sizning user)
- **Password**: pgAdmin parolingiz
- **Database**: `unomimyuni`

---

## 3. LOYIHANI O'RNATISH

### 3.1. Loyiha papkasiga kirish

Terminal/CMD ni oching va loyiha papkasiga o'ting:

```bash
cd path/to/project
```

### 3.2. Paketlarni o'rnatish

```bash
npm install
```

### 3.3. .env.local faylini sozlash

`.env.local` faylini ochib, o'z ma'lumotlaringizni kiriting:

```env
DATABASE_URL="postgresql://postgres:SIZNING_PAROL@localhost:5432/unomimyuni?schema=public"
NEXTAUTH_SECRET="universitet-secret-2025"
NEXTAUTH_URL="http://localhost:3000"
```

**MUHIM**: `SIZNING_PAROL` ni PostgreSQL parolingiz bilan almashtiring!

---

## 4. PRISMA MIGRATION

### 4.1. Prisma Client yaratish

```bash
npx prisma generate
```

### 4.2. Jadvallarni yaratish (Migration)

```bash
npx prisma migrate dev --name init
```

Bu quyidagi jadvallarni yaratadi:
- `admins` - Admin foydalanuvchilar
- `employees` - Hodimlar
- `assets` - Buyumlar
- `asset_assignments` - Javobgarlik tarixi

### 4.3. Admin foydalanuvchini qo'shish

Prisma Studio orqali:

```bash
npx prisma studio
```

1. Brauzerda Prisma Studio ochiladi
2. `admins` jadvaliga boring
3. **Add record** bosing
4. Quyidagilarni kiriting:
   - username: `admin`
   - password: `admin123`
   - name: `Administrator`
5. **Save** bosing

**YOKI** SQL orqali (pgAdmin da):

```sql
INSERT INTO admins (id, username, password, name, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin',
    'admin123',
    'Administrator',
    NOW(),
    NOW()
);
```

---

## 5. LOYIHANI ISHGA TUSHIRISH

### 5.1. Development rejimida ishga tushirish

```bash
npm run dev
```

### 5.2. Brauzerda ochish

Brauzerni oching va quyidagi manzilga o'ting:

```
http://localhost:3000
```

### 5.3. Login qilish

- **Username**: `admin`
- **Password**: `admin123`

---

## 6. FOYDALANISH BO'YICHA QISQACHA

### Admin Panel

\`http://localhost:3000/admin\` - Asosiy admin panel

**Hodimlar**:
- \`/admin/employees\` - Hodimlar ro'yxati
- Yangi hodim qo'shish, tahrirlash, o'chirish

**Buyumlar**:
- \`/admin/assets\` - Buyumlar ro'yxati
- Yangi buyum qo'shish (avtomatik QR-kod yaratiladi)
- Tahrirlash, o'chirish
- QR-kodni chop etish

**Javobgarlik belgilash**:
- Buyumni tanlang
- "Javobgar biriktirish" tugmasini bosing
- Hodimni tanlang, izoh va sana kiriting
- Javobgarlikni o'zgartirish yoki bekor qilish

**Excel Eksport**:
- Har bir sahifada "Export to Excel" tugmasi bor
- Filtrlarni qo'llang
- Eksport tugmasini bosing
- Fayl yuklab olinadi

### Public QR Sahifa

Har bir buyumning o'ziga xos QR-kodi bor:

\`http://localhost:3000/asset/{qr_code}\`

Bu sahifada:
- Buyum ma'lumotlari
- Javobgar hodim ma'lumotlari
- Faqat ko'rish rejimi (tahrirlash yo'q)

---

## 7. MUAMMOLARNI HAL QILISH

### Ma'lumotlar bazasiga ulanish xatosi

1. PostgreSQL serveri ishga tushganligini tekshiring
2. `.env.local` fayldagi ma'lumotlarni tekshiring
3. pgAdmin orqali ulanishni sinab ko'ring

### Prisma xatolari

```bash
npx prisma generate
npx prisma migrate reset
```

### Port band bo'lsa

`.env.local` da portni o'zgartiring yoki:

```bash
PORT=3001 npm run dev
```

---

## 8. MA'LUMOTLAR BAZASI BACKUP

### Backup olish (pgAdmin)

1. pgAdmin da `unomimyuni` ni tanlang
2. O'ng tugma > **Backup**
3. Fayl nomini kiriting
4. Format: **Custom**
5. **Backup** bosing

### Backup qayta tiklash

1. pgAdmin da ma'lumotlar bazasini yarating
2. O'ng tugma > **Restore**
3. Backup faylini tanlang
4. **Restore** bosing

---

## 9. QO'SHIMCHA MA'LUMOTLAR

### Prisma Studio (ma'lumotlar bazasini ko'rish)

```bash
npx prisma studio
```

### Production uchun build

```bash
npm run build
npm start
```

---

## YORDAM

Agar muammo yuzaga kelsa:

1. Terminal/CMD dagi xato xabarini o'qing
2. `.env.local` fayldagi ma'lumotlarni qayta tekshiring
3. Ma'lumotlar bazasi ishga tushganligini tekshiring
4. \`node_modules\` ni o'chirib, qayta o'rnating:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

**Loyiha tayyor! Muvaffaqiyatlar!** 🎉
```
