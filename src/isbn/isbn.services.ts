import * as isbn      from 'node-isbn';
import * as Bluebird  from 'bluebird';
import { Metadata }   from '../lib/metadata.interface';

// NOTE: alternatives to node-isbn are:
//  -> http://isbndb.com/
//  -> buy a database such as https://gumroad.com/l/RKxO

/**
 * Tries to find metadata for the given ISBN,
 * using external APIs such as google book.
 * See https://github.com/palmerabollo/node-isbn for more information.
 * If successful, returns a Metadata object with as much information
 * as we could find.
 * Otherwise, returns a promise rejection.
 * @param isbnNumber The ISBN to search for.
 * @returns {Bluebird<Metadata>}
 */
export function findMetadata(isbnNumber: isbn.ISBN): Bluebird<Metadata>{
  return new Bluebird(
    (resolve: (...params: any[]) => any, reject: (...params: any[]) => any) => {
      isbn.resolve(isbnNumber, (err: Error, book: isbn.Response) => {
        if(err) {
          return reject(err);
        }
        return resolve(book);
      });
    })
    .then((res: isbn.Response) => {
      return {
        id: isbnNumber,
        title : res.title,
        author: res.authors.length > 0 ? res.authors[0] : undefined,
        genres: res.categories,
        abstract: res.description,
        cover: res.imageLinks ? res.imageLinks.thumbnail : undefined,
        majorForm: res.printType,
        edition: res.publisher
      };
    });
}