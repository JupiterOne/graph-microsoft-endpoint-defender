/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * @module GraphErrorHandler
 */

import { GraphError } from '@microsoft/microsoft-graph-client';
export type GraphErrorExtended = GraphError & { headers?: Headers };

/**
 * @class
 * Class for GraphErrorHandler
 * NOTE: copied & modified from the microsoft-graph-client NPM package.
 */

export class GraphErrorHandler {
  /**
   * @public
   * @static
   * @async
   * To get the GraphError object
   * @param {any} [error = null] - The error returned by graph service or some native error
   * @param {number} [statusCode = -1] - The status code of the response
   * @returns A promise that resolves to GraphError instance
   */
  public static async getError(
    error: any = null,
    statusCode: number = -1,
  ): Promise<GraphErrorExtended> {
    let gError: GraphErrorExtended;

    gError = new GraphError(statusCode);
    gError.headers = error.headers;

    return gError;
  }
}
