/**
 * RequestBuilder - A class to build request bodies for API calls
 */
export class RequestBuilder {
  private data: Record<string, any> = {};

  /**
   * Add a field to the request data
   * @param key - The key for the field
   * @param value - The value for the field
   * @returns this RequestBuilder instance for chaining
   */
  public addField(key: string, value: any): RequestBuilder {
    this.data[key] = value;
    return this;
  }

  /**
   * Add multiple fields to the request data
   * @param fields - An object containing key-value pairs to add
   * @returns this RequestBuilder instance for chaining
   */
  public addFields(fields: Record<string, any>): RequestBuilder {
    this.data = { ...this.data, ...fields };
    return this;
  }

  /**
   * Remove a field from the request data
   * @param key - The key of the field to remove
   * @returns this RequestBuilder instance for chaining
   */
  public removeField(key: string): RequestBuilder {
    delete this.data[key];
    return this;
  }

  /**
   * Get the built request data
   * @returns The complete request data object
   */
  public build(): Record<string, any> {
    return { ...this.data };
  }

  /**
   * Create a new instance with predefined data
   * @param initialData - Initial data to populate the builder with
   * @returns A new RequestBuilder instance
   */
  public static create(initialData?: Record<string, any>): RequestBuilder {
    const builder = new RequestBuilder();
    if (initialData) {
      builder.addFields(initialData);
    }
    return builder;
  }
} 