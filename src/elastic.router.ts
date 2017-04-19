import * as express   from 'express';
import * as services  from './elastic.services';
import { Metadata }   from './metadata.interface';

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

router.get('/book/:id', (req: express.Request, res: express.Response) => {
  return services
    .findBookById(req.params['id'])
    .then((book: Metadata) => {
      return res.status(200).json(book);
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
});

router.get('/book/title/:title', (req: express.Request, res: express.Response) => {
  return services
    .findBookByTitle(req.params['title'])
    .then((book: Metadata[]) => {
      return res.status(200).json(book);
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
});

router.get('/book/search/:query', (req: express.Request, res: express.Response) => {
  return services
    .search(req.params['query'])
    .then((book: Metadata[]) => {
      return res.status(200).json(book);
    })
    .catch((err: Error) => {
      return res.status(404).json(err);
    });
});

/**
 * PUT /book
 * book: Metadata
 *
 * Adds the given book to the right index.
 * f the books already exists, i.e. there is already
 * a book with the same id as provided,
 * the book is simply overridden.
 * Returns a 201 created status code if successful,
 * along with some associated information.
 * Otherwise, returns a 400 bad request alongside
 * an object describing the error.
 */
router.put('/book', (req: express.Request, res: express.Response) => {
  return services
    .addBook(req.body.book)
    .then((result: any) => {
      return res.status(201).json(result);
    })
    .catch((err: Error) => {
      return res.status(400).json(err);
    });
});

export default router;