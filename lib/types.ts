export interface JobListing {
  id: number;
  posisi: string;
  namaPerusahaan: string;
  lokasi: string;
  kuota: number;
  tunjangan: string;
  programStudi: string;
  hariLibur: string;
  url: string;
  kategori: string;
}

export type SortField = "posisi" | "namaPerusahaan" | "lokasi" | "kuota";
export type SortOrder = "asc" | "desc";

export interface FilterState {
  search: string;
  lokasi: string;
  kategori: string;
  sortField: SortField;
  sortOrder: SortOrder;
  page: number;
}
