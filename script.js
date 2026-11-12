
const form = document.getElementById("formTarefa");
const campo = document.getElementById("campoTarefa");
const lista = document.getElementById("listaTarefas");
const mensagemErro = document.getElementById("mensagemErro");
const mensagemVazia = document.getElementById("mensagemVazia");

const totalTarefas = document.getElementById("totalTarefas");
const tarefasPendentes = document.getElementById("tarefasPendentes");
const tarefasConcluidas = document.getElementById("tarefasConcluidas");
const contadorLista = document.getElementById("contadorLista");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
let filtroAtual = "todas";

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function atualizarResumo() {
    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    const pendentes = tarefas.length - concluidas;

    totalTarefas.textContent = tarefas.length;
    tarefasPendentes.textContent = pendentes;
    tarefasConcluidas.textContent = concluidas;
}

function renderizarTarefas() {
    lista.innerHTML = "";

    const tarefasFiltradas = tarefas.filter(tarefa => {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    });

    mensagemVazia.hidden = tarefasFiltradas.length !== 0;

    contadorLista.textContent =
        `${tarefasFiltradas.length} ${tarefasFiltradas.length === 1 ? "tarefa" : "tarefas"}`;

    tarefasFiltradas.forEach(tarefa => {
        const item = document.createElement("li");
        item.className = "item-tarefa";

        if (tarefa.concluida) {
            item.classList.add("concluida");
        }

        const conteudo = document.createElement("div");
        conteudo.className = "conteudo-tarefa";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarefa.concluida;
        checkbox.setAttribute("aria-label", `Concluir ${tarefa.texto}`);

        checkbox.addEventListener("change", () => {
            tarefa.concluida = checkbox.checked;
            salvarTarefas();
            renderizarTarefas();
        });

        const texto = document.createElement("span");
        texto.className = "texto-tarefa";
        texto.textContent = tarefa.texto;

        const excluir = document.createElement("button");
        excluir.className = "botao-excluir";
        excluir.textContent = "Excluir";
        excluir.setAttribute("aria-label", `Excluir ${tarefa.texto}`);

        excluir.addEventListener("click", () => {
            tarefas = tarefas.filter(item => item.id !== tarefa.id);
            salvarTarefas();
            renderizarTarefas();
        });

        conteudo.append(checkbox, texto);
        item.append(conteudo, excluir);
        lista.appendChild(item);
    });

    atualizarResumo();
}

form.addEventListener("submit", event => {
    event.preventDefault();

    const texto = campo.value.trim();

    if (texto === "") {
        mensagemErro.textContent = "Digite uma tarefa antes de adicionar!";
        campo.focus();
        return;
    }

    mensagemErro.textContent = "";

    const novaTarefa = {
        id: Date.now(),
        texto: texto,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();
    form.reset();
    campo.focus();
    renderizarTarefas();
});

document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        document.querySelectorAll(".filtro").forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        renderizarTarefas();
    });
});

renderizarTarefas();
