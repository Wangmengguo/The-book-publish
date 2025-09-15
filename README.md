# Gold Eye - Book Waitlist Landing Page

一个使用 Next.js 和 React 构建的图书等待列表落地页。

## 项目结构

```
The-book-publish/
├── app/                    # Next.js App Router
│   ├── api/waitlist/       # 等待列表API路由
│   ├── globals.css         # 全局样式
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 主页
├── components/             # React组件
│   └── WaitlistLanding.tsx # 等待列表组件
├── public/media/           # 静态媒体文件
│   ├── goldeye-poster.jpg
│   └── *.mp4 (视频文件)
├── package.json            # 项目配置和依赖
└── tailwind.config.js      # Tailwind CSS配置
```

## 安装和运行

1. **安装依赖**：
   ```bash
   npm install
   ```

2. **启动开发服务器**：
   ```bash
   npm run dev
   ```

3. **打开浏览器访问**：
   ```
   http://localhost:3000
   ```

## 功能特性

- 🎨 现代化的UI设计（使用Tailwind CSS）
- 📱 响应式布局，支持移动端
- 🎬 背景视频播放
- 📧 邮件表单验证
- 🤖 反机器人机制（蜜罐陷阱）
- ♿ 无障碍访问支持
- ⚡ 快速加载和优化

## 自定义配置

### 更改视频文件

在 `components/WaitlistLanding.tsx` 中修改视频源：

```tsx
<source src="/media/your-video.mp4" type="video/mp4" />
```

### 设置邮件存储（Supabase）

1. **创建 Supabase 项目**：
   - 访问 [supabase.com](https://supabase.com)
   - 创建新项目
   - 等待项目初始化完成

2. **创建数据库表**：
   在 Supabase 控制台的 SQL Editor 中运行：
   ```sql
   CREATE TABLE waitlist_emails (
     id SERIAL PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     source TEXT DEFAULT 'website'
   );
   ```

3. **设置环境变量**：
   在 Vercel 项目设置中添加：
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **获取 API 密钥**：
   - 在 Supabase 控制台 → Settings → API
   - 复制 `Project URL` 和 `anon public` 密钥

5. **查看收集的邮件**：
   ```bash
   # 设置环境变量后运行
   npm run view-emails
   ```

### 修改API端点

当前API路由在 `app/api/waitlist/route.ts` 中，已集成了 Supabase 存储。你也可以：

- 集成邮件服务（如Mailchimp, ConvertKit）
- 添加更多验证逻辑
- 连接其他数据库

### 样式定制

项目使用Tailwind CSS，可以直接在组件中修改className来自定义样式。

## 部署

项目可以部署到 Vercel、Netlify 或任何支持 Next.js 的平台。

### Vercel 部署（推荐）

#### 方式一：一键部署脚本（推荐）
```bash
npm run deploy
```
脚本会自动帮你：
- 安装 Vercel CLI
- 部署项目
- 引导设置 Supabase 环境变量
- 部署到生产环境

#### 方式二：手动部署

1. **使用 CLI 部署**：
   ```bash
   npx vercel --yes
   ```

2. **设置环境变量**：
   在 Vercel 控制台 → 项目 → Settings → Environment Variables 中添加：
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **重新部署**：
   ```bash
   npx vercel --prod
   ```

### 本地构建测试

```bash
npm run build
npm run start
```

## 技术栈

- **Next.js 14** - React框架
- **React 18** - UI库
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **PostCSS** - CSS处理
