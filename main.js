document.addEventListener('DOMContentLoaded', () => {
  const newsGrid = document.getElementById('news-grid');
  const refreshBtn = document.getElementById('refresh-news');
  const themeToggle = document.getElementById('theme-toggle');
  const dateDisplay = document.getElementById('current-date');

  // Set current date
  const now = new Date();
  dateDisplay.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 아침 브리핑`;

  // Mock News Data with Impact Predictions
  const newsData = [
    {
      id: 1,
      category: 'tech',
      badge: '반도체',
      headline: '엔비디아, 차세대 AI 칩 발표... 삼성전자·SK하이닉스 수혜 기대',
      summary: '엔비디아가 역대급 성능의 신규 GPU 라인업을 공개하며 AI 반도체 수요가 더욱 폭증할 것으로 전망됩니다.',
      impact: 'positive',
      stocks: ['삼성전자', 'SK하이닉스', '한미반도체']
    },
    {
      id: 2,
      category: 'finance',
      badge: '거시경제',
      headline: '美 연준, 예상보다 매파적 발언... 금리 인하 시점 늦춰지나',
      summary: '제롬 파월 의장이 인플레이션 둔화 속도가 충분치 않다고 언급하며 시장의 금리 인하 기대감에 찬물을 끼얹었습니다.',
      impact: 'negative',
      stocks: ['카카오', 'NAVER', '셀트리온']
    },
    {
      id: 3,
      category: 'global',
      badge: '이차전지',
      headline: '유럽 연합, 전기차 배정 공급망 규정 강화... 국내 배터리 3사 영향은?',
      summary: 'EU가 배터리 여권 제도 및 핵심 원자재법(CRMA) 이행 가이드라인을 발표하며 공급망 관리가 핵심 변수로 떠올랐습니다.',
      impact: 'neutral',
      stocks: ['LG에너지솔루션', '삼성SDI', '포스코홀딩스']
    },
    {
      id: 4,
      category: 'tech',
      badge: '디스플레이',
      headline: '애플, 신형 아이패드에 OLED 전면 도입... 국내 패널사 수주 대박',
      summary: '애플이 차세대 태블릿 라인업에 OLED 패널 채택을 확정하며 국내 디스플레이 업계의 가동률이 급상승할 것으로 보입니다.',
      impact: 'positive',
      stocks: ['LG디스플레이', '삼성디스플레이', 'LX세미콘']
    },
    {
      id: 5,
      category: 'finance',
      badge: '자동차',
      headline: '현대차·기아, 역대 최대 분기 실적 달성 전망... 환율 효과 톡톡',
      summary: '고부가가치 차종 판매 비중 확대와 우호적인 환율 여건이 지속되면서 완성차 업체들의 수익성이 극대화되고 있습니다.',
      impact: 'positive',
      stocks: ['현대차', '기아', '현대모비스']
    }
  ];

  function renderNews() {
    newsGrid.innerHTML = '';
    
    // Simulate loading
    const loading = document.createElement('div');
    loading.className = 'loading-state';
    loading.textContent = '최신 시장 분석 데이터를 분석 중입니다...';
    newsGrid.appendChild(loading);

    setTimeout(() => {
      newsGrid.innerHTML = '';
      newsData.forEach(news => {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        const impactText = news.impact === 'positive' ? '상승 전망' : 
                           news.impact === 'negative' ? '하락 우려' : '중립/혼조';
        const impactClass = `status-${news.impact}`;

        card.innerHTML = `
          <div class="news-badge badge-${news.category}">${news.badge}</div>
          <h3>${news.headline}</h3>
          <p class="news-summary">${news.summary}</p>
          <div class="impact-box">
            <div class="impact-header">
              <span>예상 영향</span>
              <span class="impact-status ${impactClass}">${impactText}</span>
            </div>
            <div class="stocks-list">
              ${news.stocks.map(stock => `<span class="stock-tag">${stock}</span>`).join('')}
            </div>
          </div>
        `;
        newsGrid.appendChild(card);
      });
    }, 800);
  }

  // Theme Toggle
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });

  // Refresh Button
  refreshBtn.addEventListener('click', renderNews);

  // Initial Render
  renderNews();
});
