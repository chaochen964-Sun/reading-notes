import { getStore } from "@netlify/blobs";

const key = "public-board";
const now = () => Date.now();
const id = () => crypto.randomUUID();

const cycleBooks = [
  ["1", "9787532180011", "吞下宇宙的男孩", "", "上海文艺出版社（果麦）"],
  ["2", "9787532777532", "长日将尽", "", "上海译文出版社（冯涛译）"],
  ["3", "9787532762897", "小径分岔的花园", "", "上海译文出版社（王永年译）"],
  ["4", "9787201134598", "罗生门", "", "天津人民出版社（高慧勤译，果麦出品）"],
  ["5", "9787544736541", "彼时此刻：马基雅维利在伊莫拉", "", "译林出版社"],
  ["6", "9787508672717", "人生复本", "", "中信出版社（布莱克·克劳奇）"],
  ["7", "9787532791620", "一个人的房间", "", "上海译文出版社（瞿世镜译）"],
  ["8", "9789579001847", "你不爽，为什么不明说？", "", "橡实文化（繁体主流）"],
  ["9", "9787532759538", "金阁寺", "", "上海译文出版社（唐月梅译）"],
  ["10", "9787554605424", "人性的弱点", "", "古吴轩出版社（完整全译本）"],
  ["11", "9787532752393", "1984", "", "上海译文出版社（董乐山译）"],
  ["12", "9787544722278", "看不见的城市", "", "译林出版社（张密译）"],
  ["13", "9787544292597", "献给阿尔吉侬的花束", "", "南海出版公司"],
  ["14", "9787020122349", "马丁·伊登", "", "人民文学出版社"],
  ["15", "9787020104598", "大师与玛格丽特", "", "人民文学出版社"],
  ["16", "9787544294010", "The Silent Patient（《无声的病人》）", "", "南海出版公司"],
  ["17", "9787532774986", "公羊的节日", "", "上海译文出版社"],
  ["18", "9787544291309", "一桩事先张扬的凶杀案", "", "南海出版公司"],
  ["19", "9787544768917", "树上的男爵", "", "译林出版社"],
  ["20", "9787020126781", "象棋的故事", "", "人民文学出版社"],
  ["21", "9787532778205", "宠物公墓", "", "上海译文出版社"],
  ["22", "9787532779996", "未来学大会", "", "上海译文出版社"],
  ["23", "9787020162347", "没有墓碑的草原", "", "人民文学出版社"],
  ["24", "9787559648655", "鱼不存在", "", "北京联合出版公司"],
  ["25", "manual-cycle-25", "特辑《佛教艺术赏析》", "", "非单一图书，多为专题/画册，无统一ISBN"],
  ["26", "9787544775122", "作家城堡", "", "译林出版社（卡尔维诺相关）"],
  ["27", "9787115545084", "第一性原理", "", "人民邮电出版社"],
  ["28", "9787530215995", "台北人", "", "北京十月文艺出版社"],
  ["29", "9787020104666", "卡拉马佐夫兄弟", "〔俄〕陀思妥耶夫斯基", "人民文学出版社"],
  ["30", "9787020122356", "包法利夫人", "", "人民文学出版社"],
  ["31", "9787111555377", "当尼采哭泣", "〔美〕欧文·亚隆｜侯维之 译", "机械工业出版社（2017版）"],
];

const currentBooks = [
  ["31a", "9786269673384", "家弒服務", "", "寂寞出版（繁体，最畅销）"],
  ["31b", "9787111555377", "当尼采哭泣", "〔美〕欧文·亚隆｜侯维之 译", "机械工业出版社（2017版）"],
  ["31c", "9787559848048", "可能性的艺术", "", "广西师范大学出版社"],
  ["31d", "9787553522685", "我们为什么会受骗", "", "上海文化出版社"],
  ["31e", "9787208136779", "查拉图斯特拉如是说", "〔德〕尼采｜孙周兴 译", "上海人民出版社（孙周兴译）"],
  ["31f", "9787559675583", "语言恶女", "", "北京联合出版公司"],
];

