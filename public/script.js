const form = document.getElementById('rentalApplicationForm');
const message = document.getElementById('formMessage');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  payload.consent = formData.get('consent');

  message.textContent = 'Submitting your application...';
  message.className = 'form-message';

  try {
    const response = await fetch('/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    message.textContent = result.message;
    message.className = `form-message ${result.ok ? 'success' : 'error'}`;

    if (result.ok) {
      form.reset();
    }
  } catch (error) {
    message.textContent = 'Unable to submit the form right now. Please try again.';
    message.className = 'form-message error';
  }
});
