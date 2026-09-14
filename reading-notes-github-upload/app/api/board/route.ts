import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { books, cycles, groupNotes, libraryEntries, nominees, personalNotes, suppressedNominees } from "@/db/schema";

type BookInput = { isbn: string; title: string; authors?: string; publisher?: string; publishedDate?: string; coverUrl?: string; podcastUrl?: string; chapters?: string[] };

const id = () => crypto.randomUUID();
const now = () => Date.now();

const cycleBooks: BookInput[] = [
  { isbn: "9787532180011", title: "吞下宇宙的男孩", publisher: "上海文艺出版社（果麦）" },
  { isbn: "9787532777532", title: "长日将尽", publisher: "上海译文出版社（冯涛译）" },
  { isbn: "9787532762897", title: "小径分岔的花园", publisher: "上海译文出版社（王永年译）" },
  { isbn: "9787201134598", title: "罗生门", publisher: "天津人民出版社（高慧勤译，果麦出品）" },
  { isbn: "9787544736541", title: "彼时此刻：马基雅维利在伊莫拉", publisher: "译林出版社" },
  { isbn: "9787508672717", title: "人生复本", publisher: "中信出版社（布莱克·克劳奇）" },
  { isbn: "9787532791620", title: "一个人的房间", publisher: "上海译文出版社（瞿世镜译）" },
  { isbn: "9789579001847", title: "你不爽，为什么不明说？", publisher: "橡实文化（繁体主流）" },
  { isbn: "9787532759538", title: "金阁寺", publisher: "上海译文出版社（唐月梅译）" },
  { isbn: "9787554605424", title: "人性的弱点", publisher: "古吴轩出版社（完整全译本）" },
  { isbn: "9787532752393", title: "1984", publisher: "上海译文出版社（董乐山译）" },
  { isbn: "9787544722278", title: "看不见的城市", publisher: "译林出版社（张密译）" },
  { isbn: "9787544292597", title: "献给阿尔吉侬的花束", publisher: "南海出版公司" },
  { isbn: "9787020122349", title: "马丁·伊登", publisher: "人民文学出版社" },
  { isbn: "9787020104598", title: "大师与玛格丽特", publisher: "人民文学出版社" },
  { isbn: "9787544294010", title: "The Silent Patient（《无声的病人》）", publisher: "南海出版公司" },
  { isbn: "9787532774986", title: "公羊的节日", publisher: "上海译文出版社" },
  { isbn: "9787544291309", title: "一桩事先张扬的凶杀案", publisher: "南海出版公司" },
  { isbn: "9787544768917", title: "树上的男爵", publisher: "译林出版社" },
  { isbn: "9787020126781", title: "象棋的故事", publisher: "人民文学出版社" },
  { isbn: "9787532778205", title: "宠物公墓", publisher: "上海译文出版社" },
  { isbn: "9787532779996", title: "未来学大会", publisher: "上海译文出版社" },
  { isbn: "9787020162347", title: "没有墓碑的草原", publisher: "人民文学出版社" },
  { isbn: "9787559648655", title: "鱼不存在", publisher: "北京联合出版公司" },
  { isbn: "manual-cycle-25", title: "特辑《佛教艺术赏析》", publisher: "非单一图书，多为专题/画册，无统一ISBN" },
  { isbn: "9787544775122", title: "作家城堡", publisher: "译林出版社（卡尔维诺相关）" },
  { isbn: "9787115545084", title: "第一性原理", publisher: "人民邮电出版社" },
  { isbn: "9787530215995", title: "台北人", publisher: "北京十月文艺出版社" },
  { isbn: "9787020104666", title: "卡拉马佐夫兄弟", authors: "〔俄〕陀思妥耶夫斯基", publisher: "人民文学出版社" },
  { isbn: "9787020122356", title: "包法利夫人", publisher: "人民文学出版社" },
  { isbn: "9787111555377", title: "当尼采哭泣", authors: "〔美〕欧文·亚隆｜侯维之 译", publisher: "机械工业出版社" },
];

