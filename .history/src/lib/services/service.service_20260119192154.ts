
export async function deleteService(serviceId: string): Promise<Service> {
  if (!isUUID(serviceId))
    throw new Error("PROTOCOL_ERROR: Target_ID_Malformed");

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: false },
  });

  revalidateTag("catalog_node", "page");

  return sanitize(updated);
}
