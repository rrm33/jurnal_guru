import mysql from 'mysql2/promise';

async function test() {
  try {
    const pool = mysql.createPool({
      host: '127.0.0.1',
      user: 'root'
    });
    console.log("Pool created");
  } catch (e) {
    console.error("Failed", e);
  }
}
test();
