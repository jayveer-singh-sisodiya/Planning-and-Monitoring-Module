"use client";

import { Table } from "@/app/components/ui/table";

export function DataTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-auto rounded-md border">
      <Table>{children}</Table>
    </div>
  );
}
