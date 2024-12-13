import { openDB } from "idb";

let db;

async function createDB() {
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction) {
                switch (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('pessoas', {
                            // A propriedade nome será o campo chave
                            keyPath: 'nome'
                        });
                        // Criando um índice id na store, deve estar contido no objeto do banco.
                        store.createIndex('id', 'id');
                        showResult("Banco de dados criado!");
                }
            }
        });
        showResult("Banco de dados aberto.");
    } catch (e) {
        showResult("Erro ao criar o banco de dados: " + e.message)
    }
}

window.addEventListener("DOMContentLoaded", async event => {
    createDB();

    document.getElementById("btnSalvar").addEventListener("click", addData);
    document.getElementById("btnListar").addEventListener("click", getData);
    document.getElementById("btnAtualizar").addEventListener("click", atualizar);
    document.getElementById("btnRemover").addEventListener("click", remover);
    document.getElementById('btnBuscar').addEventListener("click", buscar);
});

async function getData() {
    if (db == undefined) {
        showResult("O banco de dados está fechado");
        return;
    }

    const tx = await db.transaction('pessoas', 'readonly')
    const store = tx.objectStore('pessoas');
    const value = await store.getAll();
    if (value) {

        const listagem = value.map(pessoa => {
            return `<div>
                <p> ${pessoa.nome}</p>
                <p> ${pessoa.idade}</p>
            </div>`
        })
        showResult("Dados do banco: " + listagem.join(''))
    } else {
        showResult("Não há nenhum dado no banco!")
    }
}


async function addData() {
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    const tx = await db.transaction('pessoas', 'readwrite')
    const store = tx.objectStore('pessoas');
    try {
        await store.add({ nome: nome, idade: idade });
        await tx.done;
        limparCampos();
        console.log('Registro adicionado com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar registro:', error);
        tx.abort();
    }
}

function showResult(text) {
    document.getElementById('resultados').innerHTML = text;
}

async function buscar() {
    let nomeBuscado = document.getElementById('buscarNome').value;
    const tx = db.transaction('pessoas', 'readonly');
    const store = tx.objectStore('pessoas');
    try {
        let objetoBuscado = await store.get(nomeBuscado);
        document.getElementById('nome').value = objetoBuscado.nome;
        document.getElementById('idade').value = objetoBuscado.idade;
    } catch (error) {
        console.log(error.message);
    }
}

async function atualizar() {
    let nome = document.getElementById("nome").value;
    let idade = document.getElementById("idade").value;
    const tx = await db.transaction('pessoas', 'readwrite')
    const store = tx.objectStore('pessoas');
    try {
        let objBuscado = await store.get(nome)
        objBuscado = { nome: nome, idade: Number(idade) }
        await store.put(objBuscado);
        await tx.done;
        console.log('Registro atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar registro:', error);
        tx.abort();
    }
}

async function remover() {
    let nome = document.getElementById("nome").value;
    const tx = await db.transaction('pessoas', 'readwrite')
    const store = tx.objectStore('pessoas');
    try {
        let objBuscado = await store.get(nome)
        await store.delete(objBuscado.nome);
        await tx.done;
        console.log('Registro removido com sucesso!');
    } catch (error) {
        console.error('Erro ao remover registro:', error);
        tx.abort();
    }
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('idade').value = '';
}