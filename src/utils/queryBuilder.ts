import { Query, PopulateOptions } from "mongoose";

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  searchFields?: string; // Comma-separated fields to search in
  fields?: string; // Comma-separated fields to select
  [key: string]: unknown; // Allow any other dynamic filters
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class QueryBuilder<T> {
  private mongooseQuery: Query<T[], T>;
  private queryParams: QueryOptions;
  constructor(mongooseQuery: Query<T[], T>, queryParams: QueryOptions) {
    this.mongooseQuery = mongooseQuery;
    this.queryParams = queryParams;
  }

  // Dynamic search function - accepts search fields from query params or defaults
  search(defaultSearchFields: string[] = []) {
    const searchTerm = this.queryParams.search;
    if (!searchTerm) return this;

    // Get search fields from query params or use defaults
    const searchFieldsParam = this.queryParams.searchFields;
    const searchFields = searchFieldsParam
      ? searchFieldsParam.split(",").map((field) => field.trim())
      : defaultSearchFields;

    if (searchFields.length === 0) return this;

    // Advanced search with field weighting and operators
    const searchConditions = searchFields.map((field) => {
      const condition: Record<string, unknown> = {};

      // Check if it's an exact match search (wrapped in quotes)
      if (searchTerm.startsWith('"') && searchTerm.endsWith('"')) {
        const exactTerm = searchTerm.slice(1, -1);
        condition[field] = { $regex: `^${exactTerm}$`, $options: "i" };
      }
      // Check for numeric search on numeric fields
      else if (
        ["cost", "price", "duration", "maxParticipants"].includes(field) &&
        !isNaN(Number(searchTerm))
      ) {
        condition[field] = Number(searchTerm);
      }
      // Default regex search
      else {
        condition[field] = { $regex: searchTerm, $options: "i" };
      }

      return condition;
    });

    this.mongooseQuery = this.mongooseQuery.find({
      $or: searchConditions,
    });

    return this;
  }

  // Universal dynamic filter system
  filter() {
    const filterObj: Record<string, unknown> = {};
    const queryParams = { ...this.queryParams };

    // Remove non-filter parameters
    const excludeFields = [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "search",
      "searchFields",
      "fields",
    ];
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([key]) => !excludeFields.includes(key)
      )
    );

    // Process each remaining parameter as a filter
    Object.entries(filteredParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      // Handle operator-based filtering (e.g., minCost, maxCost, gtAge, ltePrice)
      if (key.startsWith("min")) {
        const field = key.replace("min", "").toLowerCase();
        if (!filterObj[field]) filterObj[field] = {};
        (filterObj[field] as Record<string, unknown>).$gte =
          this.convertValue(value);
      } else if (key.startsWith("max")) {
        const field = key.replace("max", "").toLowerCase();
        if (!filterObj[field]) filterObj[field] = {};
        (filterObj[field] as Record<string, unknown>).$lte =
          this.convertValue(value);
      } else if (key.startsWith("gt")) {
        const field = key.replace("gt", "").toLowerCase();
        filterObj[field] = { $gt: this.convertValue(value) };
      } else if (key.startsWith("gte")) {
        const field = key.replace("gte", "").toLowerCase();
        filterObj[field] = { $gte: this.convertValue(value) };
      } else if (key.startsWith("lt")) {
        const field = key.replace("lt", "").toLowerCase();
        filterObj[field] = { $lt: this.convertValue(value) };
      } else if (key.startsWith("lte")) {
        const field = key.replace("lte", "").toLowerCase();
        filterObj[field] = { $lte: this.convertValue(value) };
      } else if (key.startsWith("ne")) {
        const field = key.replace("ne", "").toLowerCase();
        filterObj[field] = { $ne: this.convertValue(value) };
      }
      // Handle array values (e.g., division=A,B,C or status[]=active&status[]=pending)
      else if (typeof value === "string" && value.includes(",")) {
        const values = value.split(",").map((v) => this.convertValue(v.trim()));
        filterObj[key] = { $in: values };
      } else if (Array.isArray(value)) {
        filterObj[key] = { $in: value.map((v) => this.convertValue(v)) };
      }
      // Handle regex patterns for text fields
      else if (
        typeof value === "string" &&
        ["title", "description", "location", "name"].includes(key)
      ) {
        filterObj[key] = { $regex: value, $options: "i" };
      }
      // Handle date fields
      else if (
        typeof value === "string" &&
        ["startDate", "endDate", "createdAt", "updatedAt"].includes(key)
      ) {
        filterObj[key] = { $gte: new Date(value) };
      }
      // Handle exact matches
      else {
        filterObj[key] = this.convertValue(value);
      }
    });

    if (Object.keys(filterObj).length > 0) {
      this.mongooseQuery = this.mongooseQuery.find(filterObj);
    }

    return this;
  }

  // Helper method to convert string values to appropriate types
  private convertValue(value: unknown): unknown {
    if (typeof value !== "string") return value;

    // Convert to number if it's a valid number
    if (!isNaN(Number(value))) {
      return Number(value);
    }

    // Convert to boolean if it's a boolean string
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;

    // Convert to Date if it looks like a date
    if (
      value.match(/^\d{4}-\d{2}-\d{2}/) ||
      value.match(/^\d{2}\/\d{2}\/\d{4}/)
    ) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }

    return value;
  }

  //Advanced sorting with multi-field support
  sort() {
    let sortBy = this.queryParams.sortBy || "createdAt";
    const sortOrder = this.queryParams.sortOrder === "asc" ? 1 : -1;

    // Handle multi-field sorting (e.g., sortBy=price,-createdAt,title)
    if (sortBy.includes(",")) {
      const sortObj: Record<string, 1 | -1> = {};
      sortBy.split(",").forEach((field) => {
        const trimmedField = field.trim();
        if (trimmedField.startsWith("-")) {
          sortObj[trimmedField.substring(1)] = -1;
        } else {
          sortObj[trimmedField] = 1;
        }
      });
      this.mongooseQuery = this.mongooseQuery.sort(sortObj);
    }
    // Single field sorting with explicit order
    else {
      // Remove leading minus if present (handled by sortOrder)
      if (sortBy.startsWith("-")) {
        sortBy = sortBy.substring(1);
      }
      this.mongooseQuery = this.mongooseQuery.sort({ [sortBy]: sortOrder });
    }

    return this;
  }
  //Advanced pagination function with cursor support
  paginate() {
    const page = Math.max(1, Number(this.queryParams.page) || 1);
    const limit = Math.min(
      100, // Increased max limit but capped for performance
      Math.max(1, Number(this.queryParams.limit) || 10)
    );
    const skip = (page - 1) * limit;

    // Apply pagination
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }

  // Add field selection
  select() {
    if (this.queryParams.fields) {
      const fields = this.queryParams.fields
        .split(",")
        .map((field) => field.trim())
        .join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  //pouplate function
  populate(populateOptions: PopulateOptions | (string | PopulateOptions)[]) {
    this.mongooseQuery = this.mongooseQuery.populate(populateOptions);
    return this;
  }
  fields(): this {
    const fields = this.queryParams.fields?.split(",").join(" ") || "";

    this.mongooseQuery = this.mongooseQuery.select(fields);

    return this;
  }
      build() {
        return this.mongooseQuery
    }

    async getMeta() {
        const totalDocuments = await this.mongooseQuery.model.countDocuments()

        const page = Number(this.queryParams.page) || 1
        const limit = Number(this.queryParams.limit) || 10

        const totalPage = Math.ceil(totalDocuments / limit)

        return { page, limit, total: totalDocuments, totalPage }
    }
  async execute() {
    return await this.mongooseQuery.exec();
  }

  static getPaginationMeta(total: number, page: number, limit: number) {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null,
    };
  }
}
