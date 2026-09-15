"use client";
/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { BookHeart, BookOpen, Bookmark, Check, ChevronRight, Library, LoaderCircle, MessageCircle, PenLine, Plus, Search, Settings, Sparkles, Trash2, Users, X } from "lucide-react";

type Profile = { deviceId: string; name: string; avatar: string };
type BookDraft = { isbn: string; title: string; authors: string; publisher: string; publishedDate: string; coverUrl: string; podcastUrl: string; chapters: string[] };
type Board = { books: any[]; library: any[]; notes: any[]; cycles: any[]; nominees: any[]; groupNotes: any[] };
type GroupNoteTarget = { cycleId: string; bookId: string };

const blank: BookDraft = { isbn: "", title: "", authors: "", publisher: "", publishedDate: "", coverUrl: "", podcastUrl: "", chapters: [] };
const avatars = ["☁️", "🌿", "🫐", "🪶", "🌙", "🫖", "🐚", "✒️", "🐈", "🐕", "🦊", "🐼", "🐧", "🦉", "🐳", "🦋", "🍎", "🍐", "🍊", "🍋", "🍓", "🍒", "🥝", "🍑", "🥐", "🍞", "🧀", "🍙", "🍜", "🍰", "🍵", "☕️"];
const statusLabel: Record<string, string> = { wish: "想读", reading: "在读", finished: "已读" };
const fallbackBoardStorageKey = "readingnotes-public-fallback-board";

