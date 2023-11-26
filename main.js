import NumElemento from "./numElemento.js";

class App {
    //numeros iniciais
    numeros = [9, 3, 2, 5, 8, 7, 6, 1, 4];
    numElementos = [];
    opcoesElementos = [];

    //elementos
    container = document.querySelector("main");
    controle = document.querySelector("#controle");

    //botão de ordenar
    botaoOrdenar = document.querySelector("#botao-ordenar");
    botaoResetar = document.querySelector("#botao-recomecar");

    //tipoOrdenamentoAtual
    tipoOrdenamentoAtual = "bubble-sort";

    /*
     ========================================
     ========================================

     Métodos de controle abaixo

     ========================================
     ========================================
    */

    //inicializando a aplicação
    configurar() {
        //destacando o ordenamento ativo
        const opcoes = Array.from(document.querySelectorAll("li"));
        for (let opcao of opcoes) {
            this.opcoesElementos.push(opcao);
        }

        this.resetar();
        this.destacarOpcaoDeOrdenamento();

        //adicionando os listeners dos botões
        this.botaoOrdenar.addEventListener("click", this.ordenar.bind(this));
        this.botaoResetar.addEventListener("click", this.resetar.bind(this));

        //adicionando o listener de troca de oção de ordenamento (event delegation)
        this.controle.addEventListener("click", (e) => {
            if (
                e.target.closest("li")?.classList.contains("opcao-ordenamento")
            ) {
                this.tipoOrdenamentoAtual = e.target.closest("li").classList[1];
                this.destacarOpcaoDeOrdenamento();
            }
        });
    }

    //detaca a opão de ordenamento atual
    destacarOpcaoDeOrdenamento() {
        for (let opcao of this.opcoesElementos) {
            //garantingo que duas opções diferentes não vão ficar ativas
            opcao.classList.remove("ativo");

            if (opcao.classList.contains(this.tipoOrdenamentoAtual)) {
                opcao.classList.add("ativo");
            }
        }
    }

    //retorna os númeors à sua posição inicial
    resetar() {
        //removendo elementos atuais
        this.numElementos = [];

        //criando e adicionando os elementos com base no número
        this.numeros.forEach((num, i) => {
            this.numElementos.push(new NumElemento(num, i));
        });

        //recuperando apenas o html dos elementos
        const elementos = this.numElementos.map((numElemento) => {
            return numElemento.elemento;
        });

        //adicionando o html dos elementos no container
        this.container.replaceChildren(...elementos);
    }

    //chama o método correto de ordenamento com base no tipo atual
    ordenar() {
        switch (this.tipoOrdenamentoAtual) {
            case "bubble-sort":
                this.esconderControle();
                this.bubbleSort();
                break;
            case "inserction-sort":
                this.esconderControle();
                this.inserctionSort();
                break;
            case "merge-sort":
                this.esconderControle();
                this.mergeSort();
                break;
            case "quick-sort":
                this.esconderControle();
                this.quickSort();
                break;
        }
    }

    //esconde o painel de controle
    esconderControle() {
        this.controle.style.opacity = "0";
        setTimeout(() => (this.controle.style.display = "none"), 300);
    }

    //torna visível o painel de controel
    mostrarControle() {
        this.controle.style.display = "flex";
        setTimeout(() => (this.controle.style.opacity = "1"), 100);
    }

    //produz um delay com promise
    async delay(mileseconds) {
        return new Promise((resolve) => setTimeout(resolve, mileseconds));
    }

    /*
     ========================================
     ========================================

     Métodos de ordenamento abaixo

     ========================================
     ========================================
    */

    //ordenamento via bubble sort
    async bubbleSort() {
        let trocado;
        //ordenando
        for (let i = 0; i < this.numElementos.length; i++) {
            for (let j = 0; j < this.numElementos.length - i - 1; j++) {
                this.numElementos[j].ativar();
                await this.delay(500);

                if (
                    this.numElementos[j].valor > this.numElementos[j + 1].valor
                ) {
                    this.numElementos[j + 1].ativar();
                    await this.delay(500);
                    this.numElementos[j + 1].desativar();

                    this.numElementos[j].desativar();

                    this.numElementos[j].atualizarIndice(j + 1);
                    this.numElementos[j + 1].atualizarIndice(j);

                    let aux = this.numElementos[j];
                    this.numElementos[j] = this.numElementos[j + 1];
                    this.numElementos[j + 1] = aux;
                }

                this.numElementos[j].desativar();
            }
        }

        //tornando os controles visíveis
        this.mostrarControle();
    }

    //ordenamento via inserction sort
    async inserctionSort() {
        for (let i = 0; i < this.numElementos.length; i++) {
            let atual = this.numElementos[i];

            atual.ativar();
            await this.delay(500);

            //coletando o predecessor
            let indicePredecessor = i - 1;
            let predecessor = this.numElementos[indicePredecessor];

            while (indicePredecessor >= 0 && predecessor.valor > atual.valor) {
                predecessor.ativar();
                await this.delay(500);

                //realizando o swap
                let aux = this.numElementos[atual.indice];
                this.numElementos[atual.indice] =
                    this.numElementos[predecessor.indice];
                this.numElementos[predecessor.indice] = aux;

                //atualizando os indices
                predecessor.atualizarIndice(atual.indice);
                atual.atualizarIndice(indicePredecessor);

                predecessor.desativar();

                //atualizando o predecessor
                predecessor = this.numElementos[--indicePredecessor];
            }

            atual.desativar();
        }

        this.mostrarControle();
    }

