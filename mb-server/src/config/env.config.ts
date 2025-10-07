export const envVariable = () => {
    return {
        app: {
            port: Number(process.env.PORT),
            env: process.env.NODE_ENV,
            name: process.env.APP_NAME
        },
        db: {
            uri: process.env.MONGO_URI,
            host: process.env.MONGO_HOST,
            name: process.env.MONGO_DB,
            replica: process.env.MONGO_REPLICA_SET
        },
        jwt: {
            accessSecret: String(process.env.JWT_ACCESS_SECRET),
            accessExpriseIn: String(process.env.JWT_ACCESS_EXPRISEIN),
            refreshSecret: String(process.env.JWT_REFRESH_SECRET),
            refreshExpriseIn: String(process.env.JWT_REFRESH_EXPRISEIN)
        }
    }
}