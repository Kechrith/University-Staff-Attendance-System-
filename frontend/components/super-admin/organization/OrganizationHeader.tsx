"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrganizationHeaderProps {
  onAddClass: (className: string) => Promise<void>;
}

/** Hero section at the top of the Super Admin Organization page, with the "Add Unit" class-creation dialog. */
export function OrganizationHeader({ onAddClass }: OrganizationHeaderProps) {
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const trimmed = className.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onAddClass(trimmed);
      toast.success("Class added", { description: `${trimmed} was added under Data Science and Engineering.` });
      setClassName("");
      setOpen(false);
    } catch {
      toast.error("Couldn't add the class", { description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Organization</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage faculties, departments, centers, and classes.</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <Button>
              <FolderPlus className="size-4" /> Add Unit
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>Create a new class under the Department of Data Science and Engineering.</DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <Label htmlFor="new-class-name">Class name</Label>
            <Input
              id="new-class-name"
              placeholder="e.g. DSE-401 Capstone Project"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!className.trim() || submitting}>
              {submitting ? "Adding…" : "Add Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
