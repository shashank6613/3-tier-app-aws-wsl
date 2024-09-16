async function submitForm(event) {
    event.preventDefault();

    const formData = new FormData(document.querySelector('form'));
    const data = Object.fromEntries(formData.entries());

    const response = await fetch('http://localhost:8080/submit', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const result = await response.json();
    alert(result.message);
}

