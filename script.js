function addQualification() {
    const container = document.getElementById('qualifications-container');
    const newQualification = document.createElement('div');
    newQualification.className = 'qualification-entry';
    newQualification.innerHTML = `
        <div class="qualification-header">
            <h2>Qualification</h2>
            <button class="delete-btn" onclick="deleteQualification(this)">×</button>
        </div>
        <select class="qualification-select">
            <option value="">Select</option>
            <option value="SSC">SSC</option>
            <option value="HSSC">HSSC</option>
            <option value="BA/B.Sc">BA/B.Sc</option>
            <option value="MA/M.Sc">MA/M.Sc</option>
            <option value="BS">BS (4-Year)</option>
            <option value="B.Ed/ADE/Shahadtul Almia/Qari Sanad">B.Ed/ADE/Shahadtul Almia/Qari Sanad</option>
            <option value="M.Ed">M.Ed</option>
            <option value="MS/M.Phil">MS/M.Phil</option>
            <option value="Ph.D">Ph.D</option>
        </select>
        <div class="marks-container">
            <div class="marks-input">
                <label>Obtained</label>
                <input type="number" class="obtained-marks" placeholder="Obtained Marks" min="0" onchange="validateMarks(this)">
            </div>
            <div class="marks-input">
                <label>Total</label>
                <input type="number" class="total-marks" placeholder="Total Marks" min="0" onchange="validateMarks(this)">
            </div>
        </div>
    `;
    container.appendChild(newQualification);
}

function deleteQualification(button) {
    const qualificationEntry = button.closest('.qualification-entry');
    qualificationEntry.remove();
}

function downloadPDF() {
    const element = document.getElementById('result-content');
    html2pdf()
        .from(element)
        .save('academic_score.pdf');
}

function downloadImage() {
    const element = document.getElementById('result-content');
    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'academic_score.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
    });
}

function getWeightage(qualificationType) {
    const weightages = {
        'SSC': 15,
        'HSSC': 20,
        'BA/B.Sc': 20,
        'MA/M.Sc': 15,
        'BS': 35,  // Special case for 4-year BS degree (20 + 15)
        'B.Ed/ADE/Shahadtul Almia/Qari Sanad': 5,
        'M.Ed': 5,
        'MS/M.Phil': 5,
        'Ph.D': 5
    };
    return weightages[qualificationType] || 0;
}

function calculate() {
    const name = document.getElementById('studentName').value;
    if (!name) {
        alert('Please enter your name');
        return;
    }

    const qualifications = document.getElementsByClassName('qualification-entry');
    let totalScore = 0;
    let scoresList = '';
    let hasValidQualification = false;

    for (let qual of qualifications) {
        const qualificationType = qual.querySelector('.qualification-select').value;
        const obtainedMarks = parseFloat(qual.querySelector('.obtained-marks').value);
        const totalMarks = parseFloat(qual.querySelector('.total-marks').value);

        if (!qualificationType || isNaN(obtainedMarks) || isNaN(totalMarks)) {
            continue;
        }

        if (totalMarks === 0) {
            alert('Total marks cannot be zero');
            return;
        }

        hasValidQualification = true;
        let score;

        // Calculate score based on qualification type
        if (qualificationType === 'BS') {
            // Special case for 4-year BS degree
            const baBscComponent = (obtainedMarks / totalMarks) * 20;
            const maMscComponent = (obtainedMarks / totalMarks) * 15;
            score = baBscComponent + maMscComponent;
            
            scoresList += `
                <div class="score-item">
                    <span>${qualificationType} (4-Year)</span>
                    <span>${score.toFixed(2)} out of 35</span>
                    <div class="score-breakdown">
                        <small>BA/B.Sc (${baBscComponent.toFixed(2)}/20)</small>
                        <small>MA/M.Sc (${maMscComponent.toFixed(2)}/15)</small>
                    </div>
                </div>`;
        } else {
            const weightage = getWeightage(qualificationType);
            score = (obtainedMarks / totalMarks) * weightage;
            
            scoresList += `
                <div class="score-item">
                    <span>${qualificationType}</span>
                    <span>${score.toFixed(2)} out of ${weightage}</span>
                    <div class="formula">
                        <small>(${obtainedMarks} × ${weightage}) ÷ ${totalMarks}</small>
                    </div>
                </div>`;
        }

        totalScore += score;
    }

    if (!hasValidQualification) {
        alert('Please enter at least one valid qualification with marks');
        return;
    }

    const resultElement = document.getElementById('result');
    resultElement.querySelector('.result-name').textContent = `Mr. ${name}`;
    resultElement.querySelector('.scores-list').innerHTML = scoresList;
    resultElement.querySelector('.final-score').textContent = `${totalScore.toFixed(2)} out of 100`;
    resultElement.style.display = 'block';
}

function validateMarks(input) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < 0) {
        input.value = '';
    }
}

function clearAll() {
    document.getElementById('studentName').value = '';
    document.getElementById('qualifications-container').innerHTML = `
        <div class="qualification-entry">
            <div class="qualification-header">
                <h2>Qualification</h2>
                <button class="delete-btn" onclick="deleteQualification(this)">×</button>
            </div>
            <select class="qualification-select">
                <option value="">Select</option>
                <option value="SSC">SSC</option>
                <option value="HSSC">HSSC</option>
                <option value="BA/B.Sc">BA/B.Sc</option>
                <option value="MA/M.Sc">MA/M.Sc</option>
                <option value="BS">BS</option>
                <option value="B.Ed/ADE/Shahadtul Almia/Qari Sanad">B.Ed/ADE/Shahadtul Almia/Qari Sanad</option>
                <option value="M.Ed">M.Ed</option>
                <option value="BS/MA Education">BS/MA Education</option>
                <option value="MS/M.Phil">MS/M.Phil</option>
                <option value="Ph.D">Ph.D</option>
            </select>
            <div class="marks-container">
                <div class="marks-input">
                    <label>Obtained</label>
                    <input type="number" class="obtained-marks" placeholder="Obtained Marks">
                </div>
                <div class="marks-input">
                    <label>Total</label>
                    <input type="number" class="total-marks" placeholder="Total Marks">
                </div>
            </div>
        </div>
    `;
    document.getElementById('result').style.display = 'none';
} 