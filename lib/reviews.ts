import "server-only";
import { db } from "./db";

export type Testimonial = { id: string; name: string; role: string | null; rating: number; quote: string };

// Never throws: the public pages still render if the database is unreachable.
export async function getTestimonials(site: "portfolio" | "booking"): Promise<Testimonial[]> {
  try {
    const rows = await db.review.findMany({
      where: { status: "approved", ...(site === "portfolio" ? { showOnPortfolio: true } : { showOnBooking: true }) },
      orderBy: { approvedAt: "desc" },
      take: 12,
    });
    return rows.map((r) => ({ id: r.id, name: r.name, role: r.role, rating: r.rating ?? 5, quote: r.quote ?? "" }));
  } catch (err) {
    console.error("[reviews] failed to load testimonials", err);
    return [];
  }
}
