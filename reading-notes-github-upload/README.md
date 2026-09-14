# 读记 Reading Notes

读记是给 F2F 读书会使用的阅读记录和共读书单网页。当前版本包含：

- 第 1–31 期往期书单展示
- 第 31 期推荐阅读书单
- 本期所选书目展示
- 个人浏览器内的编辑、删除、设为本期和笔记记录
- 中文 ISBN 手动补录字段
- 豆瓣封面图片转发显示
- 分享二维码：`public/share/readingnotes-qr.png`

## 当前数据模式

数据保存在 Netlify Database（托管 Postgres）里，所有成员共享同一份可编辑数据：

- `books`：书目
- `cycles`：期次
- `nominees`：每期推荐
- `suppressed_nominees`：被删除的推荐
- `library_entries`：个人书架
- `personal_notes`：个人笔记
- `group_notes`：共读笔记

表结构定义在 `db/schema.ts`，迁移文件在 `netlify/database/migrations/`，部署时由 Netlify 自动执行。

第 1–31 期书单会在数据库第一次为空时自动写入，所以新环境打开就能看到完整往期内容。如果数据库暂时不可用，页面仍会回退到内置公共书单，并把编辑结果保存在当前浏览器里。

修改表结构后需要重新生成迁移：

```bash
pnpm db:generate -- --name <描述本次修改>
```

## 本地开发

需要 Node.js 22+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

本地地址：

```text
http://localhost:3000
```

如果需要连上 Netlify Database 和其他 Netlify 功能，用 Netlify CLI 启动：

```bash
netlify dev --port 8889
```

## 构建

```bash
pnpm build
```

## Netlify 部署

推荐先用 Netlify 免费域名，例如：

```text
readingnotes.netlify.app
```

Netlify 设置：

- Build command: `pnpm build`
- Publish directory: `.next`
- Node version: `22`

仓库已包含 `netlify.toml`，通常导入 GitHub 仓库后 Netlify 会自动读取。页面和 `app/api/*` 接口都由 Netlify 的 Next.js 运行时提供服务。
