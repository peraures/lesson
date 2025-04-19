// 배경색 팔레트 정의 (어두운 계열)
const backgroundColors = [
  '#1e1e1e',    // 첫 번째 섹션 배경색
  '#1e1e1e',    // 두 번째 섹션 배경색

];

// 배경색 전환 함수
function updateBackgroundColor() {
  const sections = document.querySelectorAll('[data-background]');
  const windowHeight = window.innerHeight;

  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    
    // 요소의 중간 지점이 화면의 상단 1/4 ~ 하단 1/4 사이에 있으면 배경색 전환
    if (rect.top < windowHeight * 1/5 && rect.bottom > windowHeight / 5) {
      // 현재 섹션의 인덱스에 해당하는 배경색으로 전환
      document.body.style.backgroundColor = backgroundColors[index] || backgroundColors[0];
    }
  });
}

// 스크롤 이벤트 리스너 추가
window.addEventListener('scroll', updateBackgroundColor);

// 초기 로드 시 한 번 실행
window.addEventListener('DOMContentLoaded', () => {
  // 트랜지션 효과 추가
  document.body.style.transition = 'background-color 0.5s ease';
  updateBackgroundColor();
});