-- CreateTable
CREATE TABLE "DomainEvent" (
    "id" VARCHAR(26) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "aggregateId" VARCHAR(255) NOT NULL,
    "aggregateVersion" BIGINT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DomainEvent_type_idx" ON "DomainEvent"("type");

-- CreateIndex
CREATE UNIQUE INDEX "DomainEvent_aggregateId_aggregateVersion_key" ON "DomainEvent"("aggregateId", "aggregateVersion");
