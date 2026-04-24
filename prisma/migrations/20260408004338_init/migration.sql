-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "path" VARCHAR(200) NOT NULL,
    "error" VARCHAR(200) NOT NULL,
    "errorCode" VARCHAR(200) NOT NULL,
    "sesion_id" INTEGER,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_sesion_id_fkey" FOREIGN KEY ("sesion_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
