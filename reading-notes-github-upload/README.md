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

共享数据存放在 Netlify Database（托管 Postgres）里，所有成员看到并编辑同一份书单与笔记。

页面同时保留了浏览器兜底模式：如果后端数据库暂时不可用，页面会显示内置公共书单，并把编辑结果保存在当前浏览器里，因此不会出现打开就空白的情况。

数据表结构定义在 `db/schema.ts`，迁移文件放在 `netlify/database/migrations/`，Netlify 会在每次部署时自动执行尚未应用的迁移。修改表结构时请更新 `db/schema.ts` 后运行：

```bash
pnpm db:generate --name <本次修改说明>
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

如果需要连接 Netlify 的数据库和环境变量，用 Netlify CLI 启动：

```bash
netlify dev
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

- Build command: `next build`
- Publish directory: `.next`
- Node version: `22`

仓库已包含 `netlify.toml`，通常导入 GitHub 仓库后 Netlify 会自动读取。Netlify 会识别这是 Next.js 项目并自动启用 Next.js Runtime，页面渲染与 `app/api/*` 接口都由它托管。
