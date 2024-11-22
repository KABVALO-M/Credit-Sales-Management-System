 // Wait until the document is fully loaded
 document.addEventListener('DOMContentLoaded', function () {
    const flashMessages = document.getElementById('flashMessages');
    
    if (flashMessages) {
      setTimeout(() => {
        flashMessages.classList.add('opacity-0');
      }, 3000);

      setTimeout(() => {
        flashMessages.style.display = 'none';
      }, 4000);
    }
  });