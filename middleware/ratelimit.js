const { rateLimit } = require('express-rate-limit')

exports.loginLimiter = rateLimit({
	windowMs: 10 * 1 * 1000, // 10 seconds
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers

})