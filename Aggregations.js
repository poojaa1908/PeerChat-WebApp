const { Client } = require('@elastic/elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({ node: 'http://localhost:9200' }); // Replace with your Elasticsearch server URL
const app = express();

app.use(bodyParser.json());

// Endpoint to perform aggregations
app.get('/aggregations', async (req, res) => {
  try {
    const response = await client.search({
      index: 'incidents',
      body: {
        size: 0, // We are only interested in the aggregation results
        aggs: {
          app_name_count: {
            terms: { field: 'app_name' }
          },
          channel_name_count: {
            terms: { field: 'channel_name' }
          },
          severity_stats: {
            stats: { field: 'severity' }
          },
          category_count: {
            terms: { field: 'category' }
          },
          issue_id_count: {
            terms: { field: 'issue_id' }
          }
        }
      }
    });
    res.json(response.aggregations);
  } catch (error) {
    console.error('Error performing aggregations:', error);
    res.status(500).send('Error performing aggregations');
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
