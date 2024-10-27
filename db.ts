import { Pool } from "pg";

export type Movie = {
  movie_name: string;
  year: number;
  rating: number;
};
interface paramsTypes {
  movie_name: string;
  year: number;
  rating: number;
  id?: number;
}

const pool = new Pool({
  connectionString: process.env.CONNECTION_URL,
});

export const query = async (text: string, params?: paramsTypes[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
