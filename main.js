import NumElemento from "./numElemento.js";

class App {
    //numeros iniciais
    numeros = [7, 3, 4, 6, 2, 5, 8, 9, 1];
    numElementos = [];
    opcoesElementos = [];

    //elementos
    container = document.querySelector("main");
    controle = document.querySelector("#controle");

    //botão de ordenar
    botaoOrdenar = document.querySelector("#botao-ordenar");
    botaoResetar = document.querySelector("#botao-recomecar");

    //tipoOrdenamentoAtual
    tipoOrdenamentoAtual = 'bubble-sort';


     /*
     ========================================
     ========================================

     Métodos de controle abaixo

     ========================================
     ========================================
    */

    //inicializando a aplicação
    configurar(){
        //destacando o ordenamento ativo
        const opcoes = Array.from(document.querySelectorAll("li"));
        for(let opcao of opcoes){
            this.opcoesElementos.push(opcao);
        }

        this.resetar();
        this.destacarOpcaoDeOrdenamento();

        //adicionando os listeners dos botões
        this.botaoOrdenar.addEventListener('click', this.ordenar.bind(this));
        this.botaoResetar.addEventListener('click', this.resetar.bind(this));

        //adicionando o listener de troca de oção de ordenamento (event delegation)
        this.controle.addEventListener('click', (e) => {
            if(e.target.closest('li')?.classList.contains('opcao-ordenamento')){
                this.tipoOrdenamentoAtual = e.target.closest('li').classList[1];
                this.destacarOpcaoDeOrdenamento();
            }
        });
    }

    //detaca a opão de ordenamento atual
    destacarOpcaoDeOrdenamento(){
        for(let opcao of this.opcoesElementos){
            //garantingo que duas opções diferentes não vão ficar ativas
            opcao.classList.remove('ativo');

            if(opcao.classList.contains(this.tipoOrdenamentoAtual)){
                opcao.classList.add('ativo')
            }
        }
    }

    //retorna os númeors à sua posição inicial
    resetar(){
        //removendo elementos atuais
        this.numElementos = [];

        
        //criando e adicionando os elementos com base no número
        this.numeros.forEach((num, i) => {       
            this.numElementos.push(new NumElemento(num, i));
        });

        //recuperando apenas o html dos elementos
        const elementos = this.numElementos.map(numElemento => {
            return numElemento.elemento;
        });

        //adicionando o html dos elementos no container
        this.container.replaceChildren(...elementos);
    }
    
    //chama o método correto de ordenamento com base no tipo atual
    ordenar(){
        switch(this.tipoOrdenamentoAtual){
            case 'bubble-sort':
                this.esconderControle();
                this.bubbleSort();
                break;
            case 'inserction-sort':
                this.esconderControle();
                this.inserctionSort();
                break;
        }
    }

    //esconde o painel de controle
    esconderControle(){
        this.controle.style.opacity = '0';
        setTimeout(() => this.controle.style.display = 'none', 300);
    }

    //torna visível o painel de controel
    mostrarControle(){
        this.controle.style.display = 'flex';
        setTimeout(() => this.controle.style.opacity = '1', 100);
    }

    //produz um delay com promise
    async delay(mileseconds){
        return new Promise(resolve => setTimeout(resolve, mileseconds));
    }

    /*
     ========================================
     ========================================

     Métodos de ordenamento abaixo

     ========================================
     ========================================
    */

    //ordenamento via bubble sort
    async bubbleSort(){
        let trocado;
        //ordenando
        do{
            trocado = false;

            //percorrendo cada posição
            for(let i = 0; i < this.numElementos.length - 1; i++){
                
                //destacando o elemento
                this.numElementos[i].ativar();
                await this.delay(1000)

                //verificando se o próximo elemento é maior
                if(this.numElementos[i].valor > this.numElementos[i+1].valor){
                    trocado = true;

                    //ativando o elemento
                    this.numElementos[i+1].ativar();
                    await this.delay(1000);


                    //atualizando os índices e posições gráficas
                    this.numElementos[i].atualizarIndice(i+1);
                    this.numElementos[i+1].atualizarIndice(i);

                    //realizadno o swap
                    let aux = this.numElementos[i];
                    this.numElementos[i] = this.numElementos[i+1];
                    this.numElementos[i+1] = aux;
                    
                    this.numElementos[i+1].desativar();
                }
                this.numElementos[i].desativar();
            }

        }while(trocado);

        //tornando os controles visíveis
        this.mostrarControle();
    }

    //ordenamento via inserction sort
    async inserctionSort(){

        for(let i = 0; i < this.numElementos.length; i++){
            let atual = this.numElementos[i];

            atual.ativar();
            await this.delay(1000);

            //coletando o predecessor
            let indicePredecessor = i - 1;
            let predecessor = this.numElementos[indicePredecessor];

            while(indicePredecessor >= 0 && predecessor.valor > atual.valor){
                predecessor.ativar();
                await this.delay(1000);

                //realizando o swap
                let aux = this.numElementos[atual.indice];
                this.numElementos[atual.indice] = this.numElementos[predecessor.indice];
                this.numElementos[predecessor.indice]= aux;

                //atualizando os indices
                predecessor.atualizarIndice(atual.indice);
                atual.atualizarIndice(indicePredecessor);


                await this.delay(100);
                predecessor.desativar();

                //atualizando o predecessor
                predecessor = this.numElementos[--indicePredecessor];



            }

            atual.desativar();

        }

        this.mostrarControle();
    }
}


//iniciando a aplicação
window.addEventListener("load", new App().configurar());