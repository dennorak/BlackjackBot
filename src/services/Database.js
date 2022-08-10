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
      supportBigNumbers: true,
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
          try {
            resolve(result[0]["bal"]);
          } catch {
            resolve(100);
          }
        }
      );
    });
  }

  async getTimeout(uid) {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT faucet FROM accounts WHERE uid=${uid}`,
        function (err, res) {
          if (err) reject(err);
          resolve(res[0].faucet);
        }
      );
    });
  }

  async pour(uid) {
    const res = await this.credit(uid, 100);
    return new Promise((resolve, reject) => {
      this.connection.query(
        `UPDATE accounts SET faucet=${
          Math.floor(Date.now() / 1000) + 300
        } WHERE uid=${uid}`,
        function (err, response) {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  }

  async getLeaderboard() {
    return new Promise((resolve, reject) => {
      this.connection.query(
        `SELECT * FROM accounts WHERE NOT uid=0 ORDER BY bal DESC LIMIT 5`,
        function (err, res) {
          if (err) reject(err);
          resolve(res);
        }
      );
    });
  }

  async credit(uid, amt) {
    let ubal = await this.getBalance(uid);
    return new Promise((resolve, reject) => {
      this.connection.query(
        `INSERT INTO accounts (uid, bal) VALUES (${uid}, ${amt}) ON DUPLICATE KEY UPDATE bal=${
          ubal + amt
        }`,
        function (err, res) {
          if (err) reject(err);
          resolve(`Credited ${amt} XWC to <@${uid}>`);
        }
      );
    });
  }

  async send(to, from, amt) {
    try {
      let fBal = await this.getBalance(from);
      let tBal = await this.getBalance(to);
      return new Promise((resolve, reject) => {
        if (fBal >= amt) {
          this.connection.query(
            `INSERT INTO accounts (uid, bal) VALUES (${to}, ${
              tBal + amt
            }) ON DUPLICATE KEY UPDATE bal=${
              tBal + amt
            }; UPDATE accounts SET bal=${fBal - amt} WHERE uid=${from};`,
            function (err, res) {
              if (err) reject(err);
              resolve(`Sent ${amt} XWC to <@${to}>.`);
            }
          );
        } else {
          resolve("insufficient balance.");
        }
      });
    } catch (TypeError) {
      return "An error occurred.";
    }
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
