document.addEventListener('DOMContentLoaded', function() {
    const toggleFormButton = document.getElementById('toggle-form');
    const toggleTableButton = document.getElementById('toggle-table');
    const showTable = document.getElementById('show-table');
    const inserirPetModal = new bootstrap.Modal(document.getElementById('inserirPetModal'));
    const atualizarPetModal = new bootstrap.Modal(document.getElementById('atualizarPetModal'));

    toggleFormButton.addEventListener('click', function() {
        inserirPetModal.show();
    });

    const createForm = document.getElementById('create-form');
    createForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await createPet();
        inserirPetModal.hide(); // Fecha o modal após enviar o formulário
        location.reload();
    });

    toggleTableButton.addEventListener('click', function() {
        showTable.style.display = (showTable.style.display === 'none' || showTable.style.display === '') ? 'block' : 'none';
        fetchAnimais();
    });

    async function fetchAnimais() {
        try {
            const response = await fetch('http://localhost:5000/animais');
            if (!response.ok) {
                throw new Error('Erro ao buscar animais');
            }
            const animais = await response.json();
            const tableBody = document.querySelector('#animais-table tbody');
            tableBody.innerHTML = '';
            animais.forEach(animal => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="align-middle">${animal.id}</td>
                    <td class="align-middle">${animal.name}</td>
                    <td class="align-middle">${animal.age}</td>
                    <td class="align-middle">${animal.sex}</td>
                    <td class="align-middle">${animal.size}</td>
                    <td class="align-middle">${animal.personality}</td>
                    <td class="align-middle"><img src="${animal.image_url}" alt="Dog Image" class="img-fluid"></td>
                    <td class="align-middle">
                        <button class="btn btn-primary" onclick="showUpdateForm(${animal.id}, '${animal.name}', '${animal.age}', '${animal.sex}', '${animal.size}', '${animal.personality}')">Atualizar</button>
                        <button class="btn btn-danger" onclick="deleteItem(${animal.id})">Deletar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            alert('Erro ao buscar animais');
        }
    }

    async function createPet() {
        try {
            const name = document.getElementById('create-name').value;
            const age = document.getElementById('create-age').value;
            const sex = document.querySelector('input[name="gender"]:checked').value;
            const size = document.getElementById('create-size').value;
            const personality = document.getElementById('create-personality').value;

            const response = await fetch('http://localhost:5000/animais', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, age, sex, size, personality })
            });

            if (!response.ok) {
                throw new Error('Erro ao cadastrar animal');
            }

            alert('Animal cadastrado com sucesso!');
            fetchAnimais();
            createForm.reset();
        } catch (error) {
            console.error(error);
            alert('Erro ao cadastrar animal');
        }
    }

    window.showUpdateForm = function(id, name, age, sex, size, personality) {
        document.getElementById('update-id').value = id;
        document.getElementById('update-name').value = name;
        document.getElementById('update-age').value = age;
        document.querySelector(`input[name="update-gender"][value="${sex}"]`).checked = true;
        document.getElementById('update-size').value = size;
        document.getElementById('update-personality').value = personality;
        atualizarPetModal.show();
    }

    const updateForm = document.getElementById('update-form');
    updateForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await updatePet();
        atualizarPetModal.hide();
    });

    async function updatePet() {
        try {
            const id = document.getElementById('update-id').value;
            const name = document.getElementById('update-name').value;
            const age = document.getElementById('update-age').value;
            const sex = document.querySelector('input[name="update-gender"]:checked').value;
            const size = document.getElementById('update-size').value;
            const personality = document.getElementById('update-personality').value;

            const response = await fetch(`http://localhost:5000/animais/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, age, sex, size, personality })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar animal');
            }

            alert('Dados do pet atualizados com sucesso!');
            fetchAnimais();
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar animal');
        }
    }

    window.deleteItem = async function(id) {
        try {
            const response = await fetch(`http://localhost:5000/animais/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Erro ao deletar animal');
            }
            alert('Pet deletado com sucesso!');
            fetchAnimais();
        } catch (error) {
            console.error(error);
            alert('Erro ao deletar animal');
        }
    }

    fetchAnimais();
});
