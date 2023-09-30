const express = require('express')
const UserRoutes = require('./userRoutes')
const MailRoutes = require('./mailRoutes')
const ProductRoutes = require('./productRoutes')
const AgencyRoutes = require('./agencyRoutes')
const ClientRoutes = require('./clientRoutes')
const BranchRoutes = require('./branchRoutes')
const SellerRoutes = require('./sellerRoutes')
const OrderRoutes = require('./orderRoutes')
const AuthRoutes = require('./authRoutes')

function routerApi(app) {
    const router = express.Router()

    app.use('/api/v1/', router)

    router.use('/auth', AuthRoutes)
    router.use('/users', UserRoutes)
    router.use('/mail', MailRoutes)
    router.use('/products', ProductRoutes)
    router.use('/agencies', AgencyRoutes)
    router.use('/clients', ClientRoutes)
    router.use('/branches', BranchRoutes)
    router.use('/sellers', SellerRoutes)
    router.use('/orders', OrderRoutes)
}

module.exports = routerApi