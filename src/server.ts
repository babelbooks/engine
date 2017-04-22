import * as express     from 'express';
import * as bodyparser  from 'body-parser';
import * as morgan      from 'morgan';
import * as cors        from 'cors';

import { default as elasticRouter } from './elastic/elastic.router';

/**
 * Create server app.
 */
const app = express();

/**
 * Configure server app.
 */
// Set environment
app.set('port', process.env.BB_ENGINE_PORT || 3002);

// Allow CORS
app.use(cors({
  origin: process.env.BB_PRES_URL || '*', // In dev mode, allow everything
  optionsSuccessStatus: 200               // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Use logger
app.use(morgan('dev'));

// Parse JSON object in POST/PUT/etc
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

// Mount sub-routers
app.use('/', elasticRouter);

/**
 * Run the server.
 */
app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});