# API Testing Module

This module provides the core API testing functionality for the Playwright-BDD framework.

## Directory Structure

```
src/api/
  ├── clients/    # API client functions (GET, POST, etc.)
  ├── requests/   # Request payload builders or schema templates
  ├── responses/  # Response validators or data extractors
  └── utils/      # API utilities for authentication, etc.
```

## Usage

The API testing functionality is used in conjunction with the feature files in `src/features/api/` and step definitions in `src/steps/api/`.

### API Client

The `ApiClient` class in `clients/apiClient.ts` provides methods for making HTTP requests:

```typescript
// Example usage
import { ApiClient } from '../../api/clients/apiClient';

// Make a GET request
const response = await ApiClient.get(url, headers);

// Make a POST request
const response = await ApiClient.post(url, data, headers);
```

### Response Validation

The `ResponseValidator` class in `responses/responseValidator.ts` provides methods for validating API responses:

```typescript
// Example usage
import { ResponseValidator } from '../../api/responses/responseValidator';

// Validate status code
await ResponseValidator.validateStatusCode(response, 200);

// Validate response contains text
await ResponseValidator.validateResponseContains(response, "expected text");

// Validate response body values
await ResponseValidator.validateResponseBody(response, { key: "expected value" });
```

### API Utilities

The `ApiUtils` class in `utils/apiUtils.ts` provides utility methods for API testing:

```typescript
// Example usage
import { ApiUtils } from '../../api/utils/apiUtils';

// Create basic auth header
const authHeader = ApiUtils.createBasicAuthHeader(username, password);

// Add query parameters to URL
const urlWithParams = ApiUtils.addQueryParams(baseUrl, { param1: "value1" });

// Extract value from JSON path
const value = ApiUtils.extractValueFromPath(object, "path.to.value");
```

## Running Tests

API tests are defined in feature files in `src/features/api/` and can be run using the scripts defined in `package.json`:

```bash
# Run all API tests
npm run test:api

# Run specific test cases
npm run test:api:tc1
npm run test:api:tc2
```

For more information about writing and running API tests, see the README in `src/features/api/`. 