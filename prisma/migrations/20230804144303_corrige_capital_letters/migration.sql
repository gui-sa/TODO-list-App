/*
  Warnings:

  - You are about to drop the column `userId` on the `todos` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_userId_fkey";

-- AlterTable
ALTER TABLE "todos" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
