// Admin Dashboard JavaScript functionality

class AdminManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupQuestionModal();
        this.setupQuestionActions();
        this.setupFormValidation();
    }
    
    setupQuestionModal() {
        const modal = document.getElementById('questionModal');
        const addBtn = document.getElementById('addQuestionBtn');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                this.showQuestionModal();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideQuestionModal();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideQuestionModal();
            });
        }
        
        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideQuestionModal();
                }
            });
        }
    }
    
    setupQuestionActions() {
        // Edit question buttons
        document.querySelectorAll('.edit-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.target.dataset.id;
                this.editQuestion(questionId);
            });
        });
        
        // Delete question buttons
        document.querySelectorAll('.delete-question').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const questionId = e.target.dataset.id;
                this.deleteQuestion(questionId);
            });
        });
        
        // Question form submission
        const questionForm = document.getElementById('questionForm');
        if (questionForm) {
            questionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveQuestion();
            });
        }
    }
    
    setupFormValidation() {
        const form = document.getElementById('questionForm');
        if (!form) return;
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }
    
    showQuestionModal(questionData = null) {
        const modal = document.getElementById('questionModal');
        const form = document.getElementById('questionForm');
        const title = document.getElementById('modalTitle');
        
        if (questionData) {
            // Edit mode
            title.textContent = 'Edit Question';
            this.populateForm(questionData);
            form.dataset.mode = 'edit';
            form.dataset.questionId = questionData._id;
        } else {
            // Add mode
            title.textContent = 'Add New Question';
            form.reset();
            form.dataset.mode = 'add';
            delete form.dataset.questionId;
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    hideQuestionModal() {
        const modal = document.getElementById('questionModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Clear form
        document.getElementById('questionForm').reset();
        this.clearErrors();
    }
    
    populateForm(questionData) {
        document.getElementById('question').value = questionData.question;
        document.getElementById('option1').value = questionData.options[0];
        document.getElementById('option2').value = questionData.options[1];
        document.getElementById('option3').value = questionData.options[2];
        document.getElementById('option4').value = questionData.options[3];
        document.getElementById('correctAnswer').value = questionData.correctAnswer;
        document.getElementById('difficulty').value = questionData.difficulty;
        document.getElementById('subject').value = questionData.subject;
        document.getElementById('category').value = questionData.category || '';
    }
    
    async editQuestion(questionId) {
        try {
            const response = await fetch(`/admin/questions/${questionId}`);
            const result = await response.json();
            
            if (result.success) {
                this.showQuestionModal(result.question);
            } else {
                this.showError('Failed to load question data');
            }
        } catch (error) {
            console.error('Edit question error:', error);
            this.showError('Failed to load question data');
        }
    }
    
    async deleteQuestion(questionId) {
        if (!confirm('Are you sure you want to delete this question?')) {
            return;
        }
        
        try {
            const response = await fetch(`/admin/questions/${questionId}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Question deleted successfully');
                // Reload page to update the list
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showError(result.message || 'Failed to delete question');
            }
        } catch (error) {
            console.error('Delete question error:', error);
            this.showError('Failed to delete question');
        }
    }
    
    async saveQuestion() {
        const form = document.getElementById('questionForm');
        const formData = new FormData(form);
        const mode = form.dataset.mode;
        const questionId = form.dataset.questionId;
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Convert FormData to regular object
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        try {
            let url = '/admin/questions';
            let method = 'POST';
            
            if (mode === 'edit' && questionId) {
                url = `/admin/questions/${questionId}`;
                method = 'PUT';
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.hideQuestionModal();
                // Reload page to update the list
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                this.showError(result.message || 'Failed to save question');
            }
        } catch (error) {
            console.error('Save question error:', error);
            this.showError('Failed to save question');
        }
    }
    
    validateForm() {
        const form = document.getElementById('questionForm');
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        this.clearErrors();
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        // Additional validation for correct answer
        const correctAnswer = parseInt(document.getElementById('correctAnswer').value);
        if (correctAnswer < 0 || correctAnswer > 3) {
            this.showFieldError('correctAnswer', 'Correct answer must be between 0 and 3');
            isValid = false;
        }
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field.id, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.showFieldError(field.id, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(field.id);
        return true;
    }
    
    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    clearErrors() {
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
        
        document.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }
    
    showSuccess(message) {
        this.showAlert(message, 'success');
    }
    
    showError(message) {
        this.showAlert(message, 'error');
    }
    
    showAlert(message, type) {
        // Remove existing alerts
        document.querySelectorAll('.alert').forEach(alert => {
            alert.remove();
        });
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.main-content .container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.admin-dashboard')) {
        new AdminManager();
    }
});

// Confirm before deleting
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-danger') && 
        (e.target.textContent.includes('Delete') || e.target.innerHTML.includes('Delete'))) {
        if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
        }
    }
});
