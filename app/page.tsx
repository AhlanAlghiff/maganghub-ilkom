"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { parseCSVText } from "@/lib/parseCSV";
import { JobListing, SortField, SortOrder } from "@/lib/types";
import {
  Search,
  MapPin,
  Building2,
  Users,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  X,
  Briefcase,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
} from "lucide-react";

const ITEMS_PER_PAGE = 24;

const KATEGORI_LIST = ["Semua", "Engineering", "Data", "AI/ML", "Security", "QA", "Design", "IT Support", "Business/Analyst", "Lainnya"];

function getBadgeClass(kategori: string) {
  const map: Record<string, string> = {
    Engineering: "badge-engineering",
    Data: "badge-data",
    "AI/ML": "badge-ai",
    Security: "badge-security",
    Design: "badge-design",
    QA: "badge-qa",
    "IT Support": "badge-support",
    "Business/Analyst": "badge-business",
    Lainnya: "badge-other",
  };
  return map[kategori] || "badge-other";
}

function JobCard({ job }: { job: JobListing }) {
  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="job-card"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            marginBottom: "4px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}>
            {job.posisi}
          </h3>
        </div>
        <span className={`badge ${getBadgeClass(job.kategori)}`} style={{
          fontSize: "11px",
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>
          {job.kategori}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px" }}>
          <Building2 size={14} strokeWidth={2} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.namaPerusahaan}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px" }}>
          <MapPin size={14} strokeWidth={2} style={{ color: "#22d3ee", flexShrink: 0 }} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.lokasi}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px" }}>
          <Calendar size={14} strokeWidth={2} style={{ color: "#4ade80", flexShrink: 0 }} />
          <span>Libur: {job.hariLibur || "Tidak disebutkan"}</span>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Users size={14} style={{ color: "var(--text-muted)" }} />
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
            {job.kuota} kuota tersedia
          </span>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          color: "var(--accent)",
          fontSize: "12px",
          fontWeight: 600,
        }}>
          Lamar <ExternalLink size={12} />
        </div>
      </div>
    </a>
  );
}

