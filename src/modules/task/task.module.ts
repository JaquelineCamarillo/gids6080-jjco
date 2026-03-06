import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";
import { pgProvider } from "src/common/providers/pg.provider";
import { mysqlProvider } from "src/common/providers/mysql.provider";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [
        TaskController
    ],
    providers: [
        TaskService,
        pgProvider[0],
        mysqlProvider[0],
        PrismaService
    ],
})

export class TaskModule {}
