document.addEventListener("DOMContentLoaded", function () {
  const typingTextElements = document.querySelectorAll(".typing-text");
  const totalDuration = 4000; // 모든 문단이 이 시간 안에 끝나도록 설정
  const initialDelay = 3000; // 타이핑 시작 전 지연 시간 (ms)

  let maxSteps = 0;
  const typingData = [];

  // 1️⃣ **각 문단의 타이핑 단계(step) 개수 계산 및 높이 미리 계산**
  typingTextElements.forEach((element) => {
    const rawHTML = element.getAttribute("data-text");
    const steps = calculateTypingSteps(rawHTML);
    typingData.push({ element, rawHTML, steps });
    maxSteps = Math.max(maxSteps, steps);

    // 문단 높이 미리 계산
    calculateHeight(element, rawHTML);
    window.addEventListener("resize", () => calculateHeight(element, rawHTML));
  });

  // 2️⃣ **각 문단의 속도를 동일한 step 횟수로 맞추기**
  setTimeout(() => { // 타이핑 시작 전 지연
    typingData.forEach(({ element, rawHTML, steps }) => {
      const adjustedDelay = totalDuration / maxSteps; // 가장 긴 문단 기준으로 타이핑 속도 설정
      startTypingAnimation(element, rawHTML, maxSteps, adjustedDelay);
    });
  }, initialDelay);

  // 🔹 **타이핑 단계(step) 개수 계산 (HTML 태그 포함)**
  function calculateTypingSteps(rawHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = rawHTML;
    const textLength = (tempDiv.textContent || "").replace(/\s+/g, "").length; // 순수 텍스트 길이
    const brCount = (rawHTML.match(/<br>/g) || []).length; // <br> 개수
    const tagCount = (rawHTML.match(/<[^>]+>/g) || []).length; // 모든 태그 개수
    return textLength + brCount + tagCount; // 전체 타이핑 단계 수
  }

  // 🔹 **문단 높이 자동 조정**
  function calculateHeight(element, rawHTML) {
    const hiddenDiv = document.createElement("div");
    Object.assign(hiddenDiv.style, {
      position: "absolute",
      visibility: "hidden",
      width: `${element.offsetWidth}px`,
      lineHeight: getComputedStyle(element).lineHeight,
      fontSize: getComputedStyle(element).fontSize,
      fontFamily: getComputedStyle(element).fontFamily,
    });
    hiddenDiv.innerHTML = rawHTML;
    document.body.appendChild(hiddenDiv);
    element.style.height = `${hiddenDiv.offsetHeight}px`;
    document.body.removeChild(hiddenDiv);
  }

  // 🔹 **타이핑 애니메이션 실행 (동일한 step 횟수로 동기화)**
  function startTypingAnimation(element, rawHTML, maxSteps, delay) {
    const regex = /(<br>|<[^>]+>)|([^<]+)/g;
    const parts = [];
    let match;
  
    while ((match = regex.exec(rawHTML)) !== null) {
      if (match[1]) {
        parts.push({ type: "tag", content: match[1] });
      } else if (match[2]) {
        for (const ch of match[2]) {
          parts.push({ type: "char", content: ch });
        }
      }
    }
  
    let index = 0;
    const cursor = document.createElement("span");
    cursor.className = "typing typing-active";
    cursor.textContent = "|";
    element.appendChild(cursor);
    element.classList.add("typing-in-progress");
  
    function type() {
      if (index < maxSteps) {
        const stepSize = Math.ceil(parts.length / maxSteps); // 각 step에서 추가할 글자 수
        let html = parts.slice(0, index * stepSize).map(p => p.content).join("");
        element.innerHTML = html;
        element.appendChild(cursor);
        index++;
        setTimeout(type, delay);
      } else {
        // 🔹 타이핑 완료 직전에 깜빡이는 효과 추가
        element.style.transition = "opacity 0.1s"; // 깜빡임 효과를 위한 트랜지션
        element.style.opacity = "0"; // 투명하게 만듦
        setTimeout(() => {
          element.style.opacity = "1"; // 다시 보이게 만듦
  
          // 🔹 깜빡임 효과가 끝난 후 클래스 변경 및 색상 변경
          element.classList.remove("typing-in-progress");
          element.classList.add("typing-complete");
          cursor.remove();
        }, 200); // 200ms 후 다시 보이게
      }
    }
  
    type();
  }
});