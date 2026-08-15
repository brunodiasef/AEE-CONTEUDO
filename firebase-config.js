/* ============================================================
   CONFIGURAÇÃO DO FIREBASE — Monitoramento AEE
   ============================================================
   1. Acesse https://console.firebase.google.com
   2. Crie um projeto (gratuito)
   3. Em "Compilação" > "Firestore Database" clique em "Criar banco de dados"
   4. Em "Compilação" > "Storage" clique em "Começar"
   5. Em "Configurações do projeto" (ícone de engrenagem) > "Geral",
      role até "Seus apps", clique no ícone "</>" (Web) e registre o app.
   6. Copie o objeto "firebaseConfig" que aparece e cole abaixo,
      substituindo os valores de exemplo.
   ============================================================ */

export const firebaseConfig = {
  apiKey: "AIzaSyC1ESYJm2RoqGYjWg1D9ZMHYzYpKtIYaQA",
  authDomain: "aee-conteudo.firebaseapp.com",
  projectId: "aee-conteudo",
  storageBucket: "aee-conteudo.firebasestorage.app",
  messagingSenderId: "914968247050",
  appId: "1:914968247050:web:98ccd7935ef1dc3c24d8f3"
};
