namespace NodeJS {
    interface ProcessEnv {
        PORT : number,
        PROJECT_TYPE : "production" | "development"
        // Database
        DB_HOST : string,
        DB_PORT : number,
        DB_NAME : string,
        DB_USER : string,
        DB_PASS : string,
    }
}