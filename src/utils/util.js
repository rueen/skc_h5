// 转换函数
const convertToHtml = (content) => {
  if (!content || typeof content !== 'string') return ''
  
  return content
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>')
    .replace(/<p><br><\/p>/g, '<p>&nbsp;</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/ /g, '&nbsp;')
}

export {
  convertToHtml
}