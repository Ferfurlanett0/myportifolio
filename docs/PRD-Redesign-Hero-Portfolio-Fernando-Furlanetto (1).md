# PRD — Redesign da Hero Section do Portfólio

**Projeto:** Portfólio Fernando Furlanetto
**Área principal:** Hero Section / Home
**Posicionamento:** Desenvolvedor Full Stack
**Status:** Planejamento para implementação
**Referência visual:** Imagem fornecida junto ao projeto

---

## 1. Visão Geral

O objetivo deste projeto é modernizar a primeira experiência visual do portfólio existente de **Fernando Furlanetto**, utilizando a imagem fornecida como principal referência de design.

> [!IMPORTANT]
> Este projeto **NÃO deve recriar o portfólio do zero**.

Antes de realizar qualquer alteração, o projeto atual deve ser analisado para identificar:

- Framework utilizado;
- Estrutura de componentes;
- Sistema de estilos;
- Dependências;
- Navegação;
- Responsividade;
- Assets;
- Animações existentes;
- Projetos cadastrados;
- Links;
- Redes sociais;
- Currículo;
- Tecnologias apresentadas;
- Demais seções existentes.

A nova implementação deve ser construída sobre a arquitetura atual sempre que tecnicamente possível.

---

# 2. Objetivo do Produto

O portfólio deve permitir que um recrutador, desenvolvedor ou potencial cliente entenda rapidamente:

1. Quem é Fernando Furlanetto;
2. Qual sua área de atuação;
3. Que trabalha como Desenvolvedor Full Stack;
4. Que possui capacidade para desenvolver aplicações completas;
5. Quais são suas principais tecnologias;
6. Onde visualizar seus projetos;
7. Como entrar em contato;
8. Onde acessar seu GitHub e LinkedIn;
9. Como baixar seu currículo.

A primeira impressão deve transmitir:

- Tecnologia;
- Profissionalismo;
- Modernidade;
- Criatividade;
- Engenharia de software;
- Desenvolvimento Full Stack;
- Capacidade técnica;
- Atenção a UI/UX;
- Qualidade.

---

# 3. Posicionamento Visual

O resultado deve parecer um portfólio profissional de:

> **Full Stack Developer / Software Engineer**

Evitar aparência de:

- Template genérico;
- Site gamer;
- Landing page de criptomoeda;
- Projeto acadêmico básico;
- Portfólio excessivamente futurista;
- Interface cheia de efeitos sem propósito.

O 3D deve reforçar o posicionamento profissional, não competir com ele.

---

# 4. Princípio Fundamental de Implementação

Antes de escrever código:

1. Analisar o projeto atual;
2. Identificar componentes existentes;
3. Identificar tecnologias e bibliotecas já instaladas;
4. Identificar sistema de estilos;
5. Verificar arquitetura;
6. Verificar responsividade;
7. Verificar links e navegação;
8. Verificar dados reais apresentados.

Depois disso, definir a estratégia de implementação.

### Não fazer

- Recriar todo o projeto sem necessidade;
- Trocar framework;
- Alterar arquitetura apenas por preferência;
- Remover funcionalidades existentes;
- Alterar URLs desnecessariamente;
- Adicionar dependências pesadas sem justificativa;
- Inventar conteúdo;
- Inventar tecnologias;
- Inventar experiência;
- Inventar métricas.

A implementação deve parecer uma **evolução natural do portfólio atual**.

---

# 5. Direção Visual

Utilizar a imagem fornecida como principal referência.

## Estética

- Dark premium;
- Minimalista;
- Tecnológica;
- Moderna;
- Sofisticada;
- Profissional;
- Elementos 3D;
- Iluminação azul/violeta;
- Glassmorphism discreto;
- Negative space;
- Alto contraste;
- Microinterações.

---

# 6. Paleta de Cores

## Background

```css
--background-primary: #030712;
--background-secondary: #050816;
--background-tertiary: #080d18;
```

## Texto

```css
--text-primary: #f8fafc;
--text-white: #ffffff;
--text-secondary: #94a3b8;
--text-muted: #a1a1aa;
```

## Azul

```css
--cyan: #00bfff;
--blue-light: #0ea5e9;
--blue: #2563eb;
```

## Violeta

