// Exam JavaScript functionality

class ExamManager {
    constructor() {
        this.timeRemaining = 0;
        this.timerId = null;
        this.warningShown = false;
        this.finalWarningShown = false;
        
        this.init();
    }
    
    init() {
        this.setupTimer();
        this.setupNavigation();
        this.setupAutoSave();
        this.setupOptionSelection();
        this.checkExamStatus();
    }
    
    setupTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        this.timeRemaining = parseInt(timerElement.dataset.time) || 0;
        this.updateTimerDisplay();
        
        this.timerId = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            // Show warnings
            if (this.timeRemaining === 300 && !this.warningShown) { // 5 minutes
                this.showWarning('5 minutes remaining!');
                this.warningShown = true;
            }
            
            if (this.timeRemaining === 60 && !this.finalWarningShown) { // 1 minute
                this.showWarning('1 minute remaining!', 'danger');
                this.finalWarningShown = true;
            }
            
            // Auto submit when time expires
            if (this.timeRemaining <= 0) {
                this.autoSubmit();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add warning class when time is low
        if (this.timeRemaining <= 300) { // 5 minutes
            timerElement.classList.add('warning');
        }
    }
    
    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.navigateQuestion('previous'));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.navigateQuestion('next'));
        }
        
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitExam());
        }
    }
    
    setupAutoSave() {
        const options = document.querySelectorAll('input[name="answer"]');
        options.forEach(option => {
            option.addEventListener('change', () => {
                this.saveAnswer();
            });
        });
    }
    
    setupOptionSelection() {
        const optionLabels = document.querySelectorAll('.option-label');
        optionLabels.forEach(label => {
            label.addEventListener('click', () => {
                // Remove selected class from all labels
                optionLabels.forEach(l => l.classList.remove('selected'));
                // Add selected class to clicked label
                label.classList.add('selected');
            });
        });
        
        // Restore selected option if any
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            const selectedLabel = selectedOption.closest('.option-label');
            if (selectedLabel) {
                selectedLabel.classList.add('selected');
            }
        }
    }
    
    navigateQuestion(direction) {
        this.saveAnswer(() => {
            const questionId = document.querySelector('input[name="questionId"]').value;
            this.submitNavigation(questionId, direction);
        });
    }
    
    saveAnswer(callback) {
        const questionId = document.querySelector('input[name="questionId"]').value;
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const answer = selectedOption ? selectedOption.value : null;
        
        const data = {
            questionId,
            answer,
            action: 'save'
        };
        
        fetch('/exam/save-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success && callback) {
                callback();
            }
        })
        .catch(error => {
            console.error('Error saving answer:', error);
        });
    }
    
    submitNavigation(questionId, action) {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        const answer = selectedOption ? selectedOption.value : null;
        
        const data = {
            questionId,
            answer,
            action
        };
        
        fetch('/exam/save-answer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success && result.redirect) {
                window.location.href = result.redirect;
            }
        })
        .catch(error => {
            console.error('Error navigating:', error);
            this.showError('Navigation failed. Please try again.');
        });
    }
    
    submitExam() {
        if (confirm('Are you sure you want to submit your exam? This action cannot be undone.')) {
            this.saveAnswer(() => {
                window.location.href = '/exam/submit';
            });
        }
    }
    
    autoSubmit() {
        clearInterval(this.timerId);
        this.showWarning('Time is up! Submitting exam automatically...', 'danger');
        
        setTimeout(() => {
            window.location.href = '/exam/submit';
        }, 2000);
    }
    
    checkExamStatus() {
        // Check exam status every 30 seconds
        setInterval(() => {
            fetch('/exam/status')
                .then(response => response.json())
                .then(result => {
                    if (!result.success || result.isExpired) {
                        this.autoSubmit();
                    }
                })
                .catch(error => {
                    console.error('Error checking exam status:', error);
                });
        }, 30000);
    }
    
    showWarning(message, type = 'warning') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        const container = document.querySelector('.exam-container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
    
    showError(message) {
        this.showWarning(message, 'error');
    }
}

// Initialize exam manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.exam-container')) {
        new ExamManager();
    }
});

// Prevent going back during exam
if (window.location.pathname.includes('/exam/question/')) {
    history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, window.location.href);
        alert('Navigation is disabled during the exam!');
    });
}

// Warn before leaving page during exam
window.addEventListener('beforeunload', function (e) {
    if (window.location.pathname.includes('/exam/question/')) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your progress will be saved.';
        return e.returnValue;
    }
});
