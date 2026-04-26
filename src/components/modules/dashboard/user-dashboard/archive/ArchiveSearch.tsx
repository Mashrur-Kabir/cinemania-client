"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function ArchiveSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultSearch = searchParams.get("searchTerm") || "";

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;

    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("searchTerm", search);
    } else {
      params.delete("searchTerm");
    }
    params.set("page", "1"); // Reset to page 1 on new search

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-rose-500/40" />
      <input
        name="search"
        defaultValue={defaultSearch}
        placeholder="Search quarantined media by title..."
        className="w-full pl-12 pr-4 py-3 bg-rose-500/[0.02] border border-rose-500/20 rounded-2xl text-[11px] font-black tracking-widest uppercase text-white focus:outline-none focus:border-rose-500/50 transition-colors placeholder:text-rose-500/20"
      />
    </form>
  );
}
