// app.js - webhook اختباري بسيط لـ WhatsApp Cloud API
const express = require('express');
const app = express();

// لقراءة JSON من الطلبات الواردة
app.use(express.json());

// المنفذ (Render يحدده تلقائيًا)
const port = process.env.PORT || 3000;

// التوكن اللي هتحطه في Meta (Verify Token)
const verifyToken = process.env.VERIFY_TOKEN;

// GET: للتحقق من الـ webhook (Meta يرسل طلب GET للتأكيد)
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED ✅');
    res.status(200).send(challenge); // مهم: نرجع الـ challenge كـ text
  } else {
    res.status(403).end();
  }
});

// POST: يستقبل الإشعارات من WhatsApp (الرسائل، الحالات، إلخ)
app.post('/', (req, res) => {
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`\n\nWebhook received ${timestamp}\n`);
  console.log(JSON.stringify(req.body, null, 2)); // يطبع الـ payload كامل في logs Render

  res.status(200).end(); // دائمًا رد 200 عشان Meta يستمر في الإرسال
});

app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});
