import express from 'express';
import * as momoController from '../controllers/momo.controller.js';

const router = express.Router();

// Transfer Money to MoMo Subscriber
router.post('/transfer-to-subscriber', momoController.transferToMomoSubscriber);

// Transfer to Other Network
router.post('/transfer-to-network', momoController.transferToOtherNetwork);

// MoMo and Bill Payment
router.post('/bill-payment', momoController.momoAndBillPayment);

// Buy Airtime
router.post('/buy-airtime', momoController.buyAirtime);

// Buy Data
router.post('/buy-data', momoController.buyData);

// Schedule Airtime
router.post('/schedule-airtime', momoController.scheduleAirtime);

// Allow Cashout
router.post('/allow-cashout', momoController.allowCashout);

// Balance Check
router.get('/balance', momoController.balanceCheck);

// My Approvals
router.get('/approvals', momoController.myApprovals);

// Bank to Wallet
router.post('/bank-to-wallet', momoController.bankToWallet);

// Wallet to Bank
router.post('/wallet-to-bank', momoController.walletToBank);

// Loan Request
router.post('/loan-request', momoController.loanRequest);

// MoMo Pay
router.post('/pay', momoController.momoPay);

export default router;
