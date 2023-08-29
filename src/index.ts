/**
 * Conteúdo do módulo `br-cid10-csv`
 * 
 * ## Licença
 * 
 * Este arquivo é parte do programa BR-CID10-CSV.js
 * 
 * BR-CID10-CSV.js é um software livre; você pode redistribuí-lo e/ou
 * modificá-lo dentro dos termos da Licença Pública Geral Menor GNU como
 * publicada pela Free Software Foundation (FSF); na versão 3 da
 * Licença, ou (a seu critério) qualquer versão posterior.
 * 
 * Este programa é distribuído na esperança de que possa ser útil,
 * mas SEM NENHUMA GARANTIA; sem uma garantia implícita de ADEQUAÇÃO
 * a qualquer MERCADO ou APLICAÇÃO EM PARTICULAR. Veja a
 * Licença Pública Geral Menor GNU para maiores detalhes.
 * 
 * Você deve ter recebido uma cópia da Licença Pública Geral Menor GNU junto
 * com este programa, Se não, veja <http://www.gnu.org/licenses/lgpl-3.0.html>.
 *
 * @module br-cid10-csv
 */

import { createReadStream } from 'node:fs';

/**
 * Leitor genérico para linha das tabelas CSV da CID-10
 *
 * @see {@link cidTableStream | `cidTableStream`} &mdash; para ler um arquivo
 *      de tabela CSV da CID-10
 *
 * @example Obtendo valores em texto puro das colunas da linha
 *
 * ```ts
 * import { CidRecord } from 'br-cid10-csv';
 * const row = 'column a;column b;column c';
 * new CidRecord(row).$columns; // ['column a', 'column b', 'column c']
 * ```
 */
export class CidRecord {
  /**
   * Sequência de colunas em texto puro
   */
  $columns: string[];

  /**
   * Construtor padrão para leitura de linha das tabelas CSV da CID-10
   *
   * Realiza a separação inicial das colunas delimitadas por ponto e vírgula e
   * armazena a sequência em {@link $columns | `$columns`} como texto puro.
   *
   * @param row Linha com colunas delimitadas por ponto e vírgula
   */
  constructor(row: string) {
    this.$columns = row.split(';');
  }
}

// Configurando a propriedade `CidRecord.prototype.$columns` de forma a evitar
// que esta seja enumerada como atributo de objeto

Object.defineProperties(CidRecord.prototype, {
  $columns: { enumerable: false, writable: true }
});

/**
 * Capítulo da CID-10
 *
 * Tem como base as especificações de colunas do arquivo `CID-10-CAPITULOS.CSV`,
 * que contém a descrição dos capítulos da CID-10.
 *
 * @see {@link cid10ChaptersStream | `cid10ChaptersStream`} &mdash; para ler o
 *      arquivo `CID-10-CAPITULOS.CSV` da CID-10
 *
 * @example Obtendo os dados do capítulo da CID-10
 *
 * ```ts
 * import { Cid10Chapter } from 'br-cid10-csv';
 * 
 * const row = '1;A00;B99;Capítulo I - Descrição;I.   Abreviação';
 * const record = new Cid10Chapter(row);
 *
 * record.number;       // 1
 * record.roman;        // 'I'
 * record.catFirst;     // 'A00'
 * record.catLast;      // 'B99'
 * record.description;  // 'Descrição'
 * record.abbreviation; // 'Abreviação'
 * ```
 */
export class Cid10Chapter extends CidRecord {
  /**
   * Índice da coluna: "NUMCAP"
   */
  static readonly NUMBER = 0;

  /**
   * Índice da coluna: "CATINIC"
   */
  static readonly CAT_FIRST = 1;

  /**
   * Índice da coluna: "CATFIM"
   */
  static readonly CAT_LAST = 2;

  /**
   * Índice da coluna: "DESCRICAO"
   */
  static readonly DESCRIPTION = 3;

  /**
   * Índice da coluna: "DESCRABREV"
   */
  static readonly ABBREVIATION = 4;

  /**
   * Obtém o número do capítulo da sequência de valores
   * {@link $columns | `$columns`}
   * 
   * Numeração arábica; se igual a zero, indica o capítulo que contém os códigos
   * não oficialmente pertinentes à CID-10.
   */
  get number() {
    return parseInt(this.$columns[Cid10Chapter.NUMBER]);
  }

