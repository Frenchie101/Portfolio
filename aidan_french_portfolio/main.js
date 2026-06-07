const blackElements = document.querySelectorAll('.cls-3');
blackElements.forEach(element => {
  element.addEventListener('mouseenter', () => {
    element.style.animation = 'fadeOut 3.25s ease forwards';
  });
});

document.querySelector('.cls-5').addEventListener('click', () => {
  window.location.href = "index.html";
});

document.querySelector('.cls-4').addEventListener('click', () => {
  window.location.href = "index.html";
});

document.querySelector('.cls-2').addEventListener('click', () => {
  window.location.href = "index.html";
});