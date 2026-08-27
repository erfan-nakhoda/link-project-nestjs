import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SecuritySchemeObject, SwaggerModule } from "@nestjs/swagger";

export function swaggerConfig(app : INestApplication) {
    const doc = new DocumentBuilder()
    .setTitle("Link Project")
    .setDescription("Link Project Endpoints Demo")
    .setVersion("1.0.0")
    .addBearerAuth(bearerAuthConfig())
    .build()
    
    const createDoc = SwaggerModule.createDocument(app, doc)
    SwaggerModule.setup('/swagger', app, createDoc)
    console.log(`http://localhost:${process.env.PORT ?? 3000}/swagger`)
}


function bearerAuthConfig() : SecuritySchemeObject {
    return {
        in : "path",
        type : "http",
        bearerFormat : "JWT",
        scheme : "bearer"
    }
}