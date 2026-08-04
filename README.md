# Portfólio — Fernando Furlanetto

Portfólio profissional estático publicado pelo GitHub Pages.

## Estrutura

```text
myportifolio/
├── index.html                         # Entrada do GitHub Pages
├── assets/
│   ├── css/                           # Estilos da aplicação
│   ├── documents/                     # Currículo e documentos públicos
│   ├── icons/                         # Ícones locais das tecnologias
│   ├── images/
│   │   └── projects/                  # Imagens dos projetos
│   ├── js/
│   │   └── hero/                      # Cena Three.js e ciclo de renderização
│   └── vendor/
│       └── three/                     # Three.js 0.185.1 fixado localmente
└── docs/
    ├── design/                        # Referências visuais
    └── PRD-redesign-portfolio.md      # Requisitos do redesign
```

## Desenvolvimento local

O projeto não possui etapa de compilação. Como a Hero utiliza módulos ES, sirva a raiz por HTTP em vez de abrir o `index.html` por `file://`.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Depois, acesse `http://127.0.0.1:4173/`.

## Publicação

O código-fonte fica na branch `main`. O GitHub Pages publica a raiz da branch `gh-pages`.
