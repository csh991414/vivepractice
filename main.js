document.addEventListener('DOMContentLoaded', () => {
  const techGrid = document.getElementById('tech-news-grid');
  const globalGrid = document.getElementById('global-news-grid');
  const refreshBtn = document.getElementById('refresh-news');
  const themeToggle = document.getElementById('theme-toggle');
  const dateDisplay = document.getElementById('current-date');

  function updateDate() {
    const now = new Date();
    dateDisplay.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 실시간 시장 & 국제 정세 브리핑`;
  }
  updateDate();

  const stockMap = {
    // 테크 & 산업
    '반도체': { stocks: ['삼성전자', 'SK하이닉스', '한미반도체'], impact: 'positive' },
    'AI': { stocks: ['NAVER', '카카오', '이수페타시스'], impact: 'positive' },
    '전기차': { stocks: ['LG엔솔', '에코프로', '현대차'], impact: 'neutral' },
    '배터리': { stocks: ['LG화학', '포스코퓨처엠'], impact: 'positive' },
    '바이오': { stocks: ['삼성바이오', '셀트리온'], impact: 'positive' },
    '애플': { stocks: ['LG이노텍', '비에이치'], impact: 'positive' },
    '엔비디아': { stocks: ['SK하이닉스', '한미반도체'], impact: 'positive' },
    
    // 국제 정세 & 거시 경제
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
    const combined = (title + summary).toLowerCase();
    let bestMatch = { stocks: ['시장 전반'], impact: 'neutral' };
    
    for (const [keyword, data] of Object.entries(stockMap)) {
      if (combined.includes(keyword.toLowerCase())) {
        return data;
      }
    }
    return bestMatch;
  }

  async function fetchNewsByCategory(query, container, count = 4) {
    container.innerHTML = '<div class="loading-state">데이터를 가져오는 중...</div>';
    
    try {
      const rssUrl = encodeURIComponent(`https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`);
      // Use a different proxy if rss2json fails, or try multiple times
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=oyebmxjxvqz7q4q8p3v5p6v2v2v2v2v2v2v2v2v2`); // Random API key or empty
      const data = await response.json();

      if (data.status === 'ok') {
        renderNews(data.items.slice(0, count), container);
      } else {
        throw new Error('API Response not OK');
      }
    } catch (error) {
      console.error(`Error fetching ${query}:`, error);
      container.innerHTML = '<div class="loading-state">뉴스를 불러올 수 없습니다. (CORS 또는 API 제한)</div>';
    }
  }

  function renderNews(items, container) {
    container.innerHTML = '';
    items.forEach(item => {
      const prediction = predictImpact(item.title, item.description);
      const impactText = prediction.impact === 'positive' ? '상승 전망' : 
                         prediction.impact === 'negative' ? '하락 우려' : '중립/혼조';
      const impactClass = `status-${prediction.impact}`;

      const card = document.createElement('div');
      card.className = 'news-card';
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description;
      const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";

      card.innerHTML = `
        <div class="news-badge badge-finance">실시간 분석</div>
        <h3>${item.title}</h3>
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
        window.open(item.link, '_blank');
      });

      container.appendChild(card);
    });
  }

  async function refreshAllNews() {
    updateDate();
    // Fetch 4 items for each section to make 8 total
    await Promise.all([
      fetchNewsByCategory('주식+반도체+AI+실적', techGrid, 4),
      fetchNewsByCategory('미국+중국+전쟁+금리+경제', globalGrid, 4)
    ]);
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  refreshBtn.addEventListener('click', refreshAllNews);

  // Initial Load
  refreshAllNews();
});
