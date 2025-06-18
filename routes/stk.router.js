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

    const password = Buffer.from(
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
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: `254${phone.substring(1)}`,
        TransactionDesc: "Test",
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.status(200).json(response.data);
  } catch (e) {
    console.error(e.response?.data || e.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

router.route("/callback").post((req, res) => {
  const callbackBody = req.body;

  if (!callbackBody.Body.stkCallback.CallbackMetadata) {
    console.log("No CallbackMetadata found", callbackBody);
    return res.status(200).json("ok");
  }

  console.log(
    "Callback Metadata:",
    callbackBody.Body.stkCallback.CallbackMetadata
  );
  res.status(200).json("ok");
});

export default router;
