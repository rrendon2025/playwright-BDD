/**
 * API utilities to help with common API operations
 */
export class ApiUtils {
  /**
   * Creates basic authentication header
   * @param username - The username
   * @param password - The password
   * @returns The basic auth header value
   */
  static createBasicAuthHeader(username: string, password: string): string {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  /**
   * Creates a bearer token header
   * @param token - The bearer token
   * @returns The bearer token header value
   */
  static createBearerTokenHeader(token: string): string {
    return `Bearer ${token}`;
  }

  /**
   * Creates common headers for API requests
   * @param additionalHeaders - Any additional headers to include
   * @returns A headers object
   */
  static createCommonHeaders(additionalHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'Playwright-BDD-API-Client'
    };

    if (additionalHeaders) {
      Object.assign(headers, additionalHeaders);
    }

    return headers;
  }

  /**
   * Parses query parameters and adds them to a URL
   * @param baseUrl - The base URL
   * @param params - Query parameters object
   * @returns URL with query parameters
   */
  static addQueryParams(baseUrl: string, params: Record<string, string | number | boolean>): string {
    const url = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
    
    return url.toString();
  }

  /**
   * Extracts a specific value from a JSON path in the response
   * @param obj - The object to extract from
   * @param path - The path using dot notation (e.g., 'data.user.id')
   * @returns The extracted value or undefined if not found
   */
  static extractValueFromPath(obj: any, path: string): any {
    const parts = path.split('.');
    let result = obj;

    for (const part of parts) {
      if (result === undefined || result === null) {
        return undefined;
      }
      result = result[part];
    }

    return result;
  }
} 