  /**
   * Extrai o número do capítulo em algarismo romano da sequência de valores
   * {@link $columns | `$columns`}
   * 
   * Este valor não possui coluna específica e é extraído a partir do prefixo
   * da coluna "DESCRABREV", podendo ser `undefined`.
   */
  get roman() {
    return this.$columns[Cid10Chapter.ABBREVIATION]
      .match(/^([IVXLCDM]+)\.\s*/)?.[1];
  }

  /**
   * Obtém o código da primeira categoria do capítulo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catFirst() {
    return this.$columns[Cid10Chapter.CAT_FIRST];
  }

  /**
   * Obtém o código da última categoria do capítulo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catLast() {
    return this.$columns[Cid10Chapter.CAT_LAST];
  }

  /**
   * Obtém a descrição (nome) do capítulo, sem prefixo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[Cid10Chapter.DESCRIPTION]
      .replace(/^Capítulo\s+[IVXLCDM]+\s*-\s*/, '');
  }

  /**
   * Obtém a descrição (nome) abreviado do capítulo, com até 50 caracteres, sem
   * prefixo, a partir da sequência de valores {@link $columns | `$columns`}
   */
  get abbreviation() {
    return this.$columns[Cid10Chapter.ABBREVIATION]
      .replace(/^[IVXLCDM]+\.\s*/, '');
  }
}

// Configurando as funções get de `Cid10Chapter` de forma fazer com que sejam
// enumeradas como atributo de objeto

Object.defineProperties(Cid10Chapter.prototype, {
  number: { enumerable: true },
  roman: { enumerable: true },
  catFirst: { enumerable: true },
  catLast: { enumerable: true },
  description: { enumerable: true },
  abbreviation: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-10-CAPITULOS.CSV` da
 * CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link Cid10Chapter | `Cid10Chapter`} para obtenção de dados a medida em que
 * obtém linhas completas da tabela CSV.
 *
 * @example Percorrendo as categorias do arquivo `CID-10-CAPITULOS.CSV` da
 * CID-10
 *
 * ```ts
 * import { cid10ChaptersStream } from 'br-cid10-csv';
 *
 * const stream = cid10ChaptersStream('./CID-10-CAPITULOS.CSV');
 * for await (const record of stream) {
 *   const {
 *     number,
 *     roman,
 *     catFirst,
 *     catLast,
 *     description,
 *     abbreviation
 *   } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-10-CAPITULOS.CSV`
 * @param highWaterMark Tamanho máximo por ciclo de leitura
 * @returns Gerador assíncrono de objetos {@link Cid10Chapter | `Cid10Chapter`}
 */
export function cid10ChaptersStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, Cid10Chapter, highWaterMark);
}

/**
 * Grupo da CID-10
 * 
 * Tem como base as especificações das colunas do arquivo `CID-10-GRUPOS.CSV`,
 * que contém a descrição dos grupos de categorias da CID-10
 *
 * @see {@link cid10GroupsStream | `cid10GroupsStream`} &mdash; para ler o
 *      arquivo `CID-10-GRUPOS.CSV` da CID-10
 *
 * @example Obtendo os dados do grupo da CID-10
 * 
 * ```ts
 * import { Cid10Group } from 'br-cid10-csv';
 *
 * const row = 'A00;A09;Descrição;Abreviação';
 * const record = new Cid10Group(row);
 *
 * record.catFirst;     // 'A00'
 * record.catLast;      // 'A09'
 * record.description;  // 'Descrição'
 * record.abbreviation; // 'Abreviação'
 * ```
 */
export class Cid10Group extends CidRecord {
  /**
   * Índice da coluna "CATINIC"
   */
  static readonly CAT_FIRST = 0;

  /**
   * Índice da coluna "CATFIM"
   */
  static readonly CAT_LAST = 1;

  /**
   * Índice da coluna "DESCRICAO"
   */
  static readonly DESCRIPTION = 2;

  /**
   * Índice da coluna "DESCRABREV"
   */
  static readonly ABBREVIATION = 3;

  /**
   * Obtém o código da primeira categoria do grupo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catFirst() {
    return this.$columns[Cid10Group.CAT_FIRST];
  }

  /**
   * Obtém o código da última categoria do grupo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catLast() {
    return this.$columns[Cid10Group.CAT_LAST];
  }

  /**
   * Obtém a descrição (nome) do grupo, a partir da sequência de valores
   * {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[Cid10Group.DESCRIPTION];
  }

  /**
   * Obtém a descrição (nome) abreviado do grupo, com até 50 caracteres, a
   * partir da sequência de valores {@link $columns | `$columns`}
   */
  get abbreviation() {
    return this.$columns[Cid10Group.ABBREVIATION];
  }
}

// Configurando as funções get de `Cid10Group` de forma fazer com que sejam
// enumeradas como atributo de objeto

Object.defineProperties(Cid10Group.prototype, {
  catFirst: { enumerable: true },
  catLast: { enumerable: true },
  description: { enumerable: true },
  abbreviation: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-10-GRUPOS.CSV` da
 * CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link Cid10Group | `Cid10Group`} para obtenção de dados a medida em que
 * obtém linhas completas da tabela CSV.
 *
 * @example Percorrendo as categorias do arquivo `CID-10-GRUPOS.CSV` da
 * CID-10
 *
 * ```ts
 * import { cid10GroupsStream } from 'br-cid10-csv';
 *
 * const stream = cid10GroupsStream('./CID-10-GRUPOS.CSV');
 * for await (const record of stream) {
 *   const { catFirst, catLast, description, abbreviation } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-10-GRUPOS.CSV`
 * @param highWaterMark Tamanho máximo por ciclo de leitura
 * @returns Gerador assíncrono de objetos {@link Cid10Group | `Cid10Group`}
 */
export function cid10GroupsStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, Cid10Group, highWaterMark);
}

