import * as express   from 'express';
import * as services  from './isbn.services';
import { Metadata }   from '../lib/metadata.interface';

export let router = express.Router();

/**
 * GET /:isbn
 *
 * Gather all metadata available from
 * the given ISBN.
 * If successful, returns a 200 status code alongside
 * the found metadata.
 * Otherwise, returns a 404 status code along with an object
 * describing the error.
 */
router.get('/:isbn', (req: express.Request, res: express.Response) => {
  return services
    .findMetadata(req.params['isbn'])
    .then((response: Metadata) => {
      return res.status(200).json(response);
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
});