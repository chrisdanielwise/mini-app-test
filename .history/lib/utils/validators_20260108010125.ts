/**
 * Checks if a string is a valid UUID.
 * Useful for preventing PostgreSQL syntax errors in Prisma 7.
 */
export const isUUID = (id: string | null | undefined): id is string => {
  if (!id) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};