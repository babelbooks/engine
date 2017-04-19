import * as Bluebird  from 'bluebird';
import { client }     from './elastic.config';
import { Metadata }   from './metadata.interface';

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
      index: 'babel',
      body: {
        query: {
          ids: {
            values: [id]
          }
        }
      }
    }))
    .then((res: any) => {
      return res.hits.hits[0] ? res.hits.hits[0]._source : undefined;
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
      index: 'babel',
      q: 'title:' + title
    }))
    .then((res: any) => {
      return res.hits.hits;
    })
    .map((res: any) => {
      return res._source;
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
  return Bluebird.resolve(client.index({
    index: 'babel',
    type: 'book',
    id: id,
    body: book
  }));
}

export function search(query: string): Bluebird<Metadata[]> {
  return Bluebird.reject(new Error('Not implemented yet'));
}