-- AlterTable
ALTER TABLE "PropertyDashboardStatus" ADD COLUMN     "createdAtHash" TEXT,
ADD COLUMN     "updatedAtHash" TEXT;

-- CreateIndex
CREATE INDEX "PropertyDashboardStatus_updatedAtHash_idx" ON "PropertyDashboardStatus"("updatedAtHash");

-- CreateIndex
CREATE INDEX "PropertyDashboardStatus_createdAtHash_idx" ON "PropertyDashboardStatus"("createdAtHash");
