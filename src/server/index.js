import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;
const app = express();

if (!process.env.PORT) {
  console.error("Fatal: PORT environment variable is required");
  process.exit(1);
}
const PORT = process.env.PORT;

const DB_ON_FLAG = process.env.DB_ON_FLAG || "0";

if (DB_ON_FLAG === "1" && !process.env.DB_URL) {
  console.error("Fatal: DATABASE_URL environment variable is required");
  process.exit(1);
}

// Create global pool instance
const pool =
  DB_ON_FLAG === "1"
    ? new Pool({
        connectionString: process.env.DB_URL,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })
    : null;

// Middlewares
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

// Sub-router
const apiRouter = express.Router();

// Ping DB
async function pingDB() {
  if (!pool) {
    console.log("Database connection disabled");
    return false;
  }

  try {
    await pool.query("SELECT 1");
    return true;
  } catch (error) {
    return false;
  }
}

// Ping DB on server startup and DB_ON_FLAG == 1
if (DB_ON_FLAG === "1") {
  (async () => {
    const pingResult = await pingDB();
    if (!pingResult) {
      console.error("Fatal: Database connection failed");
      process.exit(1);
    } else {
      console.log("Database connection successful");
    }
  })();
}

// Routes
apiRouter.get("/health", (_, res) => {
  const thaiTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Bangkok",
    dateStyle: "full",
    timeStyle: "long",
  });
  const uptimeInSeconds = process.uptime();
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);
  const uptime = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  res.status(200).json({
    status: "ok",
    timestamp: thaiTime,
    hostname: process.env.HOSTNAME || "local",
    uptime,
  });
});

apiRouter.get("/sects", async (_, res) => {
  if (DB_ON_FLAG === "0") {
    return res.status(200).json({
      status: "ok",
      db_on_flag: DB_ON_FLAG,
      data: [
        { id: 1, name: "Temple A", power: 30 },
        { id: 2, name: "Temple B", power: 20 },
      ],
    });
  }

  try {
    if (!pool) {
      return res.status(503).json({
        status: "error",
        message: "Database connection not available",
      });
    }

    const result = await pool.query("SELECT * FROM sects");
    res.status(200).json({
      status: "ok",
      db_on_flag: DB_ON_FLAG,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  if (pool) {
    await pool.end();
    console.log("DB pool closed.");
  }
  process.exit(0);
});

// Mount /api
app.use("/api", apiRouter);

// Start
app.listen(PORT, () => {
  console.log(`🔥 Server is running on port ${PORT}`);
});
