import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === "PUT") {
    const { id, movie_name, year, rating } = req.body;
    try {
      const result = await query("SELECT * FROM movies WHERE id = $1", [id]);
      if (result.rowCount === 1) {
        const updateQuery =
          "UPDATE movies SET movie_name = $1, year = $2, rating = $3 WHERE id = $4";
        await query(updateQuery, [movie_name, year, rating, id]);
        res.json({ message: "Movie updated successfully" });
      } else {
        res.status(404).json({ message: "Movie not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
