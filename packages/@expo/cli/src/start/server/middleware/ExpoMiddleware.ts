import { parse } from 'url';

import * as Log from '../../../log';
import { ServerNext, ServerRequest, ServerResponse } from './server.types';

/** Base middleware creator for Expo dev servers. */
export abstract class ExpoMiddleware {
  constructor(protected projectRoot: string, protected supportedPaths: string[]) {}

  /**
   * Returns true when the middleware should handle the incoming server request.
   * Exposed for testing.
   */
  _shouldHandleRequest(req: ServerRequest): boolean {
    return (
      !!req.url &&
      this.supportedPaths.includes(
        // Strip the query params
        parse(req.url).pathname
      )
    );
  }

  abstract handleRequestAsync(
    req: ServerRequest,
    res: ServerResponse,
    next: ServerNext
  ): Promise<void>;

  /** Create a server middleware handler. */
  public getHandler(): (
    req: ServerRequest,
    res: ServerResponse,
    next: ServerNext
  ) => Promise<void> {
    return async (req: ServerRequest, res: ServerResponse, next: ServerNext) => {
      if (!this._shouldHandleRequest(req)) {
        return next();
      }

      try {
        return await this.handleRequestAsync(req, res, next);
      } catch (e) {
        Log.exception(e);
        // 5xx = Server Error HTTP code
        res.statusCode = 500;
        if (typeof e === 'object' && e !== null) {
          res.end(
            JSON.stringify({
              error: e.toString(),
            })
          );
        } else {
          res.end(`Unexpected error: ${e}`);
        }
      }
    };
  }
}

export function disableResponseCache(res: ServerResponse): ServerResponse {
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Expires', '-1');
  res.setHeader('Pragma', 'no-cache');
  return res;
}
