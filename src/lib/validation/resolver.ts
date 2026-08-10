import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export function zr<T extends FieldValues>(schema: ZodType): Resolver<T> {
  return zodResolver(schema as never) as Resolver<T>;
}
