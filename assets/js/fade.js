const elements = document.querySelectorAll('[data-fade="true"]');

window.addEventListener('scroll', () => {
  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    
    if (rect.top < windowHeight * 2/3 && rect.bottom > windowHeight / 2) {
      element.style.filter = `brightness(1)`; 
    } else {
      element.style.filter = `brightness(0.4)`; 
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const event = new Event('scroll');
  window.dispatchEvent(event);
});