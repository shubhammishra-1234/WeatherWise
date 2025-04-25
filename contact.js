document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        // Show loading state
        formStatus.className = 'form-status loading';
        formStatus.innerHTML = `
            <div class="loading-message">
                <i class="fa-solid fa-spinner"></i>
                <span>Sending message...</span>
            </div>
        `;

        try {
            // Simulate API call (replace with actual API endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
                <div class="success-message">
                    <i class="fa-solid fa-check-circle"></i>
                    <span>Message sent successfully!</span>
                </div>
            `;

            // Reset form
            contactForm.reset();

            // Clear success message after 3 seconds
            setTimeout(() => {
                formStatus.className = 'form-status';
                formStatus.innerHTML = '';
            }, 3000);

        } catch (error) {
            // Show error message
            formStatus.className = 'form-status error';
            formStatus.innerHTML = `
                <div class="error-message">
                    <i class="fa-solid fa-exclamation-circle"></i>
                    <span>Failed to send message. Please try again.</span>
                </div>
            `;
        }
    });
}); 