document.addEventListener('DOMContentLoaded', () => {
  const lottoContainer = document.getElementById('lotto-container');
  const generateBtn = document.getElementById('generate-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Lotto generation logic
  function generateLottoNumbers() {
    const numbers = [];
    while (numbers.length < 6) {
      const randomNum = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum);
      }
    }
    // Sort numbers for better presentation
    numbers.sort((a, b) => a - b);
    
    // Update the DOM
    const balls = lottoContainer.querySelectorAll('.ball');
    balls.forEach((ball, index) => {
      ball.textContent = numbers[index];
      // Simple animation trigger
      ball.style.transform = 'scale(1.2)';
      setTimeout(() => {
        ball.style.transform = 'scale(1)';
      }, 200);
    });
  }

  // Theme toggle logic
  function toggleTheme() {
    if (body.classList.contains('light-mode')) {
      body.classList.replace('light-mode', 'dark-mode');
    } else {
      body.classList.replace('dark-mode', 'light-mode');
    }
  }

  // Event Listeners
  generateBtn.addEventListener('click', generateLottoNumbers);
  themeToggle.addEventListener('click', toggleTheme);
});
