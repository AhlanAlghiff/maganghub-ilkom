import { JobListing } from "./types";

function getKategori(posisi: string): string {
  const lower = posisi.toLowerCase();
  if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("automation")) return "AI/ML";
  if (lower.includes("security") || lower.includes("cyber") || lower.includes("red team")) return "Security";
  if (lower.includes("data")) return "Data";
  if (lower.includes("design") || lower.includes("ui") || lower.includes("ux")) return "Design";
  if (
    lower.includes("developer") ||
    lower.includes("engineer") ||
    lower.includes("programmer") ||
    lower.includes("fullstack") ||
    lower.includes("frontend") ||
    lower.includes("backend") ||
    lower.includes("flutter") ||
    lower.includes("software")
  )
    return "Engineering";
  if (lower.includes("quality assurance") || lower.includes(" qa") || lower.startsWith("qa")) return "QA";
  if (lower.includes("it support") || lower.includes("technical support") || lower.includes("helpdesk")) return "IT Support";
  if (
    lower.includes("analyst") ||
    lower.includes("business") ||
    lower.includes("product manager") ||
    lower.includes("manager")
  )
    return "Business/Analyst";
  return "Lainnya";
}

function parseKuota(kuotaStr: string): number {
  const match = kuotaStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 1;
}

export function parseCSVText(csvText: string): JobListing[] {
  const lines = csvText.trim().split("\n");
  const results: JobListing[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Manual CSV parse to handle quoted fields with commas
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length < 9) continue;

    const [idStr, posisi, namaPerusahaan, lokasi, kuotaStr, tunjangan, programStudi, hariLibur, url] = fields;

    const id = parseInt(idStr);
    if (isNaN(id) || !posisi) continue;

    results.push({
      id,
      posisi: posisi.replace(/^"|"$/g, ""),
      namaPerusahaan: namaPerusahaan.replace(/^"|"$/g, ""),
      lokasi: lokasi.replace(/^"|"$/g, ""),
      kuota: parseKuota(kuotaStr),
      tunjangan: tunjangan.replace(/^"|"$/g, ""),
      programStudi: programStudi.replace(/^"|"$/g, ""),
      hariLibur: hariLibur.replace(/^"|"$/g, ""),
      url: url.replace(/^"|"$/g, ""),
      kategori: getKategori(posisi),
    });
  }

  return results;
}
