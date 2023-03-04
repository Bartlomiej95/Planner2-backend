export const config = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'planner',
    logging: true,
    synchronize: true,
    mailPassword: 'admin123',
    mailUsername: 'admin',
    feUrl: 'http://localhost:3001',
    jwtSecret: 'djkaslhd767l@$#',
    jwtTimeToExpire: '1y',
    jwtCookieTimeToExpire: 1000 * 60 * 60 * 24 * 365, //1y
}