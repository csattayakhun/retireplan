-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RetirementPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planName` VARCHAR(191) NOT NULL DEFAULT 'แผนเกษียณของฉัน',
    `currentAge` INTEGER NOT NULL,
    `retirementAge` INTEGER NOT NULL,
    `lifeExpectancyAge` INTEGER NOT NULL,
    `currentSavings` INTEGER NOT NULL,
    `monthlySaving` INTEGER NOT NULL,
    `monthlyExpense` INTEGER NOT NULL,
    `monthlyPension` INTEGER NOT NULL DEFAULT 0,
    `monthlyRental` INTEGER NOT NULL DEFAULT 0,
    `returnBefore` DOUBLE NOT NULL DEFAULT 5,
    `returnAfter` DOUBLE NOT NULL DEFAULT 2,
    `inflationRate` DOUBLE NOT NULL DEFAULT 3,
    `targetAmount` INTEGER NULL,
    `projectedAmount` INTEGER NULL,
    `gap` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `RetirementPlan_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TaxPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planName` VARCHAR(191) NOT NULL DEFAULT 'แผนภาษีของฉัน',
    `taxYear` INTEGER NOT NULL,
    `maritalStatus` VARCHAR(191) NOT NULL DEFAULT 'single',
    `totalIncome` INTEGER NOT NULL,
    `deductions` INTEGER NOT NULL DEFAULT 60000,
    `withholdingTax` INTEGER NOT NULL DEFAULT 0,
    `estimatedTax` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    INDEX `TaxPlan_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RetirementPlan` ADD CONSTRAINT `RetirementPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TaxPlan` ADD CONSTRAINT `TaxPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
