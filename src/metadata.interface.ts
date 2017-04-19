export interface Metadata {
  /**
   * The books ISBN if it exists.
   * Otherwise, this is a custom 13 digits ISBN starting with 981.
   */
  id: number | string;

  /**
   * The book's title.
   */
  title: string;

  /**
   * A shot abstract for the book.
   */
  abstract?: string;

  /**
   * The list of genres the book is known of.
   */
  genres: string[];

  /**
   * The author's name.
   */
  author?: string;

  /**
   * The book's edition (one of them).
   */
  edition?: string;

  /**
   * Whether if the book is a novel, a short story
   * or anything else.
   */
  majorForm?: string;

  /**
   * An url to the book's cover.
   */
  cover?: string;
}