/**
 * Gategoria da CID-10
 *
 * Tem com base as especificações das colunas do arquivo
 * `CID-10-CATEGORIAS.CSV`, que contém a descrição das categorias (códigos a
 * três caracteres) da CID-10
 *
 * @see {@link cid10CategoriesStream | `cid10CategoriesStream`} &mdash; para ler
 *      o arquivo `CID-10-CATEGORIAS.CSV` da CID-10
 *
 * @example Obtendo os dados da categoria da CID-10
 *
 * ```ts
 * import { Cid10Category } from 'br-cid10-csv';
 *
 * const row = 'Z00;+;Descrição;Z00   Abreviação;A00.0*;B00.0+,C00.0,D00.-';
 * const record = new Cid10Category(row);
 *
 * record.code;         // 'Z00'
 * record.classif;      // '+'
 * record.description;  // 'Descrição'
 * record.abbreviation; // 'Abreviação'
 * record.refer;        // 'A00.0*'
 * record.excluded;     // ['B00.0+', 'C00.0', 'D00.-']
 * ```
 */
export class Cid10Category extends CidRecord {
  /**
   * Índice da coluna "CAT"
   */
  static readonly CODE = 0;

  /**
   * Índice da coluna "CLASSIF"
   */
  static readonly CLASSIF = 1;

  /**
   * Índice da coluna "DESCRICAO"
   */
  static readonly DESCRIPTION = 2;

  /**
   * Índice da coluna "DESCRABREV"
   */
  static readonly ABBREVIATION = 3;
  
  /**
   * Índice da coluna "REFER"
   */
  static readonly REFER = 4;

  /**
   * Índice da coluna "EXCLUIDOS"
   */
  static readonly EXCLUDED = 5;

  /**
   * Obtém o código da categoria da sequência de valores
   * {@link $columns | `$columns`}
   */
  get code() {
    return this.$columns[Cid10Category.CODE];
  }

  /**
   * Obtém a indicação se a situação da categoria em relação à classificação
   * cruz/asterisco da sequência de valores {@link $columns | `$columns`}:
   * 
   * - `undefined`: não tem dupla classificação;
   * - `'+'`: classificação por etiologia; e
   * - `'*'`: classificação por manifestação.
   */
  get classif() {
    return this.$columns[Cid10Category.CLASSIF] || undefined;
  }

