-- CreateTable
CREATE TABLE "Shoe" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT,
    "year" INTEGER,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'JPY',
    "weightG" INTEGER,
    "dropMm" INTEGER,
    "stackHeightHeel" INTEGER,
    "stackHeightFore" INTEGER,
    "cushionType" TEXT,
    "cushionMaterial" TEXT,
    "outsoleMaterial" TEXT,
    "upperMaterial" TEXT,
    "widthOptions" TEXT NOT NULL DEFAULT 'standard',
    "surfaceType" TEXT NOT NULL DEFAULT 'road',
    "pronationType" TEXT NOT NULL DEFAULT 'neutral',
    "category" TEXT NOT NULL,
    "durabilityKm" INTEGER,
    "officialUrl" TEXT,
    "imageUrl" TEXT,
    "description" TEXT,
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shoe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingFit" (
    "id" TEXT NOT NULL,
    "shoeId" TEXT NOT NULL,
    "dailyJog" INTEGER NOT NULL DEFAULT 3,
    "paceRun" INTEGER NOT NULL DEFAULT 3,
    "interval" INTEGER NOT NULL DEFAULT 3,
    "longRun" INTEGER NOT NULL DEFAULT 3,
    "race" INTEGER NOT NULL DEFAULT 3,
    "recovery" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "TrainingFit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "shoeId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Shoe_brand_idx" ON "Shoe"("brand");

-- CreateIndex
CREATE INDEX "Shoe_category_idx" ON "Shoe"("category");

-- CreateIndex
CREATE INDEX "Shoe_price_idx" ON "Shoe"("price");

-- CreateIndex
CREATE UNIQUE INDEX "Shoe_brand_model_key" ON "Shoe"("brand", "model");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingFit_shoeId_key" ON "TrainingFit"("shoeId");

-- CreateIndex
CREATE INDEX "Review_shoeId_idx" ON "Review"("shoeId");

-- AddForeignKey
ALTER TABLE "TrainingFit" ADD CONSTRAINT "TrainingFit_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES "Shoe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES "Shoe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
