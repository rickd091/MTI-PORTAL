import React from "react";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface Props {
  status: "pending" | "valid" | "invalid" | "expired";
  onStatusChange: (status: string) => void;
  notes?: string;
  onNotesChange?: (notes: string) => void;
}

export default function DocumentWorkflow({
  status,
  onStatusChange,
  notes = "",
  onNotesChange,
}: Props) {
  const statusConfig = {
    pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50" },
    valid: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    invalid: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    expired: { icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-50" },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${config.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <span className="font-medium capitalize">{status}</span>
          </div>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="valid">Valid</option>
            <option value="invalid">Invalid</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {onNotesChange && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
            placeholder="Add notes about this document..."
          />
        </div>
      )}
    </div>
  );
}