function bookFromTuple([idx, isbn, title, authors, publisher]) {
  return {
    id: `book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    created_at: Number.parseInt(String(idx).replace(/\D/g, ""), 10) || now(),
  };
}

function seedBoard() {
  const books = [...cycleBooks, ...currentBooks].map(bookFromTuple);
  const cycles = cycleBooks.map(([idx, isbn, title, authors], i) => ({
    id: `cycle-${idx}`,
    eyebrow: `第 ${String(i + 1).padStart(2, "0")} 期`,
    title,
    selected_book_id: `book-${idx}`,
    selected_title: title,
    selected_authors: authors,
    selected_cover: "",
    selected_podcast: "",
    selected_isbn: isbn,
    selected_chapters: "[]",
    summary: "",
    is_active: i === cycleBooks.length - 1 ? 1 : 0,
    created_at: i + 1,
  }));
  const historyNominees = cycleBooks.slice(0, 30).map(([idx, isbn, title, authors, publisher], i) => ({
    id: `nominee-${idx}`,
    cycle_id: `cycle-${idx}`,
    book_id: `book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    note: publisher,
    created_at: i + 1,
  }));
  const currentNominees = currentBooks.map(([idx, isbn, title, authors, publisher], i) => ({
    id: `nominee-${idx}`,
    cycle_id: "cycle-31",
    book_id: `book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    note: publisher,
    created_at: 31 + i,
  }));
  return { books, library: [], notes: [], cycles, nominees: [...historyNominees, ...currentNominees], groupNotes: [] };
}

async function loadBoard() {
  const store = getStore("reading-notes");
  const board = await store.get(key, { type: "json", consistency: "strong" });
  if (board?.cycles?.length) return board;
  const seeded = seedBoard();
  await store.setJSON(key, seeded);
  return seeded;
}

async function saveBoard(board) {
  await getStore("reading-notes").setJSON(key, board);
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

function normalizeBook(input = {}) {
  const created = now();
  const isbn = String(input.isbn || `manual-${id()}`).trim();
  return {
    id: input.id || `book-${id()}`,
    isbn,
    title: String(input.title || "未命名书目"),
    authors: String(input.authors || ""),
    publisher: String(input.publisher || ""),
    cover_url: String(input.coverUrl || input.cover_url || ""),
    podcast_url: String(input.podcastUrl || input.podcast_url || ""),
    published_date: String(input.publishedDate || input.published_date || ""),
    chapters_json: JSON.stringify(input.chapters || []),
    created_at: created,
  };
}

function upsertBook(board, input) {
  const next = normalizeBook(input);
  const existingIndex = board.books.findIndex((book) => book.isbn === next.isbn);
  if (existingIndex >= 0) {
    const existing = board.books[existingIndex];
    board.books[existingIndex] = { ...existing, ...next, id: existing.id, created_at: existing.created_at };
    return board.books[existingIndex];
  }
  board.books.push(next);
  return next;
}

function nomineeBookFields(book) {
  return {
    book_id: book.id,
    isbn: book.isbn,
    title: book.title,
    authors: book.authors,
    publisher: book.publisher,
    cover_url: book.cover_url,
    podcast_url: book.podcast_url,
    published_date: book.published_date,
    chapters_json: book.chapters_json,
  };
}

function selectedFields(nominee) {
  return {
    selected_book_id: nominee.book_id,
    selected_title: nominee.title,
    selected_authors: nominee.authors,
    selected_cover: nominee.cover_url,
    selected_podcast: nominee.podcast_url,
    selected_isbn: nominee.isbn,
    selected_chapters: nominee.chapters_json,
  };
}

async function handlePost(req) {
  const board = await loadBoard();
  const data = await req.json();

  if (data.action === "saveLibrary") {
    const book = upsertBook(board, data.book);
    const existingIndex = board.library.findIndex((entry) => entry.device_id === data.profile.deviceId && entry.book_id === book.id);
    const entry = {
      id: existingIndex >= 0 ? board.library[existingIndex].id : `library-${id()}`,
      device_id: data.profile.deviceId,
      display_name: data.profile.name,
      avatar: data.profile.avatar,
      book_id: book.id,
      title: book.title,
      authors: book.authors,
      isbn: book.isbn,
      cover_url: book.cover_url,
      podcast_url: book.podcast_url,
      chapters_json: book.chapters_json,
      status: data.status || "reading",
      progress: Number(data.progress || 0),
      current_chapter: data.currentChapter || "",
      reflection: data.reflection || "",
      updated_at: now(),
    };
    if (existingIndex >= 0) board.library[existingIndex] = entry;
    else board.library.push(entry);
  } else if (data.action === "personalNote") {
    const book = board.books.find((item) => item.id === data.bookId) || {};
    board.notes.unshift({ id: `note-${id()}`, title: book.title || "", ...data, book_id: data.bookId, display_name: data.profile.name, avatar: data.profile.avatar, created_at: now() });
  } else if (data.action === "groupNote") {
    const book = board.books.find((item) => item.id === data.bookId) || {};
    board.groupNotes.unshift({ id: `group-${id()}`, title: book.title || "", cycle_id: data.cycleId, book_id: data.bookId, device_id: data.profile.deviceId, display_name: data.profile.name, avatar: data.profile.avatar, chapter: data.chapter || "", quote: data.quote || "", body: data.body || "", created_at: now() });
  } else if (data.action === "nominate") {
    const book = upsertBook(board, data.book);
    const nominee = { id: `nominee-${id()}`, cycle_id: data.cycleId, ...nomineeBookFields(book), note: data.note || "", created_at: now() };
    board.nominees.push(nominee);
    if (data.select) board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, ...selectedFields(nominee) } : cycle);
  } else if (data.action === "updateNominee") {
    const book = upsertBook(board, data.book);
    const index = board.nominees.findIndex((nominee) => nominee.id === data.nomineeId && nominee.cycle_id === data.cycleId);
    if (index < 0) return json({ error: "未找到目标推选书目" }, 404);
    const nominee = { ...board.nominees[index], ...nomineeBookFields(book), note: data.note || "" };
    board.nominees[index] = nominee;
    if (data.select || board.cycles.some((cycle) => cycle.id === data.cycleId && cycle.selected_book_id === board.nominees[index].book_id)) {
      board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, ...selectedFields(nominee) } : cycle);
    }
  } else if (data.action === "deleteNominee") {
    const removed = board.nominees.find((nominee) => nominee.id === data.nomineeId && nominee.cycle_id === data.cycleId);
    board.nominees = board.nominees.filter((nominee) => nominee.id !== data.nomineeId || nominee.cycle_id !== data.cycleId);
    if (removed) board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId && cycle.selected_book_id === removed.book_id ? { ...cycle, selected_book_id: null } : cycle);
  } else if (data.action === "setCycleSelection") {
    const nominee = board.nominees.find((item) => item.id === data.nomineeId && item.cycle_id === data.cycleId);
    if (!nominee) return json({ error: "未找到目标推选书目" }, 404);
    board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, ...selectedFields(nominee) } : cycle);
  } else if (data.action === "updateCycle") {
    board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, eyebrow: data.eyebrow || cycle.eyebrow, title: data.title || cycle.title } : cycle);
  } else if (data.action === "summary") {
    board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, summary: data.summary || "" } : cycle);
  } else if (data.action === "newCycle") {
    board.cycles = board.cycles.map((cycle) => ({ ...cycle, is_active: 0 }));
    board.cycles.unshift({ id: `cycle-${id()}`, eyebrow: data.eyebrow || "新一期共读", title: data.title || "未命名期次", selected_book_id: null, summary: "", is_active: 1, created_at: now() });
  } else if (data.action !== "seedHistory") {
    return json({ error: "未知操作" }, 400);
  }

  await saveBoard(board);
  return json({ ok: true });
}

export default async function handler(req) {
  if (req.method === "GET") return json(await loadBoard());
  if (req.method === "POST") return handlePost(req);
  return json({ error: "Method not allowed" }, 405);
}
