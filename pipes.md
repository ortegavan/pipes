# Pipes puros e impuros: entenda de uma vez por todas!

Olá, desenvolvedor Angular iniciante! Se você está começando sua jornada com Angular e já ouviu falar sobre "pipes", mas ainda não entende bem o que são ou como funcionam, este artigo é para você. Vamos descomplicar esse assunto e explicar de forma bem didática o que são pipes, a diferença entre pipes puros e impuros, e como você pode usá-los em seus projetos.

![Imagem representando transformação de dados](https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)
*Photo by Markus Spiske on Unsplash*

## O que são pipes no Angular?

Imagine que você tem uma torneira (em inglês, "pipe") em casa. O que ela faz? Ela pega a água que vem do encanamento e a entrega para você usar. No Angular, os pipes funcionam de forma parecida: eles pegam dados e os transformam antes de exibi-los na tela.

Em termos simples, **pipes são transformadores de dados**. Eles permitem que você modifique a forma como os dados são exibidos no template sem alterar os dados originais no componente.

### Exemplos básicos de pipes

Antes de mergulharmos na diferença entre pipes puros e impuros, vamos ver alguns exemplos básicos de pipes que o Angular já oferece:

```html
<!-- Formatando uma data -->
<p>Data de hoje: {{ hoje | date:'dd/MM/yyyy' }}</p>

<!-- Formatando um número -->
<p>Preço: {{ preco | currency:'BRL' }}</p>

<!-- Transformando texto para maiúsculas -->
<p>{{ nome | uppercase }}</p>

<!-- Limitando o número de caracteres -->
<p>{{ descricao | slice:0:100 }}...</p>
```

No componente, você teria algo como:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-exemplo',
  templateUrl: './exemplo.component.html'
})
export class ExemploComponent {
  hoje = new Date();
  preco = 99.90;
  nome = 'joão da silva';
  descricao = 'Uma descrição muito longa que queremos limitar...';
}
```

Veja como é simples! Você usa o símbolo `|` (pipe) seguido do nome do pipe. Alguns pipes aceitam parâmetros, que são passados após dois pontos.

## Pipes puros vs. impuros: qual a diferença?

Agora que você já entendeu o básico sobre pipes, vamos ao ponto principal: a diferença entre pipes puros e impuros.

### Pipes puros (o padrão)

Os pipes puros são como funcionários eficientes que só trabalham quando realmente precisam. Eles são executados apenas quando:

1. O valor de entrada muda (para tipos primitivos como string, number, boolean)
2. A referência do objeto de entrada muda (para objetos e arrays)

Em outras palavras, se você passar um array para um pipe puro e depois adicionar um item a esse array, o pipe **não será executado novamente**, porque a referência do array continua a mesma.

```typescript
// Componente com um pipe puro
export class ExemploComponent {
  itens = ['Maçã', 'Banana', 'Laranja'];
  
  adicionarItem() {
    this.itens.push('Morango'); // O pipe puro NÃO será executado novamente!
  }
}
```

```html
<!-- Template -->
<p>Itens: {{ itens | listarItens }}</p>
<button (click)="adicionarItem()">Adicionar item</button>
```

Isso acontece porque os pipes puros são otimizados para performance. O Angular não quer ficar executando transformações desnecessárias a cada ciclo de detecção de mudanças.

### Pipes impuros (precisam ser declarados explicitamente)

Os pipes impuros são como funcionários super atentos que verificam constantemente se há algo para fazer. Eles são executados em **cada ciclo de detecção de mudanças**, independentemente de o valor de entrada ter mudado ou não.

Para criar um pipe impuro, você precisa definir a propriedade `pure` como `false` no decorador `@Pipe`:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listarItens',
  pure: false // Isso torna o pipe impuro!
})
export class ListarItensPipe implements PipeTransform {
  transform(itens: string[]): string {
    return itens.join(', ');
  }
}
```

Com esse pipe impuro, quando você adicionar um item ao array, a transformação será executada novamente e você verá o novo item na lista.

## Quando usar pipes puros vs. impuros?

Agora que você entende a diferença técnica, vamos falar sobre quando usar cada um:

### Use pipes puros quando:

- Você está transformando valores primitivos (string, number, boolean)
- Você está transformando objetos que são substituídos completamente quando mudam
- Você quer melhor performance (na maioria dos casos)

### Use pipes impuros quando:

- Você precisa detectar mudanças dentro de objetos ou arrays (como adicionar/remover itens)
- Você precisa atualizar a saída com base em fatores externos (como o tempo)
- Você está trabalhando com dados que mudam frequentemente

