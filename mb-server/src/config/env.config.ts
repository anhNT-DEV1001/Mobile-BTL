export const envVariable = () => {
    return {
        app: {
            port: Number(process.env.PORT),
            env: process.env.NODE_ENV,
            name: process.env.APP_NAME
        },
        db: {
            host: process.env.MONGO_HOST,
            name: process.env.MONGO_DB,
            replica: process.env.MONGO_REPLICA_SET
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            exprisIn: process.env.JWT_EXPRISIN
        }
    }
}