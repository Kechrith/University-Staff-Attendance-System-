"use client";

import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { LeaveRequest } from "@/types";

interface LeaveCardProps {
  request: LeaveRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function LeaveCard({ request, onApprove, onReject }: LeaveCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <Avatar className="size-10">
          <AvatarImage src={request.avatar} alt={request.staffName} />
          <AvatarFallback>{request.staffName.slice(0, 2)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{request.staffName}</p>
          <p className="text-xs text-muted-foreground">
            {request.position} · {request.duration}
          </p>

          <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs italic text-muted-foreground">“{request.reason}”</p>

          <div className="mt-3 flex gap-2">
            <Button size="sm" className="flex-1" onClick={() => onApprove?.(request.id)}>
              Approve
            </Button>
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onReject?.(request.id)}>
              Reject
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
