import { NextResponse } from "next/server"

/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    total?: number
    limit?: number
    offset?: number
    page?: number
  }
}

/**
 * JSON Replacer to handle Prisma-specific types
 * Converts BigInt and Decimal to strings during serialization
 */
const stringifySafe = (data: any) => {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" 
        ? value.toString() 
        : value?._isDecimal 
          ? value.toString() 
          : value
    )
  )
}

/**
 * Success Response (200 OK)
 */
export function successResponse<T>(
  data: T, 
  meta?: ApiResponse["meta"], 
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data: stringifySafe(data),
      meta,
    },
    { status },
  )
}

/**
 * Error Response (Default 400 Bad Request)
 */
export function errorResponse(
  error: string, 
  status = 400, 
  message?: string
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status },
  )
}

/**
 * Created Response (201 Created)
 */
export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, undefined, 201)
}

/**
 * Not Found Response (404)
 */
export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse> {
  return errorResponse("Not Found", 404, message)
}

/**
 * Unauthorized Response (401)
 */
export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse("Unauthorized", 401, message)
}

/**
 * Forbidden Response (403)
 */
export function forbiddenResponse(message = "Access denied"): NextResponse<ApiResponse> {
  return errorResponse("Forbidden", 403, message)
}

/**
 * Validation Error Response (422)
 */
export function validationError(message: string): NextResponse<ApiResponse> {
  return errorResponse("Validation Error", 422, message)
}

/**
 * Server Error Response (500)
 */
export function serverError(message = "Internal server error"): NextResponse<ApiResponse> {
  return errorResponse("Internal Server Error", 500, message)
}