```css
--indigo: #6366f1;
--violet: #7c3aed;
--purple: #8b5cf6;
--purple-light: #a855f7;
```

## Gradiente principal

```css
background: linear-gradient(
  90deg,
  #00bfff,
  #2563eb,
  #7c3aed
);
```

Gradientes devem funcionar principalmente como **accent**.

Evitar grandes superfícies excessivamente coloridas.

---

# 7. Tipografia

Priorizar tipografia moderna para produtos digitais.

Sugestões:

- Inter;
- Geist;
- Manrope.

Caso o projeto já utilize uma fonte adequada, avaliar sua manutenção antes de adicionar outra dependência.

## Hierarquia

### Nome

Desktop:

```text
64px – 82px
```

Mobile:

```text
42px – 52px
```

Peso:

```text
700 – 800
```

### Cargo

```text
14px – 18px
```

### Descrição

```text
16px – 18px
```

### Navbar

```text
14px – 16px
```

Utilizar `letter-spacing` principalmente em:

```text
OLÁ, EU SOU
```

e:

```text
DESENVOLVEDOR FULL STACK
```

---

# 8. Header / Navbar

Criar ou refatorar o header seguindo a referência.

## Estrutura

```text
[FF] Fernando Furlanetto

          Início
          Sobre
          Projetos
          Skills
          Experiência
          Contato

                              [ Baixar CV ↓ ]
```

## Comportamento

Inicialmente:

- Transparente;
- Integrado ao Hero;
- Sem sombra pesada;
- Visual leve.

Durante scroll:

- Background escuro semitransparente;
- `backdrop-filter: blur(...)`;
- Border inferior extremamente discreta.

---

# 9. Estado Ativo da Navegação

A seção atual deve possuir indicador visual.

Exemplo:

```text
Início
────
```

Utilizar pequena linha:

- Azul;
- Ciano;
- Ou gradiente azul → violeta.

Se fizer sentido com a arquitetura atual, atualizar automaticamente a navegação conforme o usuário percorre as seções.

---

# 10. Logo

Utilizar um monograma simples:

```text
FF
```

Com gradiente:

```text
azul → violeta
```

Ao lado:

```text
Fernando Furlanetto
```

Sugestão:

- `Fernando`: peso normal;
- `Furlanetto`: semibold/bold.

Caso já exista uma identidade visual no projeto, avaliar antes de substituir.

---

# 11. Hero Section

A Hero deve ocupar aproximadamente:

```css
min-height: 90vh;
```

até:

```css
min-height: 100vh;
```

## Desktop

Estrutura aproximada:

```text
LEFT                    RIGHT

42–48%                  52–58%

Conteúdo                Experiência
textual                 tecnológica 3D
```

---

# 12. Hero — Coluna Esquerda

Estrutura:

```text
● OLÁ, EU SOU

Fernando
Furlanetto

DESENVOLVEDOR FULL STACK

Descrição

[ Ver Projetos → ] [ Sobre Mim ]

ME ENCONTRE

GitHub LinkedIn Instagram E-mail
```

---

# 13. Nome

Exibir:

```text
Fernando
Furlanetto
```

`Fernando`:

- Branco;
- Alto contraste.

`Furlanetto`:

- Ciano;
- Azul;
- Violeta.

Exemplo:

