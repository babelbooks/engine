# BabelBooks - Engine
The indexing, search and recommendation engine for BabelBooks.

## Build and run
First time or newly added package(s) from pull ?
```shell
npm install
```

Then, or every other times:
```shell
npm start
```

Only build:
```shell
gulp build
```

## Deploy
```shell
docker-compose up --build
```
And it will run the server + the database.

## Services
### ISBN
#### GET /isbn/test
Just a test route to ensure that the ISBN router is working.

#### GET /isbn/:isbn
Uses different APIs to retrieve all available information about the given ISBN.
Result will have the following shape:
```json
{
  "id": number | string,
  "title": string,
  "abstract": string,
  "genres": string[],
  "author": string,
  "edition": string,
  "majorForm": string,
  "cover": string
}
```

### Metadata
#### GET /elastic/test
Just a test route to ensure that the elastic router is working.

#### GET /elastic/book/:id
Tries to retrieve all known information about the given ID
(it's an ISBN or a meta-ISBN, created by us).
If the book is not indexed yet, it will return a 404.
Result will be the same shape than for `GET /isbn/:isbn`.

#### GET /elastic/book/title/:title
Tries to retrieve all known information about books matching more
or less the given title.
If no book match, it will return a 404.
Result will be an array of the same shape than for `GET /isbn/:isbn`.

#### GET /elastic/book/search/:query
Tries to retrieve all known information about books matching more
or less the given query. Query can be keywords or author's name.
If no book match, it will return a 404.
Result will be an array of the same shape than for `GET /isbn/:isbn`.

#### GET /elastic/book/autocomplete/:piece
Tries to autocomplete an indexed book's title from the given piece of words.
If no book match, it will return a 404.
Result will be an array of all the matched titles.

#### PUT /elastic/book
Tries to index the given metadata.
The metadata must have the following shape:
```json
{
  "book": {
    "id": number | string,
    "title": string,
    "abstract": string,
    "genres": string[],
    "author": string,
    "edition": string,
    "majorForm": string,
    "cover": string
  }
}
```
If a book with the given metadata already exists,
it is simply overwritten.