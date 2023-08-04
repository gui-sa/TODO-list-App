-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "todo_parent_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_todo_parent_id_fkey" FOREIGN KEY ("todo_parent_id") REFERENCES "todos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
