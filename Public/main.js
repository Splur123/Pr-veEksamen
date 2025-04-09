document.addEventListener('DOMContentLoaded', function() {
    // Add toggle buttons for each admin answer form
    setupAnswerFormToggles();
    
    // Add status and priority classes to tickets
    setupTicketStyling();

    // Add toggle buttons for FAQ forms
    setupFaqFormToggles();
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

function setupFaqFormToggles() {
    // Find all FAQ update forms
    const updateForms = document.querySelectorAll('form[action^="/auth/updateFaq/"]');
    
    // For each form, add a toggle button before it and hide the form
    updateForms.forEach(form => {
        // Create toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-form-btn';
        toggleBtn.textContent = 'Update Answer';
        toggleBtn.dataset.formId = form.getAttribute('action').split('/').pop();
        
        // Insert toggle button before the form
        form.parentNode.insertBefore(toggleBtn, form);
        
        // Convert form to use our toggle classes
        form.classList.add('faq-form');
        
        // Add click event to toggle button
        toggleBtn.addEventListener('click', function() {
            // Toggle form visibility
            form.classList.toggle('active');
            
            // Update button text
            this.textContent = form.classList.contains('active') ? 'Hide Update Form' : 'Update Answer';
        });
    });
    
    // For the main new FAQ form
    const newFaqForm = document.querySelector('form[action="/auth/faqSubmit"]');
    if (newFaqForm) {
        // Create container for the form and button
        const formContainer = document.createElement('div');
        formContainer.className = 'faq-new-container';
        
        // Create toggle button
        const toggleBtn = document.createElement('div');
        toggleBtn.className = 'toggle-form-btn';
        toggleBtn.textContent = 'Add New FAQ';
        
        // Move the form to our container and insert button
        newFaqForm.parentNode.insertBefore(formContainer, newFaqForm);
        formContainer.appendChild(toggleBtn);
        formContainer.appendChild(newFaqForm);
        
        // Convert form to use our toggle classes
        newFaqForm.classList.add('faq-form');
        
        // Add click event to toggle button
        toggleBtn.addEventListener('click', function() {
            // Toggle form visibility
            newFaqForm.classList.toggle('active');
            
            // Update button text
            this.textContent = newFaqForm.classList.contains('active') ? 'Hide Form' : 'Add New FAQ';
        });
    }
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