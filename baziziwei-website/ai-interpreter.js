// ============================================================
// 紫微星河 AI 智能体 - 纯 JavaScript 版本
// 适用于静态 HTML 网站，无需任何框架
// ============================================================

(function() {
  'use strict';

  // ===== 配置 =====
  const CONFIG = {
    API_BASE: 'https://baziziwei-ai.linemeknnem.workers.dev',
    primaryColor: '#3B5BF7',
    panelBg: 'rgba(10, 10, 15, 0.95)',
    debug: false,
  };

  function log(...args) {
    if (CONFIG.debug) console.log('[AI]', ...args);
n  }

  // ===== 系统提示词 =====
  const SYSTEM_PROMPTS = {
    bazi: `你是紫微星河的AI命理顾问，一位精通中国传统八字命理学的专业大师。你擅长解读四柱八字、五行分析、大运流年等命理知识。解读风格：1. 专业而通俗易懂 2. 结合传统命理经典 3. 给出积极的改善建议 4. 保持客观理性。请用中文回复，语气温和专业。`,
    yunshi: `你是紫微星河的AI命理顾问，一位精通运势分析的专业大师。你擅长解读大运走势、流年运势、事业财运、婚姻感情、健康等方面。解读风格：1. 结合八字命理分析 2. 给出时间节点和注意事项 3. 提供积极的建议 4. 保持客观理性。请用中文回复，语气温和专业。`,
    tarot: `你是紫微星河的AI命理顾问，一位精通西方塔罗占卜的专业大师。你擅长解读塔罗牌的牌意、牌阵含义、正位逆位等。解读风格：1. 结合传统含义和现代心理学 2. 给出深入而富有洞察力的解读 3. 提供建设性建议 4. 强调塔罗是指引而非宿命。请用中文回复，语温和n专业。`,
  };

  // ===== 演示模式回复 =====
  function getDemoResponse(type, data) {
    if (type === 'bazi') {
      return `## 八字命盘解读

**日主：${data.dayMaster || '壬水'}**

${data.dayMaster || '壬水'}日主之人，如江河大海，智慧深邃，胸怀宽广。性格上善于谋略，适应力强，具有包容万物的气度。

**命局特点：**
- 五行分布较为均衡，${data.fiveElements?.most || '木'}气偏旺，${data.fiveElements?.least || '金'}气稍弱
- 年柱${data.yearPillar || '甲戌'}，纳音山头火，主早年根基稳固
- 命局整体格局清秀，属于中上之命

**性格分析：**
为人聪明机智，善于思考，有较强的洞察力和判断力。待人接物温和有礼，但内心有自己的原则和坚持。

**事业财运：**
适合从事需要智慧和沟通能力的行业，如教育、咨询、文化、技术等。财运平稳，中年后财源渐丰。

**婚姻感情：**
感情丰富细腻，重视精神交流。与属鼠、属猴、属鸡之人较为合拍。

**健康提示：**
注意${data.fiveElements?.least || '金'}行相关的身体部位保养，保持规律作息，适度运动。

**人生建议：**
1. 发挥自身智慧优势，不断精进
2. 培养耐心和定力
3. 重视人际关系，广结善缘
4. 保持乐观心态

---
*以上为AI智能体解读，仅供参考娱乐。*

> **提示：** 当前为演示模式。如需获得更深入的AI解读，请在 Cloudflare Worker 中配置 MOONSHOT_API_KEY。`;
    }

    if (type === 'yunshi') {
      return `## ${data.type || '运势'}分析解读

**当前大运：${data.currentLuck || '戊辰'}运 ${data.ageRange || ''}**

您当前正处于人生的重要阶段。整体运势较为平稳向上，是积累和发展的好时机。

**${data.type || '运势'}特点：**
- 整体运势呈上升趋势，机遇与挑战并存
- 贵人运较旺，容易得到他人帮助
- 需要把握时机，不要错失良机

**近期建议：**
1. 把握事业上的机遇，勇于接受新挑战
2. 理财以稳健为主，避免高风险投资
3. 多与家人朋友沟通，维护好人际关系
4. 注意劳逸结合，保持身心健康

**改善方法：**
- 可以佩戴与${data.fiveElements?.least || '金'}行相关的饰品来平衡五行
- 多向${data.fiveElements?.most || '木'}行方位活动

**未来展望：**
接下来的几年是您积累和发展的关键时期，脚踏实地必能有所收获。

---
*以上为AI智能体解读，仅供参考娱乐。*

> **提示：** 当前为演示模式。如需更深入的AI解读，请在 Worker 中配置 MOONSHOT_API_KEY。`;
    }

    if (type === 'tarot') {
      const cardNames = (data.cards || []).map(c => c.name).join('、') || '倒吊人';
      return `## 塔罗牌阵解读

**牌阵：${data.spreadType || '单张牌占卜'}**
**抽到的牌：${cardNames}**

### 整体能量

这次占卜的整体能量是**转变与成长**。塔罗牌告诉您，您正处于人生的一个重要转折点。

### 牌面解读

${(data.cards || []).map((card, i) => {
  return `**${i + 1}. ${card.name}** ${card.reversed ? '逆位' : '正位'}${card.position ? ` - ${card.position}` : ''}

${card.name}的${card.reversed ? '逆位' : '正位'}代表着${card.reversed ? '内在的挑战和需要面对的阻碍' : '积极的能量和成长的机遇'}。

`;
}).join('') || '**倒吊人 正位**\n\n倒吊人正位代表着牺牲、等待和换个角度看问题。'}

### 综合建议

塔罗牌给出的信息是：**放下执念，拥抱变化**。相信宇宙的安排，您走在正确的道路上。

### 行动指南

1. **保持耐心** - 好的结果需要时间酝酿
2. **换个角度** - 尝试从不同视角看待问题
3. **信任直觉** - 您内心的声音知道答案
4. **积极行动** - 在适当的时候勇敢迈出步伐

---
*以上为AI智能体解读，仅供参考娱乐。*

> **提示：** 当前为演示模式。如需更深入的AI解读，请在 Worker 中配置 MOONSHOT_API_KEY。`;
    }

    return '抱歉，未能生成解读内容。';
  }

  // ===== 构建用户提示词 =====
  function buildPrompt(type, data) {
    if (type === 'bazi') {
      return `请解读以下八字命盘：

**基本信息：**
- 性别：${data.gender === 'male' ? '男' : '女'}
- 出生时间：${data.birthYear}年${data.birthMonth}月${data.birthDay}日 ${data.birthHour}:${data.birthMinute}

**四柱八字：**
- 年柱：${data.yearPillar}
- 月柱：${data.monthPillar}
- 日柱：${data.dayPillar}（日主：${data.dayMaster}）
- 时柱：${data.hourPillar}

**五行分析：**
${data.fiveElements ? JSON.stringify(data.fiveElements, null, 2) : '未提供'}

请从以下方面进行详细解读：
1. 日主特性分析
2. 五行旺衰分析
3. 性格特点
4. 事业财运
5. 婚姻感情
6. 健康提示
7. 人生建议`;
    }

    if (type === 'yunshi') {
      return `请解读以下${data.type || '运势'}：

**八字信息：**
- 日主：${data.dayMaster}
- 年柱：${data.yearPillar}
- 月柱：${data.monthPillar}
- 日柱：${data.dayPillar}
- 时柱：${data.hourPillar}

**五行分析：**
${data.fiveElements ? JSON.stringify(data.fiveElements, null, 2) : '未提供'}

**当前大运：**
${data.currentLuck || '未提供'} ${data.ageRange || ''}

${data.detail ? `**详细数据：**\n${data.detail}` : ''}

请从命理学角度进行深入分析，给出专业的解读和实用的建议。`;
    }

    if (type === 'tarot') {
      const cardsDesc = (data.cards || [])
        .map((c, i) => `${i + 1}. ${c.name} ${c.reversed ? '逆位' : '正位'}${c.position ? `（${c.position}）` : ''}`)
        .join('\n');

      return `请解读以下塔罗牌阵：

**牌阵类型：** ${data.spreadType}
${data.question ? `**占卜问题：** ${data.question}` : ''}

**抽到的牌：**
${cardsDesc}

请从以下方面进行详细解读：
1. 每张牌的含义（结合正逆位和位置）
2. 牌阵的整体能量和主题
3. 给出的指引和建议
4. 需要注意的事项
5. 具体的行动建议`;
    }

    return '';
  }

  // ===== 调用 Worker API =====
  async function callWorkerAPI(type, data) {
    try {
      const endpoint = `${CONFIG.API_BASE}/api/ai/${type}`;
      log('Calling API:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      log('API response:', result);
      return result;
    } catch (error) {
      log('API error:', error);
      return {
        success: true,
        isDemo: true,
        interpretation: getDemoResponse(type, data),
      };
    }
  }

  // ===== CSS 样式 =====
  function injectStyles() {
    if (document.getElementById('ai-interpreter-styles')) return;

    const style = document.createElement('style');
    style.id = 'ai-interpreter-styles';
    style.textContent = `
      .ai-interpret-btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 12px 24px; border-radius: 60px;
        border: 1px solid rgba(59, 91, 247, 0.4);
        background: linear-gradient(135deg, rgba(59,91,247,0.2), rgba(59,91,247,0.05));
        background-size: 200% 200%;
        animation: aiBtnFlow 4s ease infinite;
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        color: #fff; font-family: "Inter", sans-serif;
        font-size: 14px; font-weight: 500; cursor: pointer;
        box-shadow: inset 0 0 0 1px rgba(59,91,247,0.1), 0 4px 30px rgba(59,91,247,0.15);
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative; overflow: hidden;
      }
      .ai-interpret-btn:hover {
        border-color: rgba(59, 91, 247, 0.7);
        box-shadow: inset 0 0 0 1px rgba(59,91,247,0.3), 0 8px 40px rgba(59,91,247,0.3);
        transform: translateY(-2px);
      }
      .ai-interpret-btn:disabled { opacity: 0.6; cursor: wait; }
      @keyframes aiBtnFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
n        100% { background-position: 0% 50%; }
      }

      .ai-panel-overlay {
        position: fixed; inset: 0; z-index: 99999;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
        animation: aiFadeIn 0.3s ease;
      }
      @keyframes aiFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .ai-panel {
        position: relative; width: 100%; max-width: 520px;
        margin: 0 1rem; background: rgba(10, 10, 15, 0.98);
        border: 1px solid rgba(59, 91, 247, 0.15);
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(59, 91, 247, 0.15);
        overflow: hidden; display: flex; flex-direction: column;
        max-height: 80vh;
        animation: aiSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes aiSlideUp {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
n        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .ai-panel-header {
        display: flex; align-items: center; justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(to right, rgba(59,91,247,0.1), rgba(59,91,247,0.02));
        flex-shrink: 0;
      }
      .ai-panel-header-left { display: flex; align-items: center; gap: 10px; }
      .ai-panel-avatar {
        width: 32px; height: 32px; border-radius: 8px;
        background: linear-gradient(135deg, #3B5BF7, #6366f1);
        display: flex; align-items: center; justify-content: center;
      }
      .ai-panel-avatar svg { width: 16px; height: 16px; color: white; }
      .ai-panel-title { font-size: 14px; font-weight: 600; color: #fff; margin: 0; }
      .ai-panel-badge { font-size: 10px; color: #fbbf24; }
      .ai-panel-actions { display: flex; align-items: center; gap: 4px; }
      .ai-panel-action-btn {
        width: 28px; height: 28px;
        display: flex; align-items: center; justify-content: center;
        background: transparent; border: none; border-radius: 6px;
        cursor: pointer; color: rgba(255,255,255,0.4);
        transition: all 0.2s;
      }
      .ai-panel-action-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

      .ai-panel-body {
        flex: 1; overflow: auto; padding: 16px 20px;
      }
      .ai-panel-body::-webkit-scrollbar { width: 4px; }
      .ai-panel-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

      .ai-loading {
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 12px; padding: 48px 0;
      }
      .ai-loading-icon {
        width: 40px; height: 40px; border-radius: 50%;
        background: linear-gradient(135deg, #3B5BF7, #6366f1);
        display: flex; align-items: center; justify-content: center;
        animation: aiPulse 2s infinite;
      }
      .ai-loading-icon svg { width: 20px; height: 20px; color: white; }
      .ai-loading-text { font-size: 14px; color: rgba(255,255,255,0.5); }
      @keyframes aiPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .ai-content { display: flex; align-items: flex-start; gap: 10px; }
      .ai-content-avatar {
        width: 24px; height: 24px; border-radius: 50%;
        background: linear-gradient(135deg, #3B5BF7, #6366f1);
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; margin-top: 2px;
      }
      .ai-content-avatar svg { width: 14px; height: 14px; color: white; }
      .ai-content-text { flex: 1; }
      .ai-content-text h2 {
        font-size: 16px; font-weight: 700; color: rgba(139, 158, 255, 0.9);
        margin: 12px 0 6px;
      }
      .ai-content-text h3 {
        font-size: 14px; font-weight: 600; color: rgba(221, 214, 254, 0.8);
        margin: 10px 0 4px;
      }
      .ai-content-text p {
        font-size: 13px; color: rgba(255,255,255,0.6);
        margin: 0 0 6px; line-height: 1.6;
      }
      .ai-content-text ul, .ai-content-text ol {
        margin: 4px 0 8px 16px; padding: 0;
      }
      .ai-content-text li {
        font-size: 13px; color: rgba(255,255,255,0.6);
        margin-bottom: 3px; line-height: 1.5;
      }
      .ai-content-text blockquote {
        font-size: 11px; color: rgba(255,255,255,0.35);
        border-left: 2px solid rgba(59, 91, 247, 0.4);
        padding-left: 10px; margin: 8px 0; font-style: italic;
      }
      .ai-content-text hr {
        border: none; border-top: 1px solid rgba(255,255,255,0.06);
        margin: 10px 0;
      }
      .ai-content-text strong { color: rgba(255,255,255,0.8); font-weight: 600; }

      .ai-panel-footer {
        padding: 10px 20px;
        border-top: 1px solid rgba(255,255,255,0.06);
        background: rgba(255,255,255,0.02); flex-shrink: 0;
      }
      .ai-panel-footer p {
        font-size: 11px; color: rgba(255,255,255,0.25);
        text-align: center; margin: 0;
      }

      .ai-btn-container {
        display: flex; justify-content: center; margin: 16px 0;
      }

      @media (max-width: 640px) {
        .ai-panel { max-height: 90vh; }
      }
    `;
    document.head.appendChild(style);
  }

  // ===== SVG 图标 =====
  const ICONS = {
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    loader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  };

  // ===== 渲染 Markdown 内容 =====
  function renderMarkdown(text) {
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
      } else if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<h3>${escapeHtml(line.slice(4))}</h3>`;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p><strong>${escapeHtml(line.slice(2, -2))}</strong></p>`;
      } else if (line.startsWith('- ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${escapeHtml(line.slice(2))}</li>`;
      } else if (line.startsWith('> ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<blockquote>${escapeHtml(line.slice(2))}</blockquote>`;
      } else if (line.startsWith('---')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr>';
      } else if (line.trim() === '') {
        // skip
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += `<p>${escapeHtml(line)}</p>`;
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== 显示 AI 解读面板 =====
  function showPanel(title, content, isDemo, onRetry, isLoading) {
    const existing = document.getElementById('ai-interpret-panel');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ai-interpret-panel';
    overlay.className = 'ai-panel-overlay';
    overlay.onclick = function(e) {
      if (e.target === overlay) closePanel();
    };

    const panel = document.createElement('div');
    panel.className = 'ai-panel';

    const header = document.createElement('div');
    header.className = 'ai-panel-header';
    header.innerHTML = `
      <div class="ai-panel-header-left">
        <div class="ai-panel-avatar">${ICONS.bot}</div>
        <div>
          <h3 class="ai-panel-title">${escapeHtml(title)}</h3>
          ${isDemo ? '<span class="ai-panel-badge">演示模式</span>' : ''}
        </div>
      </div>
      <div class="ai-panel-actions">
        ${onRetry ? `<button class="ai-panel-action-btn" id="ai-retry-btn" title="重新解读">${ICONS.refresh}</button>` : ''}
        <button class="ai-panel-action-btn" id="ai-copy-btn" title="复制内容">${ICONS.copy}</button>
        <button class="ai-panel-action-btn" id="ai-close-btn" title="关闭">${ICONS.x}</button>
      </div>
    `;

    const body = document.createElement('div');
    body.className = 'ai-panel-body';

    if (isLoading) {
      body.innerHTML = `
        <div class="ai-loading">
          <div class="ai-loading-icon">${ICONS.sparkles}</div>
          <p class="ai-loading-text">AI 正在为您解读...</p>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="ai-content">
          <div class="ai-content-avatar">${ICONS.sparkles}</div>
          <div class="ai-content-text">${renderMarkdown(content)}</div>
        </div>
      `;
    }

    const footer = document.createElement('div');
    footer.className = 'ai-panel-footer';
    footer.innerHTML = '<p>AI 解读仅供参考娱乐，不构成专业命理咨询建议</p>';

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.getElementById('ai-close-btn').onclick = closePanel;

    const copyBtn = document.getElementById('ai-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(content).then(() => {
          copyBtn.innerHTML = ICONS.check;
          copyBtn.style.color = '#4ade80';
          setTimeout(() => {
            copyBtn.innerHTML = ICONS.copy;
            copyBtn.style.color = '';
          }, 2000);
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = content;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.innerHTML = ICONS.check;
          setTimeout(() => { copyBtn.innerHTML = ICONS.copy; }, 2000);
        });
      };
    }

    const retryBtn = document.getElementById('ai-retry-btn');
    if (retryBtn && onRetry) {
      retryBtn.onclick = function() {
        closePanel();
        onRetry();
      };
    }

    function onEsc(e) {
      if (e.key === 'Escape') {
        closePanel();
        document.removeEventListener('keydown', onEsc);
      }
    }
    document.addEventListener('keydown', onEsc);
  }

  function closePanel() {
    const panel = document.getElementById('ai-interpret-panel');
    if (panel) {
      panel.style.opacity = '0';
      setTimeout(() => panel.remove(), 200);
    }
  }

  // ===== 创建 AI 解读按钮 =====
  function createButton(label, onClick) {
    const btn = document.createElement('button');
    btn.className = 'ai-interpret-btn';
    btn.innerHTML = `${ICONS.sparkles}<span>${escapeHtml(label)}</span>`;
    btn.onclick = onClick;
    return btn;
  }

  // ===== 核心：AI 解读 =====
  async function performInterpret(type, title, data) {
    log('Performing interpretation:', type, data);
    showPanel(title, '', false, null, true);
    const result = await callWorkerAPI(type, data);
    const interpretation = result.interpretation || result.reply || '抱歉，未能获取解读结果。';
    showPanel(title, interpretation, result.isDemo, () => performInterpret(type, title, data), false);
  }

  // ===== 公共 API =====
  function addBaziInterpret(container, baziData) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) { console.error('[AI] Container not found for bazi interpret'); return; }

    const btn = createButton('AI 智能解读八字', () => {
      performInterpret('bazi', 'AI 八字命盘解读', baziData);
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Bazi AI button added');
  }

  function addYunshiInterpret(container, yunshiData) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) { console.error('[AI] Container not found for yunshi interpret'); return; }

    const btn = createButton(`AI 解读${yunshiData.type || '运势'}`, () => {
      performInterpret('yunshi', `AI ${yunshiData.type || '运势'}解读`, yunshiData);
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Yunshi AI button added');
  }

  function addTarotInterpret(container, tarotData) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (!container) { console.error('[AI] Container not found for tarot interpret'); return; }

    const btn = createButton('AI 智能解读塔罗', () => {
      performInterpret('tarot', `AI ${tarotData.spreadType || '塔罗'}解读`, tarotData);
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Tarot AI button added');
  }

  // ===== 自动初始化：删除地址电话等不需要的内容 =====
  function removeUnwantedContent() {
    setTimeout(function() {
      var allEls = document.querySelectorAll('*');
      allEls.forEach(function(el) {
        if (el.children.length === 0) {
          var text = el.textContent;
          var shouldHide = false;
          if (text.indexOf('北京市朝阳区传统文化街88号') !== -1) shouldHide = true;
          if (text.indexOf('+86 400-888-8888') !== -1) shouldHide = true;
          if (text.indexOf('周一至周日') !== -1 && text.indexOf('09:00') !== -1) shouldHide = true;
          if (text.indexOf('传承千年命理智慧') !== -1) shouldHide = true;
          if (text.indexOf('我们致力于传承和发扬') !== -1) shouldHide = true;
          if (text.indexOf('将八字命理与紫微斗数') !== -1) shouldHide = true;
          if (text.indexOf('以现代化的方式呈现给每一位有缘人') !== -1) shouldHide = true;

          if (shouldHide) {
            var p = el.parentElement;
            if (p) p.style.display = 'none';
          }
        }
      });
    }, 1500);
  }

  // ===== 自动初始化：添加塔罗导航链接 =====
  function addTarotNavLink() {
    setTimeout(function() {
      var nav = document.querySelector('.nav-links, nav, .nav, .navigation');
      if (!nav) {
        var links = document.querySelectorAll('a');
        var contactLink = null;
        for (var i = 0; i < links.length; i++) {
          if (links[i].textContent.indexOf('联系我们') !== -1) {
            contactLink = links[i];
            break;
          }
        }
        if (contactLink && contactLink.parentElement) {
          nav = contactLink.parentElement;
        }
      }

      if (nav) {
        var hasTarot = false;
        var navLinks = nav.querySelectorAll('a');
        for (var i = 0; i < navLinks.length; i++) {
          if (navLinks[i].textContent.indexOf('塔罗') !== -1 ||
              navLinks[i].href.indexOf('tarot') !== -1) {
            hasTarot = true;
            break;
          }
        }

        if (!hasTarot) {
          var tarotLink = document.createElement('a');
          tarotLink.href = './tarot.html';
          tarotLink.textContent = '塔罗占卜';
          var existingLink = nav.querySelector('a');
          if (existingLink) {
            tarotLink.className = existingLink.className;
          }
          nav.appendChild(tarotLink);
        }
      }
    }, 500);
  }

  // ===== 自动初始化：在八字/运势页面添加 AI 按钮 =====
  function autoInitAiButtons() {
    var checkCount = 0;
    var maxChecks = 30;

    function tryInit() {
      checkCount++;

      // 1. 八字排盘结果页 - 找到"大运走势"标题
      var luckHeadings = document.querySelectorAll('h3, h2');
      var luckHeading = null;
      for (var i = 0; i < luckHeadings.length; i++) {
        if (luckHeadings[i].textContent.indexOf('大运走势') !== -1 ||
            luckHeadings[i].textContent.indexOf('Great Luck') !== -1) {
          luckHeading = luckHeadings[i];
          break;
        }
      }

      if (luckHeading && !luckHeading.dataset.aiInitialized) {
        luckHeading.dataset.aiInitialized = 'true';
        var btnContainer = document.createElement('div');
        luckHeading.parentNode.insertBefore(btnContainer, luckHeading);

        addBaziInterpret(btnContainer, {
          gender: 'male',
          birthYear: 1995, birthMonth: 1, birthDay: 1, birthHour: 12, birthMinute: 0,
          dayMaster: '壬水',
          yearPillar: '甲戌', monthPillar: '甲子',
          dayPillar: '壬辰', hourPillar: '丙午',
          fiveElements: { metal: 0.3, wood: 3.3, water: 3.3, fire: 3.3, earth: 3.3, most: '木', least: '金' },
          luckPeriods: [
            { ageRange: '2-11岁', stem: '乙', branch: '丑' },
            { ageRange: '12-21岁', stem: '丙', branch: '寅' },
            { ageRange: '22-31岁', stem: '丁', branch: '卯' },
            { ageRange: '32-41岁', stem: '戊', branch: '辰' },
            { ageRange: '42-51岁', stem: '己', branch: '巳' },
          ],
        });
      }

      // 2. 运势分析页 - 每个分类添加 AI 按钮
      var yunshiTypes = [
        { type: '性格分析', keyword: '性格分析' },
        { type: '事业运势', keyword: '事业运势' },
        { type: '婚姻感情', keyword: '婚姻感情' },
        { type: '财运分析', keyword: '财运分析' },
        { type: '健康指引', keyword: '健康指引' },
      ];

      yunshiTypes.forEach(function(section) {
        var headings = document.querySelectorAll('h3, h2');
        var target = null;
        for (var i = 0; i < headings.length; i++) {
          if (headings[i].textContent.indexOf(section.keyword) !== -1) {
            target = headings[i];
            break;
          }
        }

        if (target && target.parentElement && !target.dataset.aiInitialized) {
          target.dataset.aiInitialized = 'true';
          var container = document.createElement('div');
          container.style.marginTop = '12px';
          target.parentElement.appendChild(container);

          addYunshiInterpret(container, {
            type: section.type,
            dayMaster: '壬水',
            yearPillar: '甲戌', monthPillar: '甲子',
            dayPillar: '壬辰', hourPillar: '丙午',
            fiveElements: { metal: 0.3, wood: 3.3, water: 3.3, fire: 3.3, earth: 3.3, most: '木', least: '金' },
            currentLuck: '戊辰',
            ageRange: '32-41岁',
          });
        }
      });

      if (checkCount < maxChecks) {
        setTimeout(tryInit, 500);
      }
    }

    setTimeout(tryInit, 1000);
  }

  // ===== 初始化 =====
  function init() {
    injectStyles();
    removeUnwantedContent();
    addTarotNavLink();
    autoInitAiButtons();
    log('AI Interpreter initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.AiInterpreter = {
    addBaziInterpret,
    addYunshiInterpret,
    addTarotInterpret,
    config: CONFIG,
  };

  log('AI Interpreter API exposed as window.AiInterpreter');

})();
