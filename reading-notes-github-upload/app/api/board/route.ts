import { NextRequest, NextResponse } from "next/server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, isDatabaseConfigured } from "@/db";

type BookInput = { isbn: string; title: string; authors?: string; publisher?: string; publishedDate?: string; coverUrl?: string; podcastUrl?: string; chapters?: string[] };
type CycleRecord = { id: string; title: string; eyebrow: string; is_active: number; selected_book_id: string | null; created_at: number };

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
  const rawIsbn = book.isbn.trim();
  const cleanIsbn = rawIsbn.startsWith("manual-") ? rawIsbn : rawIsbn.replace(/[^0-9Xx]/g, "") || `manual-${id()}`;
  const existing = await db.prepare("SELECT id FROM books WHERE isbn=?").bind(cleanIsbn).first<{ id: string }>();
  const bookId = existing?.id || id();
  const updateClause = options.preserveExisting
    ? "title=excluded.title,authors=CASE WHEN books.authors='' THEN excluded.authors ELSE books.authors END,publisher=CASE WHEN books.publisher='' THEN excluded.publisher ELSE books.publisher END,published_date=CASE WHEN books.published_date='' THEN excluded.published_date ELSE books.published_date END,cover_url=CASE WHEN books.cover_url='' THEN excluded.cover_url ELSE books.cover_url END,podcast_url=CASE WHEN books.podcast_url='' THEN excluded.podcast_url ELSE books.podcast_url END,chapters_json=CASE WHEN books.chapters_json='' OR books.chapters_json='[]' THEN excluded.chapters_json ELSE books.chapters_json END"
    : "title=excluded.title,authors=excluded.authors,publisher=excluded.publisher,published_date=excluded.published_date,cover_url=excluded.cover_url,podcast_url=excluded.podcast_url,chapters_json=excluded.chapters_json";

  await db
    .prepare(`INSERT INTO books (id,isbn,title,authors,publisher,published_date,cover_url,podcast_url,chapters_json,created_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(isbn) DO UPDATE SET ${updateClause}`)
    .bind(bookId, cleanIsbn, book.title, book.authors || "", book.publisher || "", book.publishedDate || "", book.coverUrl || "", book.podcastUrl || "", JSON.stringify(book.chapters || []), now())
    .run();

  return bookId;
}

async function setCycleNominee(cycleId: string, bookId: string, title: string, note?: string) {
  const displayNote = note ?? `${title}（往期推荐）`;
  const suppressed = await db
    .prepare("SELECT id FROM suppressed_nominees WHERE cycle_id=? AND book_id=? LIMIT 1")
    .bind(cycleId, bookId)
    .first<{ id: string }>();
  if (suppressed?.id) return;

  const existingNominee = await db
    .prepare("SELECT id FROM nominees WHERE cycle_id=? AND book_id=? LIMIT 1")
    .bind(cycleId, bookId)
    .first<{ id: string }>();

  if (existingNominee?.id) {
    if (note !== undefined) await db.prepare("UPDATE nominees SET note=? WHERE id=?").bind(displayNote, existingNominee.id).run();
    return;
  }

  await db
    .prepare("INSERT INTO nominees (id,cycle_id,book_id,note,created_at) VALUES (?,?,?,?,?)")
    .bind(id(), cycleId, bookId, displayNote, now())
    .run();
}

