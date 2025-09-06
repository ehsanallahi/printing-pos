-- CreateTable
CREATE TABLE "MediaType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaType_name_key" ON "MediaType"("name");
