/* eslint-disable @typescript-eslint/no-var-requires */
const mdContainer = require('markdown-it-container')

module.exports = md => {
  md.use(mdContainer, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s*(.*)$/)
    },
    render(tokens, idx) {
      const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/) // df: :::demo 巴拉巴拉描述
      if (tokens[idx].nesting === 1) { // df: 从起开头标记
        const description = m && m.length > 1 ? m[1] : ''
        const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : ''
        return `<demo-block>
        ${description ? `<div>${md.render(description)}</div>` : ''}
        <!--element-demo: ${content}:element-demo-->
        `
      }
      return '</demo-block>' // df: 结尾
    },
  })

  md.use(mdContainer, 'tip')
  md.use(mdContainer, 'warning')
}
