// Constants
const RESPONDENT_CONSTANTS = {
    STAY_WITH: {
        1: 'Both Parents',
        2: 'Mother Only',
        3: 'Father Only',
        4: 'Others',
    },
    GUARDIAN_OCCUPATION: {
        1: 'Employed',
        2: 'Self-Employed',
        3: 'Unemployed',
        4: 'Retired',
        5: 'Other',
    },
    GUARDIAN_EDUCATION: {
        1: 'No Formal Education',
        2: 'Primary',
        3: 'Secondary',
        4: 'Tertiary',
    },
    RELIGION: {
        1: 'Catholic',
        2: 'Protestant',
        3: 'Muslim',
        4: 'Traditional',
        5: 'Other',
    },
    FINANCIAL_SUPPORT: {
        1: 'Parents',
        2: 'Relatives',
        3: 'Guardians',
        4: 'Other',
    },
    SCHOOL_VISITOR: {
        1: 'Daily',
        2: 'Weekly',
        3: 'Monthly',
        4: 'Rarely',
        5: 'Never',
    },
};

const AGE_OPTIONS = [15, 16, 17, 18, 19];
const FAMILY_SIZE_OPTIONS = Array.from({ length: 15 }, (_, i) => i + 1);
const BINARY_FIELD_NAMES = [
    'older_siblings',
    'parents_give_pocket_money',
    'guardian_visits',
    'has_rh_info',
    'rh_teacher',
    'rh_parents',
    'rh_health_worker',
    'rh_friends',
    'rh_media',
    'topic_sexuality',
    'topic_abstinence',
    'topic_condoms',
    'topic_sti_hiv',
    'topic_relationships',
    'info_adequate',
];

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getConstantValue(category, key) {
    return RESPONDENT_CONSTANTS[category] && RESPONDENT_CONSTANTS[category][key] 
        ? RESPONDENT_CONSTANTS[category][key] 
        : 'N/A';
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function getYearMonth(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

function isSameMonth(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function isSameYear(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getFullYear() === new Date().getFullYear();
}

function countRespondents(respondents) {
    return respondents ? respondents.length : 0;
}

function countByMonth(respondents) {
    return respondents ? respondents.filter(r => isSameMonth(r.collection_date)).length : 0;
}

function countByYear(respondents) {
    return respondents ? respondents.filter(r => isSameYear(r.collection_date)).length : 0;
}

// Form Validation
function validateForm(formData, isEditing = false) {
    const errors = {};

    if (!isEditing && (!formData.serial_no || formData.serial_no.trim() === '')) {
        errors.serial_no = 'Serial number is required';
    } else if (formData.serial_no && formData.serial_no.length > 20) {
        errors.serial_no = 'Serial number must be 20 characters or less';
    }

    if (!formData.school_name || formData.school_name.trim() === '') {
        errors.school_name = 'School name is required';
    } else if (formData.school_name.length > 100) {
        errors.school_name = 'School name must be 100 characters or less';
    }

    if (!formData.supervisor_name || formData.supervisor_name.trim() === '') {
        errors.supervisor_name = 'Supervisor name is required';
    } else if (formData.supervisor_name.length > 100) {
        errors.supervisor_name = 'Supervisor name must be 100 characters or less';
    }

    if (!formData.collection_date) {
        errors.collection_date = 'Collection date is required';
    }

    if (!formData.age || formData.age < 15 || formData.age > 19) {
        errors.age = 'Age must be between 15 and 19';
    }

    if (!formData.family_size || formData.family_size < 1) {
        errors.family_size = 'Family size is required';
    }

    if (!formData.stay_with || formData.stay_with < 1 || formData.stay_with > 4) {
        errors.stay_with = 'Stay with option is required';
    }

    if (!formData.guardian_occupation || formData.guardian_occupation < 1 || formData.guardian_occupation > 5) {
        errors.guardian_occupation = 'Guardian occupation is required';
    }

    if (formData.guardian_occupation === '5' && (!formData.guardian_occupation_other || formData.guardian_occupation_other.trim() === '')) {
        errors.guardian_occupation_other = 'Please specify other occupation';
    }

    if (!formData.guardian_education || formData.guardian_education < 1 || formData.guardian_education > 4) {
        errors.guardian_education = 'Guardian education level is required';
    }

    if (!formData.religion || formData.religion < 1 || formData.religion > 5) {
        errors.religion = 'Religion is required';
    }

    if (formData.older_siblings === undefined || formData.older_siblings === '' || formData.older_siblings === null) {
        errors.older_siblings = 'Please indicate if you have older siblings';
    }

    if (formData.parents_give_pocket_money === undefined || formData.parents_give_pocket_money === '' || formData.parents_give_pocket_money === null) {
        errors.parents_give_pocket_money = 'Please indicate if parents give pocket money';
    }

    if (!formData.financial_support_source || formData.financial_support_source < 1 || formData.financial_support_source > 4) {
        errors.financial_support_source = 'Financial support source is required';
    }

    if (formData.guardian_visits === undefined || formData.guardian_visits === '' || formData.guardian_visits === null) {
        errors.guardian_visits = 'Please indicate if guardians visit';
    }

    if (formData.has_rh_info === undefined || formData.has_rh_info === '' || formData.has_rh_info === null) {
        errors.has_rh_info = 'Please indicate if you have received RH information';
    }

    if (formData.info_adequate === undefined || formData.info_adequate === '' || formData.info_adequate === null) {
        errors.info_adequate = 'Please indicate if the information is adequate';
    }

    return errors;
}

function getFormData(form) {
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
        // Convert checkbox values
        if (value === '0' || value === '1') {
            data[key] = parseInt(value);
        } else if (value === '') {
            data[key] = undefined;
        } else if (!isNaN(value) && value !== '') {
            data[key] = parseInt(value);
        } else {
            data[key] = value;
        }
    }

    BINARY_FIELD_NAMES.forEach((fieldName) => {
        if (!(fieldName in data)) {
            data[fieldName] = 0;
        }
    });

    return data;
}

function setFormData(form, data) {
    for (const [key, value] of Object.entries(data)) {
        const fields = form.querySelectorAll(`[name="${key}"]`);
        if (!fields.length) continue;

        const field = fields[0];

        if (field.type === 'radio') {
            fields.forEach((radio) => {
                radio.checked = radio.value === String(value);
            });
            continue;
        }

        if (field.type === 'checkbox' && fields.length === 1) {
            field.checked = value === 1 || value === '1' || value === true;
            continue;
        }

        if (field.tagName === 'SELECT' || field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            if (field.type === 'date' && value) {
                field.value = String(value).slice(0, 10);
            } else {
                field.value = value ?? '';
            }
        }
    }
}

function displayErrors(form, errors) {
    // Clear all errors first
    form.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
    });

    // Display new errors
    Object.entries(errors).forEach(([key, message]) => {
        const errorEl = form.querySelector(`#error-${key}`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    });
}

function clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
}

function populateFamilySizeSelect(selectElement) {
    selectElement.innerHTML = '<option value="">Select Family Size</option>';
    FAMILY_SIZE_OPTIONS.forEach(size => {
        const option = document.createElement('option');
        option.value = size;
        option.textContent = size;
        selectElement.appendChild(option);
    });
}
