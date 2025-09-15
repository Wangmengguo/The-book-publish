// Vercel 部署脚本
// 运行: node scripts/deploy-vercel.js

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function deploy() {
  try {
    console.log('🚀 开始部署到 Vercel...\n');

    // 检查是否已安装 Vercel CLI
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch (error) {
      console.log('📦 安装 Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // 首次部署
    console.log('🔧 部署到 Vercel...');
    execSync('vercel --yes', { stdio: 'inherit' });

    // 询问是否设置 Supabase
    const setupSupabase = await ask('\n❓ 是否现在设置 Supabase 来存储邮件？(y/n): ');

    if (setupSupabase.toLowerCase() === 'y' || setupSupabase.toLowerCase() === 'yes') {
      const supabaseUrl = await ask('请输入 Supabase URL (如: https://xxx.supabase.co): ');
      const supabaseKey = await ask('请输入 Supabase Anon Key: ');

      console.log('\n🔧 设置环境变量...');

      // 使用 echo 和管道来自动输入值
      execSync(`echo "${supabaseUrl}" | vercel env add SUPABASE_URL`, { stdio: 'inherit' });
      execSync(`echo "${supabaseKey}" | vercel env add SUPABASE_ANON_KEY`, { stdio: 'inherit' });

      console.log('✅ 环境变量设置完成！');
    }

    // 生产部署
    console.log('\n🚀 部署到生产环境...');
    execSync('vercel --prod --yes', { stdio: 'inherit' });

    console.log('\n🎉 部署完成！你的网站已经上线了。');

  } catch (error) {
    console.error('❌ 部署失败:', error.message);
    console.log('\n💡 提示：你可以手动运行以下命令：');
    console.log('1. npx vercel --yes');
    console.log('2. 在 Vercel 控制台设置环境变量');
    console.log('3. npx vercel --prod');
  } finally {
    rl.close();
  }
}

deploy();
