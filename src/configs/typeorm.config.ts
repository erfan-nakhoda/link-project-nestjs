import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
    const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER, PROJECT_TYPE } = process.env
    return {
        type: "postgres",
        host: DB_HOST,
        port : DB_PORT,
        database : DB_NAME,
        username : DB_USER,
        password : DB_PASS,
        autoLoadEntities : false,
        synchronize : PROJECT_TYPE === "development" ? true : false,
        entities : [
            "dist/modules/**/**/*.entity{.ts,.js}",
            "dist/modules/**/**/**/*.entity{.ts,.js}"
        ]

    }
}