const blackElements = document.querySelectorAll('.cls-3');
const yellowCircle = document.querySelector('.cls-4');
const redCircle = document.querySelector('.cls-5');
const purpleCircle = document.querySelector('.cls-2');

blackElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    element.style.animation = 'fadeOut 0.3s ease forwards';
    
    setTimeout(() => {
      yellowCircle.classList.add('stretch');
      redCircle.classList.add('stretch');
      purpleCircle.classList.add('stretch');
    }, 300);
  });
});