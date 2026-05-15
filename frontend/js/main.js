// Global state
let currentPage = '/';
let currentRespondentId = null;

// Alert System
class AlertManager {
    constructor() {
        this.alerts = [];
    }

    add(message, type = 'info', duration = 5000) {
        const id = Math.random().toString(36).substr(2, 9);
        const alert = { id, message, type, duration };
        this.alerts.push(alert);
        this.render();

        if (duration) {
            setTimeout(() => this.remove(id), duration);
        }

        return id;
    }

    remove(id) {
        this.alerts = this.alerts.filter(a => a.id !== id);
        this.render();
    }

    render() {
        const container = document.getElementById('alerts-container');
        container.innerHTML = '';

        this.alerts.forEach(alert => {
            const el = document.createElement('div');
            el.className = `alert alert-${alert.type}`;
            const message = document.createElement('div');
            message.textContent = alert.message;
            const closeButton = document.createElement('button');
            closeButton.className = 'alert-close';
            closeButton.textContent = '×';
            closeButton.addEventListener('click', () => this.remove(alert.id));
            el.appendChild(closeButton);
            el.appendChild(message);
            container.appendChild(el);
        });
    }
}

const alertManager = new AlertManager();

// Page Navigation
function navigateTo(path) {
    currentPage = path;
    window.location.hash = path;
    renderPage();
}

// Page Rendering
async function renderPage() {
    const path = window.location.hash.slice(1) || '/';
    currentPage = path;

    const pageContent = document.getElementById('page-content');
    
    try {
        if (path === '/') {
            await renderHomePage();
        } else if (path === '/respondents') {
            await renderRespondentsPage();
        } else if (path === '/respondents/new') {
            await renderCreateRespondentPage();
        } else if (path.startsWith('/respondents/') && path.endsWith('/edit')) {
            const id = path.split('/')[2];
            await renderEditRespondentPage(id);
        } else {
            pageContent.innerHTML = '<div class="empty-state"><p>Page not found</p></div>';
        }
    } catch (error) {
        console.error('Error rendering page:', error);
        alertManager.add('Error loading page: ' + error.message, 'error');
        pageContent.innerHTML = '<div class="empty-state"><p>Error loading page</p></div>';
    }
}