const cycleCatalog = cycleBooks.map((book) => book.title);
const previousCycleTitles = [
  "吞下宇宙的男孩",
  "长日将尽",
  "小径分岔的花园",
  "罗生门",
  "彼时此刻:马基雅维利在伊莫拉",
  "人生复本",
  "一个人的房间",
  "你不爽，为什么不明说？",
  "金阁寺",
  "人性的弱点",
  "1984",
  "看不见的城市",
  "献给阿尔吉侬的花束",
  "马丁·伊登",
  "大师与玛格丽特",
  "The Silent Patient",
  "公羊的节日",
  "一桩事先张扬的凶杀案",
  "树上的男爵",
  "象棋的故事",
  "宠物公墓",
  "未来学大会",
  "没有墓碑的草原",
  "鱼不存在",
  "特辑《佛教艺术赏析》",
  "作家城堡",
  "第一性原理",
  "台北人",
  "卡拉马佐夫兄弟",
  "包法利夫人",
  "当尼采哭泣",
];

const currentCycleBooks: BookInput[] = [
  { isbn: "9786269673384", title: "家弒服務", authors: "", publisher: "寂寞出版（繁体，最畅销）", publishedDate: "", coverUrl: "", chapters: [] },
  { isbn: "9787111555377", title: "当尼采哭泣", authors: "〔美〕欧文·亚隆｜侯维之 译", publisher: "机械工业出版社（2017版）", publishedDate: "2017-03-01", coverUrl: "", chapters: [] },
  { isbn: "9787559848048", title: "可能性的艺术", authors: "", publisher: "广西师范大学出版社", publishedDate: "", coverUrl: "", chapters: [] },
  { isbn: "9787553522685", title: "我们为什么会受骗", authors: "", publisher: "上海文化出版社", publishedDate: "", coverUrl: "", chapters: [] },
  { isbn: "9787208136779", title: "查拉图斯特拉如是说", authors: "〔德〕尼采｜孙周兴 译", publisher: "上海人民出版社（孙周兴译）", publishedDate: "", coverUrl: "", chapters: [] },
  { isbn: "9787559675583", title: "语言恶女", authors: "", publisher: "北京联合出版公司", publishedDate: "", coverUrl: "", chapters: [] },
];

function catalogLabel(index: number) {
  return `第 ${String(index + 1).padStart(2, "0")} 期`;
}

async function upsertBook(book: BookInput, options: { preserveExisting?: boolean } = {}) {
  const cleanIsbn = normalizeIsbn(book.isbn);
  const [existing] = await db.select({ id: books.id }).from(books).where(eq(books.isbn, cleanIsbn)).limit(1);
  const bookId = existing?.id || id();

  // `preserveExisting` keeps whatever a member has already filled in by hand and only
  // fills the blanks, so re-seeding the catalogue never overwrites their edits.
  const set = options.preserveExisting
    ? {
        title: sql`excluded.title`,
        authors: sql`CASE WHEN ${books.authors} = '' THEN excluded.authors ELSE ${books.authors} END`,
        publisher: sql`CASE WHEN ${books.publisher} = '' THEN excluded.publisher ELSE ${books.publisher} END`,
        publishedDate: sql`CASE WHEN ${books.publishedDate} = '' THEN excluded.published_date ELSE ${books.publishedDate} END`,
        coverUrl: sql`CASE WHEN ${books.coverUrl} = '' THEN excluded.cover_url ELSE ${books.coverUrl} END`,
        podcastUrl: sql`CASE WHEN ${books.podcastUrl} = '' THEN excluded.podcast_url ELSE ${books.podcastUrl} END`,
        chaptersJson: sql`CASE WHEN ${books.chaptersJson} = '' OR ${books.chaptersJson} = '[]' THEN excluded.chapters_json ELSE ${books.chaptersJson} END`,
      }
    : {
        title: sql`excluded.title`,
        authors: sql`excluded.authors`,
        publisher: sql`excluded.publisher`,
        publishedDate: sql`excluded.published_date`,
        coverUrl: sql`excluded.cover_url`,
        podcastUrl: sql`excluded.podcast_url`,
        chaptersJson: sql`excluded.chapters_json`,
      };

  await db
    .insert(books)
    .values({
      id: bookId,
      isbn: cleanIsbn,
      title: book.title,
      authors: book.authors || "",
      publisher: book.publisher || "",
      publishedDate: book.publishedDate || "",
      coverUrl: book.coverUrl || "",
      podcastUrl: book.podcastUrl || "",
      chaptersJson: JSON.stringify(book.chapters || []),
      createdAt: now(),
    })
    .onConflictDoUpdate({ target: books.isbn, set });

  return bookId;
}

