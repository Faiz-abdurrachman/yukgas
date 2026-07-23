-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `qrisUrl` VARCHAR(191) NULL,
    `reputation` DOUBLE NOT NULL DEFAULT 0,
    `questsGiven` INTEGER NOT NULL DEFAULT 0,
    `questsTaken` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quests` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('TRANSPORT', 'FOOD', 'ADMIN', 'OTHER') NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `compensation` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('OPEN', 'TAKEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
    `giverId` VARCHAR(191) NOT NULL,
    `takerId` VARCHAR(191) NULL,
    `paymentConfirmed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `quests_status_idx`(`status`),
    INDEX `quests_category_idx`(`category`),
    INDEX `quests_giverId_idx`(`giverId`),
    INDEX `quests_takerId_idx`(`takerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings` (
    `id` VARCHAR(191) NOT NULL,
    `questId` VARCHAR(191) NOT NULL,
    `raterId` VARCHAR(191) NOT NULL,
    `ratedId` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `review` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ratings_ratedId_idx`(`ratedId`),
    UNIQUE INDEX `ratings_questId_raterId_key`(`questId`, `raterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quest_history` (
    `id` VARCHAR(191) NOT NULL,
    `questId` VARCHAR(191) NOT NULL,
    `status` ENUM('OPEN', 'TAKEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
    `changedById` VARCHAR(191) NULL,
    `changedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `quest_history_questId_idx`(`questId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `quests` ADD CONSTRAINT `quests_giverId_fkey` FOREIGN KEY (`giverId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quests` ADD CONSTRAINT `quests_takerId_fkey` FOREIGN KEY (`takerId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `quests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_raterId_fkey` FOREIGN KEY (`raterId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ratings` ADD CONSTRAINT `ratings_ratedId_fkey` FOREIGN KEY (`ratedId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_history` ADD CONSTRAINT `quest_history_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `quests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_history` ADD CONSTRAINT `quest_history_changedById_fkey` FOREIGN KEY (`changedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
