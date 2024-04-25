

# Desafio DevX

Este teste tem como objetivo habilitar a capacidade de provisionamento de recursos em nuvem por meio de uma plataforma, com a abstração dos conceitos de DevOps. Seguem as tarefas:  

-   Provisionar o sistema Backstage (utilizado para abstrair as funcionalidades da plataforma).  
-   Configurar o Backstage para possibilitar o provisionamento de um bucket (repositório de arquivos na nuvem).  
-   Configurar o Backstage para habilitar o recurso de site estático no bucket mencionado.  
-   Criar/configurar o Backstage para que possa provisionar um repositório Git destinado a receber os arquivos de um site estático.  
-   Estabelecer/configurar um Pipeline de CI/CD para publicar o site estático no bucket especificado.  
      
DOCUMENTAÇÃO DO BACKSTAGE: [https://backstage.io](https://backstage.io)

## Antes de Usar

### GitHub
É necessário configurar o provedor de autenticação no GitHub, como orientado na documentação: [Documentação Autenticação Backstage](https://backstage.io/docs/getting-started/config/authentication)
Após obter o CLIENT ID e o CLIENT SECRET adicionar no .env (usar o .env.example para criar o seu .env)

Necessário criar o token de integração segundo a [Documentação](https://backstage.io/docs/getting-started/config/authentication/#setting-up-a-github-integration)

### AWS
Criar chaves de acesso ao usuário para obter ACCESS KEY e o SECRET KEY. [Documentação](https://docs.aws.amazon.com/pt_br/keyspaces/latest/devguide/access.credentials.html)

Para o funcionamento correto do aplicativo, é necessário configurar as seguintes permissões no seu serviço AWS:

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": [
				"s3:GetBucketPublicAccessBlock",
				"s3:PutAccountPublicAccessBlock",
				"s3:PutBucketPublicAccessBlock",
				"s3:CreateBucket",
				"s3:ListBucket",
				"s3:GetBucketPolicy",
				"s3express:GetBucketPolicy",
				"s3:PutObject",
				"s3:GetObject",
				"s3:GetAccountPublicAccessBlock",
				"s3express:CreateBucket",
				"s3:PutAccessPointPublicAccessBlock",
				"s3:PutBucketPolicy",
				"s3express:PutBucketPolicy"
			],
			"Resource": "*"
		}
	]
}

```
Por favor, certifique-se de que essas permissões estão corretamente configuradas antes de iniciar o aplicativo.

## Como usar

Após baixar o repositório executar:

    yarn install

Após a instalação das dependências, executar os testes:

    yarn dev

## Templates

 1. AWS S3 Create Static Website
	 Esse plugin, cria o bucket na aws e configura para ser um site estático

![image](https://github.com/FrwkFols/backstage/assets/125265411/e795c12e-5af2-4ff5-b035-c7bf0455123b)

 2. Static GitHub + Github Actions CI/CD
	 Esse plugin cria o repositório no github, recebe o nome do bucket e no final sobre um exemplo de código estático no github, contendo um workflow. Esse workflow no momento que for executado irá criar o bucket na AWS, ajustando todas a politicas dele para ser um site estático e subir os arquivos no bucket

![image](https://github.com/FrwkFols/backstage/assets/125265411/6942ae8e-ee24-40a5-80e3-9a8e54a5a038)

 3. S3 Static Website
	 Esse template irá criar o repositório e o bucket via backstage. Irá criar o workflow que ao ser executado irá subir o html de exemplo

![image](https://github.com/FrwkFols/backstage/assets/125265411/b8957a7c-fedc-4284-8d8f-0a4e4a963ea7)

**Obs.:** é necessário configurar o secrets dentro do repositório com Key e Secret da AWS para poder enviar os arquivos.
