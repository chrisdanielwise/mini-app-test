import { NextResponse } from "next/server"

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

export function successResponse<T>(data: T, meta?: ApiResponse["meta"], status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta,
    },
    { status },
  )
}

export function errorResponse(error: string, status = 400, message?: string): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      message,
    },
    { status },
  )
}

export function createdResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return successResponse(data, undefined, 201)
}

export function notFoundResponse(message = "Resource not found"): NextResponse<ApiResponse> {
  return errorResponse("Not Found", 404, message)
}

export function unauthorizedResponse(message = "Unauthorized"): NextResponse<ApiResponse> {
  return errorResponse("Unauthorized", 401, message)
}

export function forbiddenResponse(message = "Access denied"): NextResponse<ApiResponse> {
  return errorResponse("Forbidden", 403, message)
}

export function validationError(message: string): NextResponse<ApiResponse> {
  return errorResponse("Validation Error", 422, message)
}

export function serverError(message = "Internal server error"): NextResponse<ApiResponse> {
  return errorResponse("Internal Server Error", 500, message)
}
