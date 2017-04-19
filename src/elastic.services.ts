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

export function addBook(book: Metadata): Bluebird<any> {
  return Bluebird.reject(new Error('Not implemented yet'));
}

export function search(query: string): Bluebird<Metadata[]> {
  return Bluebird.reject(new Error('Not implemented yet'));
}