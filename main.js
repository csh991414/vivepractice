document.addEventListener('DOMContentLoaded', () => {
  const newsGrid = document.getElementById('news-grid');
  const refreshBtn = document.getElementById('refresh-news');
  const themeToggle = document.getElementById('theme-toggle');
  const dateDisplay = document.getElementById('current-date');

  // Set current date
  function updateDate() {
    const now = new Date();
    dateDisplay.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 실시간 시장 브리핑`;
  }
  updateDate();

  // Keyword to Stock Mapping for Impact Prediction
  const stockMap = {
    '반도체': { stocks: ['삼성전자', 'SK하이닉스', '한미반도체'], impact: 'positive' },
    'AI': { stocks: ['NAVER', '카카오', '이수페타시스'], impact: 'positive' },
    '금리': { stocks: ['KB금융', '신한지주', '카카오뱅크'], impact: 'neutral' },
    '전기차': { stocks: ['LG에너지솔루션', '삼성SDI', '에코프로'], impact: 'neutral' },
    '배터리': { stocks: ['LG화학', '포스코퓨처엠', '엘앤에프'], impact: 'positive' },
    '자동차': { stocks: ['현대차', '기아', '현대모비스'], impact: 'positive' },
    '바이오': { stocks: ['삼성바이오로직스', '셀트리온', '유한양행'], impact: 'positive' },
    '애플': { stocks: ['LG디스플레이', '비에이치', '자화전자'], impact: 'positive' },
    '엔비디아': { stocks: ['SK하이닉스', '한미반도체', '엠로'], impact: 'positive' },
    '환율': { stocks: ['현대차', '기아', '삼성전자'], impact: 'neutral' },
    '미국': { stocks: ['삼성전자', '현대차'], impact: 'neutral' }
  };

  function predictImpact(title, summary) {
    const combined = (title + summary).toLowerCase();
    for (const [keyword, data] of Object.entries(stockMap)) {
      if (combined.includes(keyword)) {
        return data;
      }
    }
    return { stocks: ['코스피 종합', '코스닥 종합'], impact: 'neutral' };
  }

  async function fetchNews() {
    newsGrid.innerHTML = '<div class="loading-state">실시간 최신 뉴스를 분석 중입니다...</div>';
    
    try {
      // Using a public RSS to JSON API (e.g., RSS2JSON with Google News KR)
      const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=주식+반도체+경제&hl=ko&gl=KR&ceid=KR:ko');
      const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
      const data = await response.json();

      if (data.status === 'ok') {
        renderNews(data.items.slice(0, 8)); // Limit to 8 items
      } else {
        throw new Error('News fetch failed');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      newsGrid.innerHTML = '<div class="loading-state">뉴스를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.</div>';
    }
  }

  function renderNews(items) {
    newsGrid.innerHTML = '';
    updateDate();

    items.forEach(item => {
      const prediction = predictImpact(item.title, item.description);
      const impactText = prediction.impact === 'positive' ? '상승 전망' : 
                         prediction.impact === 'negative' ? '하락 우려' : '중립/혼조';
      const impactClass = `status-${prediction.impact}`;

      const card = document.createElement('div');
      card.className = 'news-card';
      card.style.cursor = 'pointer';
      
      // Extract cleaner description (remove HTML tags)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.description;
      const cleanSummary = tempDiv.textContent || tempDiv.innerText || "";

      card.innerHTML = `
        <div class="news-badge badge-finance">실시간</div>
        <h3>${item.title}</h3>
        <p class="news-summary">${cleanSummary.substring(0, 100)}...</p>
        <div class="impact-box">
          <div class="impact-header">
            <span>예상 영향</span>
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

      newsGrid.appendChild(card);
    });
  }

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // Refresh Button
  refreshBtn.addEventListener('click', fetchNews);

  // Initial Render
  fetchNews();
});
