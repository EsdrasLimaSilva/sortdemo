class NumElemento {
    valor;
    indice;
    elemento;
    posicao = {
        x: 0,
        y: 0
    }
    altura;

    constructor(valor, indice){
        //configurando o valor e indice
        this.valor = valor;
        this.indice = indice;

        //configurando a posição
        this.posicao.x = indice * 100 + 100;
        this.posicao.y = 10;

        //configurando a altura
        this.altura = valor * 30 + 32;

        //configurando o elemento
        this.elemento = document.createElement("div");
        this.elemento.appendChild(document.createTextNode(valor));
        this.elemento.classList.add("numero");

        //posicionando
        this.elemento.style.position = 'absolute';
        this.elemento.style.left = `${this.posicao.x}px`;
        this.elemento.style.top = `${this.posicao.y}px`;
        this.elemento.style.height = `${this.altura}px`;
    }

    atualizarIndice(novoIndice){
        this.indice = novoIndice;
        this.posicao.x = this.indice * 100 + 100;
        this.elemento.style.left = `${this.posicao.x}px`;
    }

    ativar(){
        this.elemento.classList.add("numero-ativo");
    }

    desativar(){
        this.elemento.classList.remove("numero-ativo");
    }
}

export default NumElemento;