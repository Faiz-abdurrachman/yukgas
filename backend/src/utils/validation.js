import { z } from 'zod';

// Schema for User Registration
export const registerSchema = z.object({
  fullName: z.string()
    .min(3, { message: 'Nama lengkap minimal harus 3 karakter' })
    .max(50, { message: 'Nama lengkap maksimal 50 karakter' }),
  email: z.string()
    .email({ message: 'Format email tidak valid' })
    .refine(
      (email) => email.endsWith('@unu-jogja.ac.id') || email.endsWith('@student.unu-jogja.ac.id'),
      { message: 'Hanya email civitas akademika UNU (@unu-jogja.ac.id atau @student.unu-jogja.ac.id) yang diizinkan' }
    ),
  password: z.string()
    .min(8, { message: 'Password minimal harus 8 karakter' })
    .regex(/[A-Za-z]/, { message: 'Password harus mengandung minimal satu huruf' })
    .regex(/[0-9]/, { message: 'Password harus mengandung minimal satu angka' }),
});

// Schema for User Login
export const loginSchema = z.object({
  email: z.string().email({ message: 'Format email tidak valid' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong' }),
});

// Schema for Update Profile
export const updateProfileSchema = z.object({
  fullName: z.string().min(3).max(50).optional(),
  bio: z.string().max(200).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  qrisUrl: z.string().url().optional().nullable(),
});

// Schema for Create Quest
export const createQuestSchema = z.object({
  title: z.string()
    .min(10, { message: 'Judul quest minimal harus 10 karakter' })
    .max(100, { message: 'Judul quest maksimal 100 karakter' }),
  description: z.string()
    .min(20, { message: 'Deskripsi quest minimal harus 20 karakter' })
    .max(500, { message: 'Deskripsi quest maksimal 500 karakter' }),
  category: z.enum(['TRANSPORT', 'FOOD', 'ADMIN', 'OTHER'], {
    errorMap: () => ({ message: 'Kategori harus berupa salah satu dari: TRANSPORT, FOOD, ADMIN, OTHER' })
  }),
  location: z.string()
    .min(3, { message: 'Lokasi minimal harus 3 karakter' })
    .max(100, { message: 'Lokasi maksimal 100 karakter' }),
  deadline: z.string()
    .datetime({ message: 'Format deadline harus tanggal ISO 8601 yang valid' })
    .refine((val) => new Date(val) > new Date(), { message: 'Deadline harus di masa depan' }),
  compensation: z.number()
    .min(1000, { message: 'Kompensasi minimal adalah Rp 1.000' })
    .max(1000000, { message: 'Kompensasi maksimal adalah Rp 1.000.000' }),
});

// Schema for Update Quest
export const updateQuestSchema = createQuestSchema.partial();

// Schema for Rating
export const ratingSchema = z.object({
  score: z.number()
    .int({ message: 'Score harus berupa angka bulat' })
    .min(1, { message: 'Score minimal adalah 1' })
    .max(5, { message: 'Score maksimal adalah 5' }),
  review: z.string()
    .max(300, { message: 'Ulasan maksimal 300 karakter' })
    .optional(),
});
