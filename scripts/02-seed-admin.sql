-- Admin foydalanuvchini qo'shish
-- Bu skriptni Prisma migrate ishlagandan KEYIN ishga tushiring

-- Default admin (username: admin, password: admin123)
INSERT INTO admins (id, username, password, name, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'admin',
    'admin123',
    'Administrator',
    NOW(),
    NOW()
) ON CONFLICT (username) DO NOTHING;