// Home Page
async function renderHomePage() {
    const template = document.getElementById('home-page-template');
    const page = template.content.cloneNode(true);
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    pageContent.appendChild(page);

    // Load stats
    try {
        const stats = await RespondentAPI.getStats();
        const respondentSnapshot = await RespondentAPI.getAll(1, 1000);
        const respondents = respondentSnapshot.respondents || [];

        document.getElementById('total-respondents').textContent = stats.totalRespondents ?? respondents.length;
        document.getElementById('this-month-count').textContent = countByMonth(respondents);
        document.getElementById('this-year-count').textContent = countByYear(respondents);
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Respondents List Page
async function renderRespondentsPage() {
    const template = document.getElementById('respondents-page-template');
    const page = template.content.cloneNode(true);
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    pageContent.appendChild(page);

    try {
        const response = await RespondentAPI.getAll();
        const respondents = response.respondents || [];
        const listContainer = document.getElementById('respondents-list');
        
        if (respondents.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <p>No respondents found</p>
                    <p style="margin-top: 1rem;">
                        <button class="btn btn-primary" data-nav="/respondents/new" type="button">Add First Respondent</button>
                    </p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = '';
        respondents.forEach(respondent => {
            const card = document.createElement('div');
            card.className = 'respondent-card';
            card.innerHTML = `
                <div class="respondent-card-info">
                    <div class="respondent-card-title">${escapeHtml(respondent.serial_no)} - ${escapeHtml(respondent.school_name)}</div>
                    <div class="respondent-card-meta">
                        <div class="respondent-card-meta-item">
                            <span class="respondent-card-meta-label">Supervisor</span>
                            <span class="respondent-card-meta-value">${escapeHtml(respondent.supervisor_name)}</span>
                        </div>
                        <div class="respondent-card-meta-item">
                            <span class="respondent-card-meta-label">Age</span>
                            <span class="respondent-card-meta-value">${escapeHtml(respondent.age)}</span>
                        </div>
                        <div class="respondent-card-meta-item">
                            <span class="respondent-card-meta-label">Collected</span>
                            <span class="respondent-card-meta-value">${escapeHtml(formatDate(respondent.collection_date))}</span>
                        </div>
                    </div>
                </div>
                <div class="respondent-card-actions">
                    <button class="btn btn-secondary btn-sm" data-nav="/respondents/${respondent.id}/edit" type="button">Edit</button>
                    <button class="btn btn-danger btn-sm" data-action="delete-respondent" data-id="${respondent.id}" type="button">Delete</button>
                </div>
            `;
            listContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading respondents:', error);
        alertManager.add('Error loading respondents: ' + error.message, 'error');
    }
}

// Create Respondent Page
async function renderCreateRespondentPage() {
    const template = document.getElementById('create-respondent-page-template');
    const page = template.content.cloneNode(true);
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    pageContent.appendChild(page);

    setupFormHandlers(false);
}

// Edit Respondent Page
async function renderEditRespondentPage(id) {
    const template = document.getElementById('edit-respondent-page-template');
    const page = template.content.cloneNode(true);
    const pageContent = document.getElementById('page-content');
    pageContent.innerHTML = '';
    pageContent.appendChild(page);

    currentRespondentId = id;

    try {
        const respondent = await RespondentAPI.getById(id);
        const form = document.getElementById('edit-respondent-form');
        
        // Populate family size options
        populateFamilySizeSelect(document.getElementById('edit-family_size'));
        
        // Set form data
        setFormData(form, respondent);
        setupFormHandlers(true, respondent);
    } catch (error) {
        console.error('Error loading respondent:', error);
        alertManager.add('Error loading respondent: ' + error.message, 'error');
    }
}

// Form Handlers
function setupFormHandlers(isEditing, data = null) {
    const formId = isEditing ? 'edit-respondent-form' : 'respondent-form';
    const form = document.getElementById(formId);
    const prefix = isEditing ? 'edit-' : '';

    // Populate family size
    const familySizeSelect = document.getElementById(`${prefix}family_size`);
    if (familySizeSelect && familySizeSelect.options.length <= 1) {
        populateFamilySizeSelect(familySizeSelect);
    }

    // Guardian Occupation - Show other field
    const guardianOccupation = document.getElementById(`${prefix}guardian_occupation`);
    const guardianOccupationOtherGroup = document.getElementById(`${prefix}guardian_occupation_other_group`);
    guardianOccupation.addEventListener('change', (e) => {
        guardianOccupationOtherGroup.style.display = e.target.value === '5' ? 'block' : 'none';
    });

    // Older Siblings - Show siblings partners question
    const olderSiblings = form.querySelectorAll(`input[name="older_siblings"]`);
    const siblingsHavePartnersGroup = document.getElementById(`${prefix}siblings_have_partners_group`);
    olderSiblings.forEach(radio => {
        radio.addEventListener('change', (e) => {
            siblingsHavePartnersGroup.style.display = e.target.value === '1' ? 'block' : 'none';
        });
    });

    // Pocket Money - Show adequacy question
    const parentsPocketMoney = form.querySelectorAll(`input[name="parents_give_pocket_money"]`);
    const pocketMoneyAdequateGroup = document.getElementById(`${prefix}pocket_money_adequate_group`);
    parentsPocketMoney.forEach(radio => {
        radio.addEventListener('change', (e) => {
            pocketMoneyAdequateGroup.style.display = e.target.value === '1' ? 'block' : 'none';
        });
    });

    // RH Information - Show sources
    const hasRhInfo = form.querySelectorAll(`input[name="has_rh_info"]`);
    const rhInfoSources = document.getElementById(`${prefix}rh_info_sources`);
    hasRhInfo.forEach(radio => {
        radio.addEventListener('change', (e) => {
            rhInfoSources.style.display = e.target.value === '1' ? 'block' : 'none';
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit(form, isEditing);
    });

    // Trigger visibility checks on initial load
    if (data) {
        guardianOccupation.dispatchEvent(new Event('change'));
        if (data.older_siblings === 1) {
            form.querySelector(`input[name="older_siblings"][value="1"]`)?.dispatchEvent(new Event('change'));
        }
        if (data.parents_give_pocket_money === 1) {
            form.querySelector(`input[name="parents_give_pocket_money"][value="1"]`)?.dispatchEvent(new Event('change'));
        }
        if (data.has_rh_info === 1) {
            form.querySelector(`input[name="has_rh_info"][value="1"]`)?.dispatchEvent(new Event('change'));
        }
    }
}

async function exportRespondents() {
    try {
        await RespondentAPI.downloadExcelExport();
        alertManager.add('Excel export downloaded successfully', 'success');
    } catch (error) {
        console.error('Error exporting respondents:', error);
        alertManager.add('Error exporting respondents: ' + error.message, 'error');
    }
}

document.addEventListener('click', (event) => {
    const navElement = event.target.closest('[data-nav]');
    if (navElement) {
        event.preventDefault();
        navigateTo(navElement.dataset.nav);
        return;
    }

    const actionElement = event.target.closest('[data-action]');
    if (!actionElement) {
        return;
    }

    const action = actionElement.dataset.action;

    if (action === 'export-excel') {
        event.preventDefault();
        exportRespondents();
        return;
    }

    if (action === 'delete-respondent') {
        event.preventDefault();
        deleteRespondent(Number(actionElement.dataset.id));
    }
});

async function handleFormSubmit(form, isEditing) {
    clearErrors(form);
    const formData = getFormData(form);
    const errors = validateForm(formData, isEditing);

    if (Object.keys(errors).length > 0) {
        displayErrors(form, errors);
        alertManager.add('Please fix the form errors', 'error');
        return;
    }

    try {
        if (isEditing) {
            await RespondentAPI.update(currentRespondentId, formData);
            alertManager.add('Respondent updated successfully', 'success');
        } else {
            await RespondentAPI.create(formData);
            alertManager.add('Respondent created successfully', 'success');
        }

        try {
            await RespondentAPI.downloadExcelExport();
        } catch (exportError) {
            console.warn('Excel export failed:', exportError);
        }
        
        // Redirect to respondents list
        setTimeout(() => {
            navigateTo('/respondents');
        }, 1500);
    } catch (error) {
        console.error('Error saving respondent:', error);
        alertManager.add('Error saving respondent: ' + error.message, 'error');
    }
}

async function deleteRespondent(id) {
    if (!confirm('Are you sure you want to delete this respondent?')) {
        return;
    }

    try {
        await RespondentAPI.delete(id);
        alertManager.add('Respondent deleted successfully', 'success');
        await renderRespondentsPage();
    } catch (error) {
        console.error('Error deleting respondent:', error);
        alertManager.add('Error deleting respondent: ' + error.message, 'error');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Handle hash navigation
    window.addEventListener('hashchange', renderPage);
    
    // Initial render
    renderPage();
});
