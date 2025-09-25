import { DocumentBuilder } from '@nestjs/swagger';
export const swaggerConfig = new DocumentBuilder()
    .setTitle('Mobile-BE')
    .setDescription('APIs Docs')
    .setVersion('1.0')
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header'
        },
        'access-token'
    )
    .build();
