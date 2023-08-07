-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_todo_parent_id_fkey";

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_todo_parent_id_fkey" FOREIGN KEY ("todo_parent_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
