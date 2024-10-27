import type { NextApiRequest, NextApiResponse } from "next";
import { query, Movie } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Movie[] | { message: string }>
) {
  if (req.method === "GET") {
    try {
      const { rows } = await query("SELECT * FROM movies ORDER BY rating DESC");
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
