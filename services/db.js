const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "mmadb";

// Create a new MongoClient
const client = new MongoClient(url);

module.exports = client.db(dbName);
