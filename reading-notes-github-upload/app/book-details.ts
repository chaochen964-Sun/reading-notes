// Match saved book identities first; equal real ISBNs can join duplicate entries.
export function sameBook(record: any, entry: any, books: any[]) {
  const entryId = entry.book_id || entry.id;
  const recordId = record.book_id || record.id;
  if (recordId && entryId && recordId === entryId) return true;
  const isbn = (value: unknown) => String(value || "").replace(/[\s-]/g, "");
  const a = isbn(record.isbn || books.find((book) => book.id === recordId)?.isbn);
  const b = isbn(entry.isbn);
  return /^\d{9}[\dX]$|^\d{13}$/.test(a) && a === b;
}

export function bookNotes(board: { books: any[]; notes: any[]; publicNotes: any[]; groupNotes: any[] }, entry: any) {
  const notes = new Map<string, any>();
  for (const [items, kind] of [[board.publicNotes || [], "public"], [board.notes || [], "personal"], [board.groupNotes || [], "group"]] as const) {
    for (const note of items) {
      if (sameBook(note, entry, board.books)) notes.set(note.id, { ...note, kind });
    }
  }
  return [...notes.values()].sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
}
