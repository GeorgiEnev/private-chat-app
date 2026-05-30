-- Improve chat history and sender lookups as rooms accumulate messages.
CREATE INDEX "Message_roomId_createdAt_idx" ON "Message"("roomId", "createdAt");

CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");