async function setCycleNominee(cycleId: string, bookId: string, title: string, note?: string) {
  const displayNote = note ?? `${title}（往期推荐）`;
  const [suppressed] = await db
    .select({ id: suppressedNominees.id })
    .from(suppressedNominees)
    .where(and(eq(suppressedNominees.cycleId, cycleId), eq(suppressedNominees.bookId, bookId)))
    .limit(1);
  if (suppressed?.id) return;

  const [existingNominee] = await db
    .select({ id: nominees.id })
    .from(nominees)
    .where(and(eq(nominees.cycleId, cycleId), eq(nominees.bookId, bookId)))
    .limit(1);

  if (existingNominee?.id) {
    if (note !== undefined) await db.update(nominees).set({ note: displayNote }).where(eq(nominees.id, existingNominee.id));
    return;
  }

  await db.insert(nominees).values({ id: id(), cycleId, bookId, createdAt: now(), note: displayNote });
}

function normalizeIsbn(rawIsbn: string) {
  const trimmed = rawIsbn.trim();
  return trimmed.startsWith("manual-") ? trimmed : trimmed.replace(/[^0-9Xx]/g, "") || `manual-${id()}`;
}

// The catalogue is fixed reference data, so a brand-new database can be filled with a
// handful of bulk inserts instead of the row-at-a-time path below. Ids are derived from
// the ISBN and期 number, which keeps the inserts idempotent and lets nominees reference
// books without a round trip. Doing this per row costs hundreds of queries, and against a
// remote database that is slow enough to run into the function timeout on the first visit.
async function seedFreshCatalog() {
  const seedStartedAt = now();

  const bookValues: (typeof books.$inferInsert)[] = [];
  const bookIdByIsbn = new Map<string, string>();

  function addBook(book: BookInput) {
    const isbn = normalizeIsbn(book.isbn);
    const existingId = bookIdByIsbn.get(isbn);
    const incoming = {
      title: book.title,
      authors: book.authors || "",
      publisher: book.publisher || "",
      publishedDate: book.publishedDate || "",
      coverUrl: book.coverUrl || "",
      podcastUrl: book.podcastUrl || "",
      chaptersJson: JSON.stringify(book.chapters || []),
    };

    if (existingId) {
      // 当尼采哭泣 appears both as第 31 期's book and in本期's recommendations. Merge so
      // whichever entry carries the fuller record wins, field by field.
      const current = bookValues.find((row) => row.id === existingId)!;
      current.authors = current.authors || incoming.authors;
      current.publisher = current.publisher || incoming.publisher;
      current.publishedDate = current.publishedDate || incoming.publishedDate;
      current.coverUrl = current.coverUrl || incoming.coverUrl;
      current.podcastUrl = current.podcastUrl || incoming.podcastUrl;
      if (current.chaptersJson === "[]") current.chaptersJson = incoming.chaptersJson;
      return existingId;
    }

    const bookId = `book-${isbn}`;
    bookIdByIsbn.set(isbn, bookId);
    bookValues.push({ id: bookId, isbn, createdAt: seedStartedAt, ...incoming });
    return bookId;
  }

  const cycleValues = cycleBooks.map((book, i) => {
    const bookId = addBook(book);
    return {
      id: `cycle-${String(i + 1).padStart(2, "0")}`,
      eyebrow: catalogLabel(i),
      title: book.title,
      selectedBookId: bookId,
      summary: "",
      isActive: i === cycleBooks.length - 1,
      // One increasing timestamp per期 keeps them in catalogue order, which is what the
      // page sorts on. Wall-clock time in a tight loop can repeat within a millisecond.
      createdAt: seedStartedAt + i,
    };
  });

  const currentCycle = cycleValues[cycleValues.length - 1];
  const nomineeValues: (typeof nominees.$inferInsert)[] = [];

  cycleValues.slice(0, -1).forEach((cycle, i) => {
    const book = cycleBooks[i];
    nomineeValues.push({
      id: `nominee-${cycle.id}-${cycle.selectedBookId}`,
      cycleId: cycle.id,
      bookId: cycle.selectedBookId,
      note: book.publisher || `${book.title}（往期推荐）`,
      createdAt: seedStartedAt + i,
    });
  });

  currentCycleBooks.forEach((book, i) => {
    const bookId = addBook(book);
    nomineeValues.push({
      id: `nominee-${currentCycle.id}-${bookId}`,
      cycleId: currentCycle.id,
      bookId,
      note: book.publisher || "本期推荐",
      createdAt: seedStartedAt + cycleValues.length + i,
    });
  });

  await db.insert(books).values(bookValues).onConflictDoNothing();
  await db.insert(cycles).values(cycleValues).onConflictDoNothing();
  await db.insert(nominees).values(nomineeValues).onConflictDoNothing();
}

