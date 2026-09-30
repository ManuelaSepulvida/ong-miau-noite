/* ==========================================================================
   js/app.js - Roteamento SPA e Âncoras sem Erro 404
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const containerConteudo = document.querySelector('main');
  const linksNavegacao = document.querySelectorAll('nav a');

  // Função para rolar até a âncora (#sobre, #gatos, etc)
  function rolarParaAncora(ancoraId) {
    if (!ancoraId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setTimeout(() => {
      const elemento = document.getElementById(ancoraId);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  // Função assíncrona para buscar e injetar a página
  async function carregarPagina(caminhoCompleto) {
    // Separa a página (.html) da âncora (#)
    const partes = caminhoCompleto.split('#');
    let pagina = partes[0];
    const ancora = partes[1] || null;

    // Se a página estiver vazia (ex: link era só '#sobre'), assume index.html
    if (!pagina || pagina === '') {
      pagina = 'index.html';
    }

    try {
      const resposta = await fetch(pagina);
      if (!resposta.ok) throw new Error('Página não encontrada');

      const htmlTexto = await resposta.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlTexto, 'text/html');
      const novoConteudo = doc.querySelector('main').innerHTML;

      // Injeta o novo conteúdo no DOM
      containerConteudo.innerHTML = novoConteudo;

      // Se for a página de cadastro, re-inicializa o script do formulário
      if (pagina.includes('cadastro.html') && typeof inicializarCadastro === 'function') {
        inicializarCadastro();
      }

      // Rola para a âncora desejada
      rolarParaAncora(ancora);

    } catch (erro) {
      containerConteudo.innerHTML = '<h2>Erro 404</h2><p>Página não encontrada.</p>';
    }
  }

  // Interceptação dos cliques nos links da <nav>
  linksNavegacao.forEach(link => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');

      if (!href) return;

      event.preventDefault();

      const partes = href.split('#');
      const paginaDestino = partes[0];
      const ancoraDestino = partes[1] || null;

      // Descobre a página atual pela URL do navegador
      const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';

      // Atualiza a URL na barra de endereços
      history.pushState(null, '', href);

      // SE JÁ ESTIVER NA PÁGINA: Não faz fetch novo, apenas rola até a âncora
      if ((paginaDestino === '' || paginaDestino === paginaAtual) && ancoraDestino) {
        rolarParaAncora(ancoraDestino);
        return;
      }

      // SE FOR PÁGINA DIFERENTE: Faz o fetch e carrega o HTML
      carregarPagina(href);
    });
  });

  // Suporte aos botões 'Voltar' e 'Avançar' do navegador
  window.addEventListener('popstate', () => {
    const caminhoAtual = window.location.pathname.split('/').pop() || 'index.html';
    const hashAtual = window.location.hash;
    carregarPagina(caminhoAtual + hashAtual);
  });
});