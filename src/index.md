Utilitários para leitura dos {@link
http://www2.datasus.gov.br/cid10/V2008/downloads/CID10CSV.zip |
arquivos CSV } da versão brasileira da {@link
http://www2.datasus.gov.br/cid10/V2008/cid10.htm | CID-10}, fornecida pelo
{@link https://datasus.saude.gov.br/ | DATASUS}.

Implementação em TypeScript voltada para Node.js, não contém os arquivos da
CID-10, que devem ser obtidos pelo utilizador separadamente.

Essa biblioteca pretende ser minimalista na sua utilização e não depende de
outros pacotes do NPM.

## Utilização

Esse módulo pode ser obtido via NPM:

```bash
npm i br-cid10-csv
```

Lista de funções úteis:

- {@link cid10ChaptersStream | `cid10ChaptersStream`}

  Para ler o arquivo `CID-10-CAPITULOS.CSV`, que contém a descrição dos
  capítulos da CID-10;

- {@link cid10GroupsStream | `cid10GroupsStream`}

  Para ler o arquivo `CID-10-GRUPOS.CSV`, que contém a descrição dos grupos de
  categorias da CID-10;

- {@link cid10CategoriesStream | `cid10CategoriesStream`}

  Para ler o arquivo `CID-10-CATEGORIAS.CSV`, que contém a descrição das
  categorias (códigos a três caracteres) da CID-10;

- {@link cid10SubcategoriesStream | `cid10SubcategoriesStream`}
  
  Para ler o arquivo `CID-10-SUBCATEGORIAS.CSV`, que contém a descrição das
  subcategorias (códigos a quatro caracteres), assim como as categorias que não
  tem subcategorias, da CID-10; os códigos existentes neste arquivos são os que
  podem ser utilizados para codificação de causas, diagnósticos etc.;

- {@link cidOGroupsStream | `cidOGroupsStream`}
  
  Para ler o arquivo `CID-O-GRUPOS.CSV`, que contém a descrição dos grupos de
  categorias da morfologia de neoplasias (CID-O); e

- {@link cidOCategoriesStream | `cidOCategoriesStream`}

  Para ler o arquivo `CID-O-CATEGORIAS.CSV`, que contém a descrição das
  categorais da morfologia de neoplasias (CID-O).

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
