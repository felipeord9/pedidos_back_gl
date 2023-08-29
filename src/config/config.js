require('dotenv').config()

const config = {
    port: process.env.PORT,
    host: process.env.HOST,
    dbPostgresUrl: process.env.DB_POSTGRES_URL,
    dbSQLServerUrl: process.env.DB_SQLSERVER_URL,
    isProd: false,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpEmail: process.env.SMTP_EMAIL,
    smtpPassword: process.env.SMTP_PASSWORD
}

module.exports = { config }