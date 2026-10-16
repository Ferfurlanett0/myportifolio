---
name: Deployable Systems
description: Um portfólio de engenharia que revela produto, código e operação em camadas precisas.
colors:
  engineering-blue: "#3767d6"
  inspection-blue: "#78a0ff"
  graphite-ink: "#111315"
  deep-graphite: "#0b0d0f"
  raised-graphite: "#15191d"
  mineral-paper: "#f1f3f3"
  mineral-paper-deep: "#e4e8e9"
  muted-brass: "#b79b63"
  operational-green: "#7fb393"
typography:
  display:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(3.25rem, 6.2vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "clamp(2.6rem, 5.2vw, 5.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "IBM Plex Mono, monospace"
    fontSize: "0.7rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  none: "0"
  control: "2px"
  object: "8px"
spacing:
  compact: "8px"
  control: "16px"
  section: "clamp(96px, 12vw, 180px)"
components:
  button-primary:
    backgroundColor: "{colors.engineering-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "#315bbf"
    textColor: "#ffffff"
---

# Design System: Deployable Systems

## Overview

**Creative North Star: "O Sistema Implantável"**

O portfólio se comporta como um objeto de engenharia que se desdobra. Um núcleo compacto abre camadas de produto, código, infraestrutura e trajetória, criando uma assinatura técnica sem transformar a página em um cenário de ficção científica.

A linguagem é editorial, assimétrica e deliberadamente contida. O 3D é a peça autoral; o restante da página oferece silêncio, hierarquia e evidência para que os projetos permaneçam no centro.

**Key Characteristics:**

- Composição ampla com linhas técnicas finas e poucas superfícies fechadas.
- Uma interação 3D memorável, apoiada por movimento seletivo.
- Projetos apresentados por contexto, decisão e resultado funcional.
- Cor de destaque rara e funcional.

## Colors

A paleta combina superfícies minerais frias com grafite e um azul de engenharia usado como sinal, não como decoração.

### Primary

- **Azul de Engenharia:** ações principais, links ativos e informação de inspeção.
- **Azul de Inspeção:** detalhes do objeto 3D e conteúdo sobre fundo escuro.

### Secondary

- **Latão Fosco:** pequenas marcações materiais dentro da cena 3D.
- **Verde Operacional:** somente para disponibilidade e sincronização confirmadas.

### Neutral

- **Grafite Profundo:** hero, navegação, rodapé e núcleo 3D.
- **Tinta Grafite:** texto principal sobre superfícies claras.
- **Papel Mineral:** superfície principal dos estudos de caso.
- **Papel Mineral Profundo:** separação da trajetória sem recorrer a cartões.

**The Signal Color Rule.** O azul destaca ações, seleção e leitura técnica; nunca colore parágrafos inteiros nem cria halos.

## Typography

**Display Font:** Manrope (sans-serif)
**Body Font:** Manrope (sans-serif)
**Label/Mono Font:** IBM Plex Mono (monospace)

**Character:** Manrope dá presença editorial e leitura limpa. IBM Plex Mono aparece apenas em estado, tecnologia, data e medição.

### Hierarchy

- **Display** (500, fluido até 6rem, 0.98): frase central do hero.
- **Headline** (500, fluido até 5.25rem, 1.02): títulos de seção com peso visual próprio.
- **Body** (400, 0.9rem, 1.75): explicação com medida máxima próxima de 65 caracteres.
- **Label** (500, 0.7rem, 0.08em): metadados técnicos e estados em caixa alta.

**The Technical Voice Rule.** Monoespaçada comunica dados; ela não fantasia texto comum como terminal.

## Layout

O conteúdo ocupa até 1280px com margens responsivas. Hero e estudos de caso usam divisões assimétricas; capacidades e projetos menores usam linhas e colunas, não grades de cartões idênticos. Aos 900px, as composições viram uma coluna. Aos 620px, espaçamento, tipografia e detalhes são reduzidos sem alterar a ordem narrativa.

## Elevation & Depth

A interface é plana por padrão. Profundidade vem de contraste tonal, recorte fotográfico e da geometria real do Three.js. Sombras aparecem somente sob elementos que simulam um objeto físico elevado e sempre possuem deslocamento perceptível.

**The Defined Edge Rule.** Linhas ou sombra definem um plano; nunca as duas competem para criar uma caixa genérica.

## Shapes

Seções e listas permanecem ortogonais. Controles usam cantos quase retos; o arredondamento suave fica reservado ao objeto 3D para sugerir material usinado. Círculos são usados apenas para estados pontuais reais.

## Components

### Buttons

- **Shape:** quase ortogonal (2px), altura de 48px.
- **Primary:** azul sólido, texto branco e ícone linear.
- **Hover / Focus:** pequeno deslocamento vertical, tom mais profundo e foco externo visível.
- **Quiet:** texto sobre a superfície com sublinhado estrutural.

### Cards / Containers

- **Corner Style:** sem arredondamento no conteúdo editorial.
- **Background:** mudança tonal em vez de cartão sobre cartão.
- **Shadow Strategy:** ausente por padrão.
- **Border:** linha de 1px para separar registros e estudos.

### Navigation

Barra grafite fixa, links compactos e indicador linear. Em telas pequenas, o conteúdo ocupa a viewport e preserva a ordem do documento.

### Deployable Core

Objeto Three.js formado por núcleo, placas articuladas e uma folha técnica facetada. Responde ao cursor com rotação contida e se monta uma única vez na entrada; o fallback mantém a mesma silhueta sem carregar a arte antiga.

## Do's and Don'ts

### Do:

- **Do** usar espaço, escala tipográfica e regras finas para organizar informação.
- **Do** apresentar projetos com problema, contexto e acesso à implementação real.
- **Do** limitar movimento a momentos que revelam estrutura ou progressão.

### Don't:

- **Don't** usar texto em degradê, halos neon ou vidro borrado como decoração.
- **Don't** converter toda informação em cartões equivalentes.
- **Don't** deixar o 3D impedir leitura, navegação, carregamento ou movimento reduzido.
