# Monitoramento AEE — PWA + Firebase

Este pacote transforma o app em um **PWA** (instalável no celular/computador,
funciona como um aplicativo de verdade) e guarda todos os dados — cadastros
de professores e conteúdos enviados — no **Firebase** (Firestore),
sincronizando em tempo real entre todos os aparelhos.

> **Sobre anexos de arquivo:** esta versão não usa o Firebase Storage, porque
> ele exige o plano pago Blaze (com cartão vinculado). Em vez de anexar um
> arquivo, o professor regente pode colar um **link** (Google Drive, Google
> Classroom, Google Fotos etc.) na hora de enviar o conteúdo da semana. Se no
> futuro você quiser habilitar upload de arquivo de verdade, é só migrar para
> o plano Blaze e ativar o Storage — o código já tem um comentário indicando
> onde reativar isso, e o arquivo `storage.rules` já está pronto para quando
> esse dia chegar.

## Arquivos do pacote

| Arquivo | Para que serve |
|---|---|
| `index.html` | O aplicativo em si |
| `manifest.json` | Diz ao navegador como instalar o app (nome, ícone, cores) |
| `sw.js` | Service worker — permite abrir o app rápido e instalá-lo |
| `firebase-config.js` | **Único arquivo que você precisa editar** com as chaves do seu Firebase |
| `firestore.rules` | Regras de segurança do banco de dados |
| `storage.rules` | Regras de segurança dos arquivos anexados |
| `firebase.json` | Configuração para publicar com o Firebase Hosting |
| `icons/` | Ícones do app (192px, 512px, apple-touch) |

## Passo 1 — Criar o projeto no Firebase

1. Acesse **https://console.firebase.google.com** e clique em **Adicionar projeto**.
2. Dê um nome, ex: `monitoramento-aee`, e conclua a criação (é gratuito no plano padrão para esse volume de uso).
3. No menu lateral, vá em **Compilação → Firestore Database** → **Criar banco de dados** → escolha o modo **produção** e a região mais próxima (ex: `southamerica-east1`).
4. Ainda no console, clique no ícone de engrenagem (⚙) → **Configurações do projeto** → aba **Geral** → role até **Seus apps** → clique no ícone **`</>`** (Web) → dê um apelido ao app → **Registrar app**.
5. O Firebase vai mostrar um bloco `firebaseConfig = {...}`. Copie esses valores.

*(Não é preciso ativar o Storage — veja o aviso no topo deste arquivo.)*

## Passo 2 — Configurar o app

Abra o arquivo **`firebase-config.js`** e substitua os valores de exemplo pelos que você copiou:

```js
export const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "monitoramento-aee.firebaseapp.com",
  projectId: "monitoramento-aee",
  storageBucket: "monitoramento-aee.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

Salve o arquivo. Isso já é suficiente para o app funcionar.

## Passo 3 — Aplicar as regras de segurança

No console do Firebase:

- **Firestore Database → Regras**: cole o conteúdo de `firestore.rules` e clique em **Publicar**.

*(O arquivo `storage.rules` só é necessário se, no futuro, você migrar para o plano Blaze e ativar o Storage para permitir anexos de arquivo de verdade.)*

> ⚠️ **Aviso de segurança**: como o app usa um login simples próprio (usuário/senha
> guardados no Firestore) em vez do sistema de autenticação do Firebase, as
> regras acima liberam acesso para qualquer pessoa que tenha o link do app —
> isso é adequado para uso interno da escola (rede fechada, link não divulgado
> publicamente), mas **não** deve ser usado como estava para dados
> altamente sensíveis sem reforço adicional. Se quiser um passo a mais de
> segurança no futuro, posso te ajudar a migrar para o **Firebase
> Authentication** com permissões por perfil (isso exige uma pequena função
> de backend para o AEE/pedagogo poderem criar logins de outros professores).

## Passo 4 — Publicar o app (Firebase Hosting)

Isso é o que faz o app virar um **PWA instalável de verdade** (precisa de HTTPS
para o "Instalar app" aparecer no celular).

1. Instale as ferramentas do Firebase (uma vez só), no terminal:
   ```
   npm install -g firebase-tools
   ```
2. Entre na pasta deste pacote e faça login:
   ```
   firebase login
   ```
3. Associe a pasta ao seu projeto:
   ```
   firebase use --add
   ```
   (escolha o projeto que você criou no Passo 1)
4. Publique:
   ```
   firebase deploy --only hosting
   ```
5. O terminal vai mostrar um link tipo `https://monitoramento-aee.web.app` —
   esse é o endereço do app. Compartilhe com os professores.

**Alternativa sem terminal:** você também pode hospedar o conteúdo desta
pasta em qualquer servidor com HTTPS (ex: Netlify, Vercel, Hostinger) —
o app funciona igual, só o passo de publicação muda.

## Passo 5 — Instalar como aplicativo

Depois de publicado (com HTTPS):

- **Celular (Android/Chrome)**: abra o link → menu ⋮ → "Instalar aplicativo" ou "Adicionar à tela inicial".
- **iPhone (Safari)**: abra o link → botão de compartilhar → "Adicionar à Tela de Início".
- **Computador (Chrome/Edge)**: abra o link → ícone de instalação na barra de endereço → "Instalar".

O app passa a abrir como um aplicativo de verdade, com ícone próprio, sem a barra do navegador.

## Como os dados ficam organizados no Firebase

- **Firestore → coleção `users`**: cada professor cadastrado (pedagogo, AEE ou regente), com nome, usuário, senha, disciplina, turma e o AEE responsável.
- **Firestore → coleção `conteudos`**: cada conteúdo semanal enviado, com título, descrição, semana, turma, disciplina, quem enviou e, se o professor colou, o link do material (Google Drive, Classroom etc.).

Você pode ver e editar esses dados a qualquer momento no console do Firebase,
em **Firestore Database** e **Storage**.

## Testando localmente antes de publicar

Como o app usa módulos JavaScript e Service Worker, ele **não funciona** só
abrindo o `index.html` direto no navegador (`file://`) — é preciso servir por
`http://` ou `https://`. Para testar localmente:

```
firebase emulators:start --only hosting
```

ou, com Python instalado, dentro da pasta:

```
python3 -m http.server 8000
```

e acesse `http://localhost:8000` no navegador.

## Login inicial

Assim que o app conectar ao Firebase pela primeira vez, ele cria
automaticamente um acesso de **Pedagogo(a)**:

- usuário: `pedagogo`
- senha: `pedagogo123`

Recomendo trocar essa senha (editando o documento correspondente na coleção
`users` do Firestore) assim que o app estiver publicado.
