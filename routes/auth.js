const express = require('express')
const { body, validationResult } = require('express-validator')
const CosmosClient = require("@azure/cosmos").CosmosClient
const config = require('../config')
const dbContext = require('../data/databaseContext')

// init cosmosdb client
const { endpoint, key, databaseId, containerId } = config
const client = new CosmosClient({ endpoint, key })
const database = client.database(databaseId)
const container = database.container(containerId)

var router = express.Router()

const usernameInUse = async (user) => {
    // check whether the username is in use
    const querySpec = {
        query: "SELECT * FROM c WHERE c.user = " + "\'" + user + "\'"
    }
    // read all items in the Items container
    const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll()

    if (items.length != 0) {
        return true
    }
    return false
}

router.post('/register',
    body('user')
        .isLength({
            min: 6
        })
        .custom(async (value, { req }) => {
            if (await usernameInUse(value)) {
                throw new Error('Username already in use')
            }
            return true
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
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        // Make sure Tasks database is already setup. If not, create it.
        await dbContext.create(client, databaseId, containerId)

        // add new user to db
        const newUser = {
            user: req.body.user,
            password: req.body.password,
            category: 'users',
            intlist: ['player1', 'player2', 'player3']
        }

        /** Create new item
         * newItem is defined at the top of this file
         */
        const { resource: createdItem } = await container.items.create(newUser);

        res.status(200).json({
            success: true,
            message: 'Registration successful'
        })
    }
    )

module.exports = router

