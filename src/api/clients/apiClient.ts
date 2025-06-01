import { request } from '@playwright/test';

/**
 * ApiClient - A class to handle API requests
 */
export class ApiClient {
  /**
   * Performs a GET request
   * @param url - The URL to make the request to
   * @param headers - Optional headers for the request
   * @returns Response object
   */
  static async get(url: string, headers?: Record<string, string>) {
    const context = await request.newContext();
    return await context.get(url, { headers });
  }

  /**
   * Performs a POST request
   * @param url - The URL to make the request to
   * @param data - The data to send in the request body
   * @param headers - Optional headers for the request
   * @returns Response object
   */
  static async post(url: string, data: any, headers?: Record<string, string>) {
    const context = await request.newContext();
    return await context.post(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }

  /**
   * Performs a PUT request
   * @param url - The URL to make the request to
   * @param data - The data to send in the request body
   * @param headers - Optional headers for the request
   * @returns Response object
   */
  static async put(url: string, data: any, headers?: Record<string, string>) {
    const context = await request.newContext();
    return await context.put(url, {
      data,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });
  }

  /**
   * Performs a DELETE request
   * @param url - The URL to make the request to
   * @param headers - Optional headers for the request
   * @returns Response object
   */
  static async delete(url: string, headers?: Record<string, string>) {
    const context = await request.newContext();
    return await context.delete(url, { headers });
  }
} 