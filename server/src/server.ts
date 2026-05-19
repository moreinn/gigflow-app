import app from "./app";

import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Starting server...");

    console.log("Connecting database...");

    await connectDB();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(
        `Server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "FULL SERVER ERROR:",
      error
    );

    process.exit(1);
  }
};

startServer();