const express = require("express");
const serverless = require("serverless-http");
const api = express();
const router = express.Router();
const {resolve} = require("path");
const http = require("http");
require("../startup/cors")()
// Replace if using a different env file or config
const env = require("dotenv").config({path: "./.env"});

const stripe = require("stripe")("sk_test_51KrFMWBn872em2Ejaw3CE91glz6mSKhrqDwA0z3mg5OGxmQm5ktiYwkd5CRYMvBoenszzCixeZai6zPiyw0fdr0R00OpMhHBOA", {
    apiVersion: "2022-08-01",
});

// router.use(express.static(process.env.STATIC_DIR));

router.get("/", (req, res) => {
    res.status(200).send("Hello from Stripe server!!")
});

router.post("/addStripeCustomer", async (req, res) => {
    const {email, name} = req.body;
    const {id} = await stripe.customers.create({
        email,
        name
    })
    res.status(200).send({id, name , email})
})
router.get("/config", (req, res) => {
    res.send({
        publishableKey: 'pk_test_51KrFMWBn872em2EjlvfsQ2ZyniEkdnt4Origm4KO2NSQgXrANifdIKlrUATJHhLT2YigmrxOW3cDLHL6AXMSTZ2M00pRJ0GltM',
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

