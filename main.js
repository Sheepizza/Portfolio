const PUBLIC_KEY = 'Yf9AYCKGo5UVfAPSX';
const SERVICE_ID = 'service_2fnx4dk';
const TEMPLATE_ID = 'template_1gxlqsv';

emailjs.init(PUBLIC_KEY);

const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.textContent = 'ENVOI...';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form)
        .then(function (response) {
            form.reset();

            submitBtn.disabled = false;
            submitBtn.textContent = 'SEND';
        }, function (error) {

            submitBtn.disabled = false;
            submitBtn.textContent = 'SEND';
        });
});
