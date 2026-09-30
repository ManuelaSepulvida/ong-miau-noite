/* ==========================================================================
   js/storage.js - Gerenciamento do LocalStorage
   ========================================================================== */

// Função para guardar um objeto no localStorage
export function salvarDados(chave, dados) {
  const dadosEmTexto = JSON.stringify(dados);
  localStorage.setItem(chave, dadosEmTexto);
}

// Função para recuperar um objeto do localStorage
export function buscarDados(chave) {
  const dadosEmTexto = localStorage.getItem(chave);
  if (dadosEmTexto) {
    return JSON.parse(dadosEmTexto);
  }
  return null;
}