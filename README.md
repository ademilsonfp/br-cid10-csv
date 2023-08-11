# BR-CID10-CSV.js

Utilitários para leitura dos [arquivos CSV] da versão brasileira da [CID-10],
fornecida pelo [DATASUS].

Implementação em TypeScript voltada para Node.js, não contém os arquivos da
CID-10, que devem ser obtidos pelo utilizador separadamente.

Essa biblioteca pretende ser minimalista na sua utilização e não depende de
outros pacotes do NPM.

## Utilização

Esse módulo pode ser obtido via NPM:

```bash
npm i br-cid10-csv
```

Para mais informações sobre como utilizar este módulo, consulte a
[referência de API].

## Desenvolvimento

Para executar os testes de desenvolvimento, também será necessário obter e
extrair o pacote de [arquivos CSV] da [CID-10], além de clonar este repositório
e instalar dependências via NPM.

O diretório contendo os arquivos extraídos deve ser informado através da
variável de ambiente `CID10_PATH` e os arquivos contidos devem possuir o nome
original, sem alterações. Um arquivo `.env` pode ser criado na raíz do projeto
para uma configuração conveniente de variáveis de ambiente a serem carregadas
automaticamente pelo teste.

Executando testes:

```bash
npm test
```

O comando acima também produzirá um relatório de páginas HTML sobre a cobertura
dos testes, onde a página principal poderá ser acessada pela localização
`coverage/index.html`.

Gerando a referência de API:

```bash
npm run build:docs
```

## Licença

Este arquivo é parte do programa BR-CID10-CSV.js

BR-CID10-CSV.js é um software livre; você pode redistribuí-lo e/ou
modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
publicada pela Free Software Foundation (FSF); na versão 3 da
Licença, ou (a seu critério) qualquer versão posterior.

Este programa é distribuído na esperança de que possa ser útil,
mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
Licença Pública Geral Menor GNU para maiores detalhes.

Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.

[arquivos CSV]: http://www2.datasus.gov.br/cid10/V2008/downloads/CID10CSV.zip
[CID-10]: http://www2.datasus.gov.br/cid10/V2008/cid10.htm
[DATASUS]: https://datasus.saude.gov.br/
[referência de API]: https://ademilsonfp.github.io/br-cid10-csv-docs
