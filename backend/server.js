import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 3012;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
