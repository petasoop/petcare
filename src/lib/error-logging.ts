/**
 * Error logging utility for API routes with context (file name + function name)
 */

interface LogContext {
  fileName: string
  functionName: string
  additionalContext?: Record<string, unknown>
}

/**
 * Log an error with context information
 * @param error - The error to log
 * @param context - Context object with fileName and functionName
 */
export function logError(error: unknown, context: LogContext): void {
  const { fileName, functionName, additionalContext } = context

  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  const contextStr = JSON.stringify({
    fileName,
    functionName,
    ...additionalContext,
  })

  console.error(`[ERROR] ${fileName}:${functionName} - ${errorMessage}`, {
    context: contextStr,
    stack: errorStack,
  })
}

/**
 * Log a warning with context information
 * @param message - The warning message
 * @param context - Context object with fileName and functionName
 */
export function logWarning(message: string, context: LogContext): void {
  const { fileName, functionName, additionalContext } = context

  const contextStr = JSON.stringify({
    fileName,
    functionName,
    ...additionalContext,
  })

  console.warn(`[WARNING] ${fileName}:${functionName} - ${message}`, {
    context: contextStr,
  })
}

/**
 * Log info with context information
 * @param message - The info message
 * @param context - Context object with fileName and functionName
 */
export function logInfo(message: string, context: LogContext): void {
  const { fileName, functionName, additionalContext } = context

  const contextStr = JSON.stringify({
    fileName,
    functionName,
    ...additionalContext,
  })

  console.log(`[INFO] ${fileName}:${functionName} - ${message}`, {
    context: contextStr,
  })
}
