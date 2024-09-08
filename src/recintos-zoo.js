class RecintosZoo {

    //Definindo o construtor da classe
    constructor(){

        //Definidno os animais que são permitidos no zoologico e suas caracteristicas
        
            this.animaisPermitidos = {
            'LEAO': {tamanho: 3, biomas: ['savana'], carnivoro: true},
            'LEOPARDO': {tamanho: 2, biomas: ['savana'], carnivoro: true},
            'CROCODILO': {tamanho: 3, biomas: ['rio'], carnivoro: true},
            'MACACO': {tamanho: 1, biomas: ['savana','floresta'], carnivoro: false},
            'GAZELA': {tamanho: 2, biomas: ['savana'], carnivoro: false},
            'HIPOPOTAMO': {tamanho: 4, biomas: ['savana','rio'], carnivoro: false},

            };


            //Defindo os recintos disponíveis no zoológico


            this.recintos = [

            {numero: 1, bioma: 'savana', tamanho: 10, animais: [{especie: 'MACACO', quantidade: 3}]},
            {numero: 2, bioma: 'floresta', tamanho: 5, animais: []},
            {numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{especie: 'GAZELA', quantidade: 1}]},
            {numero: 4, bioma: 'rio', tamanho: 8, animais: []},
            {numero: 5, bioma: 'savana', tamanho: 9, animais: [{especie: 'LEAO', quantidade: 1}]}


            ];

    } 
    
    


    analisaRecintos(animal, quantidade) {
        //Validações que garantem entradas corretas
        if (!this.animaisPermitidos[animal]){
            return {erro: 'Animal inválido'}
        }

        if (typeof quantidade !='number' || quantidade <=0){
            return {erro: 'Quantidade inválida'}
        }


        //Obtendo as informações de um animal da lista de animais permitidos
        const animalInfo = this.animaisPermitidos[animal];
        //Calculando o espaco necessario para acumular um ou mais animais
        const espacoSuficiente = animalInfo.tamanho * quantidade;


        //Verificando quais recintos sao viaveis para os tipos de animais
        let recintosViaveis = [];


        //Iterando sobre cada elemento em recintos
        for (let recinto of this.recintos){
            //Verificação se o bioma do recinto é adequado para o tipo de animal, caso não seja, a função pula para a proxima em continue
            if (!animalInfo.biomas.includes(recinto.bioma) && !(recinto.bioma.includes('savana') && animalInfo.biomas.includes('savana') && recinto.bioma.includes('rio') && animalInfo.biomas.includes('rio'))) {
                continue;
            }


            //Espaco ocupado no recinto

            let espacoOcupado = recinto.animais.reduce((total,animal) => {
                const tipoAnimal = this.animaisPermitidos[animal.especie]; //Para obter as informações do animal atual
                return total + (tipoAnimal.tamanho * animal.quantidade)
                //total é o valor acumulado a medida que reduce itera sobre cada item da lista recinto.animais(Na primeira iteração, total é 0)
            },0);

            //Verificando a existencia de animais carnivoros que devem ficar somente com a propria especie

            const haCarnivoros = recinto.animais.some(animal => this.animaisPermitidos[animal.especie].carnivoro); //O metodo some irá buscar apenas por uma condição verdadeira
            if (animalInfo.carnivoro && (haCarnivoros || recinto.animais.length > 0)){ //Se apenas uma dessas condições for "true" o cógigo faz continue e pula o recinto porque herbivoros não podem conviver com carnovoros
                continue;
            }

            //Hipopótamo(s) só tolera(m) outras espécies estando num recinto com savana e rio
            const haHipopotamo = recinto.animais.some(animal => animal.especie === 'HIPOPOTAMO');
            if((animal === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma != 'savana e rio') || (haHipopotamo && (animal !== 'HIPOPOTAMO' || recinto.bioma !== 'savana e rio'))) {
                continue; 

                //Condicao 1: impede que um hipopotamo seja adicionado a um recinto que já tenha animais, a menos que o bioma seja savana e rio
                //Condicao 2: Impede que outros animais sejam adicionados a um recinto que já tenha hipopotamos, a menos que o bioma seja savana e rio
            }

            //Um macaco não se sente confortável sem outro animal no recinto, seja da mesma ou outra espécie

            const haMacaco = recinto.animais.some(animal => animal.especie === 'MACACO');
            if((animal === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) || (haMacaco && recinto.animais.length === 1 && animal !== 'MACACO' && quantidade ===1)){
                continue; //Sendo qualquer uma das afirmações verdadeiras, o comando continue é executado, loop atual é ignorado e passsado para o próximo
            }

            //Calculo de espaco extra(Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado)

            const espacoExtra = (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal)? 1 : 0);
            const espacoTotalSuficiente = espacoSuficiente + espacoExtra;

            if (espacoOcupado + espacoTotalSuficiente <= recinto.tamanho){

                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanho - espacoOcupado - espacoSuficiente} total: ${recinto.tamanho})`);
            }

            //Caso não haja recintos viaveis               
    
        }

        if (recintosViaveis.length === 0){
                return {erro: 'Não há recinto viável'};
            }

        return { recintosViaveis };

    }


}

export { RecintosZoo as RecintosZoo };
