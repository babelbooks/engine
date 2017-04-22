import * as express   from 'express';
import * as services  from './elastic.services';
import { Metadata }   from '../lib/metadata.interface';

export let router = express.Router();

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
      response.elastic.status = 408;
      response.elastic.comment = 'the request timed out...';
      response.elastic.error = err;
      return res.status(200).json(response);
    });
});

/**
 * GET /book/:id
 *
 * Tries to find information about a book with the given ID.
 * The ID must match exactly.
 * If successful, returns all known info with a 200 status code.
 * Otherwise, returns a 404 not found status code alongside
 * a small object telling what was the searched ID.
 */
router.get('/book/:id', (req: express.Request, res: express.Response) => {
  return services
    .findBookById(req.params['id'])
    .then((book: Metadata) => {
      if(book) {
        return res.status(200).json(book);
      }
      return res.status(404).json({
        id: req.params['id'],
        status: 'Not found'
      });
    })
    .catch((err: Error) => {
      return res.status(500).json(err);
    });
});

/**
 * GET /book/title/:title
 *
 * Tries to find information about a book with the given title.
 * At least one word must match in order to send back results.
 * If successful, returns an array with all known info about
 * each matched book with a 200 status code.
 * Otherwise, returns a 404 not found status code alongside
 * a small object telling what was the searched title.
 */
router.get('/book/title/:title', (req: express.Request, res: express.Response) => {
  return services
    .findBookByTitle(req.params['title'])
    .then((book: Metadata[]) => {
      if(book && book.length > 0) {
        return res.status(200).json(book);
      }
      return res.status(404).json({
        title: req.params['title'],
        status: 'Not found'
      });
    })
    .catch((err: Error) => {
      return res.status(500).json(err);
    });
});

/**
 * GET /book/search/:query
 *
 * Tries to find books that are matching the provided keywords.
 * f successful, returns an array with all information
 * about each matched book (sorted by highest relevance,
 * and truncated to the default number of results),
 * along with a 200 status code.
 * Otherwise, returns a 404 not found status code alongside
 * a small object telling what were the searched keywords.
 */
router.get('/book/search/:query', (req: express.Request, res: express.Response) => {
  return services
    .search(req.params['query'])
    .then((book: Metadata[]) => {
      if(book && book.length > 0) {
        return res.status(200).json(book);
      }
      return res.status(404).json({
        query: req.params['query'],
        status: 'Not found'
      });
    })
    .catch((err: Error) => {
      return res.status(500).json(err);
    });
});

/**
 * GET /book/autocomplete/:piece
 *
 * Tries to complete the given piece of text
 * into some books' titles stored in our index.
 * If successful, returns an array with all the matched titles
 * alongside a status 200 code.
 * Otherwise, returns a 4040 not found status code along with
 * a small object telling what were the searched piece of text.
 */
router.get('/book/autocomplete/:piece', (req: express.Request, res: express.Response) => {
  return services
    .autocomplete(req.params['piece'])
    .then((resp: string[]) => {
      if(resp && resp.length > 0) {
        return res.status(200).json(resp);
      }
      return res.status(404).json({
        query: req.params['piece'],
        status: 'Not found'
      });
    })
    .catch((err: Error) => {
      return res.status(500).json(err);
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
      console.error('ERROR');
      console.error(err);
      return res.status(500).json(err);
    });
});