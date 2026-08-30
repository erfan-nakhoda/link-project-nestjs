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
        //Cookie
        COOKIE_SECRET_KEY : string,
        // token
        ACCESS_TOKEN_SECRET : string,
        REFRESH_TOKEN_SECRET : string,
        JWT_SECRET : string,
    }
}