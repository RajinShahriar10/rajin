"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function AdminSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams?.get("q") ?? "");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = value.trim();
    router.push(
      query
        ? `/admin/search?q=${encodeURIComponent(query)}`
        : "/admin/search",
    );
  }

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="relative"
      aria-label="Search admin"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search admin…"
        className="h-9 w-40 rounded-md border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 sm:w-56 lg:w-72"
        aria-label="Search"
      />
    </form>
  );
}