    async merge(inicio, meio, fim) {
        //ativando o subvetor
        for (let k = inicio; k <= fim; k++) {
            this.numElementos[k].elemento.style.opacity = 1;
            this.numElementos[k].moveDown();
        }

        await this.delay(300);

        const tamanhoVetorEsquerdo = meio - inicio + 1;
        const tamanhoVetorDireito = fim - meio;

        const vetorEsquerdo = [];
        const vetorDireito = [];

        for (let i = 0; i < tamanhoVetorEsquerdo; i++)
            vetorEsquerdo[i] = this.numElementos[inicio + i];
        for (let i = 0; i < tamanhoVetorDireito; i++)
            vetorDireito[i] = this.numElementos[meio + 1 + i];

        let indiceEsquerdo = 0;
        let indiceDireito = 0;
        let k = inicio;

        while (
            indiceEsquerdo < tamanhoVetorEsquerdo &&
            indiceDireito < tamanhoVetorDireito
        ) {
            let elEsquerdo = vetorEsquerdo[indiceEsquerdo];
            let elDireito = vetorDireito[indiceDireito];

            elEsquerdo.ativar();
            elDireito.ativar();
            await this.delay(500);

            if (
                vetorEsquerdo[indiceEsquerdo].valor <
                vetorDireito[indiceDireito].valor
            ) {
                vetorEsquerdo[indiceEsquerdo].atualizarIndice(k);
                vetorEsquerdo[indiceEsquerdo].moveUp();
                await this.delay(500);
                this.numElementos[k++] = vetorEsquerdo[indiceEsquerdo++];
            } else {
                vetorDireito[indiceDireito].atualizarIndice(k);
                vetorDireito[indiceDireito].moveUp();
                await this.delay(500);
                this.numElementos[k++] = vetorDireito[indiceDireito++];
            }

            elEsquerdo.desativar();
            elDireito.desativar();
        }

        while (indiceEsquerdo < tamanhoVetorEsquerdo) {
            vetorEsquerdo[indiceEsquerdo].atualizarIndice(k);
            vetorEsquerdo[indiceEsquerdo].moveUp();
            await this.delay(500);
            this.numElementos[k++] = vetorEsquerdo[indiceEsquerdo++];
        }

        while (indiceDireito < tamanhoVetorDireito) {
            vetorDireito[indiceDireito].atualizarIndice(k);
            vetorDireito[indiceDireito].moveUp();
            await this.delay(500);
            this.numElementos[k++] = vetorDireito[indiceDireito++];
        }

        //desativando o subvetor
        for (let k = inicio; k <= fim; k++) {
            this.numElementos[k].elemento.style.opacity = 0.3;
            this.numElementos[k].moveUp();
        }
    }

    async mergeDivide(inicio, fim) {
        if (inicio < fim) {
            let meio = inicio + Math.floor((fim - inicio) / 2);
            await this.mergeDivide(inicio, meio);
            await this.mergeDivide(meio + 1, fim);

            await this.merge(inicio, meio, fim);
        }
    }

    //ordenando via merge sort
    async mergeSort() {
        for (let numEl of this.numElementos) numEl.elemento.style.opacity = 0.3;

        await this.mergeDivide(0, this.numElementos.length - 1);
        this.mostrarControle();

        for (let numEl of this.numElementos) numEl.elemento.style.opacity = 1;
    }

    async quick(inicio, fim) {
        if (inicio < fim) {
            let i = inicio - 1;
            const pivo = this.numElementos[fim];
            pivo.ativar();

            for (let j = inicio; j <= fim; j++) {
                this.numElementos[j].ativar();
                await this.delay(500);
                this.numElementos[j].desativar();

                if (this.numElementos[j].valor < pivo.valor) {
                    i++;
                    this.numElementos[i].ativar();
                    this.numElementos[j].ativar();
                    await this.delay(500);
                    this.numElementos[i].desativar();
                    this.numElementos[j].desativar();

                    this.numElementos[i].atualizarIndice(j);
                    this.numElementos[j].atualizarIndice(i);

                    //fazendo o swap
                    let aux = this.numElementos[i];
                    this.numElementos[i] = this.numElementos[j];
                    this.numElementos[j] = aux;
                }

                if (j == fim) {
                    i++;

                    this.numElementos[i].atualizarIndice(j);
                    this.numElementos[j].atualizarIndice(i);
                    await this.delay(300);

                    let aux = this.numElementos[i];
                    this.numElementos[i] = pivo;
                    this.numElementos[j] = aux;

                    pivo.elemento.style.opacity = 0.3;
                }
            }

            pivo.desativar();

            await this.quick(inicio, i - 1);
            await this.quick(i + 1, fim);
        }
    }

    async quickSort() {
        await this.quick(0, this.numElementos.length - 1);

        for (let numEl of this.numElementos) numEl.elemento.style.opacity = 1;

        this.mostrarControle();
    }
}

//iniciando a aplicação
window.addEventListener("load", new App().configurar());
