import prisma from '../utils/db.js';
import { ratingSchema } from '../utils/validation.js';
import { createNotification } from '../utils/notificationHelper.js';

// @desc    Submit rating for a completed quest
// @route   POST /api/v1/ratings/:questId
// @access  Private
export const submitRating = async (req, res) => {
  try {
    const { questId } = req.params;

    // Validate score and review
    const validation = ratingSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: validation.error.flatten().fieldErrors
      });
    }

    const { score, review } = validation.data;

    // Fetch quest
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    });

    if (!quest) {
      return res.status(404).json({ success: false, message: 'Quest tidak ditemukan.' });
    }

    // Guard: Quest must be COMPLETED & paymentConfirmed
    if (quest.status !== 'COMPLETED' || !quest.paymentConfirmed) {
      return res.status(400).json({
        success: false,
        message: 'Rating hanya dapat diberikan jika quest telah selesai dan pembayaran telah dikonfirmasi.'
      });
    }

    // Determine rater and rated roles
    let ratedId = null;
    if (req.user.id === quest.giverId) {
      // Giver rating Taker
      ratedId = quest.takerId;
    } else if (req.user.id === quest.takerId) {
      // Taker rating Giver
      ratedId = quest.giverId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'Anda bukan pihak yang terlibat (pemberi/pengambil) dalam quest ini.'
      });
    }

    // Check if rater has already rated this quest
    const existingRating = await prisma.rating.findUnique({
      where: {
        questId_raterId: {
          questId,
          raterId: req.user.id
        }
      }
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah memberikan penilaian untuk quest ini.'
      });
    }

    // Submit rating and recalculate reputation in a transaction
    const ratingResult = await prisma.$transaction(async (tx) => {
      // 1. Create rating
      const rating = await tx.rating.create({
        data: {
          questId,
          raterId: req.user.id,
          ratedId,
          score,
          review
        }
      });

      // 2. Fetch all ratings received by the rated user to calculate average
      const ratingsReceived = await tx.rating.findMany({
        where: { ratedId },
        select: { score: true }
      });

      const totalScore = ratingsReceived.reduce((acc, curr) => acc + curr.score, 0);
      const avgReputation = parseFloat((totalScore / ratingsReceived.length).toFixed(1));

      // 3. Update rated user's reputation score
      await tx.user.update({
        where: { id: ratedId },
        data: { reputation: avgReputation }
      });

      return rating;
    });

    // Create notification for Rated User (Event E)
    await createNotification({
      userId: ratedId,
      questId,
      title: 'Penilaian Baru',
      message: `Anda menerima penilaian baru untuk quest '${quest.title}'.`
    });

    return res.status(201).json({
      success: true,
      message: 'Penilaian berhasil dikirim!',
      data: { rating: ratingResult }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengirimkan penilaian.'
    });
  }
};

// @desc    Get user's received ratings
// @route   GET /api/v1/ratings/user/:userId
// @access  Public
export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User tidak ditemukan.' });
    }

    // Get received ratings
    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { ratedId: userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        include: {
          rater: {
            select: {
              fullName: true,
              avatarUrl: true
            }
          },
          quest: {
            select: {
              title: true,
              category: true
            }
          }
        }
      }),
      prisma.rating.count({
        where: { ratedId: userId }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: {
        ratings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengambil data ulasan.'
    });
  }
};
