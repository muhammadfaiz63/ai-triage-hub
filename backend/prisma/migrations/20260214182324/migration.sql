-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Billing', 'Technical', 'FeatureRequest');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "ticket" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
    "category" "Category",
    "sentiment" INTEGER,
    "urgency" "Urgency",
    "aiDraft" TEXT,
    "errorReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ticket_pkey" PRIMARY KEY ("id")
);