async function seedFullCatalogIfNeeded() {
  const existing = await db.prepare("SELECT id,title,eyebrow,is_active,selected_book_id,created_at FROM cycles").all<CycleRecord>();
  const rows = existing.results;

  const rowsByEyebrow = new Map(rows.map((c) => [c.eyebrow.trim(), c] as const));
  const rowsByTitle = new Map(rows.map((c) => [c.title.trim(), c] as const));
  let reusableLegacyRow = rows.length === 1 && !rowsByEyebrow.has(catalogLabel(0)) ? rows[0] : null;

  let currentCycleId = "";
  let currentFallbackBookId = "";

  for (let i = 0; i < cycleCatalog.length; i++) {
    const book = cycleBooks[i];
    const title = book.title;
    const previousTitle = previousCycleTitles[i] || title;
    const eyebrow = catalogLabel(i);
    const bookId = await upsertBook({ authors: "", publishedDate: "", coverUrl: "", podcastUrl: "", chapters: [], ...book }, { preserveExisting: true });
    const oldManualBook = await db.prepare("SELECT id FROM books WHERE isbn=?").bind(`manual-cycle-${i + 1}`).first<{ id: string }>();
    const existingCycle = rowsByEyebrow.get(eyebrow) || rowsByTitle.get(title) || reusableLegacyRow;
    reusableLegacyRow = null;

    if (existingCycle) {
      await db
        .prepare("UPDATE cycles SET eyebrow=?, title=CASE WHEN title='' OR title=? OR title=? THEN ? ELSE title END, selected_book_id=CASE WHEN selected_book_id IS NULL OR selected_book_id=? THEN ? ELSE selected_book_id END, is_active=? WHERE id=?")
        .bind(eyebrow, `manual-cycle-${i + 1}`, previousTitle, title, oldManualBook?.id || "", bookId, i === cycleCatalog.length - 1 ? 1 : 0, existingCycle.id)
        .run();
      if (i < cycleCatalog.length - 1) await setCycleNominee(existingCycle.id, bookId, title, book.publisher || `${title}（往期推荐）`);
      if (oldManualBook?.id && oldManualBook.id !== bookId) await db.prepare("DELETE FROM nominees WHERE cycle_id=? AND book_id=?").bind(existingCycle.id, oldManualBook.id).run();
      if (i === cycleCatalog.length - 1) {
        currentCycleId = existingCycle.id;
        currentFallbackBookId = oldManualBook?.id || "";
      }
      continue;
    }

    const cycleId = id();
    await db
      .prepare("INSERT INTO cycles (id, eyebrow, title, selected_book_id, summary, is_active, created_at) VALUES (?, ?, ?, ?, '', ?, ?)")
      .bind(cycleId, eyebrow, title, bookId, i === cycleCatalog.length - 1 ? 1 : 0, now())
      .run();
    if (i < cycleCatalog.length - 1) await setCycleNominee(cycleId, bookId, title, book.publisher || `${title}（往期推荐）`);
    if (i === cycleCatalog.length - 1) {
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

    const selected = await db
      .prepare("SELECT selected_book_id FROM cycles WHERE id=?")
      .bind(currentCycleId)
      .first<{ selected_book_id: string | null }>();

    if (selectedBookId && (!selected?.selected_book_id || selected.selected_book_id === currentFallbackBookId)) {
      await db.prepare("UPDATE cycles SET selected_book_id=? WHERE id=?").bind(selectedBookId, currentCycleId).run();
    }

    if (currentFallbackBookId) {
      await db.prepare("DELETE FROM nominees WHERE cycle_id=? AND book_id=?").bind(currentCycleId, currentFallbackBookId).run();
    }
  }

  // 把第 31 期设成当前期；用户之后仍可编辑这一期标题。
  const latestRow = await db.prepare("SELECT id FROM cycles WHERE eyebrow=?").bind(catalogLabel(cycleCatalog.length - 1)).first<{ id: string }>();
  if (latestRow?.id) {
    await db.prepare("UPDATE cycles SET is_active=0").run();
    await db.prepare("UPDATE cycles SET is_active=1 WHERE id=?").bind(latestRow.id).run();
  }
}

export async function GET(request: NextRequest) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "数据库尚未连接" }, { status: 503 });

  await seedFullCatalogIfNeeded();

  const deviceId = request.nextUrl.searchParams.get("deviceId") || "";
  const [books, library, notes, cycles, nominees, groupNotes] = await Promise.all([
    db.prepare("SELECT * FROM books ORDER BY created_at DESC").all(),
    db.prepare("SELECT l.*, b.title, b.authors, b.isbn, b.cover_url, b.podcast_url, b.chapters_json FROM library_entries l JOIN books b ON b.id=l.book_id WHERE l.device_id=? ORDER BY l.updated_at DESC").bind(deviceId).all(),
    db.prepare("SELECT n.*, b.title FROM personal_notes n JOIN books b ON b.id=n.book_id WHERE n.device_id=? ORDER BY n.created_at DESC").bind(deviceId).all(),
    db.prepare("SELECT c.*, b.title AS selected_title, b.authors AS selected_authors, b.cover_url AS selected_cover, b.podcast_url AS selected_podcast, b.isbn AS selected_isbn, b.chapters_json AS selected_chapters FROM cycles c LEFT JOIN books b ON b.id=c.selected_book_id ORDER BY c.created_at DESC").all(),
    db.prepare("SELECT n.*, b.title, b.authors, b.cover_url, b.podcast_url, b.published_date, b.isbn, b.chapters_json FROM nominees n JOIN books b ON b.id=n.book_id ORDER BY n.created_at DESC").all(),
    db.prepare("SELECT g.*, b.title FROM group_notes g JOIN books b ON b.id=g.book_id ORDER BY g.created_at DESC").all(),
  ]);

  return NextResponse.json({ books: books.results, library: library.results, notes: notes.results, cycles: cycles.results, nominees: nominees.results, groupNotes: groupNotes.results });
}

