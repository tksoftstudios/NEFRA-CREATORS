import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FileText, ShieldCheck } from 'lucide-react';

export function AdminAuditLog({ auditLogs = [] }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#27272a] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#fafafa]">
            Administrative audit log
          </h1>
          <p className="text-xs text-[#a1a1aa] mt-1">
            Immutable, append-only record of all administrative overrides, dispute arbitrations, and fee adjustments.
          </p>
        </div>
        <Badge variant="outline">Append-Only</Badge>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#18181b] border-b border-[#27272a] text-[#a1a1aa] uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Administrator</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target / Justification</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] text-[#fafafa]">
              {auditLogs.map((log, idx) => (
                <tr key={log.id || idx} className="hover:bg-[#18181b]/40 transition-colors">
                  <td className="p-3 text-[#71717a] font-mono">{log.id}</td>
                  <td className="p-3 font-semibold">{log.admin}</td>
                  <td className="p-3">
                    <Badge variant="action">{log.action}</Badge>
                  </td>
                  <td className="p-3 text-[#a1a1aa]">{log.target}</td>
                  <td className="p-3 text-[#71717a]">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
