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

这个仓库里的公开部署版优先保证“所有人打开都能看到书单”。如果后端数据库不可用，页面会自动显示内置公共书单，并把编辑结果保存在当前浏览器里。

这意味着：

- 展示内容稳定，不会因为线上数据库空白而看不到共读内容。
- 浏览器内修改可以保存到自己设备。
- 如果需要所有成员共享同一份可编辑数据，后续建议接入 Supabase 或 Netlify Blobs。

## 本地开发

需要 Node.js 22+ 和 pnpm。

```bash
pnpm install
pnpm dev
```

本地地址：

```text
http://readingnotes.localhost:5173
```

如果这个地址打不开，也可以用：

```text
http://localhost:5173
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
- Publish directory: `dist/client`
- Node version: `22`

仓库已包含 `netlify.toml`，通常导入 GitHub 仓库后 Netlify 会自动读取。

## 后续可升级

如果要让所有读书会成员编辑同一份数据，建议下一步接 Supabase：

- `cycles`：期次
- `books`：书目
- `nominees`：每期推荐
- `group_notes`：共读笔记
- `personal_notes`：个人笔记

这样 Netlify 只负责托管网页，数据由 Supabase 提供，稳定性会比当前临时数据库方案更好。
