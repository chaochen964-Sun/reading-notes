import { getConnectionString, getDatabase } from "@netlify/database";

export type Row = Record<string, unknown>;

// Both driver variants `getDatabase()` can return expose a node-postgres style
// `query(text, values)`; this is the only part of either pool we use.
type PoolLike = {
  query<T>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
};

let pool: PoolLike | undefined;

function getPool(): PoolLike {
  pool ??= getDatabase().pool as unknown as PoolLike;
  return pool;
}

/**
 * True when Netlify has provisioned a database for this deploy. The API routes
 * degrade to a "not connected yet" response instead of throwing when it hasn't.
 */
export function isDatabaseConfigured(): boolean {
  try {
    return Boolean(getConnectionString());
  } catch {
    return false;
  }
}

/**
 * Rewrites SQLite/D1 `?` placeholders into the `$1`, `$2`, … form Postgres
 * expects, leaving anything inside a quoted literal untouched.
 */
function toPositionalPlaceholders(sql: string): string {
  let text = "";
  let placeholder = 0;
  let inLiteral = false;

  for (const character of sql) {
    if (character === "'") inLiteral = !inLiteral;
    text += !inLiteral && character === "?" ? `$${++placeholder}` : character;
  }

  return text;
}

class Statement {
  constructor(
    private readonly text: string,
    private readonly values: unknown[] = [],
  ) {}

  bind(...values: unknown[]): Statement {
    return new Statement(this.text, values);
  }

  async run(): Promise<void> {
    await getPool().query(this.text, this.values);
  }

  async first<T = Row>(): Promise<T | null> {
    const { rows } = await getPool().query<T>(this.text, this.values);
    return rows[0] ?? null;
  }

  async all<T = Row>(): Promise<{ results: T[] }> {
    const { rows } = await getPool().query<T>(this.text, this.values);
    return { results: rows };
  }
}

/**
 * Netlify Database accessed through the same `prepare().bind().run()` surface the
 * routes were originally written against, so the queries stay readable as SQL.
 */
export const db = {
  prepare(sql: string): Statement {
    return new Statement(toPositionalPlaceholders(sql));
  },
};
