document.addEventListener("DOMContentLoaded", function () {
  const glitchTextElements = document.querySelectorAll(".glitch-text");

  glitchTextElements.forEach((element) => {
    const targetHTML = element.getAttribute("data-text");
    const duration = 1000; // 전체 애니메이션 시간 (ms)
    const initialInterval = 20; // 초기 단계 간격 (ms)
    const maxInterval = 100; // 최대 단계 간격 (ms)

    // 문단 높이 자동 조정
    const maxHeight = calculateHeight(element, targetHTML);
    element.style.height = `${maxHeight}px`; // 문단 높이를 고정

    // HTML 태그와 텍스트 분리
    const regex = /(<[^>]+>)|([^<]+)/g; // HTML 태그와 텍스트를 분리하는 정규식
    const parts = [];
    let match;

    while ((match = regex.exec(targetHTML)) !== null) {
      if (match[1]) {
        // HTML 태그
        parts.push({ type: "tag", content: match[1] });
      } else if (match[2]) {
        // 텍스트
        for (const char of match[2]) {
          parts.push({ type: "char", content: char });
        }
      }
    }

    // 랜덤 문자 집합 생성
    const cho = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"; // 초성
    const jung = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ"; // 중성
    const jong = "ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"; // 종성
    const hangul = "가나다라마바사아자차카타파하"; // 완성된 한글 문자

    const randomChars = [...cho, ...jung, ...jong, ...hangul]; // 랜덤 문자 집합

    // 변환되지 않은 문자들의 인덱스를 추적
    const remainingIndices = parts
      .map((part, index) => (part.type === "char" ? index : null))
      .filter((index) => index !== null);

    // 각 단계에서 변환할 문자 개수 계산
    const steps = Math.ceil(duration / initialInterval); // 전체 단계 수
    const charsPerStep = Math.ceil(remainingIndices.length / steps); // 단계당 변환할 문자 개수

    let currentInterval = initialInterval; // 현재 간격
    let step = 0;

    function glitchStep() {
      let output = "";

      // 무작위로 변환할 인덱스 선택
      for (let i = 0; i < charsPerStep && remainingIndices.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * remainingIndices.length);
        const indexToComplete = remainingIndices.splice(randomIndex, 1)[0];
        parts[indexToComplete].completed = true; // 해당 인덱스를 완료 상태로 표시
      }

      parts.forEach((part) => {
        if (part.type === "tag") {
          // HTML 태그는 그대로 출력
          output += part.content;
        } else if (part.type === "char") {
          // 랜덤 문자 또는 완성된 문자 출력
          if (part.completed) {
            // 완성된 문자는 흰색으로 출력
            output += `<span class="char-complete">${part.content}</span>`;
          } else if (part.content === " ") {
            // 공백 문자는 그대로 유지
            output += `<span class="char-complete"> </span>`;
          } else {
            // 랜덤 문자는 랜덤 문자 집합에서 선택
            const randomChar =
              randomChars[Math.floor(Math.random() * randomChars.length)];
            output += `<span class="char-random">${randomChar}</span>`;
          }
        }
      });

      element.innerHTML = output;

      // 애니메이션 종료 조건
      if (remainingIndices.length === 0) {
        element.innerHTML = targetHTML; // 최종 HTML 설정
        return; // 종료
      }

      // 다음 단계 호출
      step++;
      currentInterval = Math.min(
        initialInterval + (maxInterval - initialInterval) * (step / steps),
        maxInterval
      ); // 간격을 점점 증가
      setTimeout(glitchStep, currentInterval);
    }

    glitchStep(); // 첫 단계 호출

    // 창 크기 변경 시 최대 높이 재계산
    window.addEventListener("resize", () => {
      const newMaxHeight = calculateHeight(element, targetHTML);
      element.style.height = `${newMaxHeight}px`;
    });
  });

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
      whiteSpace: "pre-wrap", // 줄바꿈 유지
      wordWrap: "break-word", // 긴 단어 줄바꿈
      padding: getComputedStyle(element).padding, // 패딩 유지
      margin: "0", // 마진 제거
      boxSizing: "border-box", // 박스 크기 계산 방식 유지
      overflow: "hidden", // 스크롤바 방지
    });

    // <br> 태그를 줄바꿈 문자로 변환
    hiddenDiv.innerHTML = rawHTML.replace(/<br\s*\/?>/g, "\n");
    document.body.appendChild(hiddenDiv);
    const calculatedHeight = hiddenDiv.offsetHeight;
    document.body.removeChild(hiddenDiv);
    return calculatedHeight; // 계산된 높이 반환
  }
});