export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) return NextResponse.json({ error: "数据库尚未连接" }, { status: 503 });
  const data = await request.json() as Record<string, any>;

  try {
    if (data.action === "saveLibrary") {
      const bookId = await upsertBook(data.book);
      const existing = await db
        .prepare("SELECT id FROM library_entries WHERE device_id=? AND book_id=?")
        .bind(data.profile.deviceId, bookId)
        .first<{ id: string }>();
      await db
        .prepare(
          "INSERT INTO library_entries (id,device_id,display_name,avatar,book_id,status,progress,current_chapter,reflection,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(device_id,book_id) DO UPDATE SET display_name=excluded.display_name,avatar=excluded.avatar,status=excluded.status,progress=excluded.progress,current_chapter=excluded.current_chapter,reflection=excluded.reflection,updated_at=excluded.updated_at",
        )
        .bind(
          existing?.id || id(),
          data.profile.deviceId,
          data.profile.name,
          data.profile.avatar,
          bookId,
          data.status || "reading",
          Number(data.progress || 0),
          data.currentChapter || "",
          data.reflection || "",
          now(),
        )
        .run();
    } else if (data.action === "personalNote") {
      await db
        .prepare(
          "INSERT INTO personal_notes (id,device_id,display_name,avatar,book_id,chapter,quote,body,created_at) VALUES (?,?,?,?,?,?,?,?,?)",
        )
        .bind(id(), data.profile.deviceId, data.profile.name, data.profile.avatar, data.bookId, data.chapter || "", data.quote || "", data.body, now())
        .run();
    } else if (data.action === "groupNote") {
      await db
        .prepare(
          "INSERT INTO group_notes (id,cycle_id,book_id,device_id,display_name,avatar,chapter,quote,body,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)",
        )
        .bind(id(), data.cycleId, data.bookId, data.profile.deviceId, data.profile.name, data.profile.avatar, data.chapter || "", data.quote || "", data.body, now())
        .run();
    } else if (data.action === "nominate") {
      const bookId = await upsertBook(data.book);
      await db
        .prepare("INSERT INTO nominees (id,cycle_id,book_id,note,created_at) VALUES (?,?,?,?,?)")
        .bind(id(), data.cycleId, bookId, data.note || "", now())
        .run();
      if (data.select) await db.prepare("UPDATE cycles SET selected_book_id=? WHERE id=?").bind(bookId, data.cycleId).run();
    } else if (data.action === "updateNominee") {
      const nominee = await db
        .prepare("SELECT book_id FROM nominees WHERE id=? AND cycle_id=?")
        .bind(data.nomineeId, data.cycleId)
        .first<{ book_id: string }>();
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      const bookId = await upsertBook(data.book);
      const selectedBook = await db
        .prepare("SELECT selected_book_id FROM cycles WHERE id=?")
        .bind(data.cycleId)
        .first<{ selected_book_id: string | null }>();

      await db
        .prepare("UPDATE nominees SET book_id=?, note=? WHERE id=? AND cycle_id=?")
        .bind(bookId, data.note || "", data.nomineeId, data.cycleId)
        .run();

      if (data.select || nominee.book_id === selectedBook?.selected_book_id) {
        await db.prepare("UPDATE cycles SET selected_book_id=? WHERE id=?").bind(bookId, data.cycleId).run();
      }
    } else if (data.action === "deleteNominee") {
      const nominee = await db
        .prepare("SELECT book_id FROM nominees WHERE id=? AND cycle_id=?")
        .bind(data.nomineeId, data.cycleId)
        .first<{ book_id: string }>();
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      await db.prepare("INSERT INTO suppressed_nominees (id,cycle_id,book_id,created_at) VALUES (?,?,?,?) ON CONFLICT(cycle_id,book_id) DO NOTHING").bind(id(), data.cycleId, nominee.book_id, now()).run();
      await db.prepare("DELETE FROM nominees WHERE id=? AND cycle_id=?").bind(data.nomineeId, data.cycleId).run();
      await db
        .prepare("UPDATE cycles SET selected_book_id = CASE WHEN selected_book_id = ? THEN NULL ELSE selected_book_id END WHERE id=?")
        .bind(nominee.book_id, data.cycleId)
        .run();
    } else if (data.action === "setCycleSelection") {
      const nominee = await db
        .prepare("SELECT book_id FROM nominees WHERE id=? AND cycle_id=?")
        .bind(data.nomineeId, data.cycleId)
        .first<{ book_id: string }>();
      if (!nominee) return NextResponse.json({ error: "未找到目标推选书目" }, { status: 404 });

      await db.prepare("UPDATE cycles SET selected_book_id=? WHERE id=?").bind(nominee.book_id, data.cycleId).run();
    } else if (data.action === "updateCycle") {
      await db
        .prepare("UPDATE cycles SET eyebrow=?, title=? WHERE id=?")
        .bind(data.eyebrow || "本期共读", data.title || "未命名期次", data.cycleId)
        .run();
    } else if (data.action === "summary") {
      await db.prepare("UPDATE cycles SET summary=? WHERE id=?").bind(data.summary || "", data.cycleId).run();
    } else if (data.action === "newCycle") {
      await db.prepare("UPDATE cycles SET is_active=0").run();
      await db
        .prepare("INSERT INTO cycles (id,eyebrow,title,selected_book_id,summary,is_active,created_at) VALUES (?,?,?,NULL,'',1,?)")
        .bind(id(), data.eyebrow || "新一期共读", data.title, now())
        .run();
    } else if (data.action === "seedHistory") {
      await seedFullCatalogIfNeeded();
    } else {
      return NextResponse.json({ error: "未知操作" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "保存失败" }, { status: 500 });
  }
}