async function seedFullCatalogIfNeeded(options: { force?: boolean } = {}) {
  const rows = await db
    .select({ id: cycles.id, title: cycles.title, eyebrow: cycles.eyebrow, selectedBookId: cycles.selectedBookId })
    .from(cycles);

  // Seeding touches every期 and every book, so skip it once the catalogue is complete.
  // The `seedHistory` action can still force a repair pass.
  if (!options.force && rows.length >= cycleCatalog.length) return;

  if (rows.length === 0) {
    await seedFreshCatalog();
    return;
  }

  const rowsByEyebrow = new Map(rows.map((c) => [c.eyebrow.trim(), c] as const));
  const rowsByTitle = new Map(rows.map((c) => [c.title.trim(), c] as const));
  let reusableLegacyRow = rows.length === 1 && !rowsByEyebrow.has(catalogLabel(0)) ? rows[0] : null;

  // One increasing timestamp per期 keeps the cycles in catalogue order, which is what
  // the page sorts on. Wall-clock time in a tight loop can repeat within a millisecond.
  const seedStartedAt = now();

  let currentCycleId = "";
  let currentFallbackBookId = "";

  for (let i = 0; i < cycleCatalog.length; i++) {
    const book = cycleBooks[i];
    const title = book.title;
    const previousTitle = previousCycleTitles[i] || title;
    const eyebrow = catalogLabel(i);
    const isLatest = i === cycleCatalog.length - 1;
    const bookId = await upsertBook({ authors: "", publishedDate: "", coverUrl: "", podcastUrl: "", chapters: [], ...book }, { preserveExisting: true });
    const [oldManualBook] = await db.select({ id: books.id }).from(books).where(eq(books.isbn, `manual-cycle-${i + 1}`)).limit(1);
    const existingCycle = rowsByEyebrow.get(eyebrow) || rowsByTitle.get(title) || reusableLegacyRow;
    reusableLegacyRow = null;

    if (existingCycle) {
      await db
        .update(cycles)
        .set({
          eyebrow,
          title: sql`CASE WHEN ${cycles.title} = '' OR ${cycles.title} = ${`manual-cycle-${i + 1}`} OR ${cycles.title} = ${previousTitle} THEN ${title} ELSE ${cycles.title} END`,
          selectedBookId: sql`CASE WHEN ${cycles.selectedBookId} IS NULL OR ${cycles.selectedBookId} = ${oldManualBook?.id || ""} THEN ${bookId} ELSE ${cycles.selectedBookId} END`,
          isActive: isLatest,
        })
        .where(eq(cycles.id, existingCycle.id));
      if (!isLatest) await setCycleNominee(existingCycle.id, bookId, title, book.publisher || `${title}（往期推荐）`);
      if (oldManualBook?.id && oldManualBook.id !== bookId) {
        await db.delete(nominees).where(and(eq(nominees.cycleId, existingCycle.id), eq(nominees.bookId, oldManualBook.id)));
      }
      if (isLatest) {
        currentCycleId = existingCycle.id;
        currentFallbackBookId = oldManualBook?.id || "";
      }
      continue;
    }

    const cycleId = id();
    await db.insert(cycles).values({ id: cycleId, eyebrow, title, selectedBookId: bookId, summary: "", isActive: isLatest, createdAt: seedStartedAt + i });
    if (!isLatest) await setCycleNominee(cycleId, bookId, title, book.publisher || `${title}（往期推荐）`);
    if (isLatest) {
      currentCycleId = cycleId;
      currentFallbackBookId = "";
    }
  }

  if (currentCycleId) {
    let selectedBookId = "";
    for (const book of currentCycleBooks) {
      const bookId = await upsertBook(book, { preserveExisting: true });
      await setCycleNominee(currentCycleId, bookId, book.title, book.publisher || "本期推荐");
      if (book.isbn === "9787111555377") selectedBookId = bookId;
    }

    const [selected] = await db.select({ selectedBookId: cycles.selectedBookId }).from(cycles).where(eq(cycles.id, currentCycleId)).limit(1);

    if (selectedBookId && (!selected?.selectedBookId || selected.selectedBookId === currentFallbackBookId)) {
      await db.update(cycles).set({ selectedBookId }).where(eq(cycles.id, currentCycleId));
    }

    if (currentFallbackBookId) {
      await db.delete(nominees).where(and(eq(nominees.cycleId, currentCycleId), eq(nominees.bookId, currentFallbackBookId)));
    }
  }

  // 把第 31 期设成当前期；用户之后仍可编辑这一期标题。
  const [latestRow] = await db.select({ id: cycles.id }).from(cycles).where(eq(cycles.eyebrow, catalogLabel(cycleCatalog.length - 1))).limit(1);
  if (latestRow?.id) {
    await db.update(cycles).set({ isActive: false });
    await db.update(cycles).set({ isActive: true }).where(eq(cycles.id, latestRow.id));
  }
}

function databaseErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "数据库暂时无法连接";
  return NextResponse.json({ error: message }, { status: 503 });
}

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId") || "";

  try {
    await seedFullCatalogIfNeeded();

    const [bookRows, libraryRows, noteRows, cycleRows, nomineeRows, groupNoteRows] = await Promise.all([
      db
        .select({
          id: books.id,
          isbn: books.isbn,
          title: books.title,
          authors: books.authors,
          publisher: books.publisher,
          published_date: books.publishedDate,
          cover_url: books.coverUrl,
          podcast_url: books.podcastUrl,
          chapters_json: books.chaptersJson,
          created_at: books.createdAt,
        })
        .from(books)
        .orderBy(desc(books.createdAt)),
      db
        .select({
          id: libraryEntries.id,
          device_id: libraryEntries.deviceId,
          display_name: libraryEntries.displayName,
          avatar: libraryEntries.avatar,
          book_id: libraryEntries.bookId,
          status: libraryEntries.status,
          progress: libraryEntries.progress,
          current_chapter: libraryEntries.currentChapter,
          reflection: libraryEntries.reflection,
          updated_at: libraryEntries.updatedAt,
          title: books.title,
          authors: books.authors,
          isbn: books.isbn,
          cover_url: books.coverUrl,
          podcast_url: books.podcastUrl,
          chapters_json: books.chaptersJson,
        })
        .from(libraryEntries)
        .innerJoin(books, eq(books.id, libraryEntries.bookId))
        .where(eq(libraryEntries.deviceId, deviceId))
        .orderBy(desc(libraryEntries.updatedAt)),
      db
        .select({
          id: personalNotes.id,
          device_id: personalNotes.deviceId,
          display_name: personalNotes.displayName,
          avatar: personalNotes.avatar,
          book_id: personalNotes.bookId,
          chapter: personalNotes.chapter,
          quote: personalNotes.quote,
          body: personalNotes.body,
          created_at: personalNotes.createdAt,
          title: books.title,
        })
        .from(personalNotes)
        .innerJoin(books, eq(books.id, personalNotes.bookId))
        .where(eq(personalNotes.deviceId, deviceId))
        .orderBy(desc(personalNotes.createdAt)),
      db
        .select({
          id: cycles.id,
          eyebrow: cycles.eyebrow,
          title: cycles.title,
          selected_book_id: cycles.selectedBookId,
          summary: cycles.summary,
          is_active: cycles.isActive,
          created_at: cycles.createdAt,
          selected_title: books.title,
          selected_authors: books.authors,
          selected_cover: books.coverUrl,
          selected_podcast: books.podcastUrl,
          selected_isbn: books.isbn,
          selected_chapters: books.chaptersJson,
        })
        .from(cycles)
        .leftJoin(books, eq(books.id, cycles.selectedBookId))
        .orderBy(desc(cycles.createdAt)),
      db
        .select({
          id: nominees.id,
          cycle_id: nominees.cycleId,
          book_id: nominees.bookId,
          note: nominees.note,
          created_at: nominees.createdAt,
          title: books.title,
          authors: books.authors,
          cover_url: books.coverUrl,
          podcast_url: books.podcastUrl,
          published_date: books.publishedDate,
          isbn: books.isbn,
          chapters_json: books.chaptersJson,
        })
        .from(nominees)
        .innerJoin(books, eq(books.id, nominees.bookId))
        .orderBy(desc(nominees.createdAt)),
      db
        .select({
          id: groupNotes.id,
          cycle_id: groupNotes.cycleId,
          book_id: groupNotes.bookId,
          device_id: groupNotes.deviceId,
          display_name: groupNotes.displayName,
          avatar: groupNotes.avatar,
          chapter: groupNotes.chapter,
          quote: groupNotes.quote,
          body: groupNotes.body,
          created_at: groupNotes.createdAt,
          title: books.title,
        })
        .from(groupNotes)
        .innerJoin(books, eq(books.id, groupNotes.bookId))
        .orderBy(desc(groupNotes.createdAt)),
    ]);

    return NextResponse.json({
      books: bookRows,
      library: libraryRows,
      notes: noteRows,
      cycles: cycleRows,
      nominees: nomineeRows,
      groupNotes: groupNoteRows,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  const data = (await request.json()) as Record<string, any>;

  try {
    if (data.action === "saveLibrary") {
      const bookId = await upsertBook(data.book);
      const [existing] = await db
        .select({ id: libraryEntries.id })
        .from(libraryEntries)
        .where(and(eq(libraryEntries.deviceId, data.profile.deviceId), eq(libraryEntries.bookId, bookId)))
        .limit(1);

      await db
        .insert(libraryEntries)
        .values({
          id: existing?.id || id(),
          deviceId: data.profile.deviceId,
          displayName: data.profile.name,
          avatar: data.profile.avatar,
          bookId,
          status: data.status || "reading",
          progress: Number(data.progress || 0),
          currentChapter: data.currentChapter || "",
          reflection: data.reflection || "",
          updatedAt: now(),
        })
        .onConflictDoUpdate({
          target: [libraryEntries.deviceId, libraryEntries.bookId],
          set: {
            displayName: sql`excluded.display_name`,
            avatar: sql`excluded.avatar`,
            status: sql`excluded.status`,
            progress: sql`excluded.progress`,
            currentChapter: sql`excluded.current_chapter`,
            reflection: sql`excluded.reflection`,
            updatedAt: sql`excluded.updated_at`,
          },
        });
    } else if (data.action === "personalNote") {
      await db.insert(personalNotes).values({
        id: id(),
        deviceId: data.profile.deviceId,
        displayName: data.profile.name,
        avatar: data.profile.avatar,
        bookId: data.bookId,
        chapter: data.chapter || "",
        quote: data.quote || "",
        body: data.body,
        createdAt: now(),
      });
    } else if (data.action === "groupNote") {
      await db.insert(groupNotes).values({
        id: id(),
        cycleId: data.cycleId,
        bookId: data.bookId,
        deviceId: data.profile.deviceId,
        displayName: data.profile.name,
        avatar: data.profile.avatar,
        chapter: data.chapter || "",
        quote: data.quote || "",
        body: data.body,
        createdAt: now(),
      });
    } else if (data.action === "nominate") {
      const bookId = await upsertBook(data.book);
      await db.insert(nominees).values({ id: id(), cycleId: data.cycleId, bookId, note: data.note || "", createdAt: now() });
      if (data.select) await db.update(cycles).set({ selectedBookId: bookId }).where(eq(cycles.id, data.cycleId));
    } else if (data.action === "updateNominee") {
      const [nominee] = await db
        .select({ bookId: nominees.bookId })
        .from(nominees)
        .where(and(eq(nominees.id, data.nomineeId), eq(nominees.cycleId, data.cycleId)))
        .limit(1);
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      const bookId = await upsertBook(data.book);
      const [selectedBook] = await db.select({ selectedBookId: cycles.selectedBookId }).from(cycles).where(eq(cycles.id, data.cycleId)).limit(1);

      await db
        .update(nominees)
        .set({ bookId, note: data.note || "" })
        .where(and(eq(nominees.id, data.nomineeId), eq(nominees.cycleId, data.cycleId)));

      if (data.select || nominee.bookId === selectedBook?.selectedBookId) {
        await db.update(cycles).set({ selectedBookId: bookId }).where(eq(cycles.id, data.cycleId));
      }
    } else if (data.action === "deleteNominee") {
      const [nominee] = await db
        .select({ bookId: nominees.bookId })
        .from(nominees)
        .where(and(eq(nominees.id, data.nomineeId), eq(nominees.cycleId, data.cycleId)))
        .limit(1);
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      await db
        .insert(suppressedNominees)
        .values({ id: id(), cycleId: data.cycleId, bookId: nominee.bookId, createdAt: now() })
        .onConflictDoNothing({ target: [suppressedNominees.cycleId, suppressedNominees.bookId] });
      await db.delete(nominees).where(and(eq(nominees.id, data.nomineeId), eq(nominees.cycleId, data.cycleId)));
      await db
        .update(cycles)
        .set({ selectedBookId: sql`CASE WHEN ${cycles.selectedBookId} = ${nominee.bookId} THEN NULL ELSE ${cycles.selectedBookId} END` })
        .where(eq(cycles.id, data.cycleId));
    } else if (data.action === "setCycleSelection") {
      const [nominee] = await db
        .select({ bookId: nominees.bookId })
        .from(nominees)
        .where(and(eq(nominees.id, data.nomineeId), eq(nominees.cycleId, data.cycleId)))
        .limit(1);
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      await db.update(cycles).set({ selectedBookId: nominee.bookId }).where(eq(cycles.id, data.cycleId));
    } else if (data.action === "updateCycle") {
      await db
        .update(cycles)
        .set({ eyebrow: data.eyebrow || "本期共读", title: data.title || "未命名期次" })
        .where(eq(cycles.id, data.cycleId));
    } else if (data.action === "summary") {
      await db.update(cycles).set({ summary: data.summary || "" }).where(eq(cycles.id, data.cycleId));
    } else if (data.action === "newCycle") {
      await db.update(cycles).set({ isActive: false });
      await db.insert(cycles).values({
        id: id(),
        eyebrow: data.eyebrow || "新一期共读",
        title: data.title,
        selectedBookId: null,
        summary: "",
        isActive: true,
        createdAt: now(),
      });
    } else if (data.action === "seedHistory") {
      await seedFullCatalogIfNeeded({ force: true });
    } else {
      return NextResponse.json({ error: "未知操作" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 500 });
  }
}
