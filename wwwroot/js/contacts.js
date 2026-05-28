const apiUrl = '/api/contacts';
let contactModal;

document.addEventListener("DOMContentLoaded", () => {
    contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
    loadContacts();
});

async function loadContacts() {
    const response = await fetch(apiUrl);
    const contacts = await response.json();
    const tbody = document.getElementById('contactsTableBody');
    tbody.innerHTML = '';

    contacts.forEach(c => {
        const dateObj = new Date(c.birthDate);
        const formattedDate = dateObj.toLocaleDateString('ru-RU');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c.name}</td>
            <td>${c.mobilePhone}</td>
            <td>${c.jobTitle}</td>
            <td>${formattedDate}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick='openModal(${JSON.stringify(c)})'>Изменить</button>
                <button class="btn btn-sm btn-danger" onclick="deleteContact(${c.id})">Удалить</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModal(contact = null) {
    clearValidation();
    if (contact) {
        document.getElementById('modalTitle').innerText = 'Редактировать контакт';
        document.getElementById('contactId').value = contact.id;
        document.getElementById('name').value = contact.name;
        document.getElementById('mobilePhone').value = contact.mobilePhone;
        document.getElementById('jobTitle').value = contact.jobTitle;
        document.getElementById('birthDate').value = contact.birthDate.split('T')[0];
    } else {
        document.getElementById('modalTitle').innerText = 'Добавить контакт';
        document.getElementById('contactForm').reset();
        document.getElementById('contactId').value = 0;
    }
    contactModal.show();
}

function validateForm() {
    let isValid = true;
    clearValidation();

    const name = document.getElementById('name').value.trim();
    if (name.length < 2) {
        document.getElementById('nameError').innerText = 'Имя должно содержать минимум 2 символа.';
        isValid = false;
    }

    const phone = document.getElementById('mobilePhone').value.trim();
    const phoneRegex = /^\+?[0-9]{9,15}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('phoneError').innerText = 'Введите корректный номер телефона (от 9 до 15 цифр, допускается + в начале).';
        isValid = false;
    }

    const jobTitle = document.getElementById('jobTitle').value.trim();
    if (jobTitle.length === 0) {
        document.getElementById('jobTitleError').innerText = 'Должность обязательна.';
        isValid = false;
    }

    const birthDate = document.getElementById('birthDate').value;
    if (!birthDate) {
        document.getElementById('birthDateError').innerText = 'Укажите дату рождения.';
        isValid = false;
    } else {
        const selectedDate = new Date(birthDate);
        const today = new Date();
        if (selectedDate >= today) {
            document.getElementById('birthDateError').innerText = 'Дата рождения должна быть в прошлом.';
            isValid = false;
        }
    }

    return isValid;
}

function clearValidation() {
    document.querySelectorAll('.text-danger').forEach(el => el.innerText = '');
}

async function saveContact() {
    if (!validateForm()) return;

    const id = parseInt(document.getElementById('contactId').value);
    const contact = {
        id: id,
        name: document.getElementById('name').value,
        mobilePhone: document.getElementById('mobilePhone').value,
        jobTitle: document.getElementById('jobTitle').value,
        birthDate: document.getElementById('birthDate').value
    };

    const method = id === 0 ? 'POST' : 'PUT';
    const url = id === 0 ? apiUrl : `${apiUrl}/${id}`;

    await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    contactModal.hide();
    loadContacts();
}

async function deleteContact(id) {
    if (confirm('Вы уверены, что хотите удалить этот контакт?')) {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        loadContacts();
    }
}