  /**
   * Obtém a descrição (nome) da categoria da sequência de valores
   * {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[Cid10Category.DESCRIPTION];
  }

  /**
   * Obtém a descrição (nome) abreviado da categoria, com até 50 caracteres,
   * a partir da sequência de valores {@link $columns | `$columns`}
   */
  get abbreviation() {
    return this.$columns[Cid10Category.ABBREVIATION].replace(/^[A-Z]\d+\s+/, '');
  }

  /**
   * Obtém, quando a categoria tiver dupla classificação, o código da categoria
   * segundo a outra classificação, a partir da sequência de valores
   * {@link $columns | `$columns`}
   *
   * Nem todos os casos de dupla classificação contém este campo.
   */
  get refer() {
    return this.$columns[Cid10Category.REFER] || undefined;
  }

  /**
   * Obtém lista com o(s) código(s) de categorias excluídas que agora fazem
   * parte desta categoria, a partir da sequência de valores
   * {@link $columns | `$columns`}
   */
  get excluded() {
    return (
      this.$columns[Cid10Category.EXCLUDED] || undefined
    )?.split(',') || [];
  }
}

// Configurando as funções get de `Cid10Category` de forma fazer com que sejam
// enumeradas como atributo de objeto

Object.defineProperties(Cid10Category.prototype, {
  code: { enumerable: true },
  classif: { enumerable: true },
  description: { enumerable: true },
  abbreviation: { enumerable: true },
  refer: { enumerable: true },
  excluded: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-10-CATEGORIAS.CSV` da
 * CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link Cid10Category | `Cid10Category`} para obtenção de dados a medida em
 * que obtém linhas completas da tabela CSV.
 *
 * @example Percorrendo as categorias do arquivo `CID-10-CATEGORIAS.CSV` da
 * CID-10
 *
 * ```ts
 * import { cid10CategoriesStream } from 'br-cid10-csv';
 *
 * const stream = cid10CategoriesStream('./CID-10-CATEGORIAS.CSV');
 * for await (const record of stream) {
 *   const {
 *     code,
 *     classif,
 *     description,
 *     abbreviation,
 *     refer,
 *     excluded
 *   } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-10-CATEGORIAS.CSV`
 * @param highWaterMark Tamanho máximo por ciclo de leitura
 * @returns Gerador assíncrono objetos {@link Cid10Category | `Cid10Category`}
 */
export function cid10CategoriesStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, Cid10Category, highWaterMark);
}

/**
 * Subcategoria da CID-10
 *
 * Tem como base as especificações de colunas do arquivo
 * `CID-10-SUBCATEGORIAS.CSV` que contém a descrição das subcategorias (códigos
 * a quatro caracteres), assim como as categorias que não tem subcategorias, da
 * CID-10; os códigos existentes neste arquivos são os que podem ser utilizados
 * para codificação de causas, diagnósticos etc.
 *
 * @see {@link cid10SubcategoriesStream | `cid10SubcategoriesStream`} &mdash;
 *      para ler o arquivo `CID-10-SUBCATEGORIAS.CSV` da CID-10
 *
 * @example Obtendo os dados da subcategoria da CID-10
 *
 * ```ts
 * import { Cid10Subcategory } from 'br-cid10-csv';
 *
 * const row = 'B000;+;M;N;Descrição;B00.0 Abreviação;N00.0*;B00.0+,C00.0,D00.-';
 * const record = new Cid10Subcategory(row);
 *
 * record.code;          // 'B000'
 * record.classif;       // '+'
 * record.restrBySex;    // 'M'
 * record.canCauseDeath; // 'N'
 * record.description;   // 'Descrição'
 * record.abbreviation;  // 'Abreviação'
 * record.refer;         // 'N00.0*'
 * record.excluded;      // ['B00.0+', 'C00.0', 'D00.-']
 * ```
 */
export class Cid10Subcategory extends CidRecord {
  /**
   * Índice da coluna "SUBCAT"
   */
  static readonly CODE = 0;

  /**
   * Índice da coluna "CLASSIF"
   */
  static readonly CLASSIF = 1;

  /**
   * Índice da coluna "RESTRSEXO"
   */
  static readonly RESTR_BY_SEX = 2;

  /**
   * Índice da coluna "CAUSAOBITO"
   */
  static readonly CAN_CAUSE_DEATH = 3;

  /**
   * Índice da coluna "DESCRICAO"
   */
  static readonly DESCRIPTION = 4;

  /**
   * Índice da coluna "DESCRABREV"
   */
  static readonly ABBREVIATION = 5;

  /**
   * Índice da coluna "REFER"
   */
  static readonly REFER = 6;

  /**
   * Índice da coluna "EXCLUIDOS"
   */
  static readonly EXCLUDED = 7;

  /**
   * Obtém o código da subcategoria (sem incluir ponto) a partir da sequência de
   * valores {@link $columns | `$columns`}
   *
   * Para categorias sem subcategorias, o quarto caractere está em branco.
   */
  get code() {
    return this.$columns[Cid10Subcategory.CODE];
  }

  /**
   * Obtém indicação se a situação da subcategoria em relação à classificação
   * cruz/asterisco, a partir da sequência de valores
   * {@link $columns | `$columns`}:
   *
   * - `undefined`: não tem dupla classificação;
   * - `'+'`: classificação por etiologia; e
   * - `'*'`: classificação por manifestação.
   */
  get classif() {
    return this.$columns[Cid10Subcategory.CLASSIF] || undefined;
  }

  /**
   * Obtém indicação se a subcategoria só pode ser usada para homens ou
   * mulheres, a partir da sequência de valores {@link $columns | `$columns`}:
   *
   * - `undefined`: pode ser utilizada em qualquer situação;
   * - `'F'`: só deve ser utilizada para o sexo feminino; e
   * - `'M'`: só deve ser utilizada para o sexo masculino.
   */
  get restrBySex() {
    return this.$columns[Cid10Subcategory.RESTR_BY_SEX] || undefined;
  }

  /**
   * Obtém indicação se a subcategoria pode causar óbito, a partir da sequência
   * de valores {@link $columns | `$columns`}:
   *
   * - `undefined`: não há restrição; e
   * - `'N'`: a subcategoria tem pouca probabilidade de causar óbito.
   *
   * Além disto, deve-se atentar para o fato de que as subcategorias da
   * classificação asterisco não devem ser utilizadas na classificação de causas
   * de óbitos, assim como as subcategorias do capítulo XIX e do capítulo XXI.
   */
  get canCauseDeath() {
    return this.$columns[Cid10Subcategory.CAN_CAUSE_DEATH] || undefined;
  }

  /**
   * Obtém a descrição (nome) da subcategoria da sequência de valores
   * {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[Cid10Subcategory.DESCRIPTION];
  }

  /**
   * Obtém a descrição (nome) abreviado da subcategoria, com até 50 caracteres,
   * a partir da sequência de valores {@link $columns | `$columns`}
   */
  get abbreviation() {
    return this.$columns[Cid10Subcategory.ABBREVIATION]
      .replace(/^[A-Z]\d+(\.\d+)?\s+/, '');
  }

  /**
   * Obtém, quando a subcategoria tiver dupla classificação, o código da
   * subcategoria segundo a outra classificação, a partir da sequência de
   * valores {@link $columns | `$columns`}
   * 
   * Nem todos os casos de dupla classificação contém este campo.
   */
  get refer() {
    return this.$columns[Cid10Subcategory.REFER] || undefined;
  }

  /**
   * Obtém uma lista com o(s) código(s) de subcategorias excluídas que agora
   * fazem parte desta subcategoria, a partid da sequência de valores
   * {@link $columns | `$columns`}
   */
  get excluded() {
    return (
      this.$columns[Cid10Subcategory.EXCLUDED] || undefined
    )?.split(',') || [];
  }
}

// Configurando as funções get de `Cid10Subcategory` de forma fazer com que
// sejam enumeradas como atributo de objeto

Object.defineProperties(Cid10Subcategory.prototype, {
  code: { enumerable: true },
  classif: { enumerable: true },
  restrBySex: { enumerable: true },
  canCauseDeath: { enumerable: true },
  description: { enumerable: true },
  abbreviation: { enumerable: true },
  refer: { enumerable: true },
  excluded: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-10-SUBCATEGORIAS.CSV`
 * da CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link Cid10Subcategory | `Cid10Subcategory`} para obtenção de dados a medida
 * em que obtém linhas completas da tabela CSV.
 *
 * @example Percorrendo as subcategorias do arquivo `CID-10-SUBCATEGORIAS.CSV`
 * da CID-10
 *
 * ```ts
 * import { cid10SubcategoriesStream } from 'br-cid10-csv';
 *
 * const stream = cid10SubcategoriesStream('./CID-10-SUBCATEGORIAS.CSV');
 * for await (const record of stream) {
 *   const {
 *     code,
 *     classif,
 *     restrBySex,
 *     canCauseDeath,
 *     description,
 *     abbreviation,
 *     refer,
 *     excluded
 *   } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-10-SUBCATEGORIAS.CSV`
 * @param highWaterMark Tamanho máximo por ciclo de leitura
 * @returns Gerador assíncrono de objetos
 *          {@link Cid10Subcategory | `Cid10Subcategory`}
 */
export function cid10SubcategoriesStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, Cid10Subcategory, highWaterMark);
}

