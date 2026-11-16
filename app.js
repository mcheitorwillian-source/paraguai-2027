
// @ts-nocheck
// ==========================================
// PARAGUAI 2027 — EXPEDIÇÃO PIRATA
// ==========================================

const main = document.querySelector("main");

if (!main) {
  console.error("Não encontrei o elemento <main> no index.html.");
} else {

  const telaInicial = main.innerHTML;

  // ==========================================
  // SALVAMENTO
  // ==========================================

  function salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function carregar(chave, padrao) {
    try {
      const dados = localStorage.getItem(chave);
      return dados ? JSON.parse(dados) : padrao;
    } catch (erro) {
      return padrao;
    }
  }

  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, caractere => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    })[caractere]);
  }

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  // ==========================================
  // DADOS
  // ==========================================

  const tarefasIniciais = [
    { texto: "Organizar documentos da viagem", feita: false },
    { texto: "Separar dinheiro para a expedição", feita: false },
    { texto: "Pesquisar lojas em Ciudad del Este", feita: false },
    { texto: "Comparar preços dos notebooks", feita: false },
    { texto: "Conferir hospedagem e transporte", feita: false },
    { texto: "Preparar mochila e acessórios", feita: false }
  ];

  let tarefas = carregar("tarefas", tarefasIniciais);
  let gastos = carregar("gastos", []);
  let anotacoes = carregar("registrosAnotacoes", []);

  if (!Array.isArray(tarefas)) tarefas = tarefasIniciais;
  if (!Array.isArray(gastos)) gastos = [];
  if (!Array.isArray(anotacoes)) anotacoes = [];

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================

  function abrirTela(titulo, conteudo) {
    main.innerHTML = `
      <button class="botao-voltar" data-acao="inicio">
        ← Voltar ao menu
      </button>

      <section class="pagina">
        <p class="etiqueta">PARAGUAI 2027 • EXPEDIÇÃO</p>
        <h2>${titulo}</h2>
        ${conteudo}
      </section>
    `;

    window.scrollTo(0, 0);
  }

  function voltarInicio() {
    main.innerHTML = telaInicial;
    window.scrollTo(0, 0);
  }

  // ==========================================
  // CHECKLIST
  // ==========================================

  function abrirChecklist() {
    const lista = tarefas.map((tarefa, indice) => `
      <label class="item-tarefa">
        <input
          type="checkbox"
          data-tarefa="${indice}"
          ${tarefa.feita ? "checked" : ""}
        >
        <span>${escapar(tarefa.texto)}</span>
      </label>
    `).join("");

    abrirTela("Checklist da expedição", `
      <p class="texto-suave">
        Marque cada tarefa conforme concluir os preparativos.
      </p>

      <div class="lista-tarefas">
        ${lista}
      </div>

      <div class="formulario">
        <input
          id="novaTarefa"
          type="text"
          placeholder="Adicionar nova tarefa..."
        >

        <button class="botao-principal" data-acao="adicionar-tarefa">
          + Adicionar tarefa
        </button>
      </div>

      <p class="texto-suave">
        ${tarefas.filter(t => t.feita).length} de ${tarefas.length}
        tarefas concluídas.
      </p>
    `);
  }

  function adicionarTarefa() {
    const campo = document.querySelector("#novaTarefa");
    const texto = campo?.value.trim();

    if (!texto) {
      alert("Escreva uma tarefa primeiro!");
      return;
    }

    tarefas.push({ texto, feita: false });
    salvar("tarefas", tarefas);
    abrirChecklist();
  }

  function alternarTarefa(indice, feita) {
    if (!tarefas[indice]) return;

    tarefas[indice].feita = feita;
    salvar("tarefas", tarefas);
    abrirChecklist();
  }

  // ==========================================
  // DIÁRIO DE ANOTAÇÕES
  // ==========================================

  function abrirAnotacoes() {
    const lista = anotacoes.length
      ? anotacoes.map((nota, indice) => `
          <article class="cartao-anotacao">
            <div class="anotacao-cabecalho">
              <strong>Registro ${anotacoes.length - indice}</strong>
              <span class="anotacao-data">
                ${escapar(new Date(nota.data).toLocaleString("pt-BR"))}
              </span>
            </div>

            <p class="anotacao-texto">${escapar(nota.texto)}</p>

            <button class="botao-excluir"
              data-remover-anotacao="${indice}">
              Excluir registro
            </button>
          </article>
        `).join("")
      : `<div class="vazio">Seu diário ainda está vazio.</div>`;

    abrirTela("Diário da expedição", `
      <p class="texto-suave">
        Registre ideias, lembretes e descobertas da viagem.
      </p>

      <div class="diario-editor">
        <textarea id="campoAnotacoes"
          placeholder="Escreva seu próximo registro..."></textarea>

        <button class="botao-principal" data-acao="salvar-anotacao">
          Guardar no diário
        </button>
      </div>

      <h3 class="grupo-titulo">Registros da expedição</h3>

      <div class="lista-anotacoes">
        ${lista}
      </div>
    `);
  }

  function salvarAnotacao() {
    const campo = document.querySelector("#campoAnotacoes");
    const texto = campo?.value.trim();

    if (!texto) {
      alert("Escreva alguma coisa antes de guardar!");
      return;
    }

    anotacoes.unshift({
      texto,
      data: new Date().toISOString()
    });

    salvar("registrosAnotacoes", anotacoes);
    abrirAnotacoes();
  }

  function removerAnotacao(indice) {
    anotacoes.splice(indice, 1);
    salvar("registrosAnotacoes", anotacoes);
    abrirAnotacoes();
  }

  // ==========================================
  // CALENDÁRIO
  // ==========================================

  const coresCalendario = {
    vermelho: "#e85b5b",
    dourado: "#e8bd60",
    azul: "#65a8e8",
    verde: "#72c98b",
    roxo: "#b58be8",
    laranja: "#e89a55",
    rosa: "#e88bc0",
    cinza: "#a5a5a5"
  };

  const nomesPadrao = {
    vermelho: "Importante",
    dourado: "Dourado",
    azul: "Azul",
    verde: "Verde",
    roxo: "Roxo",
    laranja: "Laranja",
    rosa: "Rosa",
    cinza: "Cinza"
  };

  function abrirCalendario() {
    const ano = 2027;
    const mes = 0;

    const nomesSalvos = carregar("nomesCoresCalendario", {});
    const nomesCores = {
      ...nomesPadrao,
      ...nomesSalvos
    };

    let marcacoes = carregar("diasMarcados", {});

    // Compatibilidade com marcações antigas
    if (Array.isArray(marcacoes)) {
      const antigas = {};
      marcacoes.forEach(data => antigas[data] = "dourado");
      marcacoes = antigas;
      salvar("diasMarcados", marcacoes);
    }

    const filtro = carregar("filtroCalendario", "todas");
    const selecionado = carregar("diaSelecionado", "");

    const primeiroDia = new Date(ano, mes, 1).getDay();
    const totalDias = new Date(ano, mes + 1, 0).getDate();

    let grade = "";

    for (let i = 0; i < primeiroDia; i++) {
      grade += `<div class="dia-vazio"></div>`;
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const data = `${ano}-01-${String(dia).padStart(2, "0")}`;
      const cor = marcacoes[data];
      const corHex = coresCalendario[cor];

      const oculto = filtro !== "todas" && filtro !== cor;

      grade += `
        <button
          class="dia-calendario ${selecionado === data ? "dia-marcado" : ""}"
          data-marcar-dia="${data}"
          style="
            background:${corHex || "var(--cartao)"};
            border-color:${corHex || "#ffffff12"};
            opacity:${oculto ? "0.25" : "1"};
          "
        >
          ${dia}
          ${cor ? "<small>●</small>" : ""}
        </button>
      `;
    }

    const filtros = Object.keys(coresCalendario).map(cor => `
      <button
        data-filtro="${cor}"
        style="
          background:${filtro === cor ? coresCalendario[cor] : "var(--cartao)"};
          border:1px solid ${coresCalendario[cor]};
          color:${filtro === cor ? "#17121f" : "var(--texto)"};
          padding:7px 10px;
          border-radius:10px;
        "
      >
        ${escapar(nomesCores[cor])}
      </button>
    `).join("");

    const paleta = Object.keys(coresCalendario).map(cor => `
      <button
        data-cor="${cor}"
        title="${escapar(nomesCores[cor])}"
        aria-label="${escapar(nomesCores[cor])}"
        style="
          width:34px;
          height:34px;
          border-radius:50%;
          background:${coresCalendario[cor]};
          border:3px solid ${marcacoes[selecionado] === cor ? "#ffffff" : "transparent"};
          margin:4px;
        "
      ></button>
    `).join("");

    const camposNomes = Object.keys(coresCalendario).map(cor => `
      <label style="
        display:flex;
        align-items:center;
        gap:10px;
        margin-bottom:12px;
      ">
        <span style="
          width:22px;
          height:22px;
          min-width:22px;
          border-radius:50%;
          background:${coresCalendario[cor]};
        "></span>

        <input
          type="text"
          id="nome-cor-${cor}"
          value="${escapar(nomesCores[cor])}"
          maxlength="24"
          placeholder="Nome da categoria"
          style="flex:1;min-width:0;"
        >
      </label>
    `).join("");

    const dataSelecionada = selecionado
      ? new Date(selecionado + "T12:00:00").toLocaleDateString("pt-BR")
      : "Nenhum dia selecionado";

    abrirTela("Calendário da expedição", `
      <div class="calendario-tela">

        <div class="calendario-cabecalho">
          <span>DIÁRIO DE BORDO</span>
          <h2>Janeiro 2027</h2>
          <p>Organize os dias da expedição</p>
        </div>

        <div class="calendario-cartao">
          <div class="calendario-semana">
            <span>DOM</span><span>SEG</span><span>TER</span>
            <span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span>
          </div>

          <div class="calendario-grade">
            ${grade}
          </div>
        </div>

        <div class="eventos-calendario">
          <h3>Filtrar por categoria</h3>

          <div style="display:flex;flex-wrap:wrap;gap:7px;">
            <button
              data-filtro="todas"
              style="
                padding:7px 12px;
                border-radius:10px;
                background:${filtro === "todas" ? "var(--ouro)" : "var(--cartao)"};
                color:${filtro === "todas" ? "#17121f" : "var(--texto)"};
                border:1px solid var(--ouro);
              "
            >Todas</button>

            ${filtros}
          </div>
        </div>

        <div class="eventos-calendario">
          <h3>Marcar um dia</h3>

          <div class="evento-calendario">
            <strong>${dataSelecionada}</strong>
            <p>Selecione um dia e escolha uma cor.</p>

            <div style="display:flex;flex-wrap:wrap;margin-top:12px;">
              ${paleta}
            </div>

            <button
              class="botao-excluir"
              data-acao="remover-marcacao"
              style="margin-top:12px;"
            >
              Remover marcação do dia
            </button>
          </div>
        </div>

        <div class="eventos-calendario">
          <h3>Gerenciar cores</h3>

          <div class="evento-calendario">
            <p style="margin-bottom:16px;">
              Personalize o significado de cada cor.
              Essas categorias também aparecerão nos filtros.
            </p>

            ${camposNomes}

            <button
              class="botao-principal"
              data-acao="salvar-nomes-cores"
            >
              Salvar categorias
            </button>
          </div>
        </div>

      </div>
    `);
  }

  function selecionarDia(data) {
    salvar("diaSelecionado", data);
    abrirCalendario();
  }

  function escolherCor(cor) {
    const selecionado = carregar("diaSelecionado", "");

    if (!selecionado) {
      alert("Primeiro selecione um dia no calendário!");
      return;
    }

    if (!coresCalendario[cor]) return;

    const marcacoes = carregar("diasMarcados", {});
    marcacoes[selecionado] = cor;

    salvar("diasMarcados", marcacoes);
    abrirCalendario();
  }

  function removerMarcacao() {
    const selecionado = carregar("diaSelecionado", "");

    if (!selecionado) {
      alert("Selecione um dia primeiro!");
      return;
    }

    const marcacoes = carregar("diasMarcados", {});
    delete marcacoes[selecionado];

    salvar("diasMarcados", marcacoes);
    abrirCalendario();
  }

  function salvarNomesCores() {
    const nomes = carregar("nomesCoresCalendario", {});

    Object.keys(coresCalendario).forEach(cor => {
      const campo = document.querySelector(`#nome-cor-${cor}`);

      if (campo && campo.value.trim()) {
        nomes[cor] = campo.value.trim();
      }
    });

    salvar("nomesCoresCalendario", nomes);
    abrirCalendario();
  }

  // ==========================================
  // ORÇAMENTO
  // ==========================================

  function abrirOrcamento() {
    const total = gastos.reduce((soma, gasto) => {
      return soma + Number(gasto.valor || 0);
    }, 0);

    const lista = gastos.length
      ? gastos.map((gasto, indice) => `
          <article class="cartao-anotacao">
            <strong>${escapar(gasto.descricao)}</strong>
            <p>${dinheiro(gasto.valor)}</p>

            <button class="botao-excluir"
              data-remover-gasto="${indice}">
              Excluir gasto
            </button>
          </article>
        `).join("")
      : `<div class="vazio">Nenhum gasto registrado.</div>`;

    abrirTela("Orçamento da expedição", `
      <div class="evento-calendario">
        <p class="texto-suave">Total de gastos registrados</p>
        <h2>${dinheiro(total)}</h2>
      </div>

      <div class="formulario">
        <input
          id="descricaoGasto"
          type="text"
          placeholder="Descrição do gasto"
        >

        <input
          id="valorGasto"
          type="number"
          min="0"
          step="0.01"
          placeholder="Valor em reais"
        >

        <button class="botao-principal" data-acao="adicionar-gasto">
          + Registrar gasto
        </button>
      </div>

      <h3 class="grupo-titulo">Registros financeiros</h3>
      <div class="lista-anotacoes">
        ${lista}
      </div>
    `);
  }

  function adicionarGasto() {
    const descricao = document.querySelector("#descricaoGasto")?.value.trim();
    const valor = Number(document.querySelector("#valorGasto")?.value);

    if (!descricao || !Number.isFinite(valor) || valor <= 0) {
      alert("Informe uma descrição e um valor válido!");
      return;
    }

    gastos.push({ descricao, valor });
    salvar("gastos", gastos);
    abrirOrcamento();
  }

  function removerGasto(indice) {
    gastos.splice(indice, 1);
    salvar("gastos", gastos);
    abrirOrcamento();
  }

  // ==========================================
  // GALERIA DE FOTOS — INDEXEDDB
  // ==========================================

  let bancoFotos = null;
  let urlsGaleria = [];

  function abrirBancoFotos() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB não está disponível."));
        return;
      }

      const pedido = indexedDB.open("Paraguai2027Fotos", 1);

      pedido.onupgradeneeded = evento => {
        const banco = evento.target.result;

        if (!banco.objectStoreNames.contains("fotos")) {
          banco.createObjectStore("fotos", {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      pedido.onsuccess = () => {
        bancoFotos = pedido.result;
        resolve(bancoFotos);
      };

      pedido.onerror = () => reject(pedido.error);
    });
  }

  function guardarFoto(arquivo) {
    return new Promise((resolve, reject) => {
      const transacao = bancoFotos.transaction("fotos", "readwrite");

      const pedido = transacao.objectStore("fotos").add({
        nome: arquivo.name,
        arquivo,
        data: new Date().toISOString()
      });

      pedido.onsuccess = () => resolve(pedido.result);
      pedido.onerror = () => reject(pedido.error);
    });
  }

  function buscarFotos() {
    return new Promise((resolve, reject) => {
      const transacao = bancoFotos.transaction("fotos", "readonly");
      const pedido = transacao.objectStore("fotos").getAll();

      pedido.onsuccess = () => resolve(pedido.result);
      pedido.onerror = () => reject(pedido.error);
    });
  }

  function apagarFoto(id) {
    return new Promise((resolve, reject) => {
      const transacao = bancoFotos.transaction("fotos", "readwrite");
      const pedido = transacao.objectStore("fotos").delete(id);

      pedido.onsuccess = () => resolve();
      pedido.onerror = () => reject(pedido.error);
    });
  }

  async function abrirGaleria() {
    urlsGaleria.forEach(url => URL.revokeObjectURL(url));
    urlsGaleria = [];

    abrirTela("Galeria da expedição", `
      <p class="texto-suave">
        Guarde as lembranças e fotografias da viagem.
      </p>

      <div class="formulario">
        <label for="selecionarFotos">Escolher fotografias</label>
        <input
          id="selecionarFotos"
          type="file"
          accept="image/*"
          multiple
        >
      </div>

      <div id="conteudoGaleria">
        <p class="texto-suave">Carregando fotografias...</p>
      </div>
    `);

    try {
      await abrirBancoFotos();
      const fotos = await buscarFotos();

      const conteudo = document.querySelector("#conteudoGaleria");
      if (!conteudo) return;

      if (!fotos.length) {
        conteudo.innerHTML = `
          <div class="vazio">Sua galeria ainda está vazia.</div>
        `;
        return;
      }

      conteudo.innerHTML = `
        <div class="galeria-grade">
          ${fotos.map(foto => {
            const url = URL.createObjectURL(foto.arquivo);
            urlsGaleria.push(url);

            return `
              <article class="foto-card">
                <img src="${url}" alt="${escapar(foto.nome)}">
                <p>${escapar(foto.nome)}</p>

                <button class="botao-excluir"
                  data-remover-foto="${foto.id}">
                  Excluir foto
                </button>
              </article>
            `;
          }).join("")}
        </div>
      `;
    } catch (erro) {
      console.error("Erro na galeria:", erro);

      const conteudo = document.querySelector("#conteudoGaleria");

      if (conteudo) {
        conteudo.innerHTML = `
          <div class="vazio">
            Não foi possível abrir o armazenamento de fotos neste preview.
          </div>
        `;
      }
    }
  }

  async function salvarFotosSelecionadas() {
    const campo = document.querySelector("#selecionarFotos");

    if (!campo || !campo.files.length) return;

    try {
      await abrirBancoFotos();

      for (const arquivo of campo.files) {
        if (arquivo.type.startsWith("image/")) {
          await guardarFoto(arquivo);
        }
      }

      await abrirGaleria();
    } catch (erro) {
      console.error("Erro ao salvar fotos:", erro);
      alert("Não foi possível salvar as fotos neste preview.");
    }
  }

  async function removerFoto(id) {
    try {
      await abrirBancoFotos();
      await apagarFoto(id);
      await abrirGaleria();
    } catch (erro) {
      console.error(erro);
      alert("Não foi possível excluir esta foto.");
    }
  }

  // ==========================================
  // NOTEBOOKS
  // ==========================================
  
  
async function abrirNotebooks() {
  abrirTela("Notebooks", `
    <div class="painel">

      <h2>💻 Arsenal da Expedição</h2>
      <p>Catálogo de máquinas para nossa jornada no Paraguai.</p>

      <div class="cartao-notebook">
        <h3>💰 Orçamento disponível</h3>
        <div style="font-size:30px;font-weight:bold;color:#e8bd67">
          R$ 4.000,00
        </div>
        <p>Limite máximo para a compra.</p>
      </div>

      <h3 style="margin-top:25px">🏆 Modelos selecionados</h3>

      <!-- HP VICTUS -->
      <div class="cartao-notebook">
        <img
          src="https://cdn.cs.1worldsync.com/syndication/mediaserverredirect/512e3a8421e0bca0372592ec5e44f425/original.pdf"
          alt="HP Victus 15"
          style="width:100%;max-height:190px;object-fit:contain;border-radius:12px"
        >

        <h3>01 — HP Victus 15</h3>
        <span class="badge-notebook">Dentro do orçamento na referência</span>

        <h2 style="color:#e8bd67">R$ 3.923</h2>

        <p><b>Processador:</b> Intel Core i5-13420H</p>
        <p><b>Placa de vídeo:</b> RTX 3050 6 GB</p>
        <p><b>Memória:</b> 8 GB RAM</p>
        <p><b>Armazenamento:</b> SSD 512 GB</p>
        <p><b>Tela:</b> 15,6 polegadas</p>

        <p>Boa opção para jogos, programação e edição. Planejar expansão para 16 GB de RAM.</p>

        <a href="https://www.icompras.com.py/pt-BR/produto/notebook-hp-victus-15-fa2013dx-intel-core-i5-2-1ghz-memoria-8gb-ssd-512gb-15-6-windows-11-rtx-3050-6gb"
           target="_blank"
           style="color:#e8bd67">
          Consultar oferta ↗
        </a>
      </div>

      <!-- ASUS TUF -->
      <div class="cartao-notebook">
        <img
          src="https://dlcdnwebimgs.asus.com/gain/6D6B9A3B-9B5E-4B0D-9C4A-8A8E8D9A5A4B"
          alt="ASUS TUF Gaming A15"
          style="width:100%;max-height:190px;object-fit:contain;border-radius:12px"
        >

        <h3>02 — ASUS TUF Gaming A15</h3>
        <span class="badge-notebook">Acima do orçamento</span>

        <h2 style="color:#e8bd67">R$ 4.272</h2>

        <p><b>Processador:</b> AMD Ryzen 7</p>
        <p><b>Placa de vídeo:</b> RTX 3050 4 GB</p>
        <p><b>Memória:</b> 8 GB DDR5</p>
        <p><b>Armazenamento:</b> SSD 512 GB</p>

        <p>Boa construção e processador interessante. A placa de vídeo possui apenas 4 GB.</p>
      </div>

      <!-- ACER NITRO -->
      <div class="cartao-notebook">
        <img
          src="https://images.acer.com/is/image/acer/Nitro-V-15-ANV15-41-01"
          alt="Acer Nitro V15"
          style="width:100%;max-height:190px;object-fit:contain;border-radius:12px"
        >

        <h3>03 — Acer Nitro V15</h3>
        <span class="badge-notebook">Acima do orçamento</span>

        <h2 style="color:#e8bd67">R$ 4.515</h2>

        <p><b>Processador:</b> Ryzen 5 7535HS</p>
        <p><b>Placa de vídeo:</b> RTX 3050 6 GB</p>
        <p><b>Memória:</b> 8 GB RAM</p>
        <p><b>Armazenamento:</b> SSD 512 GB</p>

        <p>Uma alternativa interessante para jogos e criação de conteúdo.</p>
      </div>

      <div class="cartao-notebook">
        <h3>📜 Observações da expedição</h3>
        <p>• Preços são referências de pesquisa, não ofertas garantidas.</p>
        <p>• Confirmar estoque, garantia e preço na loja.</p>
        <p>• Verificar possibilidade de expansão para 16 GB de RAM.</p>
        <p>• Comparar novamente perto da viagem.</p>
      </div>

    </div>
  `);
}

  // ==========================================
  // LOJAS
  // ==========================================

  function abrirLojas() {
    abrirTela("Lojas", `
      <div class="painel">
        <h3>🏬 Lojas do Paraguai</h3>
        <p>Lista de lojas e endereços para organizar a expedição.</p>
        <div class="vazio">As lojas serão adicionadas aqui.</div>
      </div>
    `);
  }

  // ==========================================
  // MAPA
  // ==========================================

  
function abrirMapa() {
  const rota = "https://www.google.com/maps/dir/?api=1"
    + "&origin=Ponte+da+Amizade,+Ciudad+del+Este,+Paraguay"
    + "&destination=OneClick,+Ciudad+del+Este,+Paraguay"
    + "&waypoints=Nissei,+Ciudad+del+Este,+Paraguay"
    + "%7CMega+Eletronicos,+Ciudad+del+Este,+Paraguay"
    + "%7CVisaoVIP+Informatica,+Ciudad+del+Este,+Paraguay"
    + "%7CProBook+PY,+Ciudad+del+Este,+Paraguay"
    + "%7CAtacado+Connect,+Ciudad+del+Este,+Paraguay"
    + "&travelmode=walking";

  const lojas = [
    ["Nissei", "Nissei, Ciudad del Este, Paraguay"],
    ["Mega Eletrônicos", "Mega Eletronicos, Ciudad del Este, Paraguay"],
    ["Visãovip Informática", "Visaovip Informatica, Ciudad del Este, Paraguay"],
    ["ProBook PY", "ProBook PY, Ciudad del Este, Paraguay"],
    ["Atacado Connect", "Atacado Connect, Ciudad del Este, Paraguay"],
    ["OneClick", "OneClick, Ciudad del Este, Paraguay"]
  ];

  const lista = lojas.map(loja => `
    <a class="botao" 
       href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loja[1])}"
       target="_blank"
       rel="noopener">
       📍 ${loja[0]}
    </a>
  `).join("");

  abrirTela("Mapa da expedição", `
    <div class="painel">
      <h3>🗺️ Mapa da expedição</h3>
      <p>Rota pelas principais lojas de tecnologia de Ciudad del Este.</p>

      <div class="painel">
        <h3>🏴‍☠️ Rota principal</h3>
        <p>Início: Ponte da Amizade</p>
        <p>Destino: lojas de tecnologia selecionadas</p>

        <a class="botao" href="${rota}" target="_blank" rel="noopener">
          🧭 Abrir rota completa no Google Maps
        </a>
      </div>

      <h3>💻 Lojas selecionadas</h3>
      <div class="lista-lojas">
        ${lista}
      </div>

      <p class="vazio">
        Os endereços serão abertos no Google Maps.
        Confira a rota e o funcionamento das lojas durante a viagem.
      </p>
    </div>
  `);
}

  // ==========================================
  // CLIQUES DO APLICATIVO
  // ==========================================

  main.addEventListener("click", evento => {
    const botao = evento.target.closest("button");
    if (!botao) return;

    const acao = botao.dataset.acao;
    const tela = botao.dataset.tela;

    if (tela === "anotacoes") abrirAnotacoes();
    if (tela === "calendario") abrirCalendario();
    if (tela === "mapa") abrirMapa();
    if (tela === "lojas") abrirLojas();
    if (tela === "notebooks") abrirNotebooks();
    if (tela === "checklist") abrirChecklist();
    if (tela === "orcamento") abrirOrcamento();
    if (tela === "galeria") abrirGaleria();

    if (acao === "inicio") voltarInicio();
    if (acao === "adicionar-tarefa") adicionarTarefa();
    if (acao === "adicionar-gasto") adicionarGasto();
    if (acao === "salvar-anotacao") salvarAnotacao();
    if (acao === "salvar-nomes-cores") salvarNomesCores();

    if (botao.dataset.removerGasto !== undefined) {
      removerGasto(Number(botao.dataset.removerGasto));
    }

    if (botao.dataset.removerAnotacao !== undefined) {
      removerAnotacao(Number(botao.dataset.removerAnotacao));
    }

    if (botao.dataset.removerFoto !== undefined) {
      removerFoto(Number(botao.dataset.removerFoto));
    }
  });

  // ==========================================
  // ALTERAÇÕES E ARQUIVOS
  // ==========================================

  main.addEventListener("change", evento => {
    const elemento = evento.target;

    if (elemento.matches("[data-tarefa]")) {
      marcarTarefa(Number(elemento.dataset.tarefa), elemento.checked);
    }

    if (elemento.matches("#selecionarFotos")) {
      salvarFotosSelecionadas();
    }
  });

  console.log("Paraguai 2027 carregado!");
  
  // ==========================================
  // SERVICE WORKER — MODO OFFLINE
  // ==========================================

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./service-worker.js")
        .then(registro => {
          console.log("Modo offline ativado!", registro);
        })
        .catch(erro => {
          console.error("Erro ao ativar modo offline:", erro);
        });
    });
  }

}
