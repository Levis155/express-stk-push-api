import { Router } from "express";
import axios from "axios";
import { generateAccessToken } from "../middleware/generateAccessToken.js";

const router = Router();

router.route("/").post(generateAccessToken, async (req, res) => {
  try {
    const { amount, phone } = req.body;
    const accessToken = req.accessToken;
    const businessShortCode = process.env.BUSINESS_SHORT_CODE;
    const passkey = process.env.PASSKEY;
    const timestamp =
      new Date().getFullYear() +
      ("0" + (new Date().getMonth() + 1)).slice(-2) +
      ("0" + new Date().getDate()).slice(-2) +
      ("0" + new Date().getHours()).slice(-2) +
      ("0" + new Date().getMinutes()).slice(-2) +
      ("0" + new Date().getSeconds()).slice(-2);

    const password = new Buffer.from(
      businessShortCode + passkey + timestamp
    ).toString("base64");

    const response = await axios.post(
      `https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phone.substring(1)}`,
        PartyB: businessShortCode,
        PhoneNumber: `254${phone.substring(1)}`,
        CallBackURL: "https://mydomain.com/pat",
        AccountReference: `254${phone.substring(1)}`,
        TransactionDesc: "Test",
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.status(200).json(response.data);
  } catch (e) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

export default router;
