const searchInput = document.querySelector('.search-box input');
let renewPolicyNo = null;
let selectedPatientId = null;

let currentStep = 1;

const formStep1 = document.getElementById('formStep1');
const formStep2 = document.getElementById('formStep2');

const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');

const progressText = document.getElementById('progressText');
const step1Circle = document.getElementById('step1');
const step2Circle = document.getElementById('step2');

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toISOString().split('T')[0];
}


function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}


searchInput.addEventListener('input', () => {
    const value = searchInput.value;

    fetch(`http://localhost:3000/patients?q=${value}`)
        .then(res => res.json())
        .then(patients => {
            renderPatients(patients);
        });
});


function openModal() {
    document.getElementById('modalOverlay').classList.add('active');
}


function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}


function closeModalOnOverlay(event) {
    if (event.target === event.currentTarget) {
        closeModal();
    }
}


function selectPatient(row, patientId) {
    document.querySelectorAll('.patient-row').forEach(r =>
        r.classList.remove('selected')
    );

    row.classList.add('selected');

    
    selectedPatientId = patientId;

   
    document.getElementById('addPolicyBtn').style.display = 'inline-flex';

   
    fetch(`http://localhost:3000/patients`)
        .then(res => res.json())
        .then(patients => {
            const patient = patients.find(p => p.id === patientId);
            if (patient) {
                updatePatientSummary(patient);
            }
        });

    // Fetch policies
    fetch(`http://localhost:3000/policies/${patientId}`)
        .then(res => res.json())
        .then(policies => {
            renderPolicies(policies);
        });
}


fetch('http://localhost:3000/test')
    .then(res => res.text())
    .then(data => {
        console.log('Backend says:', data);
    })
    .catch(err => {
        console.error('Backend error:', err);
    });


fetch('http://localhost:3000/patients')
    .then(res => res.json())
    .then(patients => {
        renderPatients(patients);
    });



function renderPatients(patients) {
    const section = document.querySelector('.patients-section');

    document.querySelectorAll('.patient-row').forEach(row => row.remove());

    patients.forEach(patient => {
        const row = document.createElement('div');
        row.className = 'patient-row';

        row.innerHTML = `
            <div>${patient.name}</div>
            <div>${patient.phone}</div>
            <div>${patient.city}</div>
            <div>${patient.policies}</div>
        `;

        row.onclick = () => selectPatient(row, patient.id);

        section.appendChild(row);
    });
}


function renderPolicies(policies) {
    const table = document.querySelector('.policy-table');

    document.querySelectorAll('.policy-row').forEach(r => r.remove());
    document.querySelector('.no-policy')?.remove();

    if (policies.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'no-policy';
        empty.style.padding = '20px';
        empty.style.textAlign = 'center';
        empty.style.color = '#777';
        empty.innerText = 'No policies found for this patient';

        table.appendChild(empty);
        return;
    }

    policies.forEach(p => {
        const row = document.createElement('div');
        row.className = 'policy-row';

        row.innerHTML = `
            <div>${p.policy_no}</div>
            <div>${p.plan}</div>
            <div>${p.sum_insured}</div>
            <div>${formatDate(p.start_date)}</div>
            <div>${formatDate(p.end_date)}</div>
            <div>
                <span class="policy-status ${p.status.toLowerCase()}">
                    ${p.status}
                </span>
            </div>
            <div class="action-buttons">
                ${
                    p.status !== 'Cancelled'
                    ? `<button class="action-btn renew-btn">Renew</button>`
                    : ''
                }
                ${
                    p.status === 'Active'
                    ? `<button class="action-btn cancel-btn">Cancel</button>`
                    : ''
                }
            </div>
        `;


        table.appendChild(row);
    });
}


nextBtn.addEventListener('click', () => {


    if (currentStep === 1) {
        formStep1.style.display = 'none';
        formStep2.style.display = 'grid';

        backBtn.style.display = 'inline-block';
        nextBtn.innerText = 'Add Patient';

        progressText.innerText = 'Step 2 of 2';
        step1Circle.classList.remove('active');
        step2Circle.classList.add('active');

        currentStep = 2;
    }

    else 
    {
        const formData = new FormData();

        formData.append('firstName', document.getElementById('firstName').value);
        formData.append('lastName', document.getElementById('lastName').value);
        formData.append('dob', document.getElementById('dob').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('address', document.getElementById('address').value);

        const imageInput = document.getElementById('patientImage');
        if (imageInput.files.length > 0) {
            formData.append('image', imageInput.files[0]);
        }

        fetch('http://localhost:3000/patients', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert('Patient added successfully');

            closeModal();

            fetch('http://localhost:3000/patients')
                .then(res => res.json())
                .then(patients => renderPatients(patients));
        })
        .catch(err => {
            alert('Failed to add patient');
            console.error(err);
        });
    }

});


