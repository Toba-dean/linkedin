import { connectToDatabase } from "../../../utils/mongodb";
import { Timestamp } from "mongodb";

export default async function handler(req, res) {
  const { method, body } = req;

  // connect to the DB
  const { db } = await connectToDatabase();

  // Get all the post in an array
  if (method === "GET") {
    try {
      const posts = await db
        .collection("posts")
        .find()
        .sort({ timestamp: -1 })
        .toArray();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  // post all all data to the DB
  if (method === "POST") {
    try {
      const post = await db
        .collection("posts")
        .insertOne({ ...body, timestamp: new Timestamp() });
      res.status(201).json({ msg: 'Successful', post });
    } catch (error) {
      res.status(500).json(error);
    }
  }
}