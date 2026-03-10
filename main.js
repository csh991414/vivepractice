document.addEventListener('DOMContentLoaded', () => {
  const techGrid = document.getElementById('tech-news-grid');
  const globalGrid = document.getElementById('global-news-grid');
  const refreshBtn = document.getElementById('refresh-news');
  const themeToggle = document.getElementById('theme-toggle');
  const dateDisplay = document.getElementById('current-date');

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

  // Robust fetch with multiple proxies
  async function fetchWithRetry(rssUrl) {
    const proxies = [
      url => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&t=${Date.now()}`,
      url => `https://thingproxy.freeboard.io/fetch/${url}`,
      url => `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];

    for (const proxyGen of proxies) {
      try {
        const targetUrl = proxyGen(rssUrl);
        console.log(`Trying proxy: ${targetUrl}`);
        const response = await fetch(targetUrl);
        if (!response.ok) continue;

        let xmlString;
        if (targetUrl.includes('allorigins')) {
          const data = await response.json();
          xmlString = data.contents;
        } else {
          xmlString = await response.text();
        }

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item"));
        
        if (items.length > 0) return items;
      } catch (e) {
        console.warn("Proxy failed, trying next...", e);
      }
    }
    throw new Error("All proxies failed");
  }

  async function fetchNewsByCategory(query, container, count = 3) {
    container.innerHTML = '<div class="loading-state">데이터를 분석 중입니다...</div>';
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=ko&gl=KR&ceid=KR:ko`;
    
    try {
      const items = await fetchWithRetry(rssUrl);
      renderNews(items.slice(0, count), container);
    } catch (error) {
      console.error(`Error fetching ${query}:`, error);
      container.innerHTML = '<div class="loading-state" style="color: #e63946;">뉴스 서버 응답 지연. <br> 잠시 후 다시 시도해주세요.</div>';
    }
  }

  function renderNews(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
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
        <div class="news-badge badge-finance">실시간 분석</div>
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

      card.addEventListener('click', () => {
        window.open(link, '_blank');
      });

      container.appendChild(card);
    });
  }

  async function refreshAllNews() {
    updateDate();
    await Promise.all([
      fetchNewsByCategory('주식+반도체+AI+경제', techGrid, 3),
      fetchNewsByCategory('미국+중국+전쟁+금리', globalGrid, 3)
    ]);
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  refreshBtn.addEventListener('click', refreshAllNews);

  refreshAllNews();
});
