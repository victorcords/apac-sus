![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat&logo=javascript&logoColor=F7DF1E)
![HTML](https://img.shields.io/badge/HTML-e34c26?style=flat&logo=html5&logoColor=white)

# GERADOR APAC-SUS

Um protótipo de uma aplicação web para preenchimento automatizado e geração de PDFs de Autorizações de Procedimentos Ambulatoriais.

## Recursos
Para facilitar o preenchimento do documento, foram implementados alguns recursos:
- Pesquisa de procedimentos (com base nas tabelas do SIGTAP)
- Pesquisa de doenças (com base no CID-10)
- Seletor de datas
- Busca de CNS
- Possibilidade de adição de até 6 procedimentos
- Modo escuro

> [!TIP]
> A pesquisa de doenças também pode ser feita por código CID. 

## Como utilizar
Preencha corretamente os dados do PACIENTE. Preferencialmente, utilize caixa-alta (caps lock) para preencher os dados. Após o preenchimento, verifique se os **dados estão corretos**, principalmente o CNS (*iniciando pelo número 7*) e o telefone de contato (*que deve ser preenchido sem o dígito obrigatório 9*). 

Após o preenchimento, basta selecionar a opção "Gerar PDF". Verifique novamente os dados no PDF gerado e imprima o documento. 

> [!IMPORTANT]  
> Os dados preenchidos **NÃO** são armazenados.
