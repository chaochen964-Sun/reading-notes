import { NextRequest, NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";

type JsonValue = Record<string, unknown>;
type GoogleVolume = {
  volumeInfo?: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    imageLinks?: Record<string, string>;
  };
};

type ChApiResult = {
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  publishedDate: string;
  coverUrl: string;
  chapters: string[];
  podcastUrl?: string;
  catalogSource: string;
};

const verifiedChineseEditions: Record<string, ChApiResult> = {
  "9787532180011": {
    isbn: "9787532180011",
    title: "吞下宇宙的男孩",
    authors: "",
    publisher: "上海文艺出版社（果麦）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532777532": {
    isbn: "9787532777532",
    title: "长日将尽",
    authors: "",
    publisher: "上海译文出版社（冯涛译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532762897": {
    isbn: "9787532762897",
    title: "小径分岔的花园",
    authors: "",
    publisher: "上海译文出版社（王永年译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787201134598": {
    isbn: "9787201134598",
    title: "罗生门",
    authors: "",
    publisher: "天津人民出版社（高慧勤译，果麦出品）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544736541": {
    isbn: "9787544736541",
    title: "彼时此刻：马基雅维利在伊莫拉",
    authors: "",
    publisher: "译林出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787508672717": {
    isbn: "9787508672717",
    title: "人生复本",
    authors: "",
    publisher: "中信出版社（布莱克·克劳奇）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532791620": {
    isbn: "9787532791620",
    title: "一个人的房间",
    authors: "",
    publisher: "上海译文出版社（瞿世镜译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9789579001847": {
    isbn: "9789579001847",
    title: "你不爽，为什么不明说？",
    authors: "",
    publisher: "橡实文化（繁体主流）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532759538": {
    isbn: "9787532759538",
    title: "金阁寺",
    authors: "",
    publisher: "上海译文出版社（唐月梅译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787554605424": {
    isbn: "9787554605424",
    title: "人性的弱点",
    authors: "",
    publisher: "古吴轩出版社（完整全译本）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532752393": {
    isbn: "9787532752393",
    title: "1984",
    authors: "",
    publisher: "上海译文出版社（董乐山译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544722278": {
    isbn: "9787544722278",
    title: "看不见的城市",
    authors: "",
    publisher: "译林出版社（张密译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544292597": {
    isbn: "9787544292597",
    title: "献给阿尔吉侬的花束",
    authors: "",
    publisher: "南海出版公司",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020122349": {
    isbn: "9787020122349",
    title: "马丁·伊登",
    authors: "",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020104598": {
    isbn: "9787020104598",
    title: "大师与玛格丽特",
    authors: "",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544294010": {
    isbn: "9787544294010",
    title: "The Silent Patient（《无声的病人》）",
    authors: "",
    publisher: "南海出版公司",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532774986": {
    isbn: "9787532774986",
    title: "公羊的节日",
    authors: "",
    publisher: "上海译文出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544291309": {
    isbn: "9787544291309",
    title: "一桩事先张扬的凶杀案",
    authors: "",
    publisher: "南海出版公司",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544768917": {
    isbn: "9787544768917",
    title: "树上的男爵",
    authors: "",
    publisher: "译林出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020126781": {
    isbn: "9787020126781",
    title: "象棋的故事",
    authors: "",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532778205": {
    isbn: "9787532778205",
    title: "宠物公墓",
    authors: "",
    publisher: "上海译文出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787532779996": {
    isbn: "9787532779996",
    title: "未来学大会",
    authors: "",
    publisher: "上海译文出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020162347": {
    isbn: "9787020162347",
    title: "没有墓碑的草原",
    authors: "",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787559648655": {
    isbn: "9787559648655",
    title: "鱼不存在",
    authors: "",
    publisher: "北京联合出版公司",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787544775122": {
    isbn: "9787544775122",
    title: "作家城堡",
    authors: "",
    publisher: "译林出版社（卡尔维诺相关）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787115545084": {
    isbn: "9787115545084",
    title: "第一性原理",
    authors: "",
    publisher: "人民邮电出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787530215995": {
    isbn: "9787530215995",
    title: "台北人",
    authors: "",
    publisher: "北京十月文艺出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020104666": {
    isbn: "9787020104666",
    title: "卡拉马佐夫兄弟",
    authors: "〔俄〕陀思妥耶夫斯基",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9787020122356": {
    isbn: "9787020122356",
    title: "包法利夫人",
    authors: "",
    publisher: "人民文学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "往期手动核实书目",
  },
  "9786269673384": {
    isbn: "9786269673384",
    title: "家弒服務",
    authors: "",
    publisher: "寂寞出版（繁体，最畅销）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "本期手动核实书目",
  },
  "9787111555377": {
    isbn: "9787111555377",
    title: "当尼采哭泣",
    authors: "〔美〕欧文·亚隆｜侯维之 译",
    publisher: "机械工业出版社（2017版）",
    publishedDate: "2017-03-01",
    coverUrl: "",
    chapters: [],
    catalogSource: "已核实中文版本",
  },
  "9787559848048": {
    isbn: "9787559848048",
    title: "可能性的艺术",
    authors: "",
    publisher: "广西师范大学出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "本期手动核实书目",
  },
  "9787553522685": {
    isbn: "9787553522685",
    title: "我们为什么会受骗",
    authors: "",
    publisher: "上海文化出版社",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "本期手动核实书目",
  },
  "9787208136779": {
    isbn: "9787208136779",
    title: "查拉图斯特拉如是说",
    authors: "〔德〕尼采｜孙周兴 译",
    publisher: "上海人民出版社（孙周兴译）",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "本期手动核实书目",
  },
  "9787559675583": {
    isbn: "9787559675583",
    title: "语言恶女",
    authors: "",
    publisher: "北京联合出版公司",
    publishedDate: "",
    coverUrl: "",
    chapters: [],
    catalogSource: "本期手动核实书目",
  },
};

function readEnvMap(): Record<string, string | undefined> {
  return process.env;
}

function pickText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeArrayText(values: unknown): string[] {
  if (typeof values === "string") return [values.trim()].filter(Boolean);
  if (!Array.isArray(values)) return [];

  return values
    .map((entry) => {
      if (typeof entry === "string") return entry;
      if (entry && typeof entry === "object" && "name" in entry) return pickText((entry as JsonValue).name);
      if (entry && typeof entry === "object" && "title" in entry) return pickText((entry as JsonValue).title);
      return "";
    })
    .filter(Boolean);
}

function pickFirstString(candidates: unknown[]): string {
  for (const candidate of candidates) {
    const text = pickText(candidate);
    if (text) return text;
  }
  return "";
}

function toChapters(raw: unknown): string[] {
  if (!raw) return [];
  if (typeof raw === "string") return raw.split(/[\n;；]/).map((x) => x.trim()).filter(Boolean);
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      const obj = item as JsonValue;
      return pickFirstString([obj.title, obj.name, obj.chapter]);
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildChineseApiRecord(raw: unknown, isbn: string): ChApiResult | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as JsonValue;
  const data = payload.data && typeof payload.data === "object" ? (payload.data as JsonValue) : {};
  const result = payload.result && typeof payload.result === "object" ? (payload.result as JsonValue) : {};
  const title = pickFirstString([
    payload.title,
    payload.bookTitle,
    payload.name,
    payload.book && typeof payload.book === "object" ? (payload.book as JsonValue).title : undefined,
    data.title,
    data.name,
    result.title,
  ]);
  if (!title) return null;

  const authors = pickFirstString([
    payload.author,
    payload.writer,
    payload.authors,
    payload.authorName,
    data.author,
    data.authors,
  ]) || [...normalizeArrayText(payload.author_name || data.author_name), ...normalizeArrayText(payload.authors), ...normalizeArrayText(data.authors)].join("、");

  const publisher = pickFirstString([
    payload.publisher,
    payload.press,
    payload.publish,
    payload.pub,
    data.publisher,
    data.press,
    payload.publisher_name,
  ]);

  const publishedDate = pickFirstString([
    payload.publish_date,
    payload.publication_date,
    payload.pubDate,
    payload.pubdate,
    payload.publishedDate,
    data.publish_date,
    data.pubdate,
    payload.year,
  ]);

  const coverUrl = pickFirstString([
    payload.cover,
    payload.coverUrl,
    payload.image,
    payload.thumb,
    payload.imageUrl,
    payload.cover_url,
    data.cover,
    data.coverUrl,
  ]);

  const chapters = [
    toChapters(payload.toc),
    toChapters(payload.contents),
    toChapters(payload.table_of_contents),
    toChapters(data.table_of_contents),
  ].flat();

  return {
    isbn,
    title,
    authors: Array.from(new Set([authors, ...normalizeArrayText(payload.author_name), ...normalizeArrayText(data.author_name)].filter(Boolean))).join("、"),
    publisher,
    publishedDate,
    coverUrl,
    chapters,
    catalogSource: "中文 ISBN API",
  };
}

function buildOpenLibraryRecord(raw: unknown, isbn: string): ChApiResult | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as JsonValue;
  const title = pickFirstString([payload.title, payload.name]);
  if (!title) return null;

  const publishers = normalizeArrayText((payload.publishers as unknown));
  const coverId = normalizeArrayText(payload.cover && Array.isArray(payload.cover) ? payload.cover : payload.covers).filter((entry) => !Number.isNaN(Number(entry)))[0];
  const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : "";
  const firstPublishYear =
    typeof payload.first_publish_year === "number" ? String(payload.first_publish_year) : pickText(payload.first_publish_year);

  return {
    isbn,
    title,
    authors: normalizeArrayText(payload.authors).join("、") || normalizeArrayText(payload.author_name).join("、"),
    publisher: publishers.join("、"),
    publishedDate: pickFirstString([
      payload.publish_date,
      payload.published_date,
      firstPublishYear ? `${firstPublishYear}` : undefined,
    ]),
    coverUrl,
    chapters: toChapters(payload.table_of_contents),
    catalogSource: "Open Library",
  };
}

function buildOpenLibrarySearchRecord(raw: unknown, isbn: string): ChApiResult | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as { docs?: Array<JsonValue> };
  const doc = payload.docs?.[0];
  if (!doc) return null;

  const title = pickFirstString([doc.title, doc.name]);
  if (!title) return null;

  return {
    isbn,
    title,
    authors: normalizeArrayText((doc.author_name as unknown)).join("、") || "",
    publisher: normalizeArrayText(doc.publisher).join("、"),
    publishedDate:
      typeof doc.first_publish_year === "number"
        ? String(doc.first_publish_year)
        : pickText(doc.first_publish_year),
    coverUrl: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
      : "",
    chapters: [],
    catalogSource: "Open Library",
  };
}

function buildGoogleRecord(raw: unknown, isbn: string): ChApiResult | null {
  if (!raw || typeof raw !== "object") return null;
  const payload = raw as { items?: GoogleVolume[] };
  const info = payload.items?.[0]?.volumeInfo;
  const title = pickText(info?.title);
  if (!title) return null;

  return {
    isbn,
    title,
    authors: (info?.authors || []).join("、"),
    publisher: pickText(info?.publisher),
    publishedDate: pickText(info?.publishedDate),
    coverUrl: pickText(info?.imageLinks?.thumbnail)?.replace("http://", "https://") || "",
    chapters: [],
    catalogSource: "Google Books",
  };
}

function buildErrorResponse(isbn: string) {
  return NextResponse.json(
    {
      error: "公开书目源没有收录这个中文版本。请直接补写书名；保存后，同一 ISBN 会进入读记共享书目库。",
      isbn,
      manualEntry: true,
    },
    { status: 404 },
  );
}

function pickConfiguredApiUrl(): string | undefined {
  const config = readEnvMap();
  return config.READING_NOTES_CHINESE_API_URL || config.ISBN_CHINESE_API_URL || config.CN_ISBN_API_URL;
}

function pickConfiguredApiHeader(): string | undefined {
  const config = readEnvMap();
  return config.READING_NOTES_CHINESE_API_HEADER || config.ISBN_CHINESE_API_HEADER || config.CN_ISBN_API_HEADER;
}

function pickConfiguredApiKeyName(): string {
  const config = readEnvMap();
  return config.READING_NOTES_CHINESE_API_KEY_NAME || config.ISBN_CHINESE_API_KEY_NAME || config.CN_ISBN_API_KEY_NAME || "api_key";
}

function pickConfiguredApiKey(): string {
  const config = readEnvMap();
  return config.READING_NOTES_CHINESE_API_KEY || config.ISBN_CHINESE_API_KEY || config.CN_ISBN_API_KEY || "";
}

async function fetchConfiguredChineseCatalog(isbn: string): Promise<ChApiResult | null> {
  const apiUrl = pickConfiguredApiUrl();
  if (!apiUrl) return null;

  const apiKey = pickConfiguredApiKey();
  const apiKeyName = pickConfiguredApiKeyName();
  const apiHeader = pickConfiguredApiHeader();

  let url = apiUrl.replaceAll("{isbn}", isbn);
  if (!url.includes(isbn) && !/{isbn}/.test(apiUrl)) {
    url += url.includes("?") ? `&isbn=${isbn}` : `?isbn=${isbn}`;
  }

  if (apiKey && !url.includes(apiKeyName)) {
    url += url.includes("?") ? `&${apiKeyName}=${encodeURIComponent(apiKey)}` : `?${apiKeyName}=${encodeURIComponent(apiKey)}`;
  }

  const headers: Record<string, string> = { accept: "application/json" };
  if (apiHeader && apiKey) headers[apiHeader] = `Bearer ${apiKey}`;

  const response = await fetch(url, { headers });
  if (!response.ok) return null;

  const raw = await response.json();
  const parsed = buildChineseApiRecord(raw, isbn);
  if (!parsed?.title) return null;
  return parsed;
}

export async function GET(request: NextRequest) {
  const isbn = (request.nextUrl.searchParams.get("isbn") || "").replace(/[^0-9Xx]/g, "");
  if (isbn.length < 10) return NextResponse.json({ error: "请输入有效的 ISBN" }, { status: 400 });

  try {
    if (isDatabaseConfigured()) {
      const saved = await db
        .prepare("SELECT isbn,title,authors,publisher,published_date,cover_url,podcast_url,chapters_json FROM books WHERE isbn=?")
        .bind(isbn)
        .first<{ isbn: string; title: string; authors: string; publisher: string; published_date: string; cover_url: string; podcast_url: string; chapters_json: string }>();
      if (saved) {
        return NextResponse.json({
          isbn: saved.isbn,
          title: saved.title,
          authors: saved.authors,
          publisher: saved.publisher,
          publishedDate: saved.published_date,
          coverUrl: saved.cover_url,
          podcastUrl: saved.podcast_url,
          chapters: JSON.parse(saved.chapters_json || "[]"),
          catalogSource: "读记共享书目库",
        });
      }
    }

    const verified = verifiedChineseEditions[isbn];
    if (verified) return NextResponse.json(verified);

    const configured = await fetchConfiguredChineseCatalog(isbn);
    if (configured) return NextResponse.json(configured);

    const [googleRes, openRes, searchRes] = await Promise.all([
      fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${encodeURIComponent(isbn)}&maxResults=1`, { headers: { accept: "application/json" } }),
      fetch(`https://openlibrary.org/isbn/${encodeURIComponent(isbn)}.json`, { headers: { accept: "application/json" } }),
      fetch(`https://openlibrary.org/search.json?isbn=${encodeURIComponent(isbn)}&limit=1`, { headers: { accept: "application/json" } }),
    ]);

    const google = googleRes.ok ? await googleRes.json() : {};
    const open = openRes.ok ? await openRes.json() : {};
    const search = searchRes.ok ? await searchRes.json() : {};

    const source =
      buildOpenLibraryRecord(open, isbn) ||
      buildOpenLibrarySearchRecord(search, isbn) ||
      buildGoogleRecord(google, isbn);

    if (source?.title) return NextResponse.json(source);

    return buildErrorResponse(isbn);
  } catch {
    return NextResponse.json({ error: "书目服务暂时没有回应，请稍后再试。" }, { status: 502 });
  }
}
