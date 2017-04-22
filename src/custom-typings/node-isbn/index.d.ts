declare namespace isbn {
  /**
   * ISBN's type as used by this lib.
   */
  export type ISBN = string | number;

  /**
   * Resolve the given ISBN.
   * https://github.com/palmerabollo/node-isbn
   */
  export function resolve(isbn: ISBN, callback: (err: Error, res: Response) => any): void;

  /**
   * Result sent by resolve().
   * Most fields are optional.
   * https://github.com/palmerabollo/node-isbn#response
   */
  export interface Response {
    title: string,
    authors: string[],
    publisher?: string,
    publishedDate?: string,
    description?: string,
    industryIdentifiers?: IndustryIdentifiers[],
    readingModes?: ReadingMode,
    pageCount?: number,
    printType?: string,
    categories?: string[],
    averageRating?: number,
    ratingsCount?: number,
    contentVersion?: string,
    imageLinks?: ImageLinks,
    language?: string,
    previewLink?: string,
    infoLink?: string,
    canonicalVolumeLink?: string
  }

  export interface IndustryIdentifiers {
    type: string,
    identifier: string
  }

  export interface ReadingMode {
    text: false,
    image: false
  }

  export interface ImageLinks {
    smallThumbnail: string,
    thumbnail: string
  }
}

declare module 'node-isbn' {
  export = isbn;
}