const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        produto: false,
        carrinho:[],
        mensagemAlerta: "Item adicionado",
        alertaAtivo: true,

    },
    filters: {
        numeroPreco(valor) {
            //Aqui ele pega o valor pois no HTML, estamos passando produto.preco na linha 19, caso fosse produto.nome, pegaria o nome
            return valor.toLocaleString("pt-BR", {style: "currency", currency: "BRL"});
        }
    },
    computed: {
        carrinhoTotal(){
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProdutos() {
            //then dar uma olhada em promises
            fetch("./api/produtos.json").then(r => r.json()).then(r => {
                this.produtos = r;
            })
        },
        fetchProduto(id) {
            //Para pegarmos um produto único passamos o id como parametro, Esse id passado cometro
            //é referente ao produtos.json
            //Esse id do path é para o dados.json, portanto, como o produtos.json e o dados.json
            //tem id, é uma forma de relacionar um json com o outro.
                fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r;
                })
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior:"smooth"
            })
        },
        fecharModal({target, currentTarget}) {
            if(target === currentTarget) {
                this.produto = false;
            }
        },
        adicionarItem() {
            this.produto.estoque--;
            const {id, nome, preco} = this.produto;
            this.carrinho.push({id, nome, preco});
            this.alerta(`${nome} adcionado ao carrinho.`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1);
        }, 
        checarLocalStorage() {
            if(window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500);
        },
        router() {
            const hash = document.location.hash;
            if(hash) {
                this.fetchProduto(hash.replace("#",""))
            }
        }
    },
    watch: {
        produto() {
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null, null, `# ${hash}`)
        },
        carrinho(){
            // Ao enviar dados para um servidor web, os dados devem ser uma string.
            // Converta um objeto JavaScript em uma string com JSON.stringify().
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        //Sempre que o Vue iniciar o created, cria esses metodos
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
});