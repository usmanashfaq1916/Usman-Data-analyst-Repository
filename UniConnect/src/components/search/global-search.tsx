"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, GraduationCap, BookOpen, MapPin, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { searchSuggestions, type SearchResults } from "@/actions/search";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const data = await searchSuggestions(q);
      setResults(data);
      setOpen(true);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, handleSearch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/universities?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  function totalResults() {
    if (!results) return 0;
    return results.universities.length + results.programs.length + results.cities.length + results.disciplines.length;
  }

  return (
    <div ref={ref} className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by university, degree, city, province, discipline..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results && totalResults() > 0) setOpen(true); }}
          className="h-12 pl-10 pr-4 text-base shadow-sm"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Search universities and programs"
        />
      </form>

      {open && results && totalResults() > 0 && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-border bg-card shadow-xl"
          role="listbox"
        >
          {results.universities.length > 0 && (
            <Section label="Universities" icon={GraduationCap}>
              {results.universities.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { router.push(`/universities/${u.slug}`); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent"
                  role="option"
                  aria-label={`University: ${u.name}`}
                >
                  <GraduationCap className="h-4 w-4 shrink-0 text-secondary" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.subtitle}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </Section>
          )}

          {results.programs.length > 0 && (
            <Section label="Programs" icon={BookOpen}>
              {results.programs.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { router.push(`/universities?q=${encodeURIComponent(p.name)}`); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent"
                  role="option"
                  aria-label={`Program: ${p.name}`}
                >
                  <BookOpen className="h-4 w-4 shrink-0 text-success" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.subtitle}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </Section>
          )}

          {results.cities.length > 0 && (
            <Section label="Cities" icon={MapPin}>
              {results.cities.map((c) => (
                <button
                  key={c.name}
                  onClick={() => { router.push(`/universities?city=${encodeURIComponent(c.name)}`); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent"
                  role="option"
                  aria-label={`City: ${c.name}`}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-warning" />
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <ArrowRight className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </Section>
          )}

          {results.disciplines.length > 0 && (
            <Section label="Disciplines" icon={Layers}>
              {results.disciplines.map((d) => (
                <button
                  key={d.name}
                  onClick={() => { router.push(`/universities?q=${encodeURIComponent(d.name)}`); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent"
                  role="option"
                  aria-label={`Discipline: ${d.name}`}
                >
                  <Layers className="h-4 w-4 shrink-0 text-purple-500" />
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  <ArrowRight className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </Section>
          )}

          <button
            onClick={() => { router.push(`/universities?q=${encodeURIComponent(query)}`); setOpen(false); }}
            className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm font-medium text-secondary hover:bg-accent"
            role="option"
            aria-label="View all results"
          >
            <Search className="h-4 w-4" />
            View all results for &ldquo;{query}&rdquo;
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
        </div>
      )}
    </div>
  );
}

function Section({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      {children}
    </div>
  );
}
