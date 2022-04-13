// cosmosdb configuration

const config = {
    endpoint: process.env.COSMOSDB_URI,
    key: process.env.COSMOSDB_KEY,
    databaseId: "Users",
    containerId: "Items",
    partitionKey: { kind: "Hash", paths: ["/category"] }
}
  
module.exports = config