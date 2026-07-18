import { prisma } from "@/lib/db";
import { Star } from "lucide-react";

export async function TestimonialSection() {
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    take: 3,
    include: { user: { select: { name: true } }, university: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (reviews.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">What Students Say</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-gray-300"}`}
                />
              ))}
            </div>
            {review.title && (
              <h3 className="mt-2 text-sm font-semibold text-foreground">{review.title}</h3>
            )}
            {review.content && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{review.content}</p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              — {review.user.name || "Anonymous"} on {review.university.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
