import { salvarDados, buscarDados } from './storage.js';
/* ==========================================================================
   js/cadastro.js - Validação + Persistência + Máscaras
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector('form');

  // 1. Ao carregar a página, recupera os dados salvos no storage.js
  if (typeof buscarDados === 'function') {
    const cadastroSalvo = buscarDados('dadosCadastro');

    if (cadastroSalvo) {
      if (cadastroSalvo.nome) document.getElementById('nome').value = cadastroSalvo.nome;
      if (cadastroSalvo.email) document.getElementById('email').value = cadastroSalvo.email;
      if (cadastroSalvo.cpf) document.getElementById('cpf').value = cadastroSalvo.cpf;
      if (cadastroSalvo.telefone) document.getElementById('telefone').value = cadastroSalvo.telefone;
      if (cadastroSalvo.cep) document.getElementById('cep').value = cadastroSalvo.cep;
    }
  }

  // 2. Aplicação das máscaras com IMask (se a biblioteca estiver carregada)
  if (typeof IMask !== 'undefined') {
    const campoCPF = document.getElementById('cpf');
    if (campoCPF) IMask(campoCPF, { mask: '000.000.000-00' });

    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) IMask(campoTelefone, { mask: '(00) 00000-0000' });

    const campoCEP = document.getElementById('cep');
    if (campoCEP) IMask(campoCEP, { mask: '00000-000' });
  }

  // 3. Ao enviar o formulário, valida os dados e guarda no localStorage
  if (formulario) {
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();

      const campoNome = document.getElementById('nome');
      const campoEmail = document.getElementById('email');

      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let temErro = false;

      // Validação do Nome
      if (campoNome && campoNome.value.trim() === '') {
        campoNome.classList.add('campo-invalido');
        temErro = true;
      } else if (campoNome) {
        campoNome.classList.remove('campo-invalido');
      }

      // Validação do E-mail
      if (campoEmail && !emailValido.test(campoEmail.value.trim())) {
        campoEmail.classList.add('campo-invalido');
        temErro = true;
      } else if (campoEmail) {
        campoEmail.classList.remove('campo-invalido');
      }

      // Se NÃO houver erros de validação, salva no localStorage
      if (!temErro) {
        const dadosDoFormulario = {
          nome: campoNome ? campoNome.value : '',
          email: campoEmail ? campoEmail.value : '',
          cpf: document.getElementById('cpf')?.value || '',
          telefone: document.getElementById('telefone')?.value || '',
          cep: document.getElementById('cep')?.value || ''
        };

        if (typeof salvarDados === 'function') {
          salvarDados('dadosCadastro', dadosDoFormulario);
        }

        alert('Cadastro realizado e salvo com sucesso!');
      }
    });
  }
});