function Skeleton() {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "20px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
        <div className="skeleton" style={{ height: "20px", width: "60%", borderRadius: "6px" }} />
        <div className="skeleton" style={{ height: "20px", width: "70px", borderRadius: "6px" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "14px" }}>
        <div className="skeleton" style={{ height: "14px", width: "80%" }} />
        <div className="skeleton" style={{ height: "14px", width: "50%" }} />
        <div className="skeleton" style={{ height: "14px", width: "65%" }} />
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        <div className="skeleton" style={{ height: "14px", width: "40%" }} />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [allJobs, setAllJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [sortField, setSortField] = useState<SortField>("posisi");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [page, setPage] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Load CSV
  useEffect(() => {
    fetch("/lowongan.csv")
      .then((r) => r.text())
      .then((text) => {
        const jobs = parseCSVText(text);
        setAllJobs(jobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load CSV:", err);
        setLoading(false);
      });
  }, []);

  // Back to top visibility
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Unique locations
  const lokasiOptions = useMemo(() => {
    const set = new Set(allJobs.map((j) => j.lokasi));
    return ["Semua", ...Array.from(set).sort()];
  }, [allJobs]);

  // Stats
  const stats = useMemo(() => {
    const totalKuota = allJobs.reduce((s, j) => s + j.kuota, 0);
    const uniquePerusahaan = new Set(allJobs.map((j) => j.namaPerusahaan)).size;
    const uniqueLokasi = new Set(allJobs.map((j) => j.lokasi)).size;
    return { totalKuota, uniquePerusahaan, uniqueLokasi };
  }, [allJobs]);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = allJobs;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.posisi.toLowerCase().includes(q) ||
          j.namaPerusahaan.toLowerCase().includes(q) ||
          j.lokasi.toLowerCase().includes(q) ||
          j.programStudi.toLowerCase().includes(q)
      );
    }

    if (lokasi && lokasi !== "Semua") {
      result = result.filter((j) => j.lokasi === lokasi);
    }

    if (kategori !== "Semua") {
      result = result.filter((j) => j.kategori === kategori);
    }

    result = [...result].sort((a, b) => {
      let va: string | number = a[sortField];
      let vb: string | number = b[sortField];
      if (sortField === "kuota") {
        return sortOrder === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
      }
      return sortOrder === "asc"
        ? String(va).localeCompare(String(vb), "id")
        : String(vb).localeCompare(String(va), "id");
    });

    return result;
  }, [allJobs, search, lokasi, kategori, sortField, sortOrder]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const resetPage = useCallback(() => setPage(1), []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    resetPage();
  };

  const clearFilters = () => {
    setSearch("");
    setLokasi("");
    setKategori("Semua");
    setPage(1);
  };

  const hasActiveFilters = search || (lokasi && lokasi !== "Semua") || kategori !== "Semua";

  const SortIcon = ({ field }: { field: SortField }) => {
    if (field !== sortField) return <ArrowUpDown size={13} />;
    return sortOrder === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Pagination helper
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        background: "rgba(15, 17, 23, 0.9)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Briefcase size={18} color="white" />
              </div>
              <div>
                <h1 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  Lowongan Magang-Hub Khusus Prodi Ilmu Komputer
                </h1>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1 }}>Ilmu Komputer · maganghub.kemnaker.go.id</p>
              </div>
            </div>
            {!loading && (
              <div style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "6px 14px",
                borderRadius: "20px",
              }}>
                <span style={{ color: "var(--accent)", fontWeight: 700 }}>{filtered.length}</span> dari {allJobs.length} lowongan
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Stats */}
        {!loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}>
            <div className="stat-card">
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>
                {allJobs.length}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Total Lowongan</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>
                {stats.totalKuota}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Total Kuota</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>
                {stats.uniquePerusahaan}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Perusahaan</div>
            </div>
            <div className="stat-card">
              <div style={{ fontSize: "28px", fontWeight: 700, color: "#f0abfc", lineHeight: 1 }}>
                {stats.uniqueLokasi}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Kota / Kabupaten</div>
            </div>
          </div>
        )}

        {/* Category filter chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {KATEGORI_LIST.map((k) => (
            <button
              key={k}
              className={`tag-btn ${kategori === k ? "active" : ""}`}
              onClick={() => { setKategori(k); resetPage(); }}
            >
              {k}
            </button>
          ))}
        </div>

        {/* Search & Filter row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 280px", minWidth: "220px" }}>
            <Search size={16} style={{
              position: "absolute",
              left: "13px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }} />
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, lokasi, atau program studi..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              className="search-input"
              style={{ width: "100%", padding: "10px 13px 10px 40px", fontSize: "14px" }}
            />
            {search && (
              <button
                onClick={() => { setSearch(""); resetPage(); }}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  padding: "2px",
                  display: "flex",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Lokasi filter */}
          <div style={{ position: "relative", minWidth: "200px" }}>
            <MapPin size={15} style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
              pointerEvents: "none",
            }} />
            <select
              value={lokasi}
              onChange={(e) => { setLokasi(e.target.value); resetPage(); }}
              className="search-input"
              style={{ padding: "10px 12px 10px 36px", fontSize: "14px", width: "100%", appearance: "none", cursor: "pointer" }}
            >
              {lokasiOptions.map((l) => (
                <option key={l} value={l === "Semua" ? "" : l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort & active filter bar */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "5px" }}>
              <TrendingUp size={14} /> Urutkan:
            </span>
            {(["posisi", "namaPerusahaan", "lokasi", "kuota"] as SortField[]).map((f) => (
              <button
                key={f}
                className={`sort-btn ${sortField === f ? "active" : ""}`}
                onClick={() => handleSort(f)}
              >
                {f === "posisi" ? "Posisi" : f === "namaPerusahaan" ? "Perusahaan" : f === "lokasi" ? "Lokasi" : "Kuota"}
                <SortIcon field={f} />
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(248, 113, 113, 0.3)",
                background: "rgba(248, 113, 113, 0.1)",
                color: "#fca5a5",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              <X size={13} /> Reset Filter
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            {search && (
              <span className="filter-chip" onClick={() => { setSearch(""); resetPage(); }}>
                Keyword: &quot;{search}&quot; <X size={12} />
              </span>
            )}
            {lokasi && lokasi !== "Semua" && (
              <span className="filter-chip" onClick={() => { setLokasi(""); resetPage(); }}>
                <MapPin size={12} /> {lokasi} <X size={12} />
              </span>
            )}
            {kategori !== "Semua" && (
              <span className="filter-chip" onClick={() => { setKategori("Semua"); resetPage(); }}>
                <Filter size={12} /> {kategori} <X size={12} />
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
            gap: "16px",
          }}>
            {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 24px",
            color: "var(--text-muted)",
          }}>
            <Search size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>
              Tidak ada lowongan ditemukan
            </p>
            <p style={{ fontSize: "14px" }}>Coba ubah kata kunci atau filter yang kamu gunakan</p>
            <button
              onClick={clearFilters}
              style={{
                marginTop: "20px",
                padding: "10px 24px",
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}>
              {paginated.map((job) => (
                <JobCard key={`${job.id}-${job.posisi}`} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}>
                <button
                  className="page-btn"
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); scrollToTop(); }}
                  disabled={page === 1}
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <span key={`dot-${i}`} style={{ color: "var(--text-muted)", fontSize: "14px", padding: "0 4px" }}>…</span>
                  ) : (
                    <button
                      key={p}
                      className={`page-btn ${page === p ? "active" : ""}`}
                      onClick={() => { setPage(p as number); scrollToTop(); }}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  className="page-btn"
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); scrollToTop(); }}
                  disabled={page === totalPages}
                >
                  <ChevronRight size={16} />
                </button>

                <span style={{ fontSize: "13px", color: "var(--text-muted)", marginLeft: "8px" }}>
                  Hal. {page} / {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--border)",
          padding: "24px",
          textAlign: "center",
          marginTop: "48px",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Data bersumber dari{" "}
          <a
            href="https://maganghub.kemnaker.go.id"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent)", textDecoration: "none" }}
          >
            maganghub.kemnaker.go.id
          </a>
          {" "}· Dashboard Lowongan Ilmu Komputer
        </p>

        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
          © {new Date().getFullYear()} @ahlanalghiff. All rights reserved.
        </p>
      </footer>

      {/* Back to top */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} title="Kembali ke atas">
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
}
