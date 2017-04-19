import * as express   from 'express';
import * as services  from './elastic.services';

let router = express.Router();

/**
 * GET /test
 *
 * An endpoint to test the router status as well as
 * the elasticsearch server status.
 */
router.get('/test', (req: express.Request, res: express.Response) => {
  let response: any = {
    endpoint: req.originalUrl,
    status: 200,
    comment: 'it\'s working!',
    elastic: {
      request: 'ping',
      status: 200,
      comment: 'it\'s working too!'
    }
  };
  return services
    .testPing()
    .then(() => {
      return res.status(200).json(response);
    })
    .catch((err: any) => {
      response.elastic.status = 500;
      response.elastic.comment = 'the request timed out...';
      response.elastic.error = err;
      return res.status(200).json(response);
    });
});

export default router;