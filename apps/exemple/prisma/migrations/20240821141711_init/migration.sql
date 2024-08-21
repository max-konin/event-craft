-- CreateTable
CREATE TABLE "Account" (
    "id" VARCHAR(26) NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL,
    "aggregateVersion" BIGINT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