```css
background: linear-gradient(
  90deg,
  #00bfff,
  #2563eb,
  #7c3aed
);

-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

O sobrenome deve funcionar como um dos principais elementos visuais da página.

Glow deve ser extremamente sutil.

---

# 14. Cargo

Texto:

```text
DESENVOLVEDOR FULL STACK
```

Sugestão:

`DESENVOLVEDOR`:

- Branco;
- Cinza claro.

`FULL STACK`:

- Azul;
- Violeta.

Utilizar espaçamento entre caracteres.

---

# 15. Descrição

Sugestão:

> Desenvolvo soluções completas para a web, do front-end e interfaces intuitivas ao back-end e bancos de dados robustos. Transformo ideias em aplicações reais.

O texto pode ser refinado caso o projeto atual já possua uma apresentação melhor.

Adicionar pequena linha vertical ao lado esquerdo.

Exemplo:

```text
│ Desenvolvo soluções completas para a web,
│ do front-end e interfaces intuitivas ao
│ back-end e bancos de dados robustos.
```

Cor da linha:

```text
azul → violeta
```

Largura máxima aproximada:

```css
max-width: 560px;
```

---

# 16. Call to Action

Criar dois CTAs.

## CTA Principal

```text
Ver Projetos →
```

Visual:

- Gradient azul → violeta;
- Texto branco;
- Border-radius moderno;
- Ícone/seta.

### Hover

- `translateY(-2px)`;
- Glow discreto;
- Aumento mínimo de luminosidade;
- Movimento sutil da seta.

O botão deve navegar até a seção real de projetos.

---

# 17. CTA Secundário

```text
Sobre Mim
```

Visual:

- Fundo transparente;
- Border discreta;
- Ícone de usuário.

Exemplo:

```css
border: 1px solid rgba(255,255,255,.15);
```

Hover:

- Border azul/violeta;
- Fundo ligeiramente mais claro.

Deve navegar para a seção Sobre existente.

---

# 18. Redes Sociais

Adicionar:

```text
ME ENCONTRE
```

Abaixo:

- GitHub;
- LinkedIn;
- Instagram, se fizer sentido;
- E-mail.

> [!IMPORTANT]
> Utilizar somente URLs reais encontradas no projeto.

Nunca inventar links.

## Botões

Cada rede deve possuir container quadrado.

Default:

- Background escuro;
- Border discreta;
- Ícone claro.

Hover:

```css
transform: translateY(-2px);
```

Adicionar:

- Accent azul/violeta;
- Glow discreto;
- Feedback visual.

Também adicionar:

```html
aria-label
```

adequado.

---

# 19. Hero — Coluna Direita

Esta será uma das principais características visuais do novo portfólio.

Não utilizar fotografia pessoal como elemento principal desta versão.

Criar uma composição tecnológica 3D inspirada na referência.

---

# 20. Conceito da Experiência 3D

A composição deve representar visualmente:

```text
FRONT-END
+
BACK-END
+
DATABASE
+
INFRASTRUCTURE
=
FULL STACK
```

O usuário não precisa literalmente ler isso.

A composição deve comunicar essa ideia visualmente.

---

# 21. Objeto Principal

Criar um grande bloco/cubo tecnológico.

Características:

- Preto;
- Grafite;
- Material premium;
- Bordas discretas;
- Iluminação azul/violeta;
- Profundidade.

Na face frontal:

```text
</>
```

ou símbolo equivalente relacionado ao desenvolvimento.

O símbolo deve possuir iluminação:

```text
ciano → azul → violeta
```

---

# 22. Plataforma

O objeto deve parecer estar flutuando ou apoiado sobre uma pequena plataforma tecnológica.

A plataforma pode possuir:

- Camadas;
- Luz inferior;
- Neon discreto;
- Reflexo;
- Profundidade.

Adicionar iluminação inferior azul/violeta.

---

# 23. Elementos Secundários 3D

Ao redor do objeto principal:

- Pequenos cubos;
- Pontos;
- Nodes;
- Linhas;
- Grid;
- Partículas;
- Painéis;
- Elementos digitais.

Distribuir em diferentes profundidades para criar sensação de espaço.

Não sobrecarregar.

---

# 24. Painéis de Código

Adicionar aproximadamente 1–2 painéis transparentes.

Exemplo:

```javascript
function solveProblem() {
  const idea = "transformar";
  const dedication = true;

  return buildSolution();
}
```

Outro painel:

```javascript
const stack = {
  frontend: ["React", "TypeScript"],
  backend: ["Node.js", "Express"],
  database: ["PostgreSQL", "MySQL"]
};
```

> [!IMPORTANT]
> Antes de utilizar tecnologias nesses snippets, verificar quais competências são realmente apresentadas no projeto.

Os painéis são decorativos.

Não devem disputar atenção com o conteúdo principal.

---

# 25. Glassmorphism dos Painéis

Utilizar algo semelhante:

```css
background: rgba(10, 15, 25, 0.35);

backdrop-filter: blur(12px);

