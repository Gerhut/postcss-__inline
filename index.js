const postcss = require('postcss')
const parseValue = require('postcss-value-parser')
const Datauri = require('datauri')
const { dirname, resolve } = require('path')

module.exports = postcss.plugin('__inline', () => (root, result) => {
  const cssDirname = dirname(root.source.input.file)
  root.walkDecls(decl => {
    const value = parseValue(decl.value)
    let processed = false
    value.walk(node => {
      if (node.type === 'function' && node.value === 'url') {
        if (node.nodes.length === 1) {
          const url = node.nodes[0]
          if (url.type === 'word' || url.type === 'string') {
            const urlValue = url.value
            const match = urlValue.match(/^(.+)\?__inline$/)
            if (match) {
              const file = resolve(cssDirname, match[1])
              url.value = new Datauri(file).content
              processed = true
            }
          }
        }
      }
    })
    if (processed) decl.value = value.toString()
  })
})
