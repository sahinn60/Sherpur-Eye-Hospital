import { prisma } from "../config/database";
import { Prisma } from "@prisma/client";

export type AuditAction =
  | "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE"
  | "LOGIN" | "LOGOUT" | "EXPORT" | "VIEW";

export type AuditModule =
  | "patient" | "appointment" | "prescription" | "visit"
  | "invoice" | "payment" | "employee" | "doctor"
  | "leave" | "attendance" | "surgery" | "inventory"
  | "cms" | "notice" | "news" | "gallery" | "service"
  | "user" | "auth" | "finance" | "billing";

export interface AuditContext {
  userId?:    string;
  userName?:  string;
  userRole?:  string;
  ipAddress?: string;
}

export function writeAudit(params: {
  ctx:          AuditContext;
  action:       AuditAction;
  module:       AuditModule;
  recordId?:    string;
  recordLabel?: string;
  meta?:        Record<string, unknown>;
}) {
  // Fire-and-forget — never throws, never blocks the main request
  // meta is serialised then escaped before being passed to Prisma.raw
  const metaRaw = params.meta
    ? Prisma.raw(`'${JSON.stringify(params.meta).replace(/'/g, "''")}'::jsonb`)
    : Prisma.raw("NULL");

  prisma.$executeRaw`
    INSERT INTO audit_logs
      ("id","userId","userName","userRole","action","module","recordId","recordLabel","meta","ipAddress","createdAt")
    VALUES (
      gen_random_uuid()::text,
      ${params.ctx.userId    ?? null},
      ${params.ctx.userName  ?? "System"},
      ${params.ctx.userRole  ?? ""},
      ${params.action},
      ${params.module},
      ${params.recordId      ?? null},
      ${params.recordLabel   ?? null},
      ${metaRaw},
      ${params.ctx.ipAddress ?? null},
      NOW()
    )
  `.catch(() => {/* silent — audit must never break the main request */});
}

export async function queryAuditLogs(query: {
  userId?:   string;
  module?:   string;
  action?:   string;
  search?:   string;
  dateFrom?: string;
  dateTo?:   string;
  page:      number;
  limit:     number;
}) {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (query.userId)  { conditions.push(`"userId" = $${idx++}`);     values.push(query.userId); }
  if (query.module)  { conditions.push(`"module" = $${idx++}`);     values.push(query.module); }
  if (query.action)  { conditions.push(`"action" = $${idx++}`);     values.push(query.action); }
  if (query.dateFrom){ conditions.push(`"createdAt" >= $${idx++}`); values.push(new Date(query.dateFrom)); }
  if (query.dateTo)  {
    const end = new Date(query.dateTo);
    end.setHours(23, 59, 59, 999);
    conditions.push(`"createdAt" <= $${idx++}`);
    values.push(end);
  }
  if (query.search) {
    // Each column reference needs its own parameter index
    const p = idx++;
    conditions.push(`("userName" ILIKE $${p} OR "recordLabel" ILIKE $${p} OR "module" ILIKE $${p})`);
    values.push(`%${query.search}%`);
  }

  const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  // LIMIT and OFFSET are integers — safe to interpolate directly
  const limit  = Math.min(Math.max(1, query.limit), 100);
  const offset = Math.max(0, (query.page - 1) * limit);

  const [countRows, rows] = await Promise.all([
    prisma.$queryRawUnsafe<[{ count: bigint }]>(
      `SELECT COUNT(*) as count FROM audit_logs ${where}`,
      ...values
    ),
    prisma.$queryRawUnsafe<any[]>(
      `SELECT id,"userId","userName","userRole","action","module","recordId","recordLabel","meta","ipAddress","createdAt"
       FROM audit_logs ${where}
       ORDER BY "createdAt" DESC
       LIMIT ${limit} OFFSET ${offset}`,
      ...values
    ),
  ]);

  const total = Number(countRows[0]?.count ?? 0);
  return {
    items:      rows,
    total,
    page:       query.page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAuditStats() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [totalRows, last30Rows, byModuleRows, byActionRows] = await Promise.all([
    prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM audit_logs`,
    prisma.$queryRaw<[{ count: bigint }]>`SELECT COUNT(*) as count FROM audit_logs WHERE "createdAt" >= ${since}`,
    prisma.$queryRaw<{ module: string; count: bigint }[]>`
      SELECT module, COUNT(*) as count FROM audit_logs
      GROUP BY module ORDER BY count DESC LIMIT 8`,
    prisma.$queryRaw<{ action: string; count: bigint }[]>`
      SELECT action, COUNT(*) as count FROM audit_logs
      GROUP BY action ORDER BY count DESC`,
  ]);

  return {
    total:      Number(totalRows[0]?.count  ?? 0),
    last30Days: Number(last30Rows[0]?.count ?? 0),
    byModule:   byModuleRows.map((r) => ({ module: r.module, count: Number(r.count) })),
    byAction:   byActionRows.map((r) => ({ action: r.action, count: Number(r.count) })),
  };
}
