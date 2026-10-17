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
│   ├── js/                            # Navegação, estados e animações
│   └── vendor/                        # Dependências locais versionadas
└── docs/
    ├── design/                        # Referências visuais
    └── PRD-redesign-portfolio.md      # Requisitos do redesign
```

## Desenvolvimento local

O projeto não possui etapa de compilação. Sirva a raiz por HTTP para reproduzir o comportamento publicado.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Depois, acesse `http://127.0.0.1:4173/`.

## Publicação

O código-fonte fica na branch `main`. O GitHub Pages publica a raiz da branch `gh-pages`.
