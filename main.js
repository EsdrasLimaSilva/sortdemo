import NumElemento from "./numElemento.js";

class App {
    //numeros iniciais
    numeros = [9, 3, 2, 5, 8, 4, 6, 1, 7];
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
            case 'merge-sort':
                this.esconderControle();
                this.mergeSort();
                break;
            case 'quick-sort':
                this.esconderControle();
                this.quickSort();
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
                await this.delay(500)

                //verificando se o próximo elemento é maior
                if(this.numElementos[i].valor > this.numElementos[i+1].valor){
                    trocado = true;

                    //ativando o elemento
                    this.numElementos[i+1].ativar();
                    await this.delay(500);


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
            await this.delay(500);

            //coletando o predecessor
            let indicePredecessor = i - 1;
            let predecessor = this.numElementos[indicePredecessor];
            

            while(indicePredecessor >= 0 && predecessor.valor > atual.valor){
                predecessor.ativar();
                await this.delay(500);

                //realizando o swap
                let aux = this.numElementos[atual.indice];
                this.numElementos[atual.indice] = this.numElementos[predecessor.indice];
                this.numElementos[predecessor.indice]= aux;

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


    async merge(inicio, fim)
    {
        for(let k = inicio; k <= fim; k++)
            this.numElementos[k].elemento.style.opacity = 1;

        for(let i = inicio; i <= fim; i++){
            this.numElementos[i].ativar();
            await this.delay(500);

            for(let j = i+1; j <= fim; j++){
                this.numElementos[j].ativar();
                await this.delay(500);

                if(this.numElementos[j].valor < this.numElementos[i].valor){
                    this.numElementos[i].atualizarIndice(j);
                    this.numElementos[j].atualizarIndice(i);

                    let aux = this.numElementos[i];
                    this.numElementos[i] = this.numElementos[j];
                    this.numElementos[j] = aux;

         
                }

                this.numElementos[j].desativar();
            }

            this.numElementos[i].desativar();
        }

        for(let k = inicio; k <= fim; k++)
            this.numElementos[k].elemento.style.opacity = 0.3;
    
    }
     

    async mergeDivide(inicio, fim){
        if(inicio < fim){
            let meio = inicio + Math.floor((fim - inicio) / 2);
            await this.mergeDivide(inicio, meio);
            await this.mergeDivide(meio+1, fim);

            await this.merge(inicio, fim);
        }
    }

    //ordenando via merge sort
    async mergeSort(){
        for(let numEl of this.numElementos)
            numEl.elemento.style.opacity = 0.3;
        
        await this.mergeDivide(0, this.numElementos.length -1);
        this.mostrarControle();

        for(let numEl of this.numElementos)
            numEl.elemento.style.opacity = 1;
    }

    async quick(inicio, fim){
       if(inicio < fim){
            let i = inicio -1;
            const pivo = this.numElementos[fim];
            pivo.ativar();

            for(let j = inicio; j <= fim; j++ ){
                this.numElementos[j].ativar();
                await this.delay(500);
                this.numElementos[j].desativar();


                if(this.numElementos[j].valor < pivo.valor){


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

                if(j == fim){
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

            await this.quick(inicio, i-1);
            await this.quick(i+1, fim);
       }
    }

    async quickSort(){
        await this.quick(0, this.numElementos.length - 1);

        for(let numEl of this.numElementos)
            numEl.elemento.style.opacity = 1;

        this.mostrarControle();
    }
}


//iniciando a aplicação
window.addEventListener("load", new App().configurar());