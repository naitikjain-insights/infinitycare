
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: [
    "https://infinitycare-smf1.onrender.com",
    "http://localhost:5173"
  ]
}));

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

app.get("/", (req, res) => {
  res.json({
    name: "InfinityCare API",
    status: "running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    databaseConfigured: Boolean(supabase)
  });
});

app.listen(PORT, () => {
  console.log(`InfinityCare API listening on port ${PORT}`);
});
