/*
 * @Author: diaochan
 * @Date: 2025-07-20 18:27:25
 * @LastEditors: rueen
 * @LastEditTime: 2025-07-20 18:32:51
 * @Description: 
 */
const openAd = (router, item) => {
  const content = item.content || {};
  switch(content.linkType) {
    case 'article':
      router.push(`/article/${content.articleId}`)
      break;
    case 'task':
      router.push(`/tasks/detail/${content.taskId}`)
      break;
    case 'taskGroup':
      router.push(`/taskGroups/detail/${content.taskGroupId}`)
      break;
    default:
  }
}

export default openAd