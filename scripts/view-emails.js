// 查看收集到的邮件列表
// 运行: node scripts/view-emails.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('请设置环境变量 SUPABASE_URL 和 SUPABASE_ANON_KEY');
  process.exit(1);
}

async function viewEmails() {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/waitlist_emails?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const emails = await response.json();

    console.log(`\n📧 已收集 ${emails.length} 个邮件地址：\n`);

    emails.forEach((entry, index) => {
      const date = new Date(entry.created_at).toLocaleString('zh-CN');
      console.log(`${index + 1}. ${entry.email} (${date})`);
    });

    if (emails.length === 0) {
      console.log('暂无邮件数据');
    }

  } catch (error) {
    console.error('获取邮件数据失败:', error.message);
  }
}

viewEmails();
