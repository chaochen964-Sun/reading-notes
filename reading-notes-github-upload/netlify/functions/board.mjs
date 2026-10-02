const key = "public-board";
const now = () => Date.now();
const id = () => crypto.randomUUID();

const cycleBooks = [
  ["1", "9787532180011", "吞下宇宙的男孩", "", "上海文艺出版社（果麦）", "https://covers.openlibrary.org/b/isbn/9787532180011-L.jpg"],
  ["2", "9789573310631", "长日将尽", "", "上海译文出版社（冯涛译）", "https://covers.openlibrary.org/b/isbn/9789573310631-L.jpg"],
  ["3", "9787533916367", "小径分岔的花园", "", "上海译文出版社（王永年译）", "https://covers.openlibrary.org/b/isbn/9787533916367-L.jpg"],
  ["4", "9787561370704", "罗生门", "", "天津人民出版社（高慧勤译，果麦出品）", "https://covers.openlibrary.org/b/isbn/9787561370704-L.jpg"],
  ["5", "9787544736541", "彼时此刻：马基雅维利在伊莫拉", "", "译林出版社", "https://covers.openlibrary.org/b/isbn/9787544736541-L.jpg"],
  ["6", "9789869170987", "人生复本", "", "中信出版社（布莱克·克劳奇）", "https://covers.openlibrary.org/b/isbn/9789869170987-L.jpg"],
  ["7", "9787559475800", "一个人的房间", "", "上海译文出版社（瞿世镜译）", "https://covers.openlibrary.org/b/isbn/9787559475800-L.jpg"],
  ["8", "9787508098463", "你不爽，为什么不明说？", "", "橡实文化（繁体主流）", "https://covers.openlibrary.org/b/isbn/9787508098463-L.jpg"],
  ["9", "9787543655621", "金阁寺", "", "上海译文出版社（唐月梅译）", "https://covers.openlibrary.org/b/isbn/9787543655621-L.jpg"],
  ["10", "9787802032460", "人性的弱点", "", "古吴轩出版社（完整全译本）", "https://covers.openlibrary.org/b/isbn/9787802032460-L.jpg"],
  ["11", "9780451524935", "1984", "", "上海译文出版社（董乐山译）", "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"],
  ["12", "9787544700603", "看不见的城市", "", "译林出版社（张密译）", "https://covers.openlibrary.org/b/isbn/9787544700603-L.jpg"],
  ["13", "9787555913726", "献给阿尔吉侬的花束", "", "南海出版公司", "https://covers.openlibrary.org/b/isbn/9787555913726-L.jpg"],
  ["14", "9781438510521", "马丁·伊登", "", "人民文学出版社", "https://covers.openlibrary.org/b/isbn/9781438510521-L.jpg"],
  ["15", "9787533911287", "大师与玛格丽特", "", "人民文学出版社", "https://covers.openlibrary.org/b/isbn/9787533911287-L.jpg"],
  ["16", "9787555910749", "The Silent Patient（《无声的病人》）", "", "南海出版公司", "https://covers.openlibrary.org/b/isbn/9787555910749-L.jpg"],
  ["17", "9787532741243", "公羊的节日", "", "上海译文出版社", "https://covers.openlibrary.org/b/isbn/9787532741243-L.jpg"],
  ["18", "9787544292467", "一桩事先张扬的凶杀案", "", "南海出版公司", "https://covers.openlibrary.org/b/isbn/9787544292467-L.jpg"],
  ["19", "9787544778008", "树上的男爵", "", "译林出版社", "https://covers.openlibrary.org/b/isbn/9787544778008-L.jpg"],
  ["20", "9787508020525", "象棋的故事", "", "人民文学出版社", "https://covers.openlibrary.org/b/isbn/9787508020525-L.jpg"],
  ["21", "9787532154159", "宠物公墓", "", "上海译文出版社", "https://covers.openlibrary.org/b/isbn/9787532154159-L.jpg"],
  ["22", "7549645035", "未来学大会", "", "上海译文出版社", "https://covers.openlibrary.org/b/isbn/7549645035-L.jpg"],
  ["23", "9789865842406", "没有墓碑的草原", "", "人民文学出版社", "https://covers.openlibrary.org/b/isbn/9789865842406-L.jpg"],
  ["24", "9787572607943", "鱼不存在", "", "北京联合出版公司", "https://covers.openlibrary.org/b/isbn/9787572607943-L.jpg"],
  ["25", "manual-cycle-25", "特辑《佛教艺术赏析》", "", "非单一图书，多为专题/画册，无统一ISBN", ""],
  ["26", "9787513361675", "作家城堡", "", "译林出版社（卡尔维诺相关）", "https://covers.openlibrary.org/b/isbn/9787513361675-L.jpg"],
  ["27", "9787523605109", "第一性原理", "", "人民邮电出版社", "https://covers.openlibrary.org/b/isbn/9787523605109-L.jpg"],
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

function bookFromTuple([idx, isbn, title, authors, publisher, cover]) {
  return {
    id: `book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: cover || "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    created_at: Number.parseInt(String(idx).replace(/\D/g, ""), 10) || now(),
  };
}

function seedBoard() {
  const books = [...cycleBooks, ...currentBooks].map(bookFromTuple);
  const cycles = cycleBooks.map(([idx, isbn, title, authors, publisher, cover], i) => ({
    id: `cycle-${idx}`,
    eyebrow: `第 ${String(i + 1).padStart(2, "0")} 期`,
    title,
    selected_book_id: `book-${idx}`,
    selected_title: title,
    selected_authors: authors,
    selected_cover: cover || "",
    selected_podcast: "",
    selected_isbn: isbn,
    selected_chapters: "[]",
    summary: "",
    is_active: i === cycleBooks.length - 1 ? 1 : 0,
    created_at: i + 1,
  }));
  const historyNominees = cycleBooks.slice(0, 30).map(([idx, isbn, title, authors, publisher, cover], i) => ({
    id: `nominee-${idx}`,
    cycle_id: `cycle-${idx}`,
    book_id: `book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: cover || "",
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

function mergeSeedMetadata(board) {
  const seeded = seedBoard();
  let changed = false;
  for (const key of ["books", "cycles", "nominees"]) {
    const byId = new Map((seeded[key] || []).map((item) => [item.id, item]));
    board[key] = (board[key] || []).map((item) => {
      const seed = byId.get(item.id);
      if (!seed) return item;
      const next = { ...item };
      for (const field of ["cover_url"]) {
        if (seed[field] && !next[field]) {
          next[field] = seed[field];
          changed = true;
        }
      }
      if (key === "cycles" && seed.selected_cover && !next.selected_cover) {
        next.selected_cover = seed.selected_cover;
        changed = true;
      }
      return next;
    });
  }
  return changed;
}

async function loadBoard() {
  const rows = await supabaseFetch(`reading_notes_state?key=eq.${encodeURIComponent(key)}&select=data&limit=1`);
  const board = rows?.[0]?.data;
  if (board?.cycles?.length) {
    const changed = mergeSeedMetadata(board) || hydrateSelectedBooks(board);
    if (changed) await saveBoard(board);
    return board;
  }
  const seeded = seedBoard();
  await saveBoard(seeded);
  return seeded;
}

async function saveBoard(board) {
  await supabaseFetch("reading_notes_state", {
    method: "POST",
    headers: { prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ key, data: board }),
  });
}

function json(body, status = 200) {
  return Response.json(body, { status });
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase 还没有配置：请在 Netlify Environment variables 添加 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY");
  }
  return { url, key };
}

async function supabaseFetch(path, options = {}) {
  const config = supabaseConfig();
  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Supabase request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
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
    selected_book_id: nominee.book_id || nominee.id,
    selected_title: nominee.title,
    selected_authors: nominee.authors,
    selected_cover: nominee.cover_url,
    selected_podcast: nominee.podcast_url,
    selected_isbn: nominee.isbn,
    selected_chapters: nominee.chapters_json,
  };
}

