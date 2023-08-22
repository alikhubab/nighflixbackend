const express = require("express");
const serverless = require("serverless-http");
const api = express();
const router = express.Router();
const {resolve} = require("path");
const http = require("http");
// Replace if using a different env file or config
const env = require("dotenv").config({path: "./.env"});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2022-08-01",
});

// router.use(express.static(process.env.STATIC_DIR));

router.get("/", (req, res) => {
    res.status(200).send("Hello from Stripe server!!")
});

router.get("/config", (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

router.post("/create-payment-intent", async (req, res) => {
    try {
        const {client_secret} = await stripe.paymentIntents.create({
            currency: 'eur',
            amount: 1999,
            automatic_payment_methods: {
                enabled: true
            }
        })
        res.send({clientSecret: client_secret})
    } catch ({message}) {
        res.status(400).send({
            error: {
                message
            }
        })
    }
});

api.use('/.netlify/functions/api', router)
module.exports.handler = serverless(api);

