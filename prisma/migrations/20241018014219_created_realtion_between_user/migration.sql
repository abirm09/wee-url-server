-- AddForeignKey
ALTER TABLE "EmailVerificationOTP" ADD CONSTRAINT "EmailVerificationOTP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
