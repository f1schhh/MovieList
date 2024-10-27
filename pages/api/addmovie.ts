import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === "POST") {
    const { movie_name, year, rating } = req.body;
    try {
      const checkIfMovieExists = await query(
        "SELECT * FROM movies WHERE movie_name = $1",
        [movie_name]
      );
      if ((checkIfMovieExists.rowCount ?? 0) > 0) {
        res.status(409).json({ message: "Movie already exists" });
        return;
      }
      if (movie_name && year && rating) {
        await query(
          "INSERT INTO movies (movie_name, year, rating) VALUES ($1, $2, $3) ",
          [movie_name, year, rating]
        );
        res.json({
          message: "Movie added to the database successfully",
        });
        return;
      }
      res.status(400).json({ message: "Invalid request" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
}
