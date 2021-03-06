import * as Bluebird  from 'bluebird';
import { client }     from './elastic.config';
import { indexName }  from './elastic.config';
import { Metadata }   from '../lib/metadata.interface';

/**
 * A ping function to check if the server is correctly running
 * and that the client in functional.
 * @param timeout The ping timeout, in ms ; default to 1000 ms.
 * @returns {Bluebird<any>}
 */
export function testPing(timeout: number = 1000): Bluebird<any> {
  return Bluebird
    .resolve(client.ping({
      requestTimeout: timeout
    }));
}

/**
 * Attempts to find a book with the given ID.
 * If successful, returns all information known about it.
 * Otherwise, returns un undefined object.
 * @param id The ID thanks to which find the requested book.
 * @returns {Bluebird<Metadata>}
 */
export function findBookById(id: number | string): Bluebird<Metadata> {
  return Bluebird
    .resolve(client.search({
      index: indexName,
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    }))
    .then((res: any) => {
      if(res.hits.hits[0]) {
        res.hits.hits[0]._source.id = res.hits.hits[0]._id;
        delete res.hits.hits[0]._source.suggest;
        return res.hits.hits[0]._source;
      }
      return undefined;
    });
}

/**
 * Attempts to find a book witch match the given title.
 * If successful, returns an array with all information about each
 * book, or an empty array otherwise.
 * @param title The piece of title to find.
 * @returns {Bluebird<Metadata[]>}
 */
export function findBookByTitle(title: string): Bluebird<Metadata[]> {
  return Bluebird
    .resolve(client.search({
      index: indexName,
      q: 'title:' + title
    }))
    .then((res: any) => {
      return res.hits.hits;
    })
    .map((res: any) => {
      res._source.id = res._id;
      delete res._source.suggest;
      return res._source;
    });
}

/**
 * Attempts to complete the given piece of text
 * into some books' titles stored in our index.
 * If successful, returns an array with all the matched titles.
 * Otherwise, returns an empty array.
 * @param piece The piece of text to complete.
 * @returns {Bluebird<string[]>}
 */
export function autocomplete(piece: string): Bluebird<string[]> {
  return Bluebird
    .resolve(client.suggest({
      index: indexName,
      body: {
        docsuggest: {
          text: piece,
          completion: {
            field: 'suggest',
            fuzzy: true
          }
        }
      }
    }))
    .then((res: any) => {
      return res.docsuggest[0] ? res.docsuggest[0].options : [];
    })
    .map((res: any) => {
      return res._source.title;
    });
}

/**
 * Adds the given book to the right index.
 * If the books already exists, i.e. there is already
 * a book with the same id as provided,
 * the book is simply overridden.
 * @param book The data to insert.
 * @returns {Bluebird<any>}
 */
export function addBook(book: Metadata): Bluebird<any> {
  let id = '' + book.id;
  delete book.id;
  let obj: any = Object.assign(book);
  obj.suggest = {
    input: book.title.split(' ')
  };
  return Bluebird.resolve(client.index({
    index: indexName,
    type: 'book',
    id: id,
    body: obj
  }));
}

/**
 * Tries to find books that are matching the provided keywords.
 * If successful, returns an array with all information
 * about each matched book (sorted by highest relevance,
 * and truncated to the default number of results).
 * Otherwise, returns an empty array.
 * @param query The keywords thanks to which perform the search.
 * @param limit The maximum number of books to retrieve. Default to 10.
 * @param offset The offset from which retrieve books. Default to 0.
 * @returns {Bluebird<Metadata[]>}
 *
 * TODO: relevance can be widely enhanced (https://www.elastic.co/guide/en/elasticsearch/guide/current/search-in-depth.html)
 */
export function search(query: string, limit: number = 10, offset: number = 0): Bluebird<Metadata[]> {
  let q = {
    bool: {
      should: [
        {
          match: {
            title: {
              query: query,
              boost: 2.0
            }
          }
        },
        {
          match: {
            author: {
              query: query,
              boost: 2.0
            }
          }
        },
        {
          match: {
            abstract: query
          }
        }
      ]
    }
  };
  return Bluebird
    .resolve(client.search({
      index: indexName,
      body: {
        query: q,
        from: offset,
        size: limit
      }
    }))
    .then((res: any) => {
      return res.hits.hits;
    })
    .map((res: any) => {
      res._source.id = res._id;
      delete res._source.suggest;
      return res._source;
    });
}