/**
 * Grupo da CID-O
 *
 * Tem como base as especificações das colunas do arquivo `CID-O-GRUPOS.CSV`,
 * que contém a descrição dos grupos de categorias da morfologia de neoplasias
 * (CID-O).
 *
 * @see {@link cidOGroupsStream | `cidOGroupsStream`} &mdash; para ler o arquivo
 *      `CID-O-GRUPOS.CSV` da CID-10
 *
 * @example Obtendo os dados do grupo
 *
 * ```ts
 * import { CidOGroup } from 'br-cid10-csv';
 *
 * const row = 'M000;M000;Descrição;C00.-';
 * const record = new CidOGroup(row);
 *
 * record.catFirst;    // 'M000'
 * record.catLast;     // 'M000'
 * record.description; // 'Descrição'
 * record.refer;       // 'C00.-'
 * ```
 */
export class CidOGroup extends CidRecord {
  /**
   * Índice da coluna "CATINIC"
   */
  static readonly CAT_FIRST = 0;

  /**
   * Índice da coluna "CATFIM"
   */
  static readonly CAT_LAST = 1;

  /**
   * Índice da coluna "DESCRICAO"
   */
  static readonly DESCRIPTION = 2;

  /**
   * Índice da coluna "REFER"
   */
  static readonly REFER = 3;

