const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = "AnalyticsDB";
const containerId = "Metrics";

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const type = req.query.type || "sales";

  try {
    const database = client.database(databaseId);
    const container = database.container(containerId);

    const { resources } = await container.items
      .query(`SELECT * FROM c WHERE c.type = @type`, { parameters: [{ name: "@type", value: type }] })
      .fetchAll();

    context.res = { body: resources };
  } catch (err) {
    context.res = { status: 500, body: `Error: ${err.message}` };
  }
};
