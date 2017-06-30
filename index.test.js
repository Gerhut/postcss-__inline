/* eslint-env jest */

const { readFile } = require('mz/fs')
const postcss = require('postcss')
const __inline = require('.')

it('should inline binary files', () => Promise.all([
  readFile('fixtures/binary/style.css', 'utf8').then(
    code => postcss([__inline]).process(code, {
      from: 'fixtures/binary/style.css'
    })
  ),
  readFile('fixtures/binary/expect.css', 'utf8')
]).then(([result, expectCss]) => {
  expect(result.css).toBe(expectCss)
}))

it('file not exists', () => {
  readFile('fixtures/not-exists/style.css', 'utf8').then(
    code => postcss([__inline]).process(code, {
      from: 'fixtures/not-exists/style.css'
    }))
    .catch((e) => {})
})

it('not standard', () => Promise.all([
  readFile('fixtures/not-standard/style.css', 'utf8').then(
    code => postcss([__inline]).process(code, {
      from: 'fixtures/not-standard/style.css'
    })
  ),
  readFile('fixtures/not-standard/expect.css', 'utf8')
]).then(([result, expectCss]) => {
  expect(result.css).toBe(expectCss)
}))
