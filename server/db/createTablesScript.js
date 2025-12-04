import fs from "fs";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

const data = fs.readFileSync("./queries.sql", { encoding: "utf8" });

const createTables = async function () {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });
    const [rows, fields] = await connection.query(data);
    console.log(rows);
    await connection.end();
  } catch (err) {
    console.error(err);
  }
};

createTables();
