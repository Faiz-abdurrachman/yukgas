import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

// Generate JWT token helper
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'super_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const { fullName, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar di platform YUKgas.in'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
        qrisUrl: true,
        reputation: true,
        questsGiven: true,
        questsTaken: true,
        createdAt: true
      }
    });

    // Generate JWT
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil!',
      data: { user, token }
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi.'
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah.'
      });
    }

    // Generate JWT
    const token = generateToken(user.id);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data profil.'
    });
  }
};