function hydrateSelectedBooks(board) {
  let changed = false;
  const bookById = new Map((board.books || []).map((book) => [book.id, book]));
  const nomineeByBookId = new Map((board.nominees || []).map((nominee) => [nominee.book_id, nominee]));

  board.cycles = (board.cycles || []).map((cycle) => {
    if (!cycle.selected_book_id) return cycle;
    const source = nomineeByBookId.get(cycle.selected_book_id) || bookById.get(cycle.selected_book_id);
    if (!source) return cycle;
    const next = { ...cycle, ...selectedFields(source) };
    if (JSON.stringify(next) !== JSON.stringify(cycle)) changed = true;
    return next;
  });

  return changed;
}

function ownsNote(note, profile) {
  return Boolean(
    note?.device_id === profile?.deviceId ||
    note?.profile?.deviceId === profile?.deviceId ||
    (!note?.device_id && !note?.profile?.deviceId && note?.display_name && note.display_name === profile?.name)
  );
}

const meetingBucket = "reading-meeting-pdfs";
const maxMeetingPdfBytes = 10 * 1024 * 1024;

async function storageFetch(path, options = {}) {
  const { url, key: serviceKey } = supabaseConfig();
  return fetch(`${url}/storage/v1/${path}`, {
    ...options,
    headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}`, ...options.headers },
  });
}

async function meetingPdfAction(data) {
  const deviceId = String(data.profile?.deviceId || "");
  if (!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(deviceId)) return json({ error: "请先设置阅读昵称。" }, 400);
  let board = await loadBoard();
  let cycle = board.cycles.find((item) => item.id === data.cycleId);
  if (!cycle) return json({ error: "找不到对应期次，请刷新后重试。" }, 404);
  if (data.action === "deleteMeetingPdf") {
    const attachment = (cycle.meeting_pdfs || []).find((item) => item.id === data.attachmentId);
    if (!attachment) return json({ error: "这份记录已经删除，请刷新页面。" }, 404);
    if (attachment.device_id && attachment.device_id !== deviceId) return json({ error: "只有上传者可以删除这份记录。" }, 403);
    // Retain a recovery copy; removed files are no longer available through the viewing endpoint.
    cycle.deleted_meeting_pdfs = [...(cycle.deleted_meeting_pdfs || []), { ...attachment, deleted_at: now() }];
    cycle.meeting_pdfs = cycle.meeting_pdfs.filter((item) => item.id !== attachment.id);
    await saveBoard(board);
    return json({ ok: true });
  }
  if ((cycle.meeting_pdfs || []).length) return json({ error: "本期已有一份 PDF，请先删除后再上传。" }, 409);
  if (data.action === "prepareMeetingPdf") {
    const name = String(data.name || "");
    if (!/\.pdf$/i.test(name) || !Number.isInteger(data.size) || data.size < 5 || data.size > maxMeetingPdfBytes) return json({ error: "请选择不超过 10 MB 的 PDF 文件。" }, 400);
    const pending = cycle.pending_meeting_pdf;
    if (pending && pending.device_id !== deviceId && now() - pending.created_at < 15 * 60 * 1000) return json({ error: "本期有文件正在上传，请稍后重试。" }, 409);
    const config = { id: meetingBucket, name: meetingBucket, public: false, file_size_limit: maxMeetingPdfBytes, allowed_mime_types: ["application/pdf"] };
    const bucket = await storageFetch(`bucket/${meetingBucket}`);
    const configured = await storageFetch(bucket.ok ? `bucket/${meetingBucket}` : "bucket", { method: bucket.ok ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(config) });
    if (!configured.ok && configured.status !== 409) throw new Error("会议记录存储暂时不可用，请稍后重试。");
    const attachment = { id: id(), name: name.replace(/[\u0000-\u001f\/\\]/g, "_").slice(0, 180), size: data.size, device_id: deviceId, created_at: now() };
    attachment.path = `${attachment.id}.pdf`;
    const signed = await storageFetch(`object/upload/sign/${meetingBucket}/${attachment.path}`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    if (!signed.ok) throw new Error("暂时无法开始上传，请稍后重试。");
    const result = await signed.json();
    cycle.pending_meeting_pdf = attachment;
    await saveBoard(board);
    return json({ attachmentId: attachment.id, uploadUrl: `${supabaseConfig().url}/storage/v1${result.url}` });
  }
  const pending = cycle.pending_meeting_pdf;
  if (!pending || pending.id !== data.attachmentId || pending.device_id !== deviceId) return json({ error: "上传已失效，请重新选择文件。" }, 409);
  const stored = await storageFetch(`object/authenticated/${meetingBucket}/${pending.path}`);
  if (!stored.ok) return json({ error: "文件尚未上传成功，请重新上传。" }, 400);
  const bytes = new Uint8Array(await stored.arrayBuffer());
  if (bytes.length !== pending.size || bytes.length > maxMeetingPdfBytes || new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") return json({ error: "文件大小或 PDF 格式不正确，请重新导出后上传。" }, 400);
  board = await loadBoard();
  cycle = board.cycles.find((item) => item.id === data.cycleId);
  if (!cycle || (cycle.meeting_pdfs || []).length || cycle.pending_meeting_pdf?.id !== pending.id) return json({ error: "本期附件已变化，请刷新查看。" }, 409);
  cycle.meeting_pdfs = [pending];
  delete cycle.pending_meeting_pdf;
  await saveBoard(board);
  return json({ ok: true });
}

async function handlePost(req) {
  const data = await req.json();
  if (["prepareMeetingPdf", "completeMeetingPdf", "deleteMeetingPdf"].includes(data.action)) return meetingPdfAction(data);
  const board = await loadBoard();

  if (data.action === "linkDevice") {
    const source = String(data.profile?.deviceId || "");
    const target = String(data.targetDeviceId || "").trim();
    const validId = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;
    if (!validId.test(source) || !validId.test(target)) return json({ error: "同步码不正确，请复制完整的 36 位代码" }, 400);
    if (source === target) return json({ ok: true });
    for (const collection of [board.library, board.notes, board.groupNotes, board.replies || []]) {
      for (const item of collection) {
        if (item.device_id !== source && item.profile?.deviceId !== source) continue;
        item.device_id = target;
        if (item.profile) item.profile.deviceId = target;
      }
    }
  } else if (data.action === "saveLibrary") {
    const book = upsertBook(board, data.book);
    const ownLibrary = (entry) => entry.device_id === data.profile.deviceId;
    let existingIndex = board.library.findIndex((entry) => ownLibrary(entry) && data.libraryId && entry.id === data.libraryId);
    if (existingIndex < 0) existingIndex = board.library.findIndex((entry) => ownLibrary(entry) && entry.book_id === book.id);
    const entry = {
      id: existingIndex >= 0 ? board.library[existingIndex].id : `library-${id()}`,
      device_id: data.profile.deviceId,
      display_name: data.profile.name,
      avatar: data.profile.avatar,
      book_id: book.id,
      title: book.title,
      authors: book.authors,
      publisher: book.publisher,
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
    board.notes.unshift({ id: `note-${id()}`, title: book.title || "", ...data, image_url: data.imageUrl || "", is_public: data.isPublic === true, book_id: data.bookId, device_id: data.profile.deviceId, display_name: data.profile.name, avatar: data.profile.avatar, created_at: now() });
  } else if (data.action === "updatePersonalNote") {
    const index = board.notes.findIndex((note) => note.id === data.noteId && ownsNote(note, data.profile));
    if (index < 0) return json({ error: "只能修改自己的个人笔记" }, 404);
    board.notes[index] = { ...board.notes[index], device_id: data.profile.deviceId, chapter: data.chapter || "", quote: data.quote || "", body: data.body || "", image_url: data.imageUrl || "", is_public: data.isPublic === true, display_name: data.profile.name, avatar: data.profile.avatar };
  } else if (data.action === "deletePersonalNote") {
    const index = board.notes.findIndex((note) => note.id === data.noteId && ownsNote(note, data.profile));
    if (index < 0) return json({ error: "只能删除自己的个人笔记" }, 404);
    board.replies = (board.replies || []).filter((reply) => reply.note_id !== data.noteId);
    board.notes.splice(index, 1);
  } else if (data.action === "groupNote") {
    const book = board.books.find((item) => item.id === data.bookId) || {};
    board.groupNotes.unshift({ id: `group-${id()}`, title: book.title || "", cycle_id: data.cycleId, book_id: data.bookId, device_id: data.profile.deviceId, display_name: data.profile.name, avatar: data.profile.avatar, chapter: data.chapter || "", quote: data.quote || "", body: data.body || "", image_url: data.imageUrl || "", created_at: now() });
  } else if (data.action === "updateGroupNote") {
    const index = board.groupNotes.findIndex((note) => note.id === data.noteId && ownsNote(note, data.profile));
    if (index < 0) return json({ error: "只能修改自己写的共读笔记" }, 404);
    board.groupNotes[index] = { ...board.groupNotes[index], device_id: data.profile.deviceId, chapter: data.chapter || "", quote: data.quote || "", body: data.body || "", image_url: data.imageUrl || "", display_name: data.profile.name, avatar: data.profile.avatar };
  } else if (data.action === "deleteGroupNote") {
    const index = board.groupNotes.findIndex((note) => note.id === data.noteId && ownsNote(note, data.profile));
    if (index < 0) return json({ error: "只能删除自己写的共读笔记" }, 404);
    board.replies = (board.replies || []).filter((reply) => reply.note_id !== data.noteId);
    board.groupNotes.splice(index, 1);
  } else if (data.action === "addReply") {
    const body = String(data.body || "").trim();
    const profile = data.profile;
    if (!profile?.deviceId || !profile?.name || !body || body.length > 2000) return json({ error: "回复需要昵称和不超过 2000 字的内容" }, 400);
    const note = board.groupNotes.find((item) => item.id === data.noteId) || board.notes.find((item) => item.id === data.noteId && item.is_public === true);
    if (!note) return json({ error: "这则笔记不存在或未公开" }, 404);
    board.replies ||= [];
    board.replies.push({ id: `reply-${id()}`, note_id: note.id, device_id: profile.deviceId, display_name: profile.name, avatar: profile.avatar || "", body, created_at: now() });
  } else if (data.action === "nominate") {
    const book = upsertBook(board, data.book);
    const nominee = { id: `nominee-${id()}`, cycle_id: data.cycleId, ...nomineeBookFields(book), note: data.note || "", created_at: now() };
    board.nominees.push(nominee);
    if (data.select) board.cycles = board.cycles.map((cycle) => cycle.id === data.cycleId ? { ...cycle, ...selectedFields(nominee) } : cycle);
  } else if (data.action === "updateNominee") {
    const book = upsertBook(board, data.book);
    const index = board.nominees.findIndex((nominee) => nominee.id === data.nomineeId && nominee.cycle_id === data.cycleId);
    if (index < 0) return json({ error: "未找到目标推选书目" }, 404);
    const oldBookId = board.nominees[index].book_id;
    const wasSelected = board.cycles.some((cycle) => cycle.id === data.cycleId && cycle.selected_book_id === oldBookId);
    const nominee = { ...board.nominees[index], ...nomineeBookFields(book), note: data.note || "" };
    board.nominees[index] = nominee;
    if (data.select || wasSelected) {
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
  } else if (data.action === "seedHistory") {
    return json({ error: "重建往期书单已关闭，避免误删大家已经输入的内容。" }, 403);
  } else {
    return json({ error: "未知操作" }, 400);
  }

  hydrateSelectedBooks(board);
  await saveBoard(board);
  return json({ ok: true });
}

async function handleRequest(req) {
  if (req.method === "GET") {
    const board = await loadBoard();
    const params = new URL(req.url).searchParams;
    if (params.has("meetingPdf")) {
      const attachment = board.cycles.flatMap((cycle) => cycle.meeting_pdfs || []).find((item) => item.id === params.get("meetingPdf"));
      if (!attachment) return json({ error: "找不到这份会议记录。" }, 404);
      const signed = await storageFetch(`object/sign/${meetingBucket}/${encodeURIComponent(attachment.path)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ expiresIn: 3600 }) });
      if (!signed.ok) return json({ error: "暂时无法打开 PDF，请稍后重试。" }, 502);
      const result = await signed.json();
      return new Response(null, { status: 302, headers: { location: `${supabaseConfig().url}/storage/v1${result.signedURL}`, "cache-control": "no-store" } });
    }
    const deviceId = params.get("deviceId") || "";
    const name = params.get("name") || "";
    board.publicNotes = (board.notes || []).filter((note) => note.is_public === true).map((note) => ({ id: note.id, book_id: note.book_id, title: note.title, display_name: note.display_name, avatar: note.avatar, chapter: note.chapter, quote: note.quote, body: note.body, image_url: note.image_url, created_at: note.created_at }));
    if (deviceId) {
      board.library = (board.library || []).filter((entry) => entry.device_id === deviceId);
      board.notes = (board.notes || []).filter((note) => ownsNote(note, { deviceId, name }));
    } else {
      board.library = [];
      board.notes = [];
    }
    const visibleNoteIds = new Set([...board.groupNotes, ...board.publicNotes, ...board.notes].map((note) => note.id));
    board.replies = (board.replies || []).filter((reply) => visibleNoteIds.has(reply.note_id)).map((reply) => ({ id: reply.id, note_id: reply.note_id, display_name: reply.display_name, avatar: reply.avatar, body: reply.body, created_at: reply.created_at }));
    board.cycles = board.cycles.map(({ pending_meeting_pdf, deleted_meeting_pdfs, ...cycle }) => cycle);
    return json(board);
  }
  if (req.method === "POST") return handlePost(req);
  return json({ error: "Method not allowed" }, 405);
}

export async function handler(event) {
  const body = event.body && event.httpMethod !== "GET"
    ? event.isBase64Encoded ? Buffer.from(event.body, "base64") : event.body
    : undefined;
  const requestUrl = event.rawUrl?.startsWith("http")
    ? event.rawUrl
    : `https://readingnotes.local${event.rawUrl || event.path || "/api/board"}`;
  const req = new Request(requestUrl, {
    method: event.httpMethod,
    headers: event.headers || {},
    body,
  });

  try {
    const response = await handleRequest(req);
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers),
      body: await response.text(),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: error instanceof Error ? error.message : "保存服务暂时不可用" }),
    };
  }
}
