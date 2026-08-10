"use client";

import { toast } from "sonner";
import { useCallback, useState } from "react";

export type ActionResult = { ok: true } | { ok: false; error: string };

export function useServerAction() {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (fn: () => Promise<ActionResult>, opts?: { success?: string; onSuccess?: () => void }) => {
      setPending(true);
      try {
        const res = await fn();
        if (!res.ok) {
          toast.error(res.error);
          return false;
        }
        toast.success(opts?.success ?? "Saved.");
        opts?.onSuccess?.();
        return true;
      } catch {
        toast.error("Something went wrong.");
        return false;
      } finally {
        setPending(false);
      }
    },
    [],
  );

  return { pending, run };
}
