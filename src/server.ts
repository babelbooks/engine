import * as express     from 'express';
import * as bodyparser  from 'body-parser';
import * as morgan      from 'morgan';
import * as cors        from 'cors';

import * as elastic from './elastic/elastic.router';
import * as isbn    from './isbn/isbn.router';

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

// Add a test path
app.get('/test', (req: any, res: any) => res.status(200).json({
  path: req.originalUrl,
  status: 200,
  comment: 'it\'s working!'
}));

// Mount sub-routers
app.use('/elastic', elastic.router);
app.use('/isbn', isbn.router);

/**
 * Run the server.
 */
app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});