-- PostgreSQL ma'lumotlar bazasini yaratish
-- Bu skriptni pgAdmin yoki psql orqali ishga tushiring

-- Agar mavjud bo'lsa, o'chirish (EHTIYOTKORLIK bilan!)
-- DROP DATABASE IF EXISTS unomimyuni;

-- Yangi ma'lumotlar bazasini yaratish
CREATE DATABASE unomimyuni
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE unomimyuni IS 'Universitet Moddiy-Texnik Baza Boshqarish Tizimi';
