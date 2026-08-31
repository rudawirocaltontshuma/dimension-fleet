"use client";

import { useState } from "react";

import { Eye, FileText } from "lucide-react";

import { PageHeader } from "@/components/nexora/page-header";
import { StatusBadge } from "@/components/nexora/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/nexora/format";
import { DOCUMENTS } from "@/lib/nexora/generate";
import type { DocumentRecord } from "@/lib/nexora/types";

const CATEGORIES = [
  "Registration",
  "Insurance",
  "Inspection",
  "Maintenance",
  "Driver Documents",
  "Delivery Documents",
] as const;

export default function DocumentsPage() {
  const [active, setActive] = useState<DocumentRecord | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="Documents" description={`${DOCUMENTS.length} documents across the fleet document center.`} />

      <Tabs defaultValue={CATEGORIES[0]}>
        <TabsList className="flex-wrap">
          {CATEGORIES.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        {CATEGORIES.map((c) => {
          const docs = DOCUMENTS.filter((d) => d.category === c);
          return (
            <TabsContent key={c} value={c} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-medium text-sm">
                    {c} ({docs.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col divide-y">
                  {docs.map((d) => (
                    <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-sm">{d.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Issued {fmtDate(d.issueDate)} • Expires {fmtDate(d.expiryDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge status={d.status} />
                        <Button variant="outline" size="sm" onClick={() => setActive(d)}>
                          <Eye /> View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {docs.length === 0 && (
                    <p className="py-8 text-center text-muted-foreground text-sm">No documents in this category.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <Dialog open={!!active} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{active?.name}</DialogTitle>
            <DialogDescription>
              {active?.category} document — related to {active?.relatedLabel}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 rounded-lg border bg-muted/30 p-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Issue Date</span>
              <span>{active && fmtDate(active.issueDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expiry Date</span>
              <span>{active && fmtDate(active.expiryDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              {active && <StatusBadge status={active.status} />}
            </div>
            <div className="mt-2 flex h-40 items-center justify-center rounded-md border border-dashed text-muted-foreground text-xs">
              Document preview placeholder — no file storage in this demo.
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
