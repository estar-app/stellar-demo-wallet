var _a;
import express from "express";
import { Transaction, Keypair } from "stellar-sdk";
require("dotenv").config({ path: require("find-config")(".env") });
const PORT = (_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 7000;
const SERVER_SIGNING_KEY = String(process.env.SERVER_SIGNING_KEY);
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/.well-known", express.static("./src/static/well_known", {
    setHeaders: function (res, _) {
        res.set("Access-Control-Allow-Headers", "Content-Type,X-Requested-With");
        res.type("application/json");
        console.log("request to /.well-known");
    }
}));
app.post("/sign", (req, res) => {
    console.log("request to /sign");
    const envelope_xdr = req.body.transaction;
    const network_passphrase = req.body.network_passphrase;
    const transaction = new Transaction(envelope_xdr, network_passphrase);
    if (Number.parseInt(transaction.sequence, 10) !== 0) {
        res.status(400);
        res.send("transaction sequence value must be '0'");
        return;
    }
    transaction.sign(Keypair.fromSecret(SERVER_SIGNING_KEY));
    res.set("Access-Control-Allow-Origin", "*");
    res.status(200);
    res.send({ "transaction": transaction.toEnvelope().toXDR("base64"), "network_passphrase": network_passphrase });
});
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
//# sourceMappingURL=index.js.map