border: 1px solid rgba(255,255,255,.08);
```

Adicionar:

- Border-radius;
- Sombra;
- Leve glow.

Evitar aparência de card branco/transparente tradicional.

---

# 26. Estratégia Técnica para o 3D

Não assumir automaticamente Three.js.

Avaliar o projeto primeiro.

## Prioridade

### Opção A — Three.js / React Three Fiber

Utilizar caso:

- Projeto seja React;
- Experiência 3D real agregue valor;
- Bundle permaneça aceitável;
- Performance permaneça boa.

### Opção B — CSS 3D

Utilizar:

- `transform`;
- `perspective`;
- Pseudo-elements;
- Gradients;
- Assets.

Caso consiga resultado semelhante com menor custo.

### Opção C — Asset 3D otimizado

Utilizar:

- WebP;
- AVIF;
- SVG;
- Asset renderizado.

Adicionar efeitos independentes sobre ele.

Escolher a alternativa com melhor equilíbrio entre:

```text
Visual
Performance
Manutenção
Responsividade
Acessibilidade
```

---

# 27. Animação do Objeto Principal

Caso seja 3D real:

Idle:

- Floating lento;
- Pequena rotação;
- Movimento vertical;
- Alterações discretas de iluminação.

Movimento deve ser extremamente suave.

---

# 28. Interação com Mouse

Desktop:

O objeto pode reagir ao cursor.

Rotação máxima aproximada:

```text
3° – 6°
```

Não fazer o objeto perseguir agressivamente o mouse.

Objetivo:

> criar profundidade, não distração.

---

# 29. Cubos Secundários

Os pequenos cubos ao fundo podem possuir animações independentes.

Utilizar:

- Velocidades diferentes;
- Delays diferentes;
- Profundidades diferentes.

Isso evita movimento artificial sincronizado.

---

# 30. Painéis Flutuantes

Os painéis de código também podem possuir movimento independente.

Exemplo:

```text
translateY(-3px → +3px)
rotateY(-1deg → +1deg)
```

Muito sutil.

---

# 31. Background

Criar background tecnológico discreto.

Pode conter:

- Dots;
- Nodes;
- Linhas;
- Grid;
- Blur lights;
- Partículas.

Evitar:

- Matrix;
- Chuva digital;
- Centenas de partículas;
- Estrelas;
- Movimentos rápidos;
- Efeito gamer.

O background deve ser percebido depois do conteúdo.

---

# 32. Glow

Criar iluminação ambiental atrás do objeto.

Exemplo:

```css
background: radial-gradient(
  circle,
  rgba(37, 99, 235, .18),
  transparent 60%
);
```

Outro glow:

```css
rgba(124, 58, 237, .12)
```

O centro da composição pode possuir maior luminosidade.

As bordas devem desaparecer no background.

---

# 33. Tech Stack

Na parte inferior da Hero ou imediatamente depois dela:

```text
TECNOLOGIAS QUE UTILIZO
```

Criar container horizontal.

Exemplo:

```css
background: rgba(5,10,20,.65);

border: 1px solid rgba(255,255,255,.08);

border-radius: 24px;
```

---

# 34. Tecnologias

Verificar primeiro as tecnologias reais existentes no portfólio.

Possíveis tecnologias:

- React;
- TypeScript;
- Tailwind CSS;
- Node.js;
- Express;
- PostgreSQL;
- MySQL;
- Git;
- Docker.

> [!WARNING]
> Não adicionar automaticamente todas apenas porque aparecem na referência.

O conteúdo real do portfólio possui prioridade.

Ideal:

```text
8–10 tecnologias principais
```

---

# 35. Apresentação das Tecnologias

Cada item:

```text
[ícone]

