import { DataTableShell } from "@/components/admin/data-table-shell";

type Column<T> = {
  key: string;
  header: string;
  cell: (item: T) => React.ReactNode;
  className?: string;
  searchable?: boolean;
  searchValue?: (item: T) => string;
};

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
}: {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  emptyMessage?: string;
}) {
  const headers = columns.map(({ key, header, className }) => ({ key, header, className }));

  const rows = data.map((item) => ({
    id: item.id,
    searchText: columns
      .filter((col) => col.searchable)
      .map((col) => (col.searchValue ? col.searchValue(item) : String(col.cell(item) ?? "")))
      .join(" ")
      .toLowerCase(),
    cells: columns.map((col) => col.cell(item)),
  }));

  return (
    <DataTableShell
      columns={headers}
      rows={rows}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={emptyMessage}
    />
  );
}
