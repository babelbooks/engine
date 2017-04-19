import * as Bluebird  from 'bluebird';
import { client }     from './elastic.config';

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