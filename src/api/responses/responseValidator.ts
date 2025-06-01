import { APIResponse } from '@playwright/test';
import * as assert from 'assert';

/**
 * ResponseValidator - A class to validate API responses
 */
export class ResponseValidator {
  /**
   * Validates the status code of the response
   * @param response - The API response
   * @param expectedStatusCode - The expected status code
   * @returns true if validation passes
   */
  static async validateStatusCode(response: APIResponse, expectedStatusCode: number): Promise<boolean> {
    assert.strictEqual(response.status(), expectedStatusCode, 
      `Expected status code ${expectedStatusCode}, but got ${response.status()}`);
    return true;
  }

  /**
   * Validates that the response body contains a specific text
   * @param response - The API response
   * @param expectedText - The text expected to be in the response body
   * @returns true if validation passes
   */
  static async validateResponseContains(response: APIResponse, expectedText: string): Promise<boolean> {
    const body = await response.text();
    assert.ok(body.includes(expectedText), 
      `Expected response to contain "${expectedText}", but it doesn't`);
    return true;
  }

  /**
   * Validates that the response body contains specific fields/values
   * @param response - The API response
   * @param expectedObject - An object containing expected field/value pairs
   * @returns true if validation passes
   */
  static async validateResponseBody(response: APIResponse, expectedObject: Record<string, any>): Promise<boolean> {
    let bodyJson: any;
    try {
      bodyJson = await response.json();
    } catch (error) {
      throw new Error('Response body is not valid JSON');
    }

    for (const [key, value] of Object.entries(expectedObject)) {
      assert.deepStrictEqual(bodyJson[key], value, 
        `Expected field "${key}" to have value ${JSON.stringify(value)}, but got ${JSON.stringify(bodyJson[key])}`);
    }
    
    return true;
  }

  /**
   * Validates the response headers contain specific values
   * @param response - The API response
   * @param expectedHeaders - An object containing expected header/value pairs
   * @returns true if validation passes
   */
  static async validateResponseHeaders(response: APIResponse, expectedHeaders: Record<string, string>): Promise<boolean> {
    const headers = response.headers();
    
    for (const [key, value] of Object.entries(expectedHeaders)) {
      const headerValue = headers[key.toLowerCase()];
      assert.ok(headerValue, `Expected header "${key}" not found in response`);
      assert.ok(headerValue.includes(value), 
        `Expected header "${key}" to contain "${value}", but got "${headerValue}"`);
    }
    
    return true;
  }
} 