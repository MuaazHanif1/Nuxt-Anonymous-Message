import mongoose from "mongoose";
type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) return;
  try {
    const db = await mongoose.connect((process.env.MONGODB_URI as string) || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB");
    //console.log(db);
    console.log(db.connections[0]);
  } catch (err) {
    console.log("Database Connection Fail", err);
    //process.exit(1);
  }
}

export default dbConnect;
