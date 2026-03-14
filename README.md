![Sparkfy Reviewer Banner](https://i.imgur.com/GNwDAyo.jpeg)

O Sparkfy Reviewer é uma extensão de navegador especializada, projetada para aprimorar o processo de revisão de código no GitHub e GitLab utilizando Inteligência Artificial avançada. Ao integrar modelos de linguagem de grande escala diretamente nos fluxos de trabalho de Pull Request e Merge Request, ele fornece feedback automatizado de alta qualidade baseado em boas práticas da indústria.

---

## Principais Funcionalidades

- **Suporte a Múltiplos Provedores de IA**: Integração com Google Gemini Pro, OpenAI GPT, Anthropic Claude e OpenRouter.
- **Integração de Plataforma**: Funciona perfeitamente com GitHub Pull Requests e GitLab Merge Requests.
- **Profiles de Revisão Pré-configurados**: 8 profiles especializados incluindo Security Focus, Performance, React Best Practices, TypeScript Strict e mais.
- **Sistema de Severidade**: Classificação automática de issues em CRITICAL, HIGH, MEDIUM, LOW e INFO com score de qualidade (0-100).
- **Análise Customizável**: Permite definir instruções específicas de revisão e criar profiles customizados.
- **Suporte Multilíngue**: Feedback disponível em Inglês, Português e Espanhol.
- **Foco em Privacidade**: As chaves de API são armazenadas localmente no armazenamento seguro do navegador.

---

## Requisitos Técnicos

- Node.js (v18 ou superior)
- PNPM, NPM ou Yarn
- Framework Plasmo
- Chave de API válida para um dos provedores de IA suportados

---

## Configuração do Ambiente de Desenvolvimento

Siga os passos abaixo para configurar o ambiente de projeto para desenvolvimento:

1. **Clonar o repositório**:

   ```bash
   git clone <repository-url>
   cd sparkfy-reviewer
   ```

2. **Instalar dependências**:

   ```bash
   npm install
   # ou
   pnpm install
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   # ou
   pnpm dev
   ```

O servidor de desenvolvimento monitorará as alterações e reconstruirá a extensão automaticamente.

---

## Instalação da Extensão no Chrome

Para instalar a extensão no Google Chrome a partir do código-fonte:

1. **Gerar a versão de desenvolvimento**:

   ```bash
   npm run dev
   ```

   Isso criará uma pasta de build em `build/chrome-mv3-dev`.

2. Abra o Chrome e acesse `chrome://extensions/`.
3. Ative o **Modo do desenvolvedor** no canto superior direito.
4. Clique em **Carga descompactada** (Load unpacked).
5. Selecione a pasta `build/chrome-mv3-dev` no diretório do seu projeto.

---

## Guia de Configuração

Após a instalação, siga estes passos para configurar a extensão:

1. Clique no ícone do Sparkfy Reviewer na barra de ferramentas de extensões do seu navegador.
2. Selecione o seu **Provedor de IA** preferido (ex: Gemini).
3. Insira sua **Chave de API** para o provedor selecionado.
4. (Opcional) Escolha um **Profile de Revisão** pré-configurado ou customize suas próprias instruções:
   - **General Review**: Análise completa com boas práticas gerais
   - **Security Focus**: Vulnerabilidades e segurança
   - **Performance Optimization**: Otimização e eficiência
   - **Clean Code & SOLID**: Princípios de código limpo
   - **React Best Practices**: Padrões específicos de React
   - **TypeScript Strict**: Tipagem rigorosa
   - **API & Backend**: Revisão de APIs e backend
   - **Testing & Quality**: Cobertura e qualidade de testes
5. Selecione o seu **Idioma de Saída** preferido.

---

## Uso

Ao visualizar um Pull Request no GitHub ou um Merge Request no GitLab, um botão "Run AI Review" aparecerá nas ações do cabeçalho. Ao clicar neste botão, a IA analisará as alterações de código e exibirá:

- **Score de Qualidade**: Pontuação geral (0-100) baseado nos issues encontrados
- **Issues por Severidade**: Classificados em CRITICAL 🔴, HIGH 🟠, MEDIUM 🟡, LOW 🟢 e INFO ℹ️
- **Feedback Detalhado**: Para cada issue com contexto, problema, solução e código sugerido

---

## Como Contribuir

Contribuições são muito bem-vindas! Se você deseja adicionar novas funcionalidades ou melhorias à ferramenta, siga os passos abaixo:

1. **Clone o projeto** para o seu ambiente local.
2. **Crie uma nova branch** para a sua feature (`git checkout -b feature/nova-funcionalidade`).
3. **Desenvolva as alterações** seguindo os padrões de código do projeto.
4. **Abra um Pull Request** detalhando as mudanças realizadas e o propósito da nova funcionalidade.

---

_Desenvolvido por LuiznDev._
