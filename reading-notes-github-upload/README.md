# 读记 Reading Notes

读记是给 F2F 读书会使用的阅读记录和共读书单网页。当前版本包含：

- 第 1–31 期往期书单展示
- 第 31 期推荐阅读书单
- 本期所选书目展示
- 编辑、删除、设为本期和共读笔记记录
- 中文 ISBN 手动补录字段
- 豆瓣封面图片转发显示

## 当前数据模式

书单、期次、推荐书目和共读笔记都存在 Netlify Database（托管 Postgres）里，所有成员看到并编辑的是同一份数据。

- 首次打开时，第 1–31 期的公共书单会自动写入数据库。
- 「我的书架」和个人笔记按浏览器区分，只有本人可见；共读笔记所有人可见。
- 如果数据库暂时连不上，页面会退回内置的公共书单，保证书单始终可读。

## 本地开发

需要 Node.js 22+ 和 pnpm。

```bash
pnpm install
netlify dev
```

`netlify dev` 会连上这个站点的数据库分支，本地地址：

```text
http://localhost:8888
```

只跑前端（不连数据库）可以用 `pnpm dev`。

## 数据库结构改动

表结构定义在 `db/schema.ts`。改完之后要生成迁移文件：

```bash
pnpm db:generate -- --name <改动说明>
```

迁移文件会写到 `netlify/database/migrations/`，Netlify 在部署时自动执行，不需要手动跑。

## Netlify 部署

推送到 GitHub 后 Netlify 会自动构建部署。仓库里的 `netlify.toml` 已经配置好构建命令，Next.js 的服务端渲染和 `/api/*` 接口由 Netlify 自动处理。

## 表结构

- `books`：书目
- `cycles`：期次
- `nominees`：每期推荐
- `suppressed_nominees`：手动删掉的推荐（避免重新写入公共书单时复活）
- `group_notes`：共读笔记
- `library_entries`：个人书架
- `personal_notes`：个人笔记
