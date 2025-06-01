import { Then, When, Given } from '@cucumber/cucumber';
import { APIResponse } from '@playwright/test';
import { ApiClient } from '../../api/clients/apiClient';
import { ResponseValidator } from '../../api/responses/responseValidator';
import { ApiUtils } from '../../api/utils/apiUtils';

// Share response between steps
let apiResponse: APIResponse;
let requestBody: Record<string, any> = {};
let requestHeaders: Record<string, any> = {};

/**
 * Given steps
 */
Given('I set the request URL to {string}', function (url: string) {
  this.url = url;
});

Given('I set the request body:', function (docString: string) {
  try {
    requestBody = JSON.parse(docString);
  } catch (error) {
    throw new Error(`Failed to parse request body JSON: ${error}`);
  }
});

Given('I set the request header {string} to {string}', function (key: string, value: string) {
  requestHeaders[key] = value;
});

Given('I set the following request headers:', function (dataTable: any) {
  const headers = dataTable.rowsHash();
  requestHeaders = { ...requestHeaders, ...headers };
});

Given('I set query parameter {string} to {string}', function (param: string, value: string) {
  if (!this.queryParams) {
    this.queryParams = {};
  }
  this.queryParams[param] = value;
});

Given('I set the following query parameters:', function (dataTable: any) {
  if (!this.queryParams) {
    this.queryParams = {};
  }
  const params = dataTable.rowsHash();
  this.queryParams = { ...this.queryParams, ...params };
});

Given('I set basic authentication with username {string} and password {string}', function (username: string, password: string) {
  if (!requestHeaders) {
    requestHeaders = {};
  }
  requestHeaders['Authorization'] = ApiUtils.createBasicAuthHeader(username, password);
});

Given('I set bearer token {string}', function (token: string) {
  if (!requestHeaders) {
    requestHeaders = {};
  }
  requestHeaders['Authorization'] = ApiUtils.createBearerTokenHeader(token);
});

/**
 * When steps
 */
When('I send a GET request', async function () {
  apiResponse = await ApiClient.get(this.url, requestHeaders);
  this.apiResponse = apiResponse; // Store for other steps
});

When('I send a POST request', async function () {
  apiResponse = await ApiClient.post(this.url, requestBody, requestHeaders);
  this.apiResponse = apiResponse;
});

When('I send a PUT request', async function () {
  apiResponse = await ApiClient.put(this.url, requestBody, requestHeaders);
  this.apiResponse = apiResponse;
});

When('I send a DELETE request', async function () {
  apiResponse = await ApiClient.delete(this.url, requestHeaders);
  this.apiResponse = apiResponse;
});

When('I send a GET request to {string} with query parameters', async function (baseUrl: string) {
  const url = this.queryParams 
    ? ApiUtils.addQueryParams(baseUrl, this.queryParams) 
    : baseUrl;
  
  apiResponse = await ApiClient.get(url, this.requestHeaders || {});
  this.apiResponse = apiResponse;
});

When('I send a GET request using stored value {string} as path parameter in {string}', async function (storedValue: string, urlTemplate: string) {
  if (this[storedValue] === undefined) {
    throw new Error(`No stored value found for "${storedValue}"`);
  }
  
  const url = urlTemplate.replace('{value}', this[storedValue]);
  apiResponse = await ApiClient.get(url, requestHeaders);
  this.apiResponse = apiResponse;
});

/**
 * Then steps
 */
Then('the response status code should be {int}', async function (expectedStatusCode: number) {
  await ResponseValidator.validateStatusCode(apiResponse, expectedStatusCode);
});

Then('the response should contain {string}', async function (expectedText: string) {
  await ResponseValidator.validateResponseContains(apiResponse, expectedText);
});

Then('the response body should contain the following values:', async function (dataTable: any) {
  const expectedValues = dataTable.rowsHash();
  await ResponseValidator.validateResponseBody(apiResponse, expectedValues);
});

Then('the response headers should contain:', async function (dataTable: any) {
  const expectedHeaders = dataTable.rowsHash();
  await ResponseValidator.validateResponseHeaders(apiResponse, expectedHeaders);
});

Then('I store the response body', async function () {
  const responseBody = await apiResponse.json();
  this.responseBody = responseBody;
});

Then('I store the value of response field {string} as {string}', async function (field: string, variableName: string) {
  const responseBody = await apiResponse.json();
  const fieldValue = responseBody[field];
  
  if (fieldValue === undefined) {
    throw new Error(`Field "${field}" not found in response body`);
  }
  
  this[variableName] = fieldValue;
});

Then('I extract the value at path {string} and store it as {string}', async function (jsonPath: string, variableName: string) {
  const responseBody = await apiResponse.json();
  const extractedValue = ApiUtils.extractValueFromPath(responseBody, jsonPath);
  
  if (extractedValue === undefined) {
    throw new Error(`Path "${jsonPath}" not found in response body`);
  }
  
  this[variableName] = extractedValue;
});

Then('the stored value {string} should equal {string}', function (variableName: string, expectedValue: string) {
  if (this[variableName] === undefined) {
    throw new Error(`No stored value found for "${variableName}"`);
  }
  
  if (this[variableName].toString() !== expectedValue) {
    throw new Error(`Expected stored value "${variableName}" to equal "${expectedValue}", but got "${this[variableName]}"`);
  }
});

Then('the stored value {string} should contain {string}', function (variableName: string, expectedValue: string) {
  if (this[variableName] === undefined) {
    throw new Error(`No stored value found for "${variableName}"`);
  }
  
  if (!this[variableName].toString().includes(expectedValue)) {
    throw new Error(`Expected stored value "${variableName}" to contain "${expectedValue}", but got "${this[variableName]}"`);
  }
}); 