import * as express     from 'express';
import * as bodyparser  from 'body-parser';

import { default as elasticRouter } from './elastic.router';

const app = express();

app.set('port', process.env.BB_ENGINE_PORT || 3002);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use('/', elasticRouter);

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});