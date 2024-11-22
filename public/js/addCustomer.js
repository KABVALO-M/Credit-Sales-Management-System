      // JavaScript for handling tab switching
      document.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.getAttribute('href');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.add('hidden');
            });

            // Remove active class from all links
            document.querySelectorAll('.tab-link').forEach(link => {
                link.classList.remove('active', 'bg-blue-700', 'text-white');
                link.classList.add('bg-gray-100', 'text-blue-700');
            });

            // Show the selected tab
            document.querySelector(targetTab).classList.remove('hidden');

            // Add active class and change style to clicked tab
            this.classList.add('active', 'bg-blue-700', 'text-white');
        });
    });

     // Make 'Personal Information' tab active by default
     document.addEventListener('DOMContentLoaded', function() {
        document.querySelector('#tab-personal').classList.remove('hidden');
        document.querySelector('.tab-link[href="#tab-personal"]').classList.add('active', 'bg-blue-700', 'text-white');
    });