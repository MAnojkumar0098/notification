require("dotenv").config();
const express = require("express");
const webpush = require("web-push");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

// Replace with your email
webpush.setVapidDetails(
  "mailto:example@yourdomain.org",
  publicVapidKey,
  privateVapidKey
);

const app = express();

app.use(require("body-parser").json());

let subscriptions = [];
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  const payload = JSON.stringify({ title: "test" });

  console.log(subscription);
  subscriptions.forEach((subscription, index) => {
    console.log(`${index}:`, subscription);
    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error(error.stack);
    });
  });
});
app.post("/trigger-notification", (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({
    title: "Button Clicked",
    body: "You clicked the button!",
  });
  res.status(200).json({ message: "Notification sent" });
  subscriptions.forEach((subscription, index) => {
    console.log(`${index}:`, subscription);
    webpush.sendNotification(subscription, payload).catch((error) => {
      console.error(error.stack);
    });
  });
});

app.use(require("express-static")("./"));

app.listen(9000);
