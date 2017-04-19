import * as express from 'express';

const app = express();

app.set('port', process.env.BB_ENGINE_PORT || 3002);

app.get('/', (req: express.Request, res: express.Response) => {
  return res.status(200).json({
    server: '@babelbooks/engine',
    status: 'running',
    url: req.originalUrl
  });
});

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});