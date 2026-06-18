// 紫微星河 AI 智能体 + 简约风格优化
(function() {
  'use strict';

  const CONFIG = {
    API_BASE: 'https://baziziwei-ai.linemeknnem.workers.dev',
    debug: false,
  };

  function log(...args) {
    if (CONFIG.debug) console.log('[AI]', ...args);
  }

  // ===== 加载简约风格CSS =====
  function loadStyles() {
    if (document.getElementById('ai-style-override')) return;
    const link = document.createElement('link');
    link.id = 'ai-style-override';
    link.rel = 'stylesheet';
    link.href = './style-override.css';
    document.head.appendChild(link);
    log('Style override loaded');
  }

  // ===== 删除不需要的内容 =====
  function removeUnwanted() {
    setTimeout(function() {
      // 关键词列表
      var keywords = [
        '北京市朝阳区传统文化街88号',
        '+86 400-888-8888',
        '周一至周日 09:00-18:00',
        '传承千年命理智慧',
        '我们致力于传承和发扬',
        '将八字命理与紫微斗数',
        '以现代化的方式呈现给每一位有缘人',
        'AI生成的图片',
        'ai-generated',
        'decoration',
      ];

      // 删除包含这些文字的元素
      var allEls = document.querySelectorAll('*');
      allEls.forEach(function(el) {
        // 检查文字内容
        if (el.children.length === 0) {
          var text = el.textContent || '';
          keywords.forEach(function(kw) {
            if (text.indexOf(kw) !== -1) {
              var p = el.parentElement;
              if (p && p !== document.body) {
                p.style.display = 'none';
                log('Removed element containing:', kw);
              }
            }
          });
        }

        // 删除AI生成的图片
        if (el.tagName === 'IMG') {
          var src = el.src || '';
          var alt = el.alt || '';
          if (src.indexOf('AI') !== -1 || src.indexOf('generated') !== -1 ||
              alt.indexOf('AI') !== -1 || alt.indexOf('装饰') !== -1 ||
              alt.indexOf('decoration') !== -1) {
            el.style.display = 'none';
            log('Removed AI image:', src);
          }
        }

        // 删除背景图片
        var style = el.getAttribute('style') || '';
        if (style.indexOf('background-image') !== -1 &&
            (style.indexOf('.jpg') !== -1 || style.indexOf('.png') !== -1 || style.indexOf('.webp') !== -1)) {
          // 检查是否是装饰性背景
          var parent = el.parentElement;
          if (parent && parent.children.length <= 2) {
            el.style.backgroundImage = 'none';
            log('Removed background image from:', el.tagName);
          }
        }
      });

      // 专门删除页脚中的联系信息块
      var footerSections = document.querySelectorAll('footer *');
      footerSections.forEach(function(el) {
        var text = el.textContent || '';
        if (text.indexOf('地址') !== -1 && text.indexOf('电话') !== -1) {
          el.style.display = 'none';
        }
        if (text.indexOf('营业时间') !== -1) {
          el.style.display = 'none';
        }
      });
    }, 1000);
  }

  // ===== 添加塔罗导航链接 =====
  function addTarotNav() {
    setTimeout(function() {
      // 查找导航栏
      var navLinks = document.querySelector('.nav-links');
      if (!navLinks) {
        // 尝试通过链接文字找到导航容器
        var allLinks = document.querySelectorAll('a');
        var contactLink = null;
        for (var i = 0; i < allLinks.length; i++) {
          if (allLinks[i].textContent.indexOf('联系我们') !== -1) {
            contactLink = allLinks[i];
            break;
          }
        }
        if (contactLink && contactLink.parentElement) {
          navLinks = contactLink.parentElement;
        }
      }

      if (navLinks) {
        // 检查是否已有塔罗链接
        var hasTarot = false;
        var links = navLinks.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
          if (links[i].textContent.indexOf('塔罗') !== -1) {
            hasTarot = true;
            break;
          }
        }

        if (!hasTarot) {
          var tarotLink = document.createElement('a');
          tarotLink.textContent = '塔罗占卜';
          tarotLink.href = '#tarot-section';
          tarotLink.style.cssText = 'cursor:pointer; color:inherit; text-decoration:none; opacity:0.6; transition:opacity 0.3s;';
          tarotLink.onmouseenter = function() { this.style.opacity = '1'; };
          tarotLink.onmouseleave = function() { this.style.opacity = '0.6'; };
          tarotLink.onclick = function(e) {
            e.preventDefault();
            showTarotSection();
          };

          var existingLink = navLinks.querySelector('a');
          if (existingLink) {
            tarotLink.className = existingLink.className;
            tarotLink.style.cssText = '';
          }
          navLinks.appendChild(tarotLink);
          log('Tarot nav link added');
        }
      }
    }, 500);
  }

  // ===== 注入塔罗板块 =====
  function injectTarotSection() {
    // 检查是否已注入
    if (document.getElementById('tarot-section')) return;

    // 查找合适的插入位置（在运势分析之后，页脚之前）
    var insertBefore = null;
    var footers = document.querySelectorAll('footer');
    if (footers.length > 0) {
      insertBefore = footers[0];
    }

    if (!insertBefore) return;

    var section = document.createElement('div');
    section.id = 'tarot-section';
    section.innerHTML = `
      <style>
        .tarot-injected {
          max-width: 900px;
          margin: 0 auto;
          padding: 80px 24px;
          text-align: center;
          font-family: "Inter", "Noto Serif SC", sans-serif;
        }
        .tarot-injected .section-label {
          font-size: 12px; font-weight: 500;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3B5BF7; margin-bottom: 1rem;
          display: block;
        }
        .tarot-injected .section-title {
          font-family: "Noto Serif SC", serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 400; line-height: 1.2;
          color: #1a1a1a; margin-bottom: 0.5rem;
        }
        .tarot-injected .section-desc {
          font-size: 16px; line-height: 1.8;
          color: rgba(0,0,0,0.5); max-width: 500px;
          margin: 1rem auto 3rem;
        }
        .tarot-spread-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .tarot-spread-card {
          background: rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 16px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }
        .tarot-spread-card:hover {
          border-color: rgba(59,91,247,0.3);
          box-shadow: 0 8px 32px rgba(59,91,247,0.1);
          transform: translateY(-4px);
        }
        .tarot-spread-card.selected {
          border-color: #3B5BF7;
          box-shadow: 0 0 30px rgba(59,91,247,0.15);
        }
        .tarot-spread-icon { font-size: 40px; margin-bottom: 0.5rem; display: block; }
        .tarot-spread-name {
          font-family: "Noto Serif SC", serif;
          font-size: 18px; color: #1a1a1a; margin-bottom: 0.3rem;
        }
        .tarot-spread-desc {
          font-size: 13px; color: rgba(0,0,0,0.5); line-height: 1.5;
        }
        .tarot-question-input {
          width: 100%; max-width: 500px;
          padding: 14px 18px; margin: 0 auto 30px;
          display: block;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: #fff;
          color: #1a1a1a; font-size: 15px;
          outline: none; transition: all 0.3s;
        }
        .tarot-question-input::placeholder { color: rgba(0,0,0,0.3); }
        .tarot-question-input:focus {
          border-color: #3B5BF7;
          box-shadow: 0 0 0 3px rgba(59,91,247,0.1);
        }
        .tarot-draw-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 40px;
          border-radius: 60px; border: none;
          background: linear-gradient(135deg, #3B5BF7, #5B73F7);
          color: #fff; font-size: 15px; font-weight: 500;
          cursor: pointer; transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(59,91,247,0.25);
        }
        .tarot-draw-btn:hover {
          box-shadow: 0 6px 24px rgba(59,91,247,0.35);
          transform: translateY(-2px);
        }
        .tarot-draw-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tarot-cards-area { margin-top: 40px; }
        .tarot-cards-display {
          display: flex; justify-content: center;
          gap: 24px; flex-wrap: wrap; margin: 30px 0;
          min-height: 260px;
        }
        .tarot-card-item {
          width: 160px; height: 260px;
          border-radius: 14px; perspective: 1000px;
          cursor: pointer; opacity: 0;
          transform: translateY(40px);
          animation: tcAppear 0.5s ease forwards;
        }
        .tarot-card-item:nth-child(1) { animation-delay: 0s; }
        .tarot-card-item:nth-child(2) { animation-delay: 0.15s; }
        .tarot-card-item:nth-child(3) { animation-delay: 0.3s; }
        .tarot-card-item:nth-child(4) { animation-delay: 0.45s; }
        .tarot-card-item:nth-child(5) { animation-delay: 0.6s; }
        @keyframes tcAppear {
          to { opacity: 1; transform: translateY(0); }
        }
        .tarot-card-inner {
          width: 100%; height: 100%; position: relative;
          transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
          transform-style: preserve-3d;
        }
        .tarot-card-item.flipped .tarot-card-inner {
          transform: rotateY(180deg);
        }
        .tarot-card-front-side, .tarot-card-back-side {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          border-radius: 14px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
        }
        .tarot-card-front-side {
          background: linear-gradient(135deg, #E8E6F0, #F0EEF5);
          border: 1px solid rgba(59,91,247,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .tarot-card-front-side::before {
          content: "✦"; font-size: 50px;
          color: rgba(59,91,247,0.2);
        }
        .tarot-card-back-side {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transform: rotateY(180deg);
          padding: 16px;
        }
        .tc-emoji { font-size: 40px; margin-bottom: 6px; }
        .tc-name { font-family: "Noto Serif SC", serif;
          font-size: 15px; color: #1a1a1a; margin-bottom: 3px;
        }
        .tc-position { font-size: 11px; color: #3B5BF7; margin-bottom: 2px; }
        .tc-orient { font-size: 10px; }
        .tc-orient.reversed { color: #ef4444; }
        .tc-orient.normal { color: rgba(0,0,0,0.4); }
        .tarot-ai-container { margin-top: 20px; }
        @media (max-width: 640px) {
          .tarot-card-item { width: 130px; height: 210px; }
          .tarot-spread-grid { grid-template-columns: 1fr; }
        }
      </style>

      <div class="tarot-injected">
        <span class="section-label">Tarot Divination</span>
        <h2 class="section-title">塔罗占卜</h2>
        <p class="section-desc">选择牌阵，专注你的问题，让塔罗揭示命运的指引</p>

        <div class="tarot-spread-grid">
          <div class="tarot-spread-card selected" data-spread="single" data-cards="1" onclick="window.selectTarotSpread(this)">
            <span class="tarot-spread-icon">🃏</span>
            <h3 class="tarot-spread-name">单张牌占卜</h3>
            <p class="tarot-spread-desc">简洁直接的指引，适合快速得到一个明确的答案</p>
          </div>
          <div class="tarot-spread-card" data-spread="three" data-cards="3" onclick="window.selectTarotSpread(this)">
            <span class="tarot-spread-icon">🃏🃏🃏</span>
            <h3 class="tarot-spread-name">三张牌阵</h3>
            <p class="tarot-spread-desc">过去、现在、未来的时间线解读</p>
          </div>
          <div class="tarot-spread-card" data-spread="cross" data-cards="5" onclick="window.selectTarotSpread(this)">
            <span class="tarot-spread-icon">✝️</span>
            <h3 class="tarot-spread-name">凯尔特十字</h3>
            <p class="tarot-spread-desc">最经典的塔罗牌阵，全面深入分析</p>
          </div>
        </div>

        <input type="text" class="tarot-question-input" id="tarot-question"
          placeholder="心中默念你的问题（可选）..." />

        <button class="tarot-draw-btn" id="tarot-draw-btn" onclick="window.drawTarotCards()">
          <span>🔮</span> 开始抽牌
        </button>

        <div class="tarot-cards-area" id="tarot-cards-area" style="display:none;">
          <h3 style="font-family:'Noto Serif SC',serif;font-size:22px;color:#1a1a1a;margin-bottom:8px;"
            id="tarot-result-title">你的牌阵</h3>
          <p style="font-size:13px;color:rgba(0,0,0,0.45);margin-bottom:20px;" id="tarot-result-desc">点击卡牌翻开查看详情</p>
          <div class="tarot-cards-display" id="tarot-cards-display"></div>
          <div class="tarot-ai-container" id="tarot-ai-container"></div>
        </div>
      </div>
    `;

    insertBefore.parentNode.insertBefore(section, insertBefore);
    log('Tarot section injected');
  }

  // ===== 塔罗牌数据 =====
  var TAROT_DECK = [
    { name: '愚人', emoji: '🤡' }, { name: '魔术师', emoji: '🎩' },
    { name: '女祭司', emoji: '👸' }, { name: '皇后', emoji: '👑' },
    { name: '皇帝', emoji: '🏛️' }, { name: '教皇', emoji: '⛪' },
    { name: '恋人', emoji: '💕' }, { name: '战车', emoji: '🏎️' },
    { name: '力量', emoji: '🦁' }, { name: '隐士', emoji: '🕯️' },
    { name: '命运之轮', emoji: '☸️' }, { name: '正义', emoji: '⚖️' },
    { name: '倒吊人', emoji: '🙃' }, { name: '死神', emoji: '💀' },
    { name: '节制', emoji: '🍷' }, { name: '恶魔', emoji: '😈' },
    { name: '塔', emoji: '🗼' }, { name: '星星', emoji: '⭐' },
    { name: '月亮', emoji: '🌙' }, { name: '太阳', emoji: '☀️' },
    { name: '审判', emoji: '📯' }, { name: '世界', emoji: '🌍' },
  ];

  var SPREAD_POSITIONS = {
    single: ['指引'],
    three: ['过去', '现在', '未来'],
    cross: ['现状', '挑战', '过去', '未来', '建议'],
  };

  var selectedSpread = 'single';
  var drawnTarotCards = [];

  // ===== 选择牌阵 =====
  window.selectTarotSpread = function(el) {
    document.querySelectorAll('.tarot-spread-card').forEach(function(c) {
      c.classList.remove('selected');
    });
    el.classList.add('selected');
    selectedSpread = el.dataset.spread;
  };

  // ===== 抽牌 =====
  window.drawTarotCards = function() {
    var btn = document.getElementById('tarot-draw-btn');
    btn.disabled = true;
    btn.innerHTML = '<span>✨</span> 洗牌中...';

    setTimeout(function() {
      var numCards = parseInt(document.querySelector('.tarot-spread-card.selected').dataset.cards);
      var positions = SPREAD_POSITIONS[selectedSpread];
      drawnTarotCards = [];

      var available = TAROT_DECK.slice();
      for (var i = 0; i < numCards; i++) {
        var idx = Math.floor(Math.random() * available.length);
        var card = available.splice(idx, 1)[0];
        drawnTarotCards.push({
          name: card.name,
          emoji: card.emoji,
          position: positions[i] || '',
          reversed: Math.random() < 0.3,
        });
      }

      displayTarotCards();

      btn.disabled = false;
      btn.innerHTML = '<span>🔮</span> 重新抽牌';
    }, 1200);
  };

  // ===== 显示牌 =====
  function displayTarotCards() {
    var container = document.getElementById('tarot-cards-display');
    var area = document.getElementById('tarot-cards-area');
    var spreadName = document.querySelector('.tarot-spread-card.selected .tarot-spread-name').textContent;
    document.getElementById('tarot-result-title').textContent = spreadName + ' 结果';
    document.getElementById('tarot-result-desc').textContent = '点击卡牌翻开，查看AI解读';
    area.style.display = 'block';

    container.innerHTML = '';

    drawnTarotCards.forEach(function(card, index) {
      var cardEl = document.createElement('div');
      cardEl.className = 'tarot-card-item';
      cardEl.style.animationDelay = (index * 0.15) + 's';
      cardEl.innerHTML =
        '<div class="tarot-card-inner">' +
          '<div class="tarot-card-front-side"></div>' +
          '<div class="tarot-card-back-side">' +
            '<span class="tc-emoji">' + card.emoji + '</span>' +
            '<h4 class="tc-name">' + card.name + '</h4>' +
            '<p class="tc-position">' + card.position + '</p>' +
            '<p class="tc-orient ' + (card.reversed ? 'reversed' : 'normal') + '">' +
              (card.reversed ? '逆位' : '正位') +
            '</p>' +
          '</div>' +
        '</div>';

      cardEl.onclick = function() {
        cardEl.classList.toggle('flipped');
        checkAllTarotFlipped();
      };

      container.appendChild(cardEl);
    });

    document.getElementById('tarot-ai-container').innerHTML = '';

    setTimeout(function() {
      area.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // ===== 检查是否全部翻开 =====
  function checkAllTarotFlipped() {
    var allFlipped = document.querySelectorAll('.tarot-card-item').length > 0 &&
      document.querySelectorAll('.tarot-card-item:not(.flipped)').length === 0;

    if (allFlipped && window.AiInterpreter) {
      showTarotAiButton();
    }
  }

  // ===== 显示 AI 解读按钮 =====
  function showTarotAiButton() {
    var container = document.getElementById('tarot-ai-container');
    if (container.children.length > 0) return;

    var question = document.getElementById('tarot-question').value || '';
    var spreadName = document.querySelector('.tarot-spread-card.selected .tarot-spread-name').textContent;

    window.AiInterpreter.addTarotInterpret(container, {
      spreadType: spreadName,
      cards: drawnTarotCards.map(function(c) {
        return { name: c.name, position: c.position, reversed: c.reversed };
      }),
      question: question,
    });
  }

  // ===== 显示塔罗板块 =====
  window.showTarotSection = function() {
    var section = document.getElementById('tarot-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ===== AI解读系统提示词 =====
  var AI_PROMPTS = {
    bazi: `你是紫微星河的AI命理顾问，一位精通中国传统八字命理学的专业大师。解读风格：1. 专业而通俗易懂 2. 结合传统命理经典 3. 给出积极的改善建议 4. 保持客观理性。请用中文回复，语气温和专业。`,
    yunshi: `你是紫微星河的AI命理顾问，一位精通运势分析的专业大师。解读风格：1. 结合八字命理分析 2. 给出时间节点和注意事项 3. 提供积极的建议 4. 保持客观理性。请用中文回复，语气温和专业。`,
    tarot: `你是紫微星河的AI命理顾问，一位精通西方塔罗占卜的专业大师。解读风格：1. 结合传统含义和现代心理学 2. 给出深入而富有洞察力的解读 3. 提供建设性建议 4. 强调塔罗是指引而非宿命。请用中文回复，语气温和专业。`,
  };

  // ===== 演示回复 =====
  function getDemoResponse(type, data) {
    if (type === 'bazi') {
      return `## 八字命盘解读

**日主：${data.dayMaster || '壬水'}**

${data.dayMaster || '壬水'}日主之人，如江河大海，智慧深邃，胸怀宽广。性格上善于谋略，适应力强，具有包容万物的气度。

**命局特点：**
- 五行分布较为均衡，${data.fiveElements?.most || '木'}气偏旺，${data.fiveElements?.least || '金'}气稍弱
- 年柱${data.yearPillar || '甲戌'}，纳音山头火，主早年根基稳固

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
*以上为AI智能体解读，仅供参考娱乐。*`;
    }
    if (type === 'yunshi') {
      return `## ${data.type || '运势'}分析解读

**当前大运：${data.currentLuck || '戊辰'}运 ${data.ageRange || ''}**

您当前正处于人生的重要阶段。整体运势较为平稳向上，是积累和发展的好时机。

**${data.type || '运势'}特点：**
- 整体运势呈上升趋势，机遇与挑战并存
- 贵人运较旺，容易得到他人帮助

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
*以上为AI智能体解读，仅供参考娱乐。*`;
    }
    if (type === 'tarot') {
      var cardNames = (data.cards || []).map(function(c) { return c.name; }).join('、');
      return `## 塔罗牌阵解读

**牌阵：${data.spreadType || '单张牌占卜'}**
**抽到的牌：${cardNames}**

### 整体能量

这次占卜的整体能量是**转变与成长**。塔罗牌告诉您，您正处于人生的一个重要转折点。

### 牌面解读

${(data.cards || []).map(function(card, i) {
  return '**' + (i+1) + '. ' + card.name + '** ' + (card.reversed ? '逆位' : '正位') + (card.position ? ' - ' + card.position : '') + '\n\n' +
    card.name + '的' + (card.reversed ? '逆位' : '正位') + '代表着' + (card.reversed ? '内在的挑战和需要面对的阻碍' : '积极的能量和成长的机遇') + '。\n\n';
}).join('')}

### 综合建议

塔罗牌给出的信息是：**放下执念，拥抱变化**。相信宇宙的安排，您走在正确的道路上。

### 行动指南

1. **保持耐心** - 好的结果需要时间酝酿
2. **换个角度** - 尝试从不同视角看待问题
3. **信任直觉** - 您内心的声音知道答案
4. **积极行动** - 在适当的时候勇敢迈出步伐

---
*以上为AI智能体解读，仅供参考娱乐。*`;
    }
    return '抱歉，未能生成解读内容。';
  }

  // ===== 调用API =====
  async function callAPI(type, data) {
    try {
      var response = await fetch(CONFIG.API_BASE + '/api/ai/' + type, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json();
    } catch (e) {
      return { success: true, isDemo: true, interpretation: getDemoResponse(type, data) };
    }
  }

  // ===== CSS =====
  function injectStyles() {
    if (document.getElementById('ai-interpreter-styles')) return;
    var style = document.createElement('style');
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
        100% { background-position: 0% 50%; }
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
        to { opacity: 1; transform: translateY(0) scale(1); }
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

      .ai-panel-body { flex: 1; overflow: auto; padding: 16px 20px; }
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

  // ===== SVG图标 =====
  var ICONS = {
    sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    loader: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai-icon spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>',
  };

  // ===== Markdown渲染 =====
  function renderMarkdown(text) {
    var lines = text.split('\n');
    var html = '';
    var inList = false;

    for (var idx = 0; idx < lines.length; idx++) {
      var line = lines[idx];
      if (line.startsWith('## ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<h2>' + escapeHtml(line.slice(3)) + '</h2>';
      } else if (line.startsWith('### ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<h3>' + escapeHtml(line.slice(4)) + '</h3>';
      } else if (line.startsWith('**') && line.endsWith('**')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p><strong>' + escapeHtml(line.slice(2, -2)) + '</strong></p>';
      } else if (line.startsWith('- ')) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + escapeHtml(line.slice(2)) + '</li>';
      } else if (line.startsWith('> ')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<blockquote>' + escapeHtml(line.slice(2)) + '</blockquote>';
      } else if (line.startsWith('---')) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<hr>';
      } else if (line.trim() === '') {
        // skip
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p>' + escapeHtml(line) + '</p>';
      }
    }
    if (inList) html += '</ul>';
    return html;
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===== 显示面板 =====
  function showPanel(title, content, isDemo, onRetry, isLoading) {
    var existing = document.getElementById('ai-interpret-panel');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'ai-interpret-panel';
    overlay.className = 'ai-panel-overlay';
    overlay.onclick = function(e) {
      if (e.target === overlay) closePanel();
    };

    var panel = document.createElement('div');
    panel.className = 'ai-panel';

    var header = document.createElement('div');
    header.className = 'ai-panel-header';
    header.innerHTML =
      '<div class="ai-panel-header-left">' +
        '<div class="ai-panel-avatar">' + ICONS.bot + '</div>' +
        '<div>' +
          '<h3 class="ai-panel-title">' + escapeHtml(title) + '</h3>' +
          (isDemo ? '<span class="ai-panel-badge">演示模式</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="ai-panel-actions">' +
        (onRetry ? '<button class="ai-panel-action-btn" id="ai-retry-btn" title="重新解读">' + ICONS.refresh + '</button>' : '') +
        '<button class="ai-panel-action-btn" id="ai-copy-btn" title="复制内容">' + ICONS.copy + '</button>' +
        '<button class="ai-panel-action-btn" id="ai-close-btn" title="关闭">' + ICONS.x + '</button>' +
      '</div>';

    var body = document.createElement('div');
    body.className = 'ai-panel-body';

    if (isLoading) {
      body.innerHTML =
        '<div class="ai-loading">' +
          '<div class="ai-loading-icon">' + ICONS.sparkles + '</div>' +
          '<p class="ai-loading-text">AI 正在为您解读...</p>' +
        '</div>';
    } else {
      body.innerHTML =
        '<div class="ai-content">' +
          '<div class="ai-content-avatar">' + ICONS.sparkles + '</div>' +
          '<div class="ai-content-text">' + renderMarkdown(content) + '</div>' +
        '</div>';
    }

    var footer = document.createElement('div');
    footer.className = 'ai-panel-footer';
    footer.innerHTML = '<p>AI 解读仅供参考娱乐，不构成专业命理咨询建议</p>';

    panel.appendChild(header);
    panel.appendChild(body);
    panel.appendChild(footer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    document.getElementById('ai-close-btn').onclick = closePanel;

    var copyBtn = document.getElementById('ai-copy-btn');
    if (copyBtn) {
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(content).then(function() {
          copyBtn.innerHTML = ICONS.check;
          copyBtn.style.color = '#4ade80';
          setTimeout(function() {
            copyBtn.innerHTML = ICONS.copy;
            copyBtn.style.color = '';
          }, 2000);
        }).catch(function() {
          var ta = document.createElement('textarea');
          ta.value = content;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          copyBtn.innerHTML = ICONS.check;
          setTimeout(function() { copyBtn.innerHTML = ICONS.copy; }, 2000);
        });
      };
    }

    var retryBtn = document.getElementById('ai-retry-btn');
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
    var panel = document.getElementById('ai-interpret-panel');
    if (panel) {
      panel.style.opacity = '0';
      setTimeout(function() { panel.remove(); }, 200);
    }
  }

  // ===== 创建按钮 =====
  function createButton(label, onClick) {
    var btn = document.createElement('button');
    btn.className = 'ai-interpret-btn';
    btn.innerHTML = ICONS.sparkles + '<span>' + escapeHtml(label) + '</span>';
    btn.onclick = onClick;
    return btn;
  }

  // ===== 执行解读 =====
  function performInterpret(type, title, data) {
    log('Performing interpretation:', type, data);
    showPanel(title, '', false, null, true);
    callAPI(type, data).then(function(result) {
      var interpretation = result.interpretation || result.reply || '抱歉，未能获取解读结果。';
      showPanel(title, interpretation, result.isDemo, function() {
        performInterpret(type, title, data);
      }, false);
    });
  }

  // ===== 公共API =====
  function addBaziInterpret(container, baziData) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) { console.error('[AI] Container not found for bazi interpret'); return; }
    var btn = createButton('AI 智能解读八字', function() {
      performInterpret('bazi', 'AI 八字命盘解读', baziData);
    });
    var wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Bazi AI button added');
  }

  function addYunshiInterpret(container, yunshiData) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) { console.error('[AI] Container not found for yunshi interpret'); return; }
    var btn = createButton('AI 解读' + (yunshiData.type || '运势'), function() {
      performInterpret('yunshi', 'AI ' + (yunshiData.type || '运势') + '解读', yunshiData);
    });
    var wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Yunshi AI button added');
  }

  function addTarotInterpret(container, tarotData) {
    if (typeof container === 'string') container = document.querySelector(container);
    if (!container) { console.error('[AI] Container not found for tarot interpret'); return; }
    var btn = createButton('AI 智能解读塔罗', function() {
      performInterpret('tarot', 'AI ' + (tarotData.spreadType || '塔罗') + '解读', tarotData);
    });
    var wrapper = document.createElement('div');
    wrapper.className = 'ai-btn-container';
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    log('Tarot AI button added');
  }

  // ===== 自动初始化：在八字/运势页面添加AI按钮 =====
  function autoInitAiButtons() {
    var checkCount = 0;
    var maxChecks = 30;

    function tryInit() {
      checkCount++;

      // 八字排盘结果页
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

      // 运势分析页
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
    loadStyles();
    injectStyles();
    removeUnwanted();
    addTarotNav();
    injectTarotSection();
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
