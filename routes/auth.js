const express = require('express')
const { body, validationResult } = require('express-validator')

var router = express.Router()

router.post('/register',
    body('user').isLength({
        min: 6
    }),
    body('password').isLength({
        min: 6
    }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
        }
        return true
    }),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        res.status(200).json({
            success: true,
            message: 'Registration successful'
        })
    }
    )

module.exports = router