React
```

Evitar cards individuais pesados.

Hover:

```css
transform: translateY(-3px) scale(1.05);
```

Adicionar glow extremamente discreto.

---

# 36. Ícones

Prioridade:

1. Biblioteca já existente;
2. Simple Icons;
3. Lucide;
4. SVG local.

Não instalar várias bibliotecas para resolver o mesmo problema.

---

# 37. Microinterações

Adicionar pequenas animações.

## Entrada da Hero

Sequência sugerida:

```text
1. OLÁ, EU SOU
2. Nome
3. Cargo
4. Descrição
5. CTAs
6. Redes
7. Visual 3D
```

Tempo total da entrada:

```text
< 1 segundo
```

---

# 38. Scroll Animations

Se já existir biblioteca de animação, reutilizar.

Caso contrário, priorizar:

```text
CSS
+
IntersectionObserver
```

Duration:

```text
400–700ms
```

---

# 39. Hover States

Todo elemento interativo deve possuir feedback.

- Links: mudança de cor;
- Botões: `translateY(-2px)`;
- Social: glow discreto;
- Technologies: `translateY(-3px) scale(1.05)`;
- Navbar: accent na cor.

---

# 40. Responsividade

## Desktop

```text
>= 1200px
```

Hero em duas colunas.

## Tablet

```text
768px – 1199px
```

Reduzir objeto, partículas, espaçamentos e fontes.

## Mobile

```text
< 768px
```

Ordem:

```text
Navbar
↓
OLÁ, EU SOU
↓
Fernando
Furlanetto
↓
Desenvolvedor Full Stack
↓
Descrição
↓
CTAs
↓
Redes sociais
↓
Visual tecnológico
↓
Tecnologias
```

---

# 41. Cena 3D no Mobile

Simplificar significativamente:

- Menos partículas;
- Menos cubos;
- Sem parallax;
- Menos sombras;
- Menor resolução;
- Menos post-processing.

Caso necessário, substituir por versão estática otimizada.

---

# 42. Mobile Navigation

Criar menu hamburger se necessário.

O menu deve:

- Abrir suavemente;
- Possuir overlay;
- Bloquear scroll;
- Fechar ao selecionar seção;
- Fechar com `ESC`;
- Possuir `aria-expanded`.

---

# 43. Performance

Meta desejada:

```text
Lighthouse Performance >= 90
```

Evitar:

- Vídeos gigantes;
- PNGs enormes;
- WebGL excessivamente complexo;
- Milhares de partículas;
- Dependências desnecessárias;
- JavaScript bloqueante.

---

# 44. Assets

Priorizar:

```text
AVIF
WebP
SVG
```

Aplicar lazy loading quando apropriado.

---

# 45. Performance WebGL

Se utilizar Three.js:

```javascript
renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);
```

No mobile, reduzir particle count, sombras, geometrias, post-processing e DPR.

---

# 46. Progressive Enhancement

O conteúdo principal deve funcionar mesmo se:

- WebGL falhar;
- JavaScript estiver lento;
- Dispositivo for fraco;
- Usuário desativar animações.

---

# 47. Reduced Motion

Respeitar:

```css
@media (prefers-reduced-motion: reduce)
```

Remover floating, parallax e animações contínuas.

---

# 48. Acessibilidade

Garantir:

- HTML semântico;
- Contraste;
- Keyboard navigation;
- `focus-visible`;
- `aria-label`;
- `alt`;
- Buttons corretos;
- Anchors corretos.

---

# 49. SEO

Preservar SEO existente.

Verificar:

```html
<title>
<meta name="description">
<link rel="canonical">
<meta property="og:title">
<meta property="og:description">
<meta property="og:image">
```

---

# 50. Title Sugerido

```text
Fernando Furlanetto | Full Stack Developer
```

---

# 51. Meta Description Sugerida

```text
Desenvolvedor Full Stack focado na criação de aplicações web modernas, interfaces intuitivas e soluções completas do front-end ao back-end.
```

---

# 52. Conteúdo Real

Nunca inventar:

- Anos de experiência;
- Quantidade de projetos;
- Empresas;
- Clientes;
- Tecnologias;
- Resultados;
- Métricas.

Se não houver informação verificável, não exibir.

---

# 53. Integração com as Demais Seções

Revisar:

- Sobre;
- Projetos;
- Skills;
- Experiência;
- Certificações;
- Contato.

A transição visual não pode parecer a junção de dois sites diferentes.

---

# 54. Design System

Criar ou reutilizar tokens.

```css
:root {
  --bg-primary: #030712;
  --bg-secondary: #050816;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;

  --accent-cyan: #00bfff;
  --accent-blue: #2563eb;
  --accent-purple: #7c3aed;

  --border-subtle: rgba(255,255,255,.08);

  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
}
```

---

# 55. Componentização

Se for React, considerar:

```text
components/
├── Navbar
├── Hero
├── HeroContent
├── HeroVisual
├── SocialLinks
├── TechStack
└── SectionTitle
```

Caso utilize Three.js:

```text
components/
└── 3d/
    ├── DeveloperScene
    ├── FloatingCube
    ├── CodePanel
    ├── Particles
    └── Lighting
