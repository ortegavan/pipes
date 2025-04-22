# Demonstração de pipes puros e impuros em Angular

Este projeto demonstra a diferença entre pipes puros e impuros no Angular através de exemplos práticos.

## Exemplos implementados

### Pipe puro: FormatListPipe

- Transforma um array em uma string formatada
- Atualiza apenas quando a referência do array muda
- Exemplo: converte `['Maçã', 'Banana', 'Laranja']` em "Maçã, Banana e Laranja"

### Pipe impuro: TimeAgoPipe

- Mostra o tempo decorrido desde uma data
- Atualiza automaticamente a cada segundo
- Exemplo: converte uma data em "há 5 minutos"

## Como executar

1. Clone o repositório
2. Instale as dependências com `npm install`
3. Execute o servidor de desenvolvimento com `ng serve`
4. Acesse `http://localhost:4200`

## Estrutura do projeto

```
src/app/
├── pipes/
│   ├── format-list.pipe.ts
│   └── time-ago.pipe.ts
├── app.component.ts
├── app.component.html
└── app.component.scss
```

## Testando os pipes

### Pipe puro

- Clique no botão "Adicionar morango"
- Observe que a lista não atualiza automaticamente
- O pipe só é executado quando a referência do array muda

### Pipe impuro

- Observe o tempo decorrido atualizando automaticamente
- Clique em "Atualizar post" para ver o tempo reiniciar
- O pipe é executado em cada ciclo de detecção de mudanças

## Aprendizados

- Pipes puros são mais eficientes pois são executados apenas quando necessário
- Pipes impuros são úteis para dados que mudam frequentemente
- Escolha o tipo de pipe baseado na frequência de atualização necessária
