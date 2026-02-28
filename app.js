document.addEventListener('DOMContentLoaded', () => {

    // CPF Mask Function
    const cpfInput = document.getElementById('patientCpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 11) value = value.slice(0, 11); // Max 11 digits

            // Format to 000.000.000-00
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
            }
            e.target.value = value;
        });
    }

    // Date Mask Function (DD/MM/YYYY)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);

            if (value.length > 4) {
                value = value.replace(/(\d{2})(\d{2})(\d{4})/, "$1/$2/$3");
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{2})/, "$1/$2");
            }
            e.target.value = value;
        });
    }

    // Time Mask Function (HH:MM)
    const timeInput = document.getElementById('time');
    if (timeInput) {
        timeInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 4) value = value.slice(0, 4);

            if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{2})/, "$1:$2");
            }
            e.target.value = value;
        });
    }

    // Form submission
    const form = document.getElementById('appointmentForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            const btnText = document.querySelector('.btn-text');
            const spinner = document.getElementById('btnSpinner');
            const formMessage = document.getElementById('formMessage');

            // Set loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';
            formMessage.className = 'form-message'; // reset

            const payload = {
                patientName: document.getElementById('patientName').value.trim(),
                patientCpf: document.getElementById('patientCpf').value.replace(/\D/g, ''),
                serviceType: document.getElementById('serviceType').value,
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
            };

            // Validações Base (Semelhante ao que era feito no Backend)
            if (!payload.patientName || !payload.patientCpf || !payload.serviceType || !payload.date || !payload.time) {
                formMessage.textContent = 'Erro: Todos os campos obrigatórios devem ser preenchidos.';
                formMessage.classList.add('msg-error');
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                spinner.style.display = 'none';
                return;
            }

            if (payload.patientCpf.length !== 11) {
                formMessage.textContent = 'O CPF informado é inválido.';
                formMessage.classList.add('msg-error');
                submitBtn.disabled = false;
                btnText.style.display = 'inline-block';
                spinner.style.display = 'none';
                return;
            }

            // Simula um delay rápido para UX agradável e Feedback Visual de Processamento
            setTimeout(() => {
                formMessage.textContent = 'Processando agendamento seguro. Conectando...';
                formMessage.classList.remove('msg-error');
                formMessage.classList.add('msg-success');

                const whatsappNumber = '5586999846614';
                const message = `Olá! Gostaria de confirmar um agendamento prévio feito pelo site:%0A%0A` +
                    `*Nome:* ${document.getElementById('patientName').value}%0A` +
                    `*CPF:* ${document.getElementById('patientCpf').value}%0A` +
                    `*Especialidade desejada:* ${payload.serviceType}%0A` +
                    `*Data:* ${payload.date}%0A` +
                    `*Horário:* ${payload.time}%0A%0A` +
                    `Aguardo retorno da clínica!`;

                const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`;

                // Redireciona o usuário
                setTimeout(() => {
                    window.location.href = whatsappUrl;
                    form.reset();
                    submitBtn.disabled = false;
                    btnText.style.display = 'inline-block';
                    spinner.style.display = 'none';
                }, 1000);

            }, 800);
        });
    }
});
