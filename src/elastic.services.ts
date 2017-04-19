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

export function findBookById(id: number | string): Bluebird<Metadata> {
  return Bluebird.reject(new Error('Not implemented yet'));
}

export function findBookByTitle(title: string): Bluebird<Metadata[]> {
  return Bluebird.reject(new Error('Not implemented yet'));
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