## Exemplo prático: um pipe impuro para mostrar "há quanto tempo"

Vamos criar um exemplo real e útil: um pipe impuro que mostra há quanto tempo algo aconteceu, como "atualizado há 5 minutos" ou "atualizado há 2 horas", e que se atualiza automaticamente conforme o tempo passa.

### Passo 1: Criar o pipe

Primeiro, vamos criar nosso pipe impuro:

```typescript
import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';

@Pipe({
  name: 'tempoAtras',
  pure: false // Tornando o pipe impuro
})
export class TempoAtrasPipe implements PipeTransform, OnDestroy {
  private timer: any;
  private valor: Date | null = null;
  private ultimoTexto = '';
  
  constructor(private ref: ChangeDetectorRef) {}
  
  transform(valor: Date): string {
    if (!valor) {
      return '';
    }
    
    // Se o valor mudou, limpa o timer anterior
    if (this.valor === null || this.valor.getTime() !== valor.getTime()) {
      this.valor = valor;
      this.limparTimer();
    }
    
    // Se não temos um timer ativo, cria um novo
    if (!this.timer) {
      this.timer = setInterval(() => {
        // Força a atualização da view
        this.ref.markForCheck();
      }, 60000); // Atualiza a cada minuto
    }
    
    // Calcula o texto "há quanto tempo"
    this.ultimoTexto = this.calcularTempoAtras(valor);
    return this.ultimoTexto;
  }
  
  ngOnDestroy() {
    this.limparTimer();
  }
  
  limparTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  calcularTempoAtras(data: Date): string {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    
    // Converter para segundos, minutos, horas, dias
    const segundos = Math.floor(diferenca / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (segundos < 60) {
      return 'atualizado agora mesmo';
    } else if (minutos < 60) {
      return `atualizado há ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}`;
    } else if (horas < 24) {
      return `atualizado há ${horas} ${horas === 1 ? 'hora' : 'horas'}`;
    } else {
      return `atualizado há ${dias} ${dias === 1 ? 'dia' : 'dias'}`;
    }
  }
}
```

### Passo 2: Registrar o pipe no módulo

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TempoAtrasPipe } from './tempo-atras.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TempoAtrasPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Passo 3: Usar o pipe no componente

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="artigo">
      <h1>Meu Artigo de Blog</h1>
      <p class="data-atualizacao">{{ dataAtualizacao | tempoAtras }}</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
    </div>
    
    <div class="comentario">
      <h3>Comentário de João</h3>
      <p class="data-comentario">{{ dataComentario | tempoAtras }}</p>
      <p>Ótimo artigo! Muito esclarecedor.</p>
    </div>
    
    <button (click)="atualizarArtigo()">Atualizar Artigo</button>
  `
})
export class AppComponent {
  dataAtualizacao = new Date(new Date().getTime() - 3600000); // 1 hora atrás
  dataComentario = new Date(new Date().getTime() - 300000);  // 5 minutos atrás
  
  atualizarArtigo() {
    this.dataAtualizacao = new Date(); // Atualiza para agora
  }
}
```

### Como funciona este exemplo?

1. Criamos um pipe impuro chamado `tempoAtras` que recebe uma data como entrada
2. O pipe configura um timer que atualiza a visualização a cada minuto
3. Quando o componente é destruído, o timer é limpo para evitar vazamentos de memória
4. O pipe calcula a diferença entre a data fornecida e a data atual, e retorna uma string amigável

Quando você carrega a página, verá algo como:

- "atualizado há 1 hora" para o artigo
- "atualizado há 5 minutos" para o comentário

E o mais legal: **conforme o tempo passa, esses textos se atualizam automaticamente!** Depois de alguns minutos, você verá algo como:

- "atualizado há 1 hora" (ou "atualizado há 2 horas" se passar mais tempo)
- "atualizado há 10 minutos"

Se você clicar no botão "Atualizar Artigo", a data de atualização mudará para "atualizado agora mesmo" e depois começará a contar novamente.

## Por que este exemplo precisa ser um pipe impuro?

Este exemplo **precisa** ser um pipe impuro porque:

1. Ele precisa se atualizar com base em algo externo (o tempo que passa)
2. Mesmo que o valor de entrada (a data) não mude, a saída deve mudar conforme o tempo passa

Se usássemos um pipe puro, o texto só seria atualizado quando a data de entrada mudasse (por exemplo, ao clicar no botão "Atualizar Artigo"), mas não se atualizaria automaticamente com o passar do tempo.

## Cuidados ao usar pipes impuros

Pipes impuros são poderosos, mas devem ser usados com cuidado:

