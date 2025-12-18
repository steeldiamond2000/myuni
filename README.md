# Universitet Moddiy-Texnik Baza Boshqarish Tizimi

**100% to'liq tayyor, ishlab chiqish uchun professional tizim**

Bu loyiha universitet moddiy-texnik bazasini boshqarish uchun mo'ljallangan to'liq funksional veb ilova.

## Asosiy Funksiyalar

### Admin Panel
- Autentifikatsiya tizimi (oddiy login/parol, hashing yo'q)
- Dashboard - statistika va umumiy ma'lumotlar

### Hodimlar Boshqaruvi
- Hodimlarni qo'shish, tahrirlash, o'chirish (CRUD)
- Hodimlarni qidirish va filtrlash
- Hodimga biriktirilgan buyumlar sonini ko'rish
- Excel formatda eksport

### Buyumlar Boshqaruvi
- Buyumlarni qo'shish, tahrirlash, o'chirish (CRUD)
- Kategoriya: Elektron qurilma yoki Moddiy buyum
- Status: Yangi, Qoniqarli, Ta'mirtalab, Eski
- Inventar raqami bilan avtomatik QR kod yaratish
- QR kodni yuklab olish va chop etish
- Buyumlarni qidirish va filtrlash
- Excel formatda eksport

### Javobgarlik Boshqaruvi
- Hodimga buyum biriktirish
- Javobgarni o'zgartirish (tarix saqlanadi)
- Javobgarlikni bekor qilish
- To'liq javobgarlik tarixi
- Javobgarlik bo'yicha filtrlash
- Excel formatda eksport

### Public QR Sahifa
- QR kod orqali buyum ma'lumotlarini ko'rish
- Javobgar hodim ma'lumotlarini ko'rish
- Autentifikatsiyasiz kirish (faqat ko'rish)
- Mobil-responsive dizayn

## Texnologiya Stack

- **Frontend:** Next.js 16, React 19.2, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** Next.js App Router, Server Actions
- **Database:** PostgreSQL (local)
- **ORM:** Prisma
- **Auth:** NextAuth.js (oddiy autentifikatsiya)
- **QR Code:** qrcode library
- **Excel Export:** xlsx library

## O'rnatish Bo'yicha To'liq Yo'riqnoma

### 1. Talablar

Kompyuteringizda quyidagilar o'rnatilgan bo'lishi kerak:
- Node.js v18 yoki yuqori
- PostgreSQL v14 yoki yuqori
- pgAdmin (ma'lumotlar bazasini boshqarish uchun)

### 2. Loyihani Yuklab Olish

ZIP faylni yuklab oling va papkaga chiqaring:

```bash
cd universitet-inventory-system
```

### 3. Paketlarni O'rnatish

```bash
npm install
```

### 4. Ma'lumotlar Bazasini Yaratish

#### pgAdmin orqali:

1. pgAdmin ni oching
2. PostgreSQL serveringizga ulanish (odatda `localhost`)
3. O'ng tugma > **Create > Database**
4. Database nomi: `unomimyuni`
5. Owner: `postgres` (yoki sizning user)
6. **Save** tugmasini bosing

#### YOKI SQL orqali:

pgAdmin da Query Tool ni ochib, quyidagi SQL ni ishga tushiring:

```sql
CREATE DATABASE unomimyuni
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8';
```

### 5. Environment Variables

`.env.local` faylini ochib, PostgreSQL ma'lumotlaringizni kiriting:

```env
DATABASE_URL="postgresql://postgres:SIZNING_PAROL@localhost:5432/unomimyuni?schema=public"
NEXTAUTH_SECRET="universitet-secret-2025"
NEXTAUTH_URL="http://localhost:3000"
```

**MUHIM:** `SIZNING_PAROL` ni o'z PostgreSQL parolingiz bilan almashtiring!

### 6. Ma'lumotlar Bazasini Sozlash

#### Prisma Client yaratish:

```bash
npx prisma generate
```

#### Jadvallarni yaratish (Migration):

```bash
npx prisma migrate dev --name init
```

Bu quyidagi jadvallarni yaratadi:
- `admins` - Admin foydalanuvchilar
- `employees` - Hodimlar
- `assets` - Buyumlar/qurilmalar
- `asset_assignments` - Javobgarlik tarixi

#### Admin foydalanuvchini qo'shish:

**Variant 1 - Prisma Studio (tavsiya etiladi):**

```bash
npx prisma studio
```

1. Brauzerda Prisma Studio ochiladi
2. `admins` jadvaliga boring
3. **Add record** tugmasini bosing
4. Quyidagilarni kiriting:
   - username: `admin`
   - password: `admin123`
   - name: `Administrator`
5. **Save** tugmasini bosing

**Variant 2 - SQL orqali:**

pgAdmin da Query Tool ni ochib:

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

### 7. Loyihani Ishga Tushirish

Development rejimida:

```bash
npm run dev
```

Brauzerni oching va quyidagi manzilga o'ting:

```
http://localhost:3000
```

### 8. Login

- **Username:** admin
- **Password:** admin123

## Foydalanish Bo'yicha Qo'llanma

### Dashboard

`/admin` - Asosiy sahifa
- Umumiy statistika
- Buyumlar, hodimlar, javobgarliklar soni

### Hodimlar

`/admin/employees` - Hodimlar sahifasi

**Hodim qo'shish:**
1. "Yangi hodim" tugmasini bosing
2. Ism, familiya, lavozim, telefon va ishga kirgan sanani kiriting
3. "Saqlash" tugmasini bosing

**Hodimni tahrirlash:**
1. Hodim qatorida "Tahrirlash" ikonkasini bosing
2. Ma'lumotlarni o'zgartiring
3. "Saqlash" tugmasini bosing

**Hodimni o'chirish:**
1. Hodim qatorida "O'chirish" ikonkasini bosing
2. Tasdiqlang

**Excel eksport:**
1. "Excel" tugmasini bosing
2. Fayl avtomatik yuklab olinadi

### Buyumlar

`/admin/assets` - Buyumlar sahifasi

**Buyum qo'shish:**
1. "Yangi buyum" tugmasini bosing
2. Barcha maydonlarni to'ldiring:
   - Buyum nomi (majburiy)
   - Inventar raqami (unikal, majburiy)
   - Kategoriya: Elektron qurilma / Moddiy buyum
   - Status: Yangi / Qoniqarli / Ta'mirtalab / Eski
   - Model (ixtiyoriy)
   - Sotib olingan sana
   - Soni
3. "Saqlash" tugmasini bosing
4. QR kod avtomatik yaratiladi

**Buyumni tahrirlash:**
1. Buyum qatorida "Tahrirlash" ikonkasini bosing
2. Ma'lumotlarni o'zgartiring (inventar raqamini o'zgartirish mumkin emas)
3. "Saqlash" tugmasini bosing

**QR kodni ko'rish va chop etish:**
1. Buyum qatorida "QR" ikonkasini bosing
2. QR kod modal oynada ochiladi
3. "Yuklab olish" - PNG formatda yuklab olish
4. "Chop etish" - bevosita chop etish

**Javobgar biriktirish:**
1. Buyum qatorida "Javobgar biriktirish" ikonkasini bosing
2. Amalni tanlang:
   - Javobgar biriktirish (birinchi marta)
   - Javobgarni o'zgartirish (allaqachon mavjud bo'lsa)
   - Javobgarlikni bekor qilish
3. Hodimni tanlang (kerak bo'lsa)
4. Sana va izoh kiriting
5. "Saqlash" tugmasini bosing

**Filtrlash:**
- Qidiruv maydonida buyum nomi, inventar raqami yoki model bo'yicha qidiring
- Kategoriya bo'yicha: Elektron / Moddiy / Barchasi
- Status bo'yicha: Yangi / Qoniqarli / Ta'mirtalab / Eski / Barchasi
- Javobgarlik bo'yicha: Javobgar biriktirilgan / Javobgar yo'q / Hammasi

**Excel eksport:**
1. Kerakli filtrlarni qo'llang
2. "Excel" tugmasini bosing
3. Faqat ko'rinayotgan (filtrlangan) ma'lumotlar yuklab olinadi

### Javobgarlik Tarixi

`/admin/assignments` - Javobgarlik tarixi sahifasi

**Ko'rish:**
- Barcha javobgarlik yozuvlari kronologik tartibda
- Aktiv va yopilgan javobgarliklar
- Boshlanish va tugash sanalari

**Filtrlash:**
- Buyum yoki hodim nomi bo'yicha qidirish
- Status bo'yicha: Aktiv / Yopilgan / Barchasi

**Excel eksport:**
1. Kerakli filtrlarni qo'llang
2. "Excel" tugmasini bosing
3. Javobgarlik tarixi Excel faylga yuklab olinadi

### Public QR Sahifa

`/asset/{qr_code}` - QR kod orqali ochish

**Foydalanish:**
1. Buyumga yopishtirilgan QR kodni skaner qiling
2. Telefon yoki planshet kamerasi bilan o'qing
3. Avtomatik brauzer ochiladi
4. Buyum va javobgar ma'lumotlari ko'rsatiladi
5. Login kerak emas (faqat ko'rish rejimi)

**Ko'rinadigan ma'lumotlar:**
- Buyum nomi, modeli, inventar raqami
- Kategoriya va status
- Sotib olingan sana
- Javobgar hodim (ism, familiya, lavozim, telefon)
- Javobgarlik boshlangan sana
- Javobgarlik bo'yicha izoh

## Ma'lumotlar Bazasi Strukturasi

### admins
- `id` - UUID
- `username` - Foydalanuvchi nomi (unikal)
- `password` - Oddiy parol (hashing yo'q)
- `name` - To'liq ism
- `created_at`, `updated_at`

### employees
- `id` - UUID
- `first_name` - Ism
- `last_name` - Familiya
- `position` - Lavozim
- `phone` - Telefon (ixtiyoriy)
- `hire_date` - Ishga kirgan sana
- `created_at`, `updated_at`

### assets
- `id` - UUID
- `name` - Buyum nomi
- `model` - Model (ixtiyoriy)
- `inventory_number` - Inventar raqami (unikal)
- `category` - Kategoriya (electronic/material)
- `purchase_date` - Sotib olingan sana
- `quantity` - Soni
- `status` - Status (new/good/needs_repair/old)
- `qr_code_value` - QR kod qiymati (unikal)
- `created_at`, `updated_at`

### asset_assignments
- `id` - UUID
- `asset_id` - Buyum ID (foreign key)
- `employee_id` - Hodim ID (foreign key)
- `start_date` - Boshlanish sanasi
- `end_date` - Tugash sanasi (null = aktiv)
- `comment` - Izoh
- `is_active` - Aktiv holat
- `created_at`

## Muammolarni Hal Qilish

### Ma'lumotlar bazasiga ulanish xatosi

1. PostgreSQL serveri ishga tushganligini tekshiring
2. `.env.local` fayldagi DATABASE_URL ni tekshiring
3. Username va parol to'g'riligini tekshiring
4. pgAdmin orqali qo'lda ulanishni sinab ko'ring

### Prisma xatolari

Ma'lumotlar bazasini qayta yaratish:

```bash
npx prisma migrate reset
```

Keyin admin foydalanuvchini qaytadan qo'shing.

### Port band bo'lsa

Boshqa portda ishga tushirish:

```bash
PORT=3001 npm run dev
```

### Admin login ishlamasa

Prisma Studio orqali admin foydalanuvchini tekshiring:

```bash
npx prisma studio
```

`admins` jadvalida foydalanuvchi borligini va username/password to'g'riligini tekshiring.

## Ma'lumotlar Bazasi Backup

### Backup olish

pgAdmin da:
1. `unomimyuni` ni tanlang
2. O'ng tugma > **Backup**
3. Fayl nomini kiriting
4. Format: **Custom** yoki **Plain**
5. **Backup** tugmasini bosing

### Backup qayta tiklash

pgAdmin da:
1. `unomimyuni` ni yarating (bo'sh)
2. O'ng tugma > **Restore**
3. Backup faylini tanlang
4. **Restore** tugmasini bosing

## Production uchun Build

```bash
npm run build
npm start
```

## Qo'shimcha Buyruqlar

### Prisma Studio (ma'lumotlar bazasini vizual ko'rish)

```bash
npx prisma studio
```

### Ma'lumotlar bazasini tozalash

```bash
npx prisma migrate reset
```

**Diqqat:** Bu barcha ma'lumotlarni o'chiradi!

## Xavfsizlik Eslatmalari

Bu loyiha development va lokal foydalanish uchun mo'ljallangan. Production da foydalanish uchun:

1. Parollarni bcrypt bilan hashlang
2. HTTPS ishlatilsin
3. Environment variables ni server da xavfsiz saqlang
4. CORS sozlamalarini to'g'ri qiling
5. Rate limiting qo'shing
6. SQL injection himoyasini tekshiring (Prisma avtomatik himoyalaydi)

## Texnik Qo'llab-quvvatlash

Muammo yuzaga kelsa:

1. Terminal/CMD dagi xato xabarini diqqat bilan o'qing
2. `.env.local` fayldagi ma'lumotlarni tekshiring
3. PostgreSQL serveri ishga tushganligini tekshiring
4. `node_modules` ni o'chirib, qaytadan o'rnating:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
5. Prisma Client ni qayta yarating:
   ```bash
   npx prisma generate
   ```

## Versiyalar

- Next.js: 16.0.10
- React: 19.2.0
- Prisma: 7.2.0
- TypeScript: 5.x
- Tailwind CSS: 4.1.9

## Litsenziya

Bu loyiha universitet ichki foydalanish uchun yaratilgan.

---

**Loyiha tayyor! Muvaffaqiyatlar!**
