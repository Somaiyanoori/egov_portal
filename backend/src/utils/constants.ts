export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const COOKIE_OPTIONS = {
  ACCESS_TOKEN: {
    maxAge: 15 * 60 * 1000, // 15 minutes
  },
  REFRESH_TOKEN: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
} as const;
