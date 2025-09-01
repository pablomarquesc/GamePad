# 🎮 Game Pad

<div align="center">
  <img src="./docs/images/gamepadHeader.png" width="200px" alt="GamePad Logo">
  
  <h3>Plataforma de Avaliação e Descoberta de Jogos</h3>
  
  <p>
    <strong>CURSO:</strong> Análise e Desenvolvimento de Sistemas<br>
    <strong>DISCIPLINA:</strong> Trabalho Interdisciplinar Desenvolvimento de Aplicação Interativa<br>
    <strong>SEMESTRE:</strong> 3º semestre/2025
  </p>
</div>

## 📖 Sobre o Projeto

O **GamePad** é uma plataforma inovadora voltada para lazer e entretenimento, onde os usuários podem **avaliar e compartilhar suas opiniões sobre jogos**. Através de notas e comentários, a plataforma facilita a descoberta de jogos bem avaliados, ajudando os usuários a tomarem decisões mais rápidas e assertivas sobre o que jogar.

### 🎯 Objetivos

- ✅ Criar um espaço interativo e colaborativo
- ✅ Facilitar a descoberta de jogos de qualidade
- ✅ Economizar tempo na busca por títulos interessantes
- ✅ Enriquecer a comunidade através da troca de experiências

## 👥 Equipe

### 🎓 Integrantes

- **Alex Mendes dos Santos**
- **Andry Marques Pereira da Silveira**
- **Isaac Souza Fernandes**
- **Pablo Marques Cordeiro**
- **Ramon Pereira de Souza**
- **Yalle Ramos Ferrari de Magalhaes**

### 👨‍🏫 Professor Orientador

- **Kleber Jacques Ferreira de Souza**

## 🚀 Acesso à Aplicação

### 🌐 **Acesso Online (Recomendado)**

<div align="center">

| **Componente**     | **Link**                                                                                                                                                     | **Descrição**                    |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| 🎮 **Frontend**    | [https://game-pad-ruby.vercel.app/](https://game-pad-ruby.vercel.app/)                                                                                       | Interface principal da aplicação |
| 🔧 **Backend API** | [https://gamepadapi-fha6cqfahhgpbad4.brazilsouth-01.azurewebsites.net/swagger](https://gamepadapi-fha6cqfahhgpbad4.brazilsouth-01.azurewebsites.net/swagger) | Documentação e teste da API      |

</div>

> ⚠️ **Observação:** Caso o acesso online não funcione corretamente, siga as instruções abaixo para rodar o projeto localmente.

---

### 💻 **Execução Local**

Para executar o projeto GamePad localmente, siga os passos abaixo:

#### 📥 **1. Clone o repositório**

```bash
git clone https://github.com/pablomarquesc/GamePad.git
cd GamePad
```

#### 🔧 **2. Configure o Backend**

```bash
# Navegue para o diretório do backend
cd src/back/GamePadAPI/GamePadAPI

# Instale as dependências
dotnet restore

# Configure o banco de dados (certifique-se que o SQL Server está rodando)
dotnet ef database update

# Inicie o backend
dotnet run
```

#### 🎨 **3. Configure o Frontend**

```bash
# Abra um novo terminal e navegue para o frontend
cd src/front

# Instale as dependências
npm install

# Configure para usar o backend local
echo "VITE_API_URL=http://localhost:5069" > .env.local

# Inicie o frontend
npm run dev
```

#### 🌐 **4. Acesse a aplicação**

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5069/swagger](http://localhost:5069/swagger)

<!--Assim que a primeira versão do sistema estiver disponível, deverá complementar com as instruções de utilização. Descreva como instalar eventuais dependências e como executar a aplicação.

Não deixe de informar o link onde a aplicação estará disponível para acesso (por exemplo: https://adota-pet.herokuapp.com/src/index.html).

Se houver usuário de teste, o login e a senha também deverão ser informados aqui (por exemplo: usuário - admin / senha - admin).

O link e o usuário/senha descritos acima são apenas exemplos de como tais informações deverão ser apresentadas.-->

## 📚 Documentação

| **Documento**                                                          | **Descrição**                            |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| 📋 [01 - Contexto](docs/01-Contexto.md)                                | Documentação de contexto do projeto      |
| 📝 [02 - Especificação](docs/02-Especificacao.md)                      | Especificação detalhada do projeto       |
| 🔬 [03 - Metodologia](docs/03-Metodologia.md)                          | Metodologia utilizada no desenvolvimento |
| 🎨 [04 - Projeto de Interface](docs/04-Projeto-interface.md)           | Design e interface da aplicação          |
| 📐 [05 - Template Padrão](docs/05-Template-padrao.md)                  | Template padrão da aplicação             |
| 🏗️ [06 - Arquitetura](docs/06-Arquitetura-solucao.md)                  | Arquitetura da solução                   |
| 🧪 [07 - Plano de Testes](docs/07-Plano-testes-software.md)            | Plano de testes de software              |
| 📊 [08 - Registro de Testes](docs/08-Registro-testes-software.md)      | Registro de testes de software           |
| 👥 [09 - Testes de Usabilidade](docs/09-Plano-testes-usabilidade.md)   | Plano de testes de usabilidade           |
| 📈 [10 - Registro Usabilidade](docs/10-Registro-testes-usabilidade.md) | Registro de testes de usabilidade        |
| 📖 [11 - Referências](docs/11-Referencias.md)                          | Referências bibliográficas               |

## 💻 Código

- 📁 [Código Fonte](src/README.md)

## 🎤 Apresentação

- 🎯 [Apresentação do Projeto](presentation/README.md)

## ☁️ Infraestrutura e Hospedagem

### 🏗️ **Arquitetura da Solução**

<div align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Backend-.NET-purple?style=for-the-badge&logo=.net" alt=".NET">
  <img src="https://img.shields.io/badge/Database-SQL%20Server-red?style=for-the-badge&logo=microsoft-sql-server" alt="SQL Server">
</div>

### 🌐 **Hospedagem**

| **Componente**        | **Plataforma**         | **Descrição**                                       |
| --------------------- | ---------------------- | --------------------------------------------------- |
| 🎮 **Frontend**       | **Vercel**             | Deploy automático via GitHub, domínio personalizado |
| 🔧 **Backend**        | **Azure App Service**  | Deploy automático via GitHub Actions                |
| 🗄️ **Banco de Dados** | **Azure SQL Database** | Alta disponibilidade e integração direta            |

### 🔄 **CI/CD Pipeline**

- ✅ **Deploy Automático** a cada push na branch `main`
- ✅ **Integração Contínua** com GitHub Actions
- ✅ **Ambiente de Produção** configurado e monitorado