1. **Performance**: Como são executados em cada ciclo de detecção de mudanças, podem afetar a performance se fizerem operações pesadas
2. **Efeitos colaterais**: Evite efeitos colaterais nos pipes (como alterar variáveis globais)
3. **Limpeza**: Sempre limpe recursos (como timers) quando o pipe for destruído

## Outro exemplo: Pipe impuro para filtrar uma lista

Vamos ver outro exemplo útil: um pipe impuro para filtrar uma lista de itens.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrar',
  pure: false
})
export class FiltrarPipe implements PipeTransform {
  transform(itens: any[], termo: string): any[] {
    if (!itens || !termo) {
      return itens;
    }
    
    termo = termo.toLowerCase();
    
    return itens.filter(item => 
      item.nome.toLowerCase().includes(termo)
    );
  }
}
```

E no componente:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-lista',
  template: `
    <input type="text" [(ngModel)]="termoBusca" placeholder="Buscar...">
    
    <ul>
      <li *ngFor="let produto of produtos | filtrar:termoBusca">
        {{ produto.nome }} - R$ {{ produto.preco }}
      </li>
    </ul>
    
    <button (click)="adicionarProduto()">Adicionar Produto</button>
  `
})
export class ListaComponent {
  produtos = [
    { nome: 'Celular', preco: 1999.99 },
    { nome: 'Notebook', preco: 4500.00 },
    { nome: 'Tablet', preco: 1200.00 }
  ];
  
  termoBusca = '';
  
  adicionarProduto() {
    this.produtos.push({ nome: 'Fone de Ouvido', preco: 199.90 });
  }
}
```

Neste exemplo:

1. O pipe `filtrar` recebe uma lista de produtos e um termo de busca
2. Ele filtra os produtos que contêm o termo de busca no nome
3. Como é um pipe impuro, ele será executado quando:
   - O termo de busca mudar
   - Um novo produto for adicionado à lista (mesmo sem mudar a referência do array)

## Criando um pipe puro para comparação

Para entender melhor a diferença, vamos criar uma versão pura do pipe de filtro:

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtrarPuro'
  // pure: true é o padrão, então não precisamos especificar
})
export class FiltrarPuroPipe implements PipeTransform {
  transform(itens: any[], termo: string): any[] {
    if (!itens || !termo) {
      return itens;
    }
    
    termo = termo.toLowerCase();
    
    return itens.filter(item => 
      item.nome.toLowerCase().includes(termo)
    );
  }
}
```

Se usarmos este pipe puro em vez do impuro:

```html
<li *ngFor="let produto of produtos | filtrarPuro:termoBusca">
```

E clicarmos no botão "Adicionar Produto", o novo produto **não aparecerá na lista** até que algo force a execução do pipe novamente (como mudar o termo de busca).

Para fazer o pipe puro funcionar com a adição de itens, precisaríamos criar um novo array em vez de modificar o existente:

```typescript
adicionarProduto() {
  // Cria um novo array em vez de modificar o existente
  this.produtos = [
    ...this.produtos,
    { nome: 'Fone de Ouvido', preco: 199.90 }
  ];
}
```

## Resumindo: quando usar cada tipo de pipe?

### Use pipes puros quando:

- Você quer melhor performance
- Você está lidando com transformações simples de dados
- Você pode garantir que sempre criará novos objetos/arrays quando eles mudarem

### Use pipes impuros quando:

- Você precisa detectar mudanças dentro de objetos/arrays
- Você precisa atualizar a saída com base em fatores externos (como tempo)
- Você está trabalhando com dados que mudam frequentemente e não quer criar novas referências toda vez

## Conclusão

Agora você entende a diferença entre pipes puros e impuros no Angular! Vamos recapitular:

- **Pipes** são transformadores de dados que modificam como os dados são exibidos
- **Pipes puros** são executados apenas quando o valor de entrada ou sua referência muda
- **Pipes impuros** são executados em cada ciclo de detecção de mudanças
- Use pipes puros para melhor performance na maioria dos casos
- Use pipes impuros quando precisar detectar mudanças internas em objetos/arrays ou quando precisar de atualizações baseadas em fatores externos

Com esse conhecimento, você pode escolher o tipo certo de pipe para cada situação em seus projetos Angular!

Espero que este artigo tenha ajudado a desmistificar os pipes puros e impuros de uma vez por todas. Agora é hora de colocar esse conhecimento em prática!

---

*Dica bônus*: Se você estiver usando pipes impuros, sempre fique atento à performance. Se perceber que sua aplicação está ficando lenta, considere otimizar seus pipes impuros ou substituí-los por outras abordagens quando possível.
