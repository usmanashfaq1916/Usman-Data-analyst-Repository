import { prisma } from "@/lib/db";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export default async function FAQsPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  const categories = [...new Set(faqs.map((f) => f.category))];

  if (faqs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Frequently Asked Questions</h1>
          <p className="mt-1 text-muted-foreground">
            Find answers to common questions about university admissions.
          </p>
        </div>
        <EmptyState
          title="No FAQs available"
          description="Check back later for updates."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Frequently Asked Questions</h1>
        <p className="mt-1 text-gray-600">
          Find answers to common questions about university admissions.
        </p>
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="flex-wrap">
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-4">
            <Accordion type="single" collapsible className="w-full">
              {faqs
                .filter((f) => f.category === cat)
                .map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
