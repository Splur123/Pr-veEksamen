document.addEventListener('DOMContentLoaded', function() {
    // Add toggle buttons for each admin answer form
    setupAnswerFormToggles();
    
    // Add status and priority classes to tickets
    setupTicketStyling();
});

function setupAnswerFormToggles() {
    // Find all admin answer forms
    const adminForms = document.querySelectorAll('form[action^="/auth/answerTicket/"]');
    
    // For each form, add a toggle button before it and hide the form
    adminForms.forEach(form => {
        // Create toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-form-btn';
        toggleBtn.textContent = 'Answer Ticket';
        toggleBtn.dataset.formId = form.getAttribute('action').split('/').pop();
        
        // Insert toggle button before the form
        form.parentNode.insertBefore(toggleBtn, form);
        
        // Convert form to use our toggle classes
        form.classList.add('answer-form');
        
        // Add click event to toggle button
        toggleBtn.addEventListener('click', function() {
            // Toggle form visibility
            form.classList.toggle('active');
            
            // Update button text
            this.textContent = form.classList.contains('active') ? 'Hide Answer Form' : 'Answer Ticket';
        });
    });
}

function setupTicketStyling() {
    // Find all status and priority indicators
    document.querySelectorAll('em').forEach(em => {
        const text = em.textContent.trim();
        
        // Add classes based on status
        if (text === 'Open') {
            em.classList.add('ticket-tag', 'status-open');
        } else if (text === 'In Progress') {
            em.classList.add('ticket-tag', 'status-progress');
        } else if (text === 'Solved') {
            em.classList.add('ticket-tag', 'status-solved');
        }
        
        // Add classes based on priority
        if (text === 'High Priority') {
            em.classList.add('ticket-tag', 'priority-high');
        } else if (text === 'Medium Priority') {
            em.classList.add('ticket-tag', 'priority-medium');
        } else if (text === 'Low Priority') {
            em.classList.add('ticket-tag', 'priority-low');
        } else if (text === 'No Priority') {
            em.classList.add('ticket-tag', 'priority-none');
        }
        
        // Add classes for category
        if (text.includes('Issue')) {
            em.classList.add('ticket-tag', 'category-tag');
        }
    });
}