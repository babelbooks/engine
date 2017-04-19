import * as express from 'express';

import { default as elasticRouter } from './elastic.router';

const app = express();

app.set('port', process.env.BB_ENGINE_PORT || 3002);

app.use('/', elasticRouter);

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});