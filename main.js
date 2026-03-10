document.addEventListener('DOMContentLoaded', () => {
  const techGrid = document.getElementById('tech-news-grid');
  const globalGrid = document.getElementById('global-news-grid');
  const refreshBtn = document.getElementById('refresh-news');
  const themeToggle = document.getElementById('theme-toggle');
  const dateDisplay = document.getElementById('current-date');

  // State management
  let newsCache = {
    tech: [],
    global: [],
    lastFetched: null,
    techIndex: 0,
    globalIndex: 0
  };

  function updateDate() {
    const now = new Date();
    dateDisplay.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 Flowerly News 실시간 브리핑`;
  }
  updateDate();

  const stockMap = {
    '반도체': { stocks: ['삼성전자', 'SK하이닉스', '한미반도체'], impact: 'positive' },
    'AI': { stocks: ['NAVER', '카카오', '이수페타시스'], impact: 'positive' },
    '전기차': { stocks: ['LG엔솔', '에코프로', '현대차'], impact: 'neutral' },
    '배터리': { stocks: ['LG화학', '포스코퓨처엠'], impact: 'positive' },
    '바이오': { stocks: ['삼성바이오', '셀트리온'], impact: 'positive' },
    '애플': { stocks: ['LG이노텍', '비에이치'], impact: 'positive' },
    '엔비디아': { stocks: ['SK하이닉스', '한미반도체'], impact: 'positive' },
    '금리': { stocks: ['KB금융', '신한지주', '보험주'], impact: 'neutral' },
    '환율': { stocks: ['현대차', '기아', '삼성전자'], impact: 'neutral' },
    '전쟁': { stocks: ['LIG넥스원', '현대로템', '한화에어로'], impact: 'positive' },
    '방산': { stocks: ['한화에어로', 'LIG넥스원'], impact: 'positive' },
    '중국': { stocks: ['아모레퍼시픽', 'LG생활건강'], impact: 'negative' },
    '미국': { stocks: ['삼성전자', '현대차'], impact: 'neutral' },
    '유가': { stocks: ['S-Oil', 'SK이노베이션'], impact: 'positive' },
    '인플레이션': { stocks: ['음식물료주', '금리관련주'], impact: 'negative' }
  };

  function predictImpact(title, summary) {
    const combined = (title + (summary || "")).toLowerCase();
    for (const [keyword, data] of Object.entries(stockMap)) {
      if (combined.includes(keyword.toLowerCase())) {
        return data;
      }
    }
    return { stocks: ['시장 전반'], impact: 'neutral' };
  }

  async function fetchRSSItems(query, count) {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
    // Use AllOrigins JSON endpoint which is more robust
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    
    try {
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      if (!data || !data.contents) throw new Error('No contents in proxy response');
      
      const xmlString = data.contents;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("XML Parsing Error");
      }
      
      const items = Array.from(xmlDoc.querySelectorAll("item"));
      console.log(`Successfully fetched ${items.length} items for query: ${query}`);
      return items.slice(0, count);
    } catch (e) {
      console.error(`Fetch error for ${query}:`, e);
      throw e;
    }
  }

  async function fetchAllNews() {
    console.log("Fetching fresh 30 items for the day...");
    techGrid.innerHTML = globalGrid.innerHTML = '<div class="loading-state">오늘의 새로운 뉴스를 분석 중입니다...</div>';
    
    try {
      const [techItems, globalItems] = await Promise.all([
        fetchRSSItems('주식+반도체+AI+경제', 30),
        fetchRSSItems('미국+중국+전쟁+금리', 30)
      ]);
      
      if (techItems.length === 0 && globalItems.length === 0) {
        throw new Error("No news items found in both categories");
      }

      newsCache.tech = techItems;
      newsCache.global = globalItems;
      newsCache.lastFetched = new Date().toDateString();
      newsCache.techIndex = 0;
      newsCache.globalIndex = 0;
      
      displayNextBatch();
    } catch (error) {
      console.error("Initial fetch failed:", error);
      techGrid.innerHTML = globalGrid.innerHTML = '<div class="loading-state" style="color: #e63946;">뉴스를 불러오는데 실패했습니다. <br> 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.</div>';
    }
  }

  function displayNextBatch() {
    renderBatch(newsCache.tech, techGrid, 'techIndex');
    renderBatch(newsCache.global, globalGrid, 'globalIndex');
  }

  function renderBatch(items, container, indexKey) {
    if (!items || items.length === 0) return;
    
    let start = newsCache[indexKey];
    const batchSize = 3;
    
    if (start >= items.length) {
      start = 0;
      newsCache[indexKey] = 0;
    }
    
    const batch = items.slice(start, start + batchSize);
    newsCache[indexKey] += batchSize;
    
    container.innerHTML = '';
    batch.forEach(item => {
      const title = item.querySelector("title")?.textContent || "제목 없음";
      const link = item.querySelector("link")?.textContent || "#";
      const description = item.querySelector("description")?.textContent || "";
      
      const prediction = predictImpact(title, description);
      const impactText = prediction.impact === 'positive' ? '상승 전망' : 
                         prediction.impact === 'negative' ? '하락 우려' : '중립/혼조';
      const impactClass = `status-${prediction.impact}`;

      const card = document.createElement('div');
      card.className = 'news-card';
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = description;
      const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";

      card.innerHTML = `
        <div class="news-badge badge-finance">AI 분석</div>
        <h3>${title}</h3>
        <p class="news-summary">${cleanSummary.substring(0, 100)}...</p>
        <div class="impact-box">
          <div class="impact-header">
            <span>관련 종목 영향</span>
            <span class="impact-status ${impactClass}">${impactText}</span>
          </div>
          <div class="stocks-list">
            ${prediction.stocks.map(stock => `<span class="stock-tag">${stock}</span>`).join('')}
          </div>
        </div>
      `;

      card.addEventListener('click', () => window.open(link, '_blank'));
      container.appendChild(card);
    });
  }

  function checkAndRefresh() {
    const now = new Date();
    const today = now.toDateString();
    
    if (newsCache.lastFetched !== today) {
      if (now.getHours() >= 9 || !newsCache.lastFetched) {
        fetchAllNews();
      } else {
        if (newsCache.tech.length === 0) fetchAllNews();
        else displayNextBatch();
      }
    } else {
      displayNextBatch();
    }
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  refreshBtn.addEventListener('click', () => {
    updateDate();
    checkAndRefresh();
  });

  checkAndRefresh();
});
