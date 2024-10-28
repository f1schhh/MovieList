import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>
) {
  if (req.method === "DELETE") {
    const { id } = req.body;
    try {
      const result = await query("DELETE FROM movies WHERE id = $1", [id]);
      if (result.rowCount === 0) {
        res.status(404).json({ message: "Movie not found" });
      } else {
        res.json({ message: "Movie deleted successfully" });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(405).json({ message: "Something went wrong" });
  }
}
