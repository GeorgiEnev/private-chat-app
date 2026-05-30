ALTER TABLE "Room" ADD COLUMN "expiresAt" TIMESTAMP(3);

CREATE INDEX "Room_expiresAt_idx" ON "Room"("expiresAt");
