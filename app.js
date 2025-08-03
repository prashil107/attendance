// Replace this with your actual API Gateway endpoint URL
const API_ENDPOINT = 'https://bxxm033qmi.execute-api.us-east-1.amazonaws.com/prod/attendance';

// Helper function to display messages
function showMessage(text, isError = false) {
    const messageEl = document.getElementById('message');
    
    // Clear previous classes
    messageEl.classList.remove('success', 'error');

    // Add new class based on message type
    if (isError) {
        messageEl.classList.add('error');
    } else {
        messageEl.classList.add('success');
    }
    
    messageEl.textContent = text;
}

// Submit attendance form
document.getElementById('attendance-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const action = document.getElementById('action').value;

    if (!studentId || !studentName) {
        showMessage('Please fill in all fields.', true);
        return;
    }

    const payload = {
        studentId,
        studentName,
        action
    };

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showMessage('Attendance marked successfully!');
            document.getElementById('attendance-form').reset();
        } else {
            const errorData = await response.json();
            showMessage('Error: ' + (errorData.message || 'Failed to mark attendance'), true);
        }
    } catch (err) {
        showMessage('Network error. Please try again.', true);
    }
});
