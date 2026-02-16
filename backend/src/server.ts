import dotenv from "dotenv";
dotenv.config();

console.log("DATABASE_URL at runtime:", process.env.DATABASE_URL);

import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
