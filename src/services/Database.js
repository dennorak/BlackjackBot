var mysql = require("mysql");
const util = require("util");
require("dotenv").config();

class DatabaseConnection {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DB,
      multipleStatements: true,
    });
    this.connection.query = util
      .promisify(this.connection.query)
      .bind(this.connection);
    this.connection.connect();
  }

  async register(uid) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO accounts (uid, bal) VALUES (${uid}, 100)`,
        function (err, res) {
          if (err) reject(err);
          resolve(`Registered ${uid}`);
        }
      );
    });
  }

  async getBalance(uid) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT bal FROM accounts WHERE uid=${uid}`,
        function (err, result) {
          if (err) reject(err);
          resolve(result[0]["bal"]);
        }
      );
    });
  }

  async credit(uid, amt) {
    let ubal = await this.getBalance(uid);
    console.log(ubal, amt);
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE accounts SET bal=${ubal + amt} WHERE uid=${uid}`,
        function (err, res) {
          if (err) reject(err);
          resolve("credited.");
        }
      );
    });
  }

  async send(to, from, amt) {
    let fBal = await this.getBalance(from);
    let tBal = await this.getBalance(to);
    return new Promise((resolve, reject) => {
      if (fBal >= amt) {
        this.connection.query(
          `UPDATE accounts SET bal=${
            tBal + amt
          } WHERE uid=${to}; UPDATE accounts SET bal=${
            fBal - amt
          } WHERE uid=${from};`,
          function (err, res) {
            if (err) reject(err);
            resolve(`Sent ${amt} to ${to}.`);
          }
        );
      } else {
        resolve("insufficient balance.");
      }
    });
  }
}

module.exports = {
  Database: class {
    static connect() {
      if (!DatabaseConnection.instance) {
        DatabaseConnection.instance = new DatabaseConnection();
      }
      return DatabaseConnection.instance;
    }
  },
};
