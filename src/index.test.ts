/**
 * Testes do módulo `br-cid10-csv`
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
 */

import 'dotenv/config';
import test from 'ava';

import {
  cid10ChaptersStream,
  cid10GroupsStream,
  cid10CategoriesStream,
  cid10SubcategoriesStream,
  cidOGroupsStream,
  cidOCategoriesStream
} from '.';

const { CID10_PATH } = process.env;

test('requirements', (test) => {
  test.truthy(CID10_PATH, 'required environment variable CID10_PATH');
});

test('cid10ChaptersStream', async (test) => {
  const path = `${CID10_PATH}/CID-10-CAPITULOS.CSV`;
  const stream = cid10ChaptersStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.true(Number.isInteger(record.number));
    test.regex(record.roman!, /^[IVXLCDM]+$/);
    test.regex(record.catFirst, /^[A-Z]\d+$/);
    test.regex(record.catLast, /^[A-Z]\d+$/);
    test.notRegex(record.description, /^Capítulo\s+[IVXLCDM]+\s*-\s*/);
    test.notRegex(record.abbreviation, /^[IVXLCDM]+\.\s*/);
  }
});

test('cid10GroupsStream', async (test) => {
  const path = `${CID10_PATH}/CID-10-GRUPOS.CSV`;
  const stream = cid10GroupsStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.regex(record.catFirst, /^[A-Z]\d+$/);
    test.regex(record.catLast, /^[A-Z]\d+$/);
    test.truthy(record.description);
    test.truthy(record.abbreviation);
  }
});

test('cid10CategoriesStream', async (test) => {
  const path = `${CID10_PATH}/CID-10-CATEGORIAS.CSV`;
  const stream = cid10CategoriesStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.regex(record.code, /^[A-Z]\d+$/);
    record.classif && test.regex(record.classif, /^[+*]$/);
    test.truthy(record.description);
    test.truthy(record.abbreviation);
    record.refer && test.is(typeof record.refer, 'string');
    test.true(Array.isArray(record.excluded));
  }
});

test('cid10SubcategoriesStream', async (test) => {
  const path = `${CID10_PATH}/CID-10-SUBCATEGORIAS.CSV`;
  const stream = cid10SubcategoriesStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.regex(record.code, /^[A-Z]\d+$/);
    record.classif && test.regex(record.classif, /^[+*]$/);
    record.restrBySex && test.regex(record.restrBySex, /^[FM]$/);
    record.canCauseDeath && test.regex(record.canCauseDeath, /^N$/);
    test.truthy(record.description);
    test.truthy(record.abbreviation);
    record.refer && test.is(typeof record.refer, 'string');
    test.true(Array.isArray(record.excluded));
  }
});

test('cidOGroupsStream', async (test) => {
  const path = `${CID10_PATH}/CID-O-GRUPOS.CSV`;
  const stream = cidOGroupsStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.regex(record.catFirst, /^[A-Z]\d+$/);
    test.regex(record.catLast, /^[A-Z]\d+$/);
    test.truthy(record.description);
    record.refer && test.is(typeof record.refer, 'string');
  }
});

test('cidOCategoriesStream', async (test) => {
  const path = `${CID10_PATH}/CID-O-CATEGORIAS.CSV`;
  const stream = cidOCategoriesStream(path);

  test.truthy(stream);

  for await (const record of stream) {
    test.truthy(record);
    test.regex(record.code, /^[A-Z]\d+\/\d$/);
    test.truthy(record.description);
    record.refer && test.is(typeof record.refer, 'string');
  }
});
