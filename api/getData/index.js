const { CosmosClient } = require("@azure/cosmos");

// Azure injects the connection string automatically after linking the DB
const connectionString = process.env.AZURE_COSMOSDB_CONNECTION_STRING;

// Create Cosmos DB client from connection string
const client = new CosmosClient(connectionString);

// These must match the database and container names you selected
const databaseId = "analyticsdb";
const containerId = "metrics";

module.exports = async function (context, req) {
  const type = req.query.type || "sales";

  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { resources } = await container.items
      .query(`SELECT * FROM c WHERE c.type = @type`, {
        parameters: [{ name: "@type", value: type }]
      })
      .fetchAll();

    context.res = { status: 200, body: resources };
  } catch (err) {
    context.res = {
      status: 500,
      body: `Error accessing Cosmos DB: ${err.message}`
    };
  }
};
