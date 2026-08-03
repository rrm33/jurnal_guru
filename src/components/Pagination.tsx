import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white border-t border-natural-border">
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">Tampilkan</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(Number(e.target.value));
            onPageChange(1);
          }}
          className="bg-natural-bg border border-natural-border rounded-lg px-2 py-1 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-natural-sage cursor-pointer"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-xs text-slate-500">baris</span>
      </div>

      <div className="text-xs text-slate-500 text-center flex-1">
        Menampilkan <span className="font-bold text-natural-dark">{startItem}-{endItem}</span> dari <span className="font-bold text-natural-dark">{totalItems}</span> data
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-natural-border text-slate-500 disabled:opacity-50 disabled:bg-slate-50 hover:bg-natural-bg transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="px-3 py-1 bg-natural-bg rounded-lg border border-natural-border text-xs font-bold text-natural-dark">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-1.5 rounded-lg border border-natural-border text-slate-500 disabled:opacity-50 disabled:bg-slate-50 hover:bg-natural-bg transition-colors cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
