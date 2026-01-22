// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupInputAnimations();
        }
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Form submission validation
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (fieldValue.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else if (!emailRegex.test(fieldValue)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;

            case 'message':
                if (!fieldValue) {
                    isValid = false;
                    errorMessage = 'Message is required';
                } else if (fieldValue.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        return isFormValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Shake animation
        field.classList.add('error-shake');
        setTimeout(() => {
            field.classList.remove('error-shake');
        }, 500);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }

            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            
            // Show loading state
            this.setLoadingState(submitButton, true);
            
            try {
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData);
                
                // For demo purposes, we'll simulate a form submission
                // In production, you would send this to your backend or service
                await this.simulateFormSubmission(data);
                
                // Show success message
                this.showSuccessMessage();
                this.form.reset();
                
            } catch (error) {
                // Show error message
                this.showErrorMessage(error.message);
            } finally {
                // Reset button state
                this.setLoadingState(submitButton, false, originalButtonText);
            }
        });
    }

    setLoadingState(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.innerHTML = originalText || '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            button.classList.remove('loading');
        }
    }

    async simulateFormSubmission(data) {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success (90% success rate for demo)
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Message sent successfully!' });
                } else {
                    reject(new Error('Failed to send message. Please try again.'));
                }
            }, 2000);
        });
    }

    showSuccessMessage() {
        this.showMessage('success', 'Thank you for your message! I\'ll get back to you soon.');
    }

    showErrorMessage(message) {
        this.showMessage('error', message || 'Something went wrong. Please try again.');
    }

    showMessage(type, message) {
        // Remove existing messages
        const existingMessage = this.form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Insert message after form
        this.form.parentNode.insertBefore(messageElement, this.form.nextSibling);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 5000);
    }

    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Floating label animation
            input.addEventListener('focus', () => {
                input.parentNode.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentNode.classList.remove('focused');
                }
            });

            // Check initial state
            if (input.value) {
                input.parentNode.classList.add('focused');
            }
        });
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new ContactForm();
});

// Additional CSS for contact form
const contactFormStyles = `
    .form-group {
        position: relative;
        margin-bottom: 1.5rem;
    }

    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 1rem;
        background: transparent;
        border: 1px solid var(--glass-border);
        border-radius: 10px;
        color: var(--text-primary);
        font-family: var(--font-family);
        font-size: var(--font-size-sm);
        transition: all 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--accent-cyan);
        box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);
        background: rgba(255, 255, 255, 0.02);
    }

    .form-group label {
        position: absolute;
        top: 1rem;
        left: 1rem;
        color: var(--text-muted);
        transition: all 0.3s ease;
        pointer-events: none;
        background: var(--bg-secondary);
        padding: 0 0.5rem;
    }

    .form-group.focused label,
    .form-group input:not(:placeholder-shown) + label,
    .form-group textarea:not(:placeholder-shown) + label {
        top: -0.5rem;
        left: 0.5rem;
        font-size: 0.75rem;
        color: var(--accent-cyan);
    }

    .form-group.error input,
    .form-group.error textarea {
        border-color: #ff4757;
        box-shadow: 0 0 10px rgba(255, 71, 87, 0.3);
    }

    .error-message {
        display: block;
        color: #ff4757;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease;
    }

    .form-message {
        margin-top: 1rem;
        padding: 1rem;
        border-radius: 10px;
        animation: slideInUp 0.3s ease;
    }

    .form-message.success {
        background: rgba(46, 213, 115, 0.1);
        border: 1px solid rgba(46, 213, 115, 0.3);
        color: #2ed573;
    }

    .form-message.error {
        background: rgba(255, 71, 87, 0.1);
        border: 1px solid rgba(255, 71, 87, 0.3);
        color: #ff4757;
    }

    .message-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .message-content i {
        font-size: 1.25rem;
    }

    .contact-form button.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .contact-form button.loading i {
        animation: spin 1s linear infinite;
    }

    .fade-out {
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.3s ease;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .form-group input,
        .form-group textarea {
            padding: 0.875rem;
        }

        .form-group label {
            top: 0.875rem;
            left: 0.875rem;
        }
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactFormStyles;
document.head.appendChild(styleSheet);