const fallbackBooks = [
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

const fallbackCurrentBooks = [
  ["31a", "9786269673384", "家弒服務", "", "寂寞出版（繁体，最畅销）"],
  ["31b", "9787111555377", "当尼采哭泣", "〔美〕欧文·亚隆｜侯维之 译", "机械工业出版社（2017版）"],
  ["31c", "9787559848048", "可能性的艺术", "", "广西师范大学出版社"],
  ["31d", "9787553522685", "我们为什么会受骗", "", "上海文化出版社"],
  ["31e", "9787208136779", "查拉图斯特拉如是说", "〔德〕尼采｜孙周兴 译", "上海人民出版社（孙周兴译）"],
  ["31f", "9787559675583", "语言恶女", "", "北京联合出版公司"],
];

function baseFallbackBoard(): Board {
  const cycles = fallbackBooks.map(([idx, isbn, title, authors, publisher, cover], i) => ({
    id: `fallback-cycle-${idx}`,
    eyebrow: `第 ${String(i + 1).padStart(2, "0")} 期`,
    title,
    selected_book_id: `fallback-book-${idx}`,
    selected_title: title,
    selected_authors: authors,
    selected_cover: cover || "",
    selected_podcast: "",
    selected_isbn: isbn,
    selected_chapters: "[]",
    summary: "",
    is_active: i === fallbackBooks.length - 1 ? 1 : 0,
    created_at: i + 1,
  }));
  const historyNominees = fallbackBooks.slice(0, 30).map(([idx, isbn, title, authors, publisher, cover], i) => ({
    id: `fallback-nominee-${idx}`,
    cycle_id: `fallback-cycle-${idx}`,
    book_id: `fallback-book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: cover || "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    note: publisher || `${title}（往期推荐）`,
    created_at: i + 1,
  }));
  const currentNominees = fallbackCurrentBooks.map(([idx, isbn, title, authors, publisher], i) => ({
    id: `fallback-nominee-${idx}`,
    cycle_id: "fallback-cycle-31",
    book_id: `fallback-book-${idx}`,
    isbn,
    title,
    authors,
    publisher,
    cover_url: "",
    podcast_url: "",
    published_date: "",
    chapters_json: "[]",
    note: publisher || "本期推荐",
    created_at: 31 + i,
  }));
  return { books: [], library: [], notes: [], cycles, nominees: [...historyNominees, ...currentNominees], groupNotes: [] };
}

function fallbackBoard(): Board {
  const base = baseFallbackBoard();
  if (typeof window === "undefined") return base;

  try {
    const saved = localStorage.getItem(fallbackBoardStorageKey);
    if (!saved) return base;
    const parsed = JSON.parse(saved) as Board;
    return {
      books: [],
      library: [],
      notes: [],
      cycles: parsed.cycles?.length ? parsed.cycles : base.cycles,
      nominees: parsed.nominees?.length ? parsed.nominees : base.nominees,
      groupNotes: parsed.groupNotes || [],
    };
  } catch {
    return base;
  }
}

function saveFallbackBoard(board: Board) {
  if (typeof window === "undefined") return;
  localStorage.setItem(fallbackBoardStorageKey, JSON.stringify({ cycles: board.cycles, nominees: board.nominees, groupNotes: board.groupNotes }));
}

function cleanCycles(cycles: any[]) {
  const parsed = cycles.map((c) => ({ ...c, is_active: Number(c.is_active) === 1 }));
  return parsed.sort((a, b) => Number(b.created_at || 0) - Number(a.created_at || 0));
}

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileReady, setProfileReady] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState({ name: "", avatar: "☁️" });
  const [board, setBoard] = useState<Board>({ books: [], library: [], notes: [], cycles: [], nominees: [], groupNotes: [] });
  const [tab, setTab] = useState<"mine" | "club" | "settings">("mine");
  const [filter, setFilter] = useState("reading");
  const [modal, setModal] = useState<null | "book" | "note" | "nominate" | "groupNote" | "cycle" | "summary">(null);
  const [editingNomineeId, setEditingNomineeId] = useState<string | null>(null);
  const [editingNomineeCycleId, setEditingNomineeCycleId] = useState<string | null>(null);
  const [editingLibraryId, setEditingLibraryId] = useState<string | null>(null);
  const [cycleForm, setCycleForm] = useState({ id: "", eyebrow: "", title: "" });
  const [book, setBook] = useState<BookDraft>(blank);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [status, setStatus] = useState("reading");
  const [progress, setProgress] = useState(20);
  const [chapter, setChapter] = useState("");
  const [quote, setQuote] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [boardError, setBoardError] = useState("");
  const [viewCycleId, setViewCycleId] = useState("");
  const [groupNoteTarget, setGroupNoteTarget] = useState<GroupNoteTarget | null>(null);
  const [editingGroupNoteId, setEditingGroupNoteId] = useState<string | null>(null);
  const [editingPersonalNoteId, setEditingPersonalNoteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("f2f-reading-profile");
      if (raw) setProfile(JSON.parse(raw));
    } finally {
      setProfileReady(true);
    }
  }, []);

  useEffect(() => {
    if (profile) refresh(profile.deviceId);
  }, [profile]);

  const cycles = useMemo(() => cleanCycles(board.cycles || []), [board.cycles]);
  const activeCycle = cycles.find((x) => x.is_active) || cycles[0];
  const sortedCyclesAsc = useMemo(() => [...cycles].sort((a, b) => Number(a.created_at || 0) - Number(b.created_at || 0)), [cycles]);
  const viewCycle = useMemo(() => {
    if (!cycles.length) return null;
    if (viewCycleId) return cycles.find((c) => c.id === viewCycleId) || activeCycle || cycles[0];
    return activeCycle || cycles[0];
  }, [viewCycleId, cycles, activeCycle]);

  useEffect(() => {
    if (!cycles.length) return;
    if (!viewCycleId || !cycles.some((c) => c.id === viewCycleId)) {
      setViewCycleId(activeCycle?.id || cycles[0].id);
      return;
    }
  }, [cycles, activeCycle, viewCycleId]);

  const visibleLibrary = useMemo(() => board.library.filter((x) => x.status === filter), [board.library, filter]);
  const parseChapters = (raw: string | undefined) => {
    try {
      return JSON.parse(raw || "[]");
    } catch {
      return [];
    }
  };

  const chapters = useMemo(() => {
    const key = selectedEntry?.chapters_json || selectedEntry?.chaptersJson;
    if (!key) return [];
    return parseChapters(key);
  }, [selectedEntry]);

  const viewNominees = useMemo(() => board.nominees.filter((n) => n.cycle_id === viewCycle?.id), [board.nominees, viewCycle?.id]);
  const viewGroupNotes = useMemo(() => board.groupNotes.filter((n) => n.cycle_id === viewCycle?.id), [board.groupNotes, viewCycle?.id]);
  const selectedBook = useMemo(() => {
    if (!viewCycle?.selected_book_id) return null;
    return {
      id: viewCycle.selected_book_id,
      title: viewCycle.selected_title,
      authors: viewCycle.selected_authors,
      cover_url: viewCycle.selected_cover,
      isbn: viewCycle.selected_isbn,
      chapters_json: viewCycle.selected_chapters,
      podcast_url: viewCycle.selected_podcast,
    };
  }, [viewCycle]);

  async function refresh(deviceId = profile?.deviceId || "") {
    const res = await fetch(`/api/board?deviceId=${encodeURIComponent(deviceId)}`, { cache: "no-store" });
    const data = (await res.json().catch(() => ({}))) as Partial<Board> & { error?: string };
    if (res.ok && data.cycles?.length) {
      setBoard(data as Board);
      setBoardError("");
    } else {
      setBoard(fallbackBoard());
      setBoardError(data.error ? `正在显示公共书单；线上同步暂时返回：${data.error}` : "正在显示公共书单；线上同步暂时没有返回共读数据。");
    }
  }

  function saveProfile() {
    if (!draftProfile.name.trim()) return;
    const next = { deviceId: profile?.deviceId || crypto.randomUUID(), name: draftProfile.name.trim(), avatar: draftProfile.avatar };
    localStorage.setItem("f2f-reading-profile", JSON.stringify(next));
    setProfile(next);
    setEditingProfile(false);
  }

  async function lookup() {
    if (!book.isbn) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/lookup?isbn=${encodeURIComponent(book.isbn)}`);
      const data = (await res.json()) as BookDraft & { tocSource?: string; error?: string; catalogSource?: string };
      if (res.ok && data.title) {
        setBook({ ...blank, ...data, chapters: data.chapters || [] });
        setMessage(data.catalogSource ? `已取得书目：${data.catalogSource}` : "已取得书目；可继续补充作者、封面和 Podcast 地址。");
      } else {
        setMessage(data.error || "没有找到；静态部署版可直接手动填写书目信息。");
      }
    } catch {
      setMessage("当前部署没有连接 ISBN 服务；可以直接手动填写书名、作者、封面和 Podcast 地址。");
    }

    setLoading(false);
  }

  function finishAction() {
    setModal(null);
    setEditingNomineeId(null);
    setEditingNomineeCycleId(null);
    setGroupNoteTarget(null);
    setEditingGroupNoteId(null);
    setEditingPersonalNoteId(null);
    setEditingLibraryId(null);
    setBook(blank);
    setBody("");
    setQuote("");
    setChapter("");
  }

  function applyFallbackAction(payload: Record<string, unknown>) {
    const action = String(payload.action || "");
    const cycleId = String(payload.cycleId || "");
    const nomineeId = String(payload.nomineeId || "");
    const usesFallback = cycleId.startsWith("fallback-") || nomineeId.startsWith("fallback-");
    if (!usesFallback) return false;

    const next = { ...board, cycles: [...board.cycles], nominees: [...board.nominees], groupNotes: [...board.groupNotes] };
    const now = Date.now();

    if (action === "updateNominee" || action === "nominate") {
      const nextBook = payload.book as BookDraft | undefined;
      if (!nextBook?.title) return false;
      const targetCycleId = cycleId || viewCycle?.id;
      const existingIndex = next.nominees.findIndex((n) => n.id === nomineeId);
      const existing = existingIndex >= 0 ? next.nominees[existingIndex] : null;
      const nextNominee = {
        ...(existing || {}),
        id: existing?.id || `fallback-nominee-custom-${now}`,
        cycle_id: targetCycleId,
        book_id: existing?.book_id || `fallback-book-custom-${now}`,
        isbn: nextBook.isbn,
        title: nextBook.title,
        authors: nextBook.authors,
        publisher: nextBook.publisher,
        cover_url: nextBook.coverUrl,
        podcast_url: nextBook.podcastUrl,
        published_date: nextBook.publishedDate,
        chapters_json: JSON.stringify(nextBook.chapters || []),
        note: String(payload.note || ""),
        created_at: existing?.created_at || now,
      };
      if (existingIndex >= 0) next.nominees[existingIndex] = nextNominee;
      else next.nominees.push(nextNominee);

      if (payload.select) {
        next.cycles = next.cycles.map((cycle) => cycle.id === targetCycleId ? {
          ...cycle,
          selected_book_id: nextNominee.book_id,
          selected_title: nextNominee.title,
          selected_authors: nextNominee.authors,
          selected_cover: nextNominee.cover_url,
          selected_podcast: nextNominee.podcast_url,
          selected_isbn: nextNominee.isbn,
          selected_chapters: nextNominee.chapters_json,
        } : cycle);
      }
    } else if (action === "deleteNominee") {
      const removed = next.nominees.find((n) => n.id === nomineeId);
      next.nominees = next.nominees.filter((n) => n.id !== nomineeId);
      if (removed) {
        next.cycles = next.cycles.map((cycle) => cycle.id === cycleId && cycle.selected_book_id === removed.book_id ? { ...cycle, selected_book_id: null } : cycle);
      }
    } else if (action === "setCycleSelection") {
      const nominee = next.nominees.find((n) => n.id === nomineeId);
      if (!nominee) return false;
      next.cycles = next.cycles.map((cycle) => cycle.id === cycleId ? {
        ...cycle,
        selected_book_id: nominee.book_id,
        selected_title: nominee.title,
        selected_authors: nominee.authors,
        selected_cover: nominee.cover_url,
        selected_podcast: nominee.podcast_url,
        selected_isbn: nominee.isbn,
        selected_chapters: nominee.chapters_json,
      } : cycle);
    } else if (action === "updateCycle") {
      next.cycles = next.cycles.map((cycle) => cycle.id === payload.cycleId ? { ...cycle, eyebrow: String(payload.eyebrow || cycle.eyebrow), title: String(payload.title || cycle.title) } : cycle);
    } else {
      return false;
    }

    setBoard(next);
    saveFallbackBoard(next);
    setMessage("已保存在当前浏览器。公共数据库同步恢复后，会继续使用线上保存。");
    finishAction();
    return true;
  }

  async function act(payload: Record<string, unknown>) {
    setLoading(true);
    setMessage("");

    const shouldFallback = String(payload.cycleId || "").startsWith("fallback-") || String(payload.nomineeId || "").startsWith("fallback-");

    const res = await fetch("/api/board", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      if (shouldFallback && applyFallbackAction(payload)) {
        setLoading(false);
        return true;
      }
      setMessage(data.error || "保存失败");
      return false;
    }

    await refresh();
    finishAction();
    return true;
  }

  function openNote(entry: any) {
    setSelectedEntry(entry);
    setEditingPersonalNoteId(null);
    setChapter(entry.current_chapter || "");
    setQuote("");
    setBody("");
    setGroupNoteTarget(null);
    setEditingGroupNoteId(null);
    setModal("note");
  }

  function openPersonalNoteEditor(note: any) {
    setSelectedEntry(note);
    setEditingPersonalNoteId(note.id);
    setChapter(note.chapter || "");
    setQuote(note.quote || "");
    setBody(note.body || "");
    setGroupNoteTarget(null);
    setEditingGroupNoteId(null);
    setModal("note");
  }

  function openLibraryEditor(entry: any) {
    setEditingLibraryId(entry.id);
    setBook({
      isbn: entry.isbn || "",
      title: entry.title || "",
      authors: entry.authors || "",
      publisher: entry.publisher || "",
      publishedDate: entry.published_date || "",
      coverUrl: entry.cover_url || "",
      podcastUrl: entry.podcast_url || "",
      chapters: parseChapters(entry.chapters_json),
    });
    setStatus(entry.status || "reading");
    setProgress(Number(entry.progress || 0));
    setModal("book");
  }

  function openGroupNoteFor(entry: any, cycle: any) {
    const bookId = entry?.book_id || entry?.id;
    if (!bookId || !cycle?.id) return;

    setSelectedEntry(entry);
    setGroupNoteTarget({ cycleId: cycle.id, bookId });
    setEditingGroupNoteId(null);
    setChapter(entry.current_chapter || entry.chapter || "");
    setQuote("");
    setBody("");
    setModal("groupNote");
  }

  function openGroupNoteEditor(note: any) {
    setSelectedEntry(note);
    setGroupNoteTarget({ cycleId: note.cycle_id, bookId: note.book_id });
    setEditingGroupNoteId(note.id);
    setChapter(note.chapter || "");
    setQuote(note.quote || "");
    setBody(note.body || "");
    setModal("groupNote");
  }

  function openNomineeEditor(candidate: any, cycleId?: string) {
    setEditingNomineeId(candidate.id);
    setEditingNomineeCycleId(cycleId || candidate.cycle_id || viewCycle?.id || null);
    setBook({
      isbn: candidate.isbn || "",
      title: candidate.title || "",
      authors: candidate.authors || "",
      publisher: candidate.publisher || "",
      publishedDate: candidate.published_date || "",
      coverUrl: candidate.cover_url || candidate.coverUrl || "",
      podcastUrl: candidate.podcast_url || candidate.podcastUrl || "",
      chapters: parseChapters(candidate.chapters_json),
    });
    setQuote(candidate.note || "");
    setModal("nominate");
  }

  function openCycleEditor(cycle?: any) {
    setCycleForm({ id: cycle?.id || "", eyebrow: cycle?.eyebrow || "本期共读", title: cycle?.title || "" });
    setModal("cycle");
  }

  function closeModal() {
    setModal(null);
    setMessage("");
    setEditingNomineeId(null);
    setEditingNomineeCycleId(null);
    setGroupNoteTarget(null);
  }

  function verifyQuote(title: string) {
    if (!quote.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(`"${quote.trim()}" ${title}`)}`, "_blank", "noopener,noreferrer");
  }

  useEffect(() => {
    const context = (document as unknown as { modelContext?: { registerTool: (tool: Record<string, unknown>, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool || !profile) return;

    const lifecycle = new AbortController();
    const register = (tool: Record<string, unknown>) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
      } catch {}
    };

    register({
      name: "list_reading_board",
      title: "查看读记概况",
      description: "查看当前设备的个人书架数量和正在进行的共读期次。",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async () => ({
        libraryCount: board.library.length,
        noteCount: board.notes.length,
        activeCycle: viewCycle?.title || null,
        sharedNoteCount: board.groupNotes.length,
      }),
    });

    register({
      name: "add_personal_reading_note",
      title: "添加个人读书笔记",
      description: "给个人书架中已有的一本书添加章节笔记；bookId 必须来自当前书架。",
      inputSchema: {
        type: "object",
        properties: { bookId: { type: "string" }, body: { type: "string" }, chapter: { type: "string" }, quote: { type: "string" } },
        required: ["bookId", "body"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (raw: unknown) => {
        const x = raw as Record<string, unknown>;
        if (typeof x.bookId !== "string" || typeof x.body !== "string" || !x.body.trim() || !board.library.some((b) => b.book_id === x.bookId)) {
          throw new Error("需要有效的书架 bookId 和非空笔记");
        }
        const ok = await act({ action: "personalNote", profile, bookId: x.bookId, chapter: typeof x.chapter === "string" ? x.chapter : "", quote: typeof x.quote === "string" ? x.quote : "", body: x.body });
        if (!ok) throw new Error("笔记保存失败");
        return { saved: true, bookId: x.bookId };
      },
    });

    register({
      name: "add_shared_reading_note",
      title: "添加共读笔记",
      description: "给当前查看的期次所选书目添加一则共享章节笔记。",
      inputSchema: { type: "object", properties: { body: { type: "string" }, chapter: { type: "string" }, quote: { type: "string" }, cycleId: { type: "string" }, bookId: { type: "string" } }, required: ["body", "cycleId", "bookId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (raw: unknown) => {
        const x = raw as Record<string, unknown>;
        if (typeof x.body !== "string" || !x.body.trim() || typeof x.cycleId !== "string" || typeof x.bookId !== "string") {
          throw new Error("共读笔记不能为空");
        }
        const ok = await act({
          action: "groupNote",
          profile,
          cycleId: x.cycleId,
          bookId: x.bookId,
          chapter: typeof x.chapter === "string" ? x.chapter : "",
          quote: typeof x.quote === "string" ? x.quote : "",
          body: x.body,
        });
        if (!ok) throw new Error("共读笔记保存失败");
        return { saved: true, cycleId: x.cycleId, bookId: x.bookId };
      },
    });

    return () => lifecycle.abort();
  }, [profile, board, viewCycle]);

  const nomineeCycleId = editingNomineeCycleId || viewCycle?.id;

  return (
    <main className="app-shell">
      <a className="skip-link" href="#reading-content">跳到阅读内容</a>
      <header className="topbar">
        <button className="brand" onClick={() => setTab("mine")}>
          <img src="/favicon.svg" alt="" />
          <span>
            <b>读记</b>
            <small>READING NOTES</small>
          </span>
        </button>
        <nav className="bottom-nav" aria-label="主导航">
          <button aria-current={tab === "mine" ? "page" : undefined} className={tab === "mine" ? "active" : ""} onClick={() => setTab("mine")}><BookOpen /><span>我的阅读</span></button>
          <button aria-current={tab === "club" ? "page" : undefined} className={tab === "club" ? "active" : ""} onClick={() => setTab("club")}><Users /><span>共读现场</span></button>
          <button aria-current={tab === "settings" ? "page" : undefined} className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}><Settings /><span>设置</span></button>
        </nav>
        <button className="profile-chip" aria-label="打开读者设置" onClick={() => setTab("settings")}>
          <span>{profile?.avatar || "☁️"}</span>
          <div>
            <b>{profile?.name || "新读者"}</b>
            <small>今天也读一页</small>
          </div>
        </button>
      </header>

      <div className="page-wrap" id="reading-content">
        {boardError && <p className="form-message">{boardError}</p>}
        {tab === "mine" && (
          <>
            <section className="page-heading">
              <div>
                <h1>我的<span>阅读</span><i aria-hidden="true">.</i></h1>
                <p>一本一本，留下自己的阅读年轮。</p>
              </div>
              <button className="primary" onClick={() => { setBook(blank); setEditingLibraryId(null); setStatus("reading"); setProgress(20); setModal("book"); }}><Plus size={18} />加入一本书</button>
            </section>

            <section className="stat-ribbon" aria-label="阅读记录">
              <div><BookOpen /><span><b>{board.library.filter((x) => x.status === "reading").length}</b> 本正在读</span></div>
              <div><Bookmark /><span><b>{board.notes.length}</b> 则笔记</span></div>
              <span className="journal-signature">READING NOTES</span>
            </section>

            <div className="journal-grid">
              <section className="shelf-section" aria-label="个人书架">
                <div className="segmented" aria-label="书架分类">
                  {Object.entries(statusLabel).map(([key, label]) => (
                    <button
                      key={key}
                      aria-pressed={filter === key}
                      className={filter === key ? "active" : ""}
                      onClick={() => setFilter(key)}
                    >
                      {label}
                      <span>{board.library.filter((x) => x.status === key).length}</span>
                    </button>
                  ))}
                </div>
                {visibleLibrary.length ? (
                  <div className="book-grid">
                    {visibleLibrary.map((entry) => (
                      <article className="book-card" key={entry.id}>
                        <Cover book={entry} />
                        <div className="book-copy">
                          <span className="book-status">{statusLabel[entry.status]}</span>
                          <h3>{entry.title}</h3>
                          <p>{entry.authors || "作者待补"}</p>
                          {entry.status === "reading" && (
                            <>
                              <div className="progress-row">
                                <span>阅读进度</span>
                                <b>{entry.progress}%</b>
                              </div>
                              <div className="progress-track"><i style={{ width: `${entry.progress}%` }} /></div>
                            </>
                          )}
                          <div className="button-row compact">
                            <button className="text-button" onClick={() => openNote(entry)}>写笔记 <ChevronRight size={16} /></button>
                            <button className="text-button" onClick={() => openLibraryEditor(entry)}>编辑书目</button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <Empty
                    icon={<Library />}
                    title={`“${statusLabel[filter]}”书架还是空的`}
                    text="用 ISBN 找到一本书，或直接手动填写。"
                    action={() => setModal("book")}
                  />
                )}
              </section>

              <aside className="journal-notes">
                <div className="section-title">
                  <h2>页边笔记<span>{board.notes.length.toString().padStart(2, "0")}</span></h2>
                </div>
                {board.notes.length ? (
                  <div className="notes-list">
                    {board.notes.slice(0, 4).map((n) => <NoteCard key={n.id} note={n} canEdit onEdit={() => openPersonalNoteEditor(n)} onDelete={() => { if (profile) void act({ action: "deletePersonalNote", profile, noteId: n.id }); }} />)}
                  </div>
                ) : (
                  <div className="notes-empty">
                    <PenLine size={28} />
                    <h3>读到心里，<br />就记在这里。</h3>
                    <p>加入一本书后，摘下喜欢的句子，留下你自己的想法。</p>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}

        {tab === "club" && (
          <>
            <section className="club-hero">
              <div>
                <p className="eyebrow">{viewCycle?.eyebrow || "本期共读"}</p>
                <div className="cycle-title-row">
                  <h1>{viewCycle?.title || "共读现场"}</h1>
                  <button className="text-button cycle-edit" onClick={() => openCycleEditor(viewCycle)}>编辑本期</button>
                </div>
                <p>同读一本书，也保留每一种不同的声音。</p>
              </div>
              <div className="hero-mark">
                <Users />
                <b>{board.groupNotes.length}</b>
                <span>则共读笔记</span>
              </div>
            </section>

            <div className="cycle-picker-row">
              <label>
                当前查看期次
                <select
                  value={viewCycle?.id || ""}
                  onChange={(e) => setViewCycleId(e.target.value)}
                >
                  {sortedCyclesAsc.map((cycle) => (
                    <option value={cycle.id} key={cycle.id}>{cycle.eyebrow || ""} {cycle.title}</option>
                  ))}
                </select>
              </label>
              <button className="text-button" onClick={() => openCycleEditor(viewCycle)}><Sparkles size={15}/>编辑该期次</button>
            </div>

            <section className="club-layout">
              <div className="selected-panel">
                <div className="panel-head">
                  <div><h2>本期所选</h2></div>
                  {selectedBook ? (
                    <button className="primary small" onClick={() => openGroupNoteFor(selectedBook, viewCycle)}>
                      <PenLine size={16} />写共读笔记
                    </button>
                  ) : (
                    <button className="primary small" onClick={() => { setBook(blank); setQuote(""); setEditingNomineeId(null); setEditingNomineeCycleId(viewCycle?.id || null); setModal("nominate"); }}>
                      <Plus size={16} />先选出书目
                    </button>
                  )}
                </div>
                {selectedBook ? (
                  <div className="selected-book">
                    <Cover book={selectedBook} />
                    <div>
                      <h3>{selectedBook.title}</h3>
                      <p>{selectedBook.authors || "作者待补"}</p>
                      <span>ISBN {selectedBook.isbn}</span>
                      <div className="podcast-slot">
                        {selectedBook.podcast_url ? (
                          <a href={selectedBook.podcast_url} target="_blank" rel="noopener noreferrer">打开 Podcast</a>
                        ) : (
                          <i>Podcast 地址待补</i>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Empty
                    icon={<BookHeart />}
                    title="本期还没有选定书目"
                    text="先把推选书目放进来，再选中这一期要共读的书。"
                    action={() => { setBook(blank); setQuote(""); setEditingNomineeId(null); setEditingNomineeCycleId(viewCycle?.id || null); setModal("nominate"); }}
                  />
                )}

                <div className="summary-card">
                  <div><Sparkles /><b>本期讨论小结</b></div>
                  <p>{viewCycle?.summary || "讨论结束后，把共同抵达的地方写在这里。"}</p>
                  <button className="text-button" onClick={() => { setBody(viewCycle?.summary || ""); setModal("summary"); }}>编辑小结 <ChevronRight size={16} /></button>
                </div>
              </div>

              <aside className="nominee-panel">
                <div className="panel-head">
                  <div><h2>推选书目</h2></div>
                  <button className="icon-button" aria-label="添加推选书目" onClick={() => { setBook(blank); setQuote(""); setEditingNomineeId(null); setEditingNomineeCycleId(viewCycle?.id || null); setModal("nominate"); }}>
                    <Plus />
                  </button>
                </div>
                <div className="nominee-list">
                  {viewNominees.map((n) => (
                    <div className="nominee" key={n.id}>
                      <Cover book={n} />
                      <div>
                        <b>{n.title}</b>
                        <span>{n.authors || "作者待补"}</span>
                        {n.note && <small>{n.note}</small>}
                      </div>
                      <div className="nominee-actions">
                        <button className="text-button tiny" onClick={() => act({ action: "setCycleSelection", cycleId: viewCycle?.id, nomineeId: n.id })}>
                          {n.book_id === viewCycle?.selected_book_id ? "已选" : "设为本期"}
                        </button>
                        {n.book_id === viewCycle?.selected_book_id && n.book_id && <Check className="selected-check" aria-label="已选为本期" />}
                        <button className="text-button tiny" onClick={() => openGroupNoteFor(n, viewCycle)}>写共读笔记</button>
                        <button className="icon-button tiny" aria-label="编辑推选书目" onClick={() => openNomineeEditor(n, viewCycle?.id)}><PenLine size={14} /></button>
                        <button className="icon-button tiny danger" aria-label="删除推选书目" onClick={() => act({ action: "deleteNominee", cycleId: viewCycle?.id, nomineeId: n.id })}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {!viewNominees.length && <p className="quiet">还没有推选书目。</p>}
                </div>
                <button className="outline full" onClick={() => openCycleEditor()}><Plus size={17} />新建下一期</button>
              </aside>
            </section>

            <section className="notes-section">
              <div className="section-title"><div><h2>章节与共读笔记</h2></div></div>
              {viewGroupNotes.length ? (
                <div className="notes-list">{viewGroupNotes.map((n) => <NoteCard key={n.id} note={n} shared canEdit={Boolean(profile && n.device_id === profile.deviceId)} onEdit={() => openGroupNoteEditor(n)} onDelete={() => { if (profile) void act({ action: "deleteGroupNote", profile, noteId: n.id }); }} />)}</div>
              ) : (
                <Empty
                  icon={<MessageCircle />}
                  title="等第一则共读笔记"
                  text="引用一句话，写下它让你想到的事。"
                  action={selectedBook ? () => openGroupNoteFor(selectedBook, viewCycle) : () => { setBook(blank); setQuote(""); setEditingNomineeId(null); setEditingNomineeCycleId(viewCycle?.id || null); setModal("nominate"); }}
                />
              )}
            </section>

            <section className="history-section">
              <div className="section-title"><h2>往期内容</h2></div>
              <div className="history-grid">
                {sortedCyclesAsc.map((cycle) => {
                  const items = board.nominees.filter((n) => n.cycle_id === cycle.id);
                  return (
                    <details key={cycle.id} className="history-cycle" open={cycle.id === viewCycle?.id}>
                      <summary>
                        <div className="history-cycle-head">
                          <div>
                            <p className="eyebrow">{cycle.eyebrow}</p>
                            <h3>{cycle.title}</h3>
                          </div>
                          <button className="text-button tiny" onClick={() => setViewCycleId(cycle.id)}>打开这一期</button>
                        </div>
                      </summary>
                      <div className="history-nominees">
                        {items.length ? (
                          items.map((n) => (
                            <div className="history-nominee" key={`${cycle.id}-${n.id}`}>
                              <Cover book={n} />
                              <div>
                                <b>{n.title}</b>
                                <span>{n.authors || "作者待补"}</span>
                                {n.note && <small>{n.note}</small>}
                              </div>
                              <div className="nominee-actions">
                                <button className="text-button tiny" onClick={() => act({ action: "setCycleSelection", cycleId: cycle.id, nomineeId: n.id })}>
                                  {n.book_id === cycle.selected_book_id ? "已选" : "设为本期"}
                                </button>
                                <button className="text-button tiny" onClick={() => openGroupNoteFor(n, cycle)}>写共读笔记</button>
                                <button className="icon-button tiny" aria-label="编辑推选书目" onClick={() => openNomineeEditor(n, cycle.id)}><PenLine size={14} /></button>
                                <button className="icon-button tiny danger" aria-label="删除推选书目" onClick={() => act({ action: "deleteNominee", cycleId: cycle.id, nomineeId: n.id })}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="quiet">这一期还没有推选书目。</p>
                        )}
                      </div>
                    </details>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {tab === "settings" && (
          <section className="settings-page">
            <h1>读者设置</h1>
            <div className="settings-card">
              <div className="big-avatar">{profile?.avatar || "☁️"}</div>
              <div>
                <h2>{profile?.name || "还没有昵称"}</h2>
                <p>不需要邮箱或密码。昵称和头像保存在这台设备里，用于标记你写下的笔记。</p>
                <button className="outline" onClick={() => {
                  setDraftProfile({ name: profile?.name || "", avatar: profile?.avatar || "☁️" });
                  setEditingProfile(true);
                }}>
                  <Settings size={17} />修改昵称与头像
                </button>
              </div>
            </div>

            <div className="info-card">
              <Bookmark />
              <div>
                <b>把网页放到手机桌面</b>
                <p>iPhone 用 Safari 的“分享 → 添加到主屏幕”；Android 用浏览器菜单里的“添加到主屏幕”。蓝色书签会成为桌面图标。</p>
              </div>
            </div>

            <div className="info-card">
              <BookHeart />
              <div>
                <b>期次初始化（往期 31 期）</b>
                <p>如果你希望强制刷新中文书单历史期次与“第 31 期”为当前期，可点下面按钮重新同步一次。</p>
                <button className="text-button" onClick={() => act({ action: "seedHistory" })}>重建往期书单</button>
              </div>
            </div>

            <div className="info-card">
              <Search />
              <div>
                <b>中文 ISBN API</b>
                <p>已接入可配置的中文书目接口。部署时设置 READING_NOTES_CHINESE_API_URL；如果需要密钥，再设置 READING_NOTES_CHINESE_API_KEY。接口地址可包含 {"{isbn}"}，也可以由读记自动追加 isbn 参数。</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {profileReady && (!profile || editingProfile) && (
        <div className="modal-backdrop welcome-backdrop">
          <div className="modal profile-modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <div className="welcome-brand">
              <div className="welcome-icon"><img src="/app-icon.svg" alt="读记图标" /></div>
              <strong>读记<span>READING<br />NOTES</span></strong>
              <p>一本一本，<br />留下自己的<br />阅读年轮。</p>
            </div>
            <div className="welcome-form">
              {editingProfile && <button className="icon-button welcome-close" onClick={() => setEditingProfile(false)} aria-label="关闭"><X /></button>}
              <h2 id="welcome-title">先留下一个<br />阅读名字。</h2>
              <p>不注册账号，只用昵称和头像认出彼此。</p>
              <label>昵称<input value={draftProfile.name} onChange={(e) => setDraftProfile({ ...draftProfile, name: e.target.value })} placeholder="例如：一叶、Mia、蓝莓" autoFocus /></label>
              <div className="avatar-pick">
                {avatars.map((a) => (
                  <button key={a} aria-label={`选择头像 ${a}`} aria-pressed={draftProfile.avatar === a} className={draftProfile.avatar === a ? "active" : ""} onClick={() => setDraftProfile({ ...draftProfile, avatar: a })}>{a}</button>
                ))}
              </div>
              <button className="primary full" disabled={!draftProfile.name.trim()} onClick={saveProfile}>{editingProfile ? "保存昵称与头像" : "进入读记"}<ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {modal && profile && (
        <Modal title={modal === "cycle" ? (cycleForm.id ? "编辑一期共读" : "新建一期共读") : modalTitle(modal)} onClose={closeModal}>
          {(modal === "book" || modal === "nominate") && (
            <BookForm
              book={book}
              setBook={setBook}
              lookup={lookup}
              loading={loading}
              message={message}
            />
          )}

          {modal === "book" && (
            <>
              <label>放到书架<select value={status} onChange={(e) => setStatus(e.target.value)}><option value="wish">想读</option><option value="reading">在读</option><option value="finished">已读</option></select></label>
              {status === "reading" && <label>当前进度 <b>{progress}%</b><input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} /></label>}
              <button className="primary full" disabled={!book.title || loading} onClick={() => act({ action: "saveLibrary", profile, libraryId: editingLibraryId, book, status, progress })}>
                {loading ? <LoaderCircle className="spin" /> : <Bookmark />}
                {editingLibraryId ? "保存书架修改" : "保存到书架"}
              </button>
            </>
          )}

          {modal === "nominate" && (
            <>
              <label>推荐理由（可选）<textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="为什么希望和大家一起读这本？" /></label>
              <div className="button-row">
                <button
                  className="outline"
                  disabled={!book.title || loading}
                  onClick={() => act(editingNomineeId
                    ? { action: "updateNominee", profile, nomineeId: editingNomineeId, book, note: quote, cycleId: nomineeCycleId, select: false }
                    : { action: "nominate", profile, book, note: quote, cycleId: nomineeCycleId, select: false }
                  )}
                >
                  {editingNomineeId ? "更新推选" : "加入推选"}
                </button>
                <button
                  className="primary"
                  disabled={!book.title || loading}
                  onClick={() => act(editingNomineeId
                    ? { action: "updateNominee", profile, nomineeId: editingNomineeId, book, note: quote, cycleId: nomineeCycleId, select: true }
                    : { action: "nominate", profile, book, note: quote, cycleId: nomineeCycleId, select: true }
                  )}
                >
                  {editingNomineeId ? "更新并选为本期" : "加入并选为本期"}
                </button>
              </div>
            </>
          )}

          {(modal === "note" || modal === "groupNote") && (
            <NoteForm
              chapter={chapter}
              setChapter={setChapter}
              quote={quote}
              setQuote={setQuote}
              body={body}
              setBody={setBody}
              chapters={chapters}
              title={selectedEntry?.title || ""}
              verify={() => verifyQuote(selectedEntry?.title || "")}
            />
          )}

          {modal === "note" && (
            <button className="primary full" disabled={!body.trim() || loading} onClick={() => act(editingPersonalNoteId ? { action: "updatePersonalNote", profile, noteId: editingPersonalNoteId, chapter, quote, body } : { action: "personalNote", profile, bookId: selectedEntry.book_id, chapter, quote, body })}>{editingPersonalNoteId ? "保存修改" : "保存个人笔记"}</button>
          )}

          {modal === "groupNote" && groupNoteTarget && (
            <button className="primary full" disabled={!body.trim() || loading} onClick={() => act(editingGroupNoteId
              ? { action: "updateGroupNote", profile, noteId: editingGroupNoteId, chapter, quote, body }
              : { action: "groupNote", profile, bookId: groupNoteTarget.bookId, cycleId: groupNoteTarget.cycleId, chapter, quote, body }
            )}>
              {editingGroupNoteId ? "保存修改" : "发布到共读区"}
            </button>
          )}

          {modal === "summary" && <>
            <label>讨论文字总结<textarea className="tall" value={body} onChange={(e) => setBody(e.target.value)} placeholder="这一期大家讨论了什么？有哪些分歧和共同发现？" autoFocus /></label>
            <button className="primary full" onClick={() => act({ action: "summary", cycleId: viewCycle?.id, summary: body })}>保存小结</button>
          </>}

          {modal === "cycle" && <CycleForm loading={loading} isEdit={Boolean(cycleForm.id)} eyebrow={cycleForm.eyebrow} title={cycleForm.title} onSave={(eyebrow, title) => cycleForm.id
            ? act({ action: "updateCycle", cycleId: cycleForm.id, eyebrow, title })
            : act({ action: "newCycle", eyebrow, title })}
          />}

          {message && modal !== "book" && modal !== "nominate" && <p className="form-message">{message}</p>}
        </Modal>
      )}
    </main>
  );
}

function Cover({ book }: { book: any }) {
  const [failed, setFailed] = useState(false);
  const coverUrl = book.cover_url || book.coverUrl;
  const imageUrl = coverUrl && coverUrl.includes("doubanio.com") ? `/api/image?url=${encodeURIComponent(coverUrl)}` : coverUrl;

  useEffect(() => setFailed(false), [coverUrl]);

  if (imageUrl && !failed) {
    return <img className="cover" src={imageUrl} alt={`${book.title}封面`} onError={() => setFailed(true)} />;
  }

  return (
    <div className="cover fallback">
      <Bookmark />
      <span>{(book.title || "未命名").slice(0, 8)}</span>
    </div>
  );
}

function Empty({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: () => void }) {
  return (
    <div className="empty">
      <span>{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <button className="outline" onClick={action}><Plus size={17} />开始添加</button>
    </div>
  );
}

function NoteCard({ note, shared = false, canEdit = false, onEdit, onDelete }: { note: any; shared?: boolean; canEdit?: boolean; onEdit?: () => void; onDelete?: () => void }) {
  return (
    <article className="note-card">
      <div className="note-meta">
        <span className="note-avatar">{note.avatar}</span>
        <div>
          <b>{shared ? note.display_name : note.title}</b>
          <small>{note.chapter || "未标章节"} · {new Date(note.created_at).toLocaleDateString("zh-CN")}</small>
        </div>
        {canEdit && (
          <div className="note-actions">
            <button className="icon-button tiny" aria-label="编辑这则共读笔记" onClick={onEdit}><PenLine size={14} /></button>
            <button className="icon-button tiny danger" aria-label="删除这则共读笔记" onClick={onDelete}><Trash2 size={14} /></button>
          </div>
        )}
      </div>
      {note.quote && <blockquote>“{note.quote}”</blockquote>}
      <p>{note.body}</p>
    </article>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function modalTitle(x: string) {
  return ({
    book: "加入个人书架",
    note: "写一则个人笔记",
    nominate: "推选一本书",
    groupNote: "写共读笔记",
    summary: "编辑讨论小结",
  } as Record<string, string>)[x];
}

function BookForm({ book, setBook, lookup, loading, message }: { book: BookDraft; setBook: (b: BookDraft) => void; lookup: () => void; loading: boolean; message: string }) {
  return (
    <>
      <label>
        ISBN
        <div className="search-row">
          <input value={book.isbn} onChange={(e) => setBook({ ...book, isbn: e.target.value })} placeholder="输入 10 或 13 位 ISBN" />
          <button className="outline" onClick={lookup} disabled={loading}>
            {loading ? <LoaderCircle className="spin" /> : <Search />}搜索
          </button>
        </div>
      </label>
      {message && <p className="form-message">{message}</p>}
      <div className="book-preview">
        {book.title && <Cover book={book} />}
        <div>
          <label>书名<input value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} placeholder="也可以手动填写" /></label>
          <label>作者<input value={book.authors} onChange={(e) => setBook({ ...book, authors: e.target.value })} /></label>
          <label>出版社<input value={book.publisher} onChange={(e) => setBook({ ...book, publisher: e.target.value })} /></label>
          <label>出版年月<input value={book.publishedDate} onChange={(e) => setBook({ ...book, publishedDate: e.target.value })} placeholder="例如：2026-01" /></label>
          <label>封面图片链接<input value={book.coverUrl} onChange={(e) => setBook({ ...book, coverUrl: e.target.value })} placeholder="https://..." /></label>
          <label>Podcast 地址<input value={book.podcastUrl} onChange={(e) => setBook({ ...book, podcastUrl: e.target.value })} placeholder="https://..." /></label>
        </div>
      </div>
    </>
  );
}

function NoteForm({ chapter, setChapter, quote, setQuote, body, setBody, chapters, title, verify }: { chapter: string; setChapter: (x: string) => void; quote: string; setQuote: (x: string) => void; body: string; setBody: (x: string) => void; chapters: string[]; title: string; verify: () => void }) {
  return (
    <>
      <label>
        章节定位
        {chapters.length ? <select value={chapter} onChange={(e) => setChapter(e.target.value)}><option value="">选择章节</option>{chapters.map((c) => <option key={c}>{c}</option>)}</select> : <input value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="例如：第三章 / p.128" />}
      </label>
      <label>
        引用原文（可选）
        <textarea value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="摘录让你停下来的那一句……" />
      </label>
      <button className="quote-search" onClick={verify} disabled={!quote.trim()}><Search size={15} />在网页核对这段引用 <small>公开书目通常不含版权正文</small></button>
      <label>
        我的笔记
        <textarea className="tall" value={body} onChange={(e) => setBody(e.target.value)} placeholder={`关于《${title}》，此刻我想记下……`} autoFocus />
      </label>
    </>
  );
}

function CycleForm({ loading, onSave, isEdit = false, eyebrow = "", title = "" }: { loading: boolean; onSave: (e: string, t: string) => void; isEdit?: boolean; eyebrow?: string; title?: string }) {
  const [e, setE] = useState(eyebrow || "本期共读");
  const [t, setT] = useState(title || "");
  return (
    <>
      <label>期次标注<input value={e} onChange={(x) => setE(x.target.value)} /></label>
      <label>本期标题<input value={t} onChange={(x) => setT(x.target.value)} placeholder="例如：在冬天，读一个漫长的故事" autoFocus /></label>
      <button className="primary full" disabled={!t.trim() || loading} onClick={() => onSave(e, t)}>
        {isEdit ? "保存本期信息" : "建立新一期"}
      </button>
    </>
  );
}
