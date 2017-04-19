import * as elastic from 'elasticsearch';
import * as fs      from 'fs';
import * as ini     from 'ini';
import * as path    from 'path';

/**
 * Some good notes:
 *
 * By default, each index in Elasticsearch is allocated 5 primary shards and 1 replica
 * which means that if you have at least two nodes in your cluster,
 * your index will have 5 primary shards and another 5 replica shards
 * (1 complete replica) for a total of 10 shards per index.
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/_basic_concepts.html
 *
 * By default, results are returned sorted by relevance — with the most relevant docs first.
 * https://www.elastic.co/guide/en/elasticsearch/guide/current/sorting.html
 */

/**
 * Parse parameters from the elastic.ini file.
 */
let options = ini.parse(fs.readFileSync(path.resolve(__dirname, './elastic.ini'), 'utf-8'));

/**
 * The client used to access our elasticsearch server.
 * @type {Elasticsearch.Client}
 */
export const client = new elastic.Client({
  host: process.env.BB_ELASTIC_HOST || options.defaultHost,
  log: options.log,
  sniffOnStart: options.sniffOnStart,
  sniffInterval: options.sniffInterval
});