backBtn.addEventListener('click', () => {

    formStep2.style.display = 'none';
    formStep1.style.display = 'grid';

    backBtn.style.display = 'none';
    nextBtn.innerText = 'Next';

    progressText.innerText = 'Step 1 of 2';
    step2Circle.classList.remove('active');
    step1Circle.classList.add('active');

    currentStep = 1;
});

function updatePatientSummary(patient) {
    
    const avatar = document.getElementById('patient-avatar');
    avatar.innerHTML = '';

    if (patient.image_url) {
        const img = document.createElement('img');
        img.src = `http://localhost:3000${patient.image_url}`;
        img.alt = patient.name;
        avatar.appendChild(img);
    } else {
        const initials = patient.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();

        avatar.innerText = initials;
    }

    const details = document.querySelectorAll('.patient-details .detail-value');

    details[0].innerText = patient.name;
    details[1].innerText = patient.dob ? calculateAge(patient.dob) : '-';
    details[2].innerText = patient.phone;
    details[3].innerText = patient.email || '-';
    details[4].innerText = patient.city;
}



function openPolicyModal() {
    document.getElementById('policyModalOverlay').classList.add('active');
}


function closePolicyModal() {
    document.getElementById('policyModalOverlay').classList.remove('active');
}


function closePolicyModalOnOverlay(event) {
    if (event.target === event.currentTarget) {
        closePolicyModal();
    }
}


document.getElementById('savePolicyBtn').addEventListener('click', () => {

    if (!selectedPatientId) {
        alert('Please select a patient first');
        return;
    }

    const data = {
        patientId: selectedPatientId,
        policyNo: document.getElementById('policyNo').value,
        plan: document.getElementById('plan').value,
        sumInsured: document.getElementById('sumInsured').value,
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: document.getElementById('status').value
    };

    fetch('http://localhost:3000/policies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(() => {
        closePolicyModal();

        fetch('http://localhost:3000/patients')
            .then(res => res.json())
            .then(patients => renderPatients(patients));

        fetch(`http://localhost:3000/policies/${selectedPatientId}`)
            .then(res => res.json())
            .then(policies => renderPolicies(policies));

        loadPolicyStats();
    })
    .catch(err => {
        console.error(err);
        alert('Failed to add policy');
    });
});


document.addEventListener('click', (e) => {

    if (e.target.classList.contains('renew-btn')) {
        const row = e.target.closest('.policy-row');
        renewPolicyNo = row.children[0].innerText;

        document.getElementById('renewPolicyModal').classList.add('active');
    }

    if (e.target.classList.contains('cancel-btn')) {
        const row = e.target.closest('.policy-row');
        const policyNo = row.children[0].innerText;

        const reason = prompt('Enter cancellation reason:');
        if (!reason) return;

        fetch(`http://localhost:3000/policies/${policyNo}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
        })
        .then(res => res.json())
        .then(() => {
            refreshPolicyAndPatients();
        })
        .catch(() => alert('Cancel failed'));
    }

});


function refreshPolicyAndPatients() {
    fetch(`http://localhost:3000/policies/${selectedPatientId}`)
        .then(res => res.json())
        .then(policies => renderPolicies(policies));

    fetch('http://localhost:3000/patients')
        .then(res => res.json())
        .then(patients => renderPatients(patients));

    loadPolicyStats();
}

document.getElementById('confirmRenewBtn').addEventListener('click', () => {
    const startDate = document.getElementById('renewStartDate').value;
    const endDate = document.getElementById('renewEndDate').value;

    if (!startDate || !endDate) {
        alert('Please select start and end dates');
        return;
    }

    fetch(`http://localhost:3000/policies/${renewPolicyNo}/renew`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            startDate,
            endDate
        })
    })
    .then(res => res.json())
    .then(() => {
        closeRenewModal();
        refreshPolicyAndPatients();
    })
    .catch(() => alert('Renew failed'));
});


function closeRenewModal() {
    document.getElementById('renewPolicyModal').classList.remove('active');
}


function closeRenewModalOnOverlay(e) {
    if (e.target === e.currentTarget) {
        closeRenewModal();
    }
}


function loadPolicyStats() {
    fetch('http://localhost:3000/policy-stats')
        .then(res => res.json())
        .then(stats => {
            document.getElementById('activeCount').innerText = stats.active;
            document.getElementById('cancelledCount').innerText = stats.cancelled;
            document.getElementById('expiredCount').innerText = stats.expired;
            document.getElementById('expiringCount').innerText = stats.expiringSoon;
        })
        .catch(err => {
            console.error('Failed to load policy stats', err);
        });
}

loadPolicyStats();