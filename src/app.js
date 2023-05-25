require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors")
const router = require("./routes")
const Sentry = require('@sentry/node');
const { SENTRY_DSN, ENVIRONMENT } = process.env;

const app = express();

Sentry.init({
  environment: ENVIRONMENT,
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors())
app.use(logger("tiny"));
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({
    message: "welcome to manufacture API, please check api/v1/docs",
  });
});

app.get("/error", (req, res) => {
  error()
  res.status(200).json({
    message: "this message will be never out"
  })
})

app.use("/api/v1", router)

app.use(Sentry.Handlers.errorHandler());

// handle error 404
app.use((req,res,next) =>{
  return res.status(404).json({
    status: false,
    message: "page not found 404",
    data: null
  })
})

// handle error 500
app.use((err,req,res,next)=>{
  return res.status(500).json({
    status: false,
    message: err.message,
    data: null
  })
})

module.exports = app