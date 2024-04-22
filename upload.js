document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('uploadForm');
    const fileInput = document.getElementById('fileInput');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const files = fileInput.files;

        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                messageDiv.textContent = 'Files uploaded successfully';
                messageDiv.classList.remove('error');
                messageDiv.classList.add('success');
            } else {
                const data = await response.json();
                messageDiv.textContent = data.error || 'An error occurred';
                messageDiv.classList.remove('success');
                messageDiv.classList.add('error');
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred';
            messageDiv.classList.remove('success');
            messageDiv.classList.add('error');
        }
    });
});
