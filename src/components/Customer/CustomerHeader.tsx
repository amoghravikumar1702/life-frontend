"use client";

import Link from "next/link";
import { Filter, Plus } from "lucide-react";

import PageHeader from "@/components/ui/PageHeader";
import SearchInput from "@/components/ui/SearchInput";
import IconButton from "@/components/ui/IconButton";

interface CustomerHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function CustomerHeader({
  search,
  onSearchChange,
}: CustomerHeaderProps) {
  return (
    <PageHeader
      title="Customers"
      subtitle="Manage your executive client portfolio."
      actions={
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
          <div className="w-full sm:w-80">
            <SearchInput
              value={search}
              onChange={onSearchChange}
              placeholder="Search customers..."
            />
          </div>

          <IconButton
            icon={<Filter size={18} />}
            ariaLabel="Filter customers"
            title="Filter"
          />

          <Link
            href="/customers/new"
            className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37] px-5 text-sm font-semibold text-[#090909] transition-all duration-200 hover:scale-[1.02] hover:brightness-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Customer
          </Link>
        </div>
      }
    />
  );
}