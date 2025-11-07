const { CosmosClient } = require("@azure/cosmos");

// Use connection string injected by Azure
const connectionString = process.env.AZURE_COSMOSDB_CONNECTION_STRING;
const client = new CosmosClient(connectionString);

const databaseId = "analyticsdb";
const containerId = "metrics";

module.exports = async function (context, req) {
  const type = req.query.type || "sales";

  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const query = {
      query: "SELECT * FROM c WHERE c.type = @type",
      parameters: [{ name: "@type", value: type }]
    };

    const { resources } = await container.items.query(query).fetchAll();

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: resources || []
    };
  } catch (err) {
    context.log("Error in getData:", err);
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: err.message || "Unknown error" }
    };
  }
};
