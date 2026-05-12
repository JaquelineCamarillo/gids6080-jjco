/*
  Warnings:

  - You are about to drop the column `created_at` on the `task` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `task` DROP COLUMN `created_at`,
    ADD COLUMN `created_dt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `name` VARCHAR(250) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_at`,
    DROP COLUMN `lastName`,
    ADD COLUMN `created_dt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `hash` VARCHAR(191) NULL,
    ADD COLUMN `lastname` VARCHAR(205) NOT NULL,
    ADD COLUMN `refreshToken` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `rol_id` INTEGER NULL,
    MODIFY `username` VARCHAR(150) NOT NULL;

-- CreateTable
CREATE TABLE `Rol` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(200) NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `statusCode` INTEGER NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `path` MEDIUMTEXT NOT NULL,
    `error` MEDIUMTEXT NOT NULL,
    `erroCode` MEDIUMTEXT NOT NULL,
    `session_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