```

---

# 56. Processo Obrigatório

## Etapa 1 — Auditoria

Analisar stack, framework, arquitetura, componentes, CSS, dependências, assets, responsividade, Hero atual, navegação e dados existentes.

## Etapa 2 — Planejamento

Determinar arquivos a modificar, arquivos a criar, componentes, dependências, estratégia 3D, animação e responsividade.

## Etapa 3 — Implementação

Implementar Navbar, Hero, CTAs, social links, experiência tecnológica, Tech Stack, responsividade e animações.

## Etapa 4 — Validação Técnica

Executar:

```bash
npm run build
npm run lint
npm run typecheck
```

ou equivalentes.

## Etapa 5 — Validação Responsiva

Testar:

```text
1440px
1280px
1024px
768px
430px
390px
```

---

# 57. Critérios de Aceitação

- [ ] Projeto compila normalmente;
- [ ] Nenhuma funcionalidade importante foi perdida;
- [ ] Hero próxima da referência;
- [ ] Fernando Furlanetto claramente identificado;
- [ ] Desenvolvedor Full Stack evidente;
- [ ] Estética dark premium;
- [ ] Experiência tecnológica no lado direito;
- [ ] 3D sem prejudicar performance;
- [ ] `Ver Projetos` funciona;
- [ ] `Sobre Mim` funciona;
- [ ] Links sociais funcionam;
- [ ] `Baixar CV` funciona;
- [ ] Tecnologias são reais;
- [ ] Desktop correto;
- [ ] Tablet correto;
- [ ] Mobile correto;
- [ ] Navegação por teclado funciona;
- [ ] Reduced Motion respeitado;
- [ ] Sem overflow horizontal;
- [ ] Sem novos erros relevantes no console;
- [ ] Build passa;
- [ ] Typecheck passa quando existente;
- [ ] Sem novos erros críticos de lint.

---

# 58. O Que Não Fazer

Não:

- Recriar todo o projeto;
- Trocar framework sem necessidade;
- Apagar seções;
- Inventar experiência;
- Inventar tecnologias;
- Inventar métricas;
- Usar a referência inteira como background;
- Criar vídeos pesados automaticamente;
- Adicionar centenas de partículas;
- Exagerar em neon;
- Criar estética gamer;
- Utilizar animações rápidas;
- Adicionar bibliotecas sem justificativa;
- Prejudicar SEO;
- Prejudicar acessibilidade;
- Alterar URLs desnecessariamente;
- Substituir conteúdo real por Lorem Ipsum.

---

# 59. Ordem de Prioridade

```text
1. Funcionalidade
2. Legibilidade
3. Responsividade
4. Performance
5. Acessibilidade
6. Fidelidade visual
```

---

# 60. Resultado Esperado

A primeira tela deve transmitir:

> Fernando não trabalha apenas com a camada visual de uma aplicação. Ele possui capacidade para desenvolver soluções completas.

A identidade deve combinar:

```text
Software Engineering
        +
Full Stack Development
        +
UI moderna
        +
Tecnologia
        +
Profissionalismo
```

---

# 61. Instrução Final para o Codex

Antes de implementar:

1. Analise o repositório relevante;
2. Entenda a arquitetura existente;
3. Identifique a stack;
4. Identifique componentes reutilizáveis;
5. Analise a Hero atual;
6. Analise a responsividade;
7. Analise dependências.

**Não comece alterando arquivos imediatamente.**

Depois:

1. Apresente brevemente o diagnóstico;
2. Defina a estratégia de implementação;
3. Escolha a melhor abordagem para a experiência 3D;
4. Implemente o redesign;
5. Preserve funcionalidades existentes;
6. Execute os testes disponíveis;
7. Corrija regressões;
8. Verifique responsividade;
9. Informe os arquivos alterados;
10. Informe eventuais limitações.

Utilize a imagem fornecida como **referência visual principal**.

Busque alta fidelidade em composição, hierarquia, atmosfera, profundidade, espaçamento, iluminação, tipografia e qualidade visual, adaptando corretamente ao conteúdo, às tecnologias e à arquitetura reais do portfólio existente.