  /**
   * Obtém o código da primeira categoria do grupo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catFirst() {
    return this.$columns[CidOGroup.CAT_FIRST];
  }

  /**
   * Obtém o código da última categoria do grupo, a partir da sequência de
   * valores {@link $columns | `$columns`}
   */
  get catLast() {
    return this.$columns[CidOGroup.CAT_LAST];
  }

  /**
   * Obtém a descrição (nome) do grupo, a partir da sequência de valores
   * {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[CidOGroup.DESCRIPTION];
  }

  /**
   * Obtém a referência do grupo na classificação do capítulo II da CID-10
   * (Neoplasias), a partir da sequência de valores
   * {@link $columns | `$columns`}, podendo ser `undefined`
   */
  get refer() {
    return this.$columns[CidOGroup.REFER] || undefined;
  }
}

// Configurando as funções get de `CidOGroup` de forma fazer com que sejam
// enumeradas como atributo de objeto

Object.defineProperties(CidOGroup.prototype, {
  catFirst: { enumerable: true },
  catLast: { enumerable: true },
  description: { enumerable: true },
  refer: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-O-GRUPOS.CSV` da
 * CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link CidOGroup | `CidOGroup`} para obtenção de dados a medida em que obtém
 * linhas completas da tabela CSV.
 *
 * @example Percorrendo os grupos do arquivo `CID-O-GRUPOS.CSV` da CID-10
 *
 * ```ts
 * import { cidOGroupsStream } from 'br-cid10-csv';
 *
 * const stream = cidOGroupsStream('./CID-O-GRUPOS.CSV');
 * for await (const record of stream) {
 *   const { catFirst, catLast, description, refer } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-O-GRUPOS.CSV` da CID-10
 * @param highWaterMark Tamanho máximo por leitura
 * @returns Gerador assíncrono de objetos {@link CidOGroup | `CidOGroup`}
 */
export function cidOGroupsStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, CidOGroup, highWaterMark);
}

/**
 * Categoria da CID-O
 *
 * Tem como base as especificações das colunas do arquivo
 * `CID-O-CATEGORIAS.CSV`, que contém a descrição das categorais da morfologia
 * de neoplasias (CID-O).
 *
 * @see {@link cidOCategoriesStream | `cidOCategoriesStream`} &mdash; para ler o
 *      arquivo `CID-O-CATEGORIAS.CSV` da CID-10
 *
 * @example Obtendo os dados da categoria da CID-O
 *
 * ```ts
 * import { CidOCategory } from 'br-cid10-csv';
 *
 * const row = 'M0000/0;Descrição;C00.-';
 * const record = new CidOCategory(row);
 *
 * record.code;        // 'M0000/0'
 * record.description; // 'Descrição'
 * record.refer;       // 'C00.-'
 * ```
 */
export class CidOCategory extends CidRecord {
  /**
   * Índice da coluna "CAT"
   */
  static readonly CODE = 0;

  /**
   * Índice da coluna "DESCRICAO"
   */
  static readonly DESCRIPTION = 1;

  /**
   * Índice da coluna "REFER"
   */
  static readonly REFER = 2;

  /**
   * Obtém o código da categoria da sequência de valores
   * {@link $columns | `$columns`}
   */
  get code() {
    return this.$columns[CidOCategory.CODE];
  }

  /**
   * Obtém a descrição (nome) da categoria da sequência de valores
   * {@link $columns | `$columns`}
   */
  get description() {
    return this.$columns[CidOCategory.DESCRIPTION];
  }

  /**
   * Obtém a referência da categoria na classificação do capítulo II da CID-10
   * (Neoplasias), a partir da sequência de valores
   * {@link $columns | `$columns`}
   */
  get refer() {
    return this.$columns[CidOCategory.REFER] || undefined;
  }
}

// Configurando as funções get de `CidOCategory` de forma fazer com que sejam
// enumeradas como atributo de objeto

Object.defineProperties(CidOCategory.prototype, {
  code: { enumerable: true },
  description: { enumerable: true },
  refer: { enumerable: true }
});

/**
 * Função geradora assíncrona para leitura do arquivo `CID-O-CATEGORIAS.CSV` da
 * CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * {@link CidOCategory | `CidOCategory`} para obtenção de dados a medida em que
 * obtém linhas completas da tabela CSV.
 *
 * @example Percorrendo as categorias do arquivo `CID-O-CATEGORIAS.CSV` da
 * CID-10
 *
 * ```ts
 * import { cidOCategoriesStream } from 'br-cid10-csv';
 *
 * const stream = cidOCategoriesStream('./CID-O-CATEGORIAS.CSV');
 * for await (const record of stream) {
 *   const { code, description, refer } = record;
 * }
 * ```
 *
 * @param path Caminho do arquivo `CID-O-CATEGORIAS.CSV` da CID-10
 * @param highWaterMark Tamanho máximo por leitura
 * @returns Gerador assíncrono de objetos {@link CidOCategory | `CidOCategory`}
 */
export function cidOCategoriesStream(path: string, highWaterMark?: number) {
  return cidTableStream(path, CidOCategory, highWaterMark);
}

/**
 * Função geradora assíncrona genérica para leitura de arquivos de tabelas CSV
 * da CID-10
 *
 * Realiza a leitura do arquivo em pacotes (stream) e fabrica objetos
 * específicos para obtenção de dados a medida em que obtém linhas completas da
 * tabela CSV.
 *
 * @example Percorrendo as linhas de um arquivo de tabela CSV da CID-10
 *
 * ```ts
 * import { cidTableStream } from 'br-cid10-csv';
 *
 * const stream = cidTableStream('./CID-N-TABELA.CSV');
 * for await (const record of stream) {
 *   record.$columns; // ['column a', 'column b', ...]
 * }
 * ```
 *
 * @param path Arquivo de tabela CSV a ser lido
 * @param Factory Classe para fabricar objetos a partir das linhas da tabela
 * @param highWaterMark Tamanho máximo por leitura
 * @returns Gerador assíncrono de objetos {@link cidTableStream:(0) | `Factory`}
 *          (parâmetro opcional) por linha ou {@link CidRecord | `CidRecord`}
 *          se não for especificado
 */
export async function* cidTableStream<T extends new (row: string) => any>(
  path: string, Factory = CidRecord as T, highWaterMark?: number)
{
  // Constantes

  const encoding = 'latin1'; // Padrão ISO-8859-1 para codificação de caracteres
  const LINEBRK = ';\r\n';   // Sequência de caracteres para fim de linha
  const SKIPERR = Symbol();  // Símbolo auxiliar usado como erro para ser
                             // ignorado

  // Estado de leitura

  let
    streamError: any,         // Erro do stream
    streamEnd = false,        // Sinalização de fim do stream
    buffer = '',              // Buffer de linha incompleta
    rowsQueue: string[] = [], // Fila de pacotes com linhas completas
    breakLoop = false;        // Sinalização para interromper loop de envio

  // Função de leitura do stream

  const read = (chunk: string) => {
    // Concatena bloco lido no buffer

    buffer += chunk;

    // Verifica se há última ocorrência de sequência de fim de linha no buffer

    const end = buffer.lastIndexOf(LINEBRK);
    if (end >= 0) {
      // Extrai as linhas completas do buffer e atualiza seu estado

      let completeRows = buffer.slice(0, end);
      buffer = buffer.slice(end + LINEBRK.length);

      // Enfileira pacote de linhas completas obtido no passo anterior

      rowsQueue.push(completeRows);
    }
  }

  // Cria stream de leitura do arquivo

  const stream = createReadStream(path, { encoding, highWaterMark })
    .on('data', read)
    .on('end', () => { streamEnd = true })
    .on('error', (err) => { streamError = err });

  // Tipo auxiliar de função para construção de promessa para recebimento
  // assíncrono de filas de pacotes com linhas completas

  type NextRowsQueue = ConstructorParameters<typeof Promise<string[]>>[0];

  // Função para construção de promessa para recebimento assíncrono de filas de
  // pacotes com linhas completas

  const nextRowsQueue: NextRowsQueue = (resolve, reject) => {
    // Verifica primeiramente se há erro do stream para poder rejeitar a
    // promessa

    if (streamError) {
      reject(streamError);
    }

    // Se não houver erro do stream, verifica se há pacotes com linhas completas
    // na fila para poder atualizar o estado de leitura e resolver a promessa

    else if (rowsQueue.length > 0) {
      const queue = rowsQueue;
      rowsQueue = [];
      breakLoop = buffer.length === 0 && streamEnd;
      resolve(queue);
    }

    // Se não houver erro do stream e não houver pacotes na fila, verifica se o
    // stream não alcançou o fim para poder agendar nova execução recursiva da
    // função 

    else if (!streamEnd) {
      setImmediate(() => nextRowsQueue(resolve, reject));
    }
  
    // Senão, será preciso rejeitar a promessa com um erro simbólico para ser
    // ignorado, evitando uma possível resolução inválida no fim

    else {
      reject(SKIPERR);
    }
  }

  // Tratamento de erro do loop de geração de registros, que ignora o símbolo
  // `SKIPERR`, evitando um possível bloqueio por promessa vazia no fim

  try {
    // Estado de geração de registros

    let
      completeRows: string, // Pacote atual de linhas completas
      row: string,          // Linha atual
      skip = true;          // Sinalização para ignorar a primeira linha

    // Loop de geração de registros

    while (!breakLoop && !streamError) {
      // Percorre os pacotes de linhas completas da próxima fila assíncrona

      for (completeRows of await new Promise(nextRowsQueue)) {
        // Divide e percorre as linhas do pacote de linhas completas

        for (row of completeRows.split(LINEBRK)) {
          // Gera novo registro ou ignora a primeira linha, atualizando o
          // estado de geração de registros

          if (!skip) {
            yield new Factory(row) as InstanceType<T>;
          } else {
            skip = false;
          }
        }
      }
    }
  } catch (loopError) {
    // Verifica se o erro do loop não deve ser ignorado

    if (loopError !== SKIPERR) {
      throw loopError;
    }
  }

  // Verifica há erro de stream que não foi lançado previamente

  if (streamError) {
    throw streamError;
  }
}
