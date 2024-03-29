// 运行在 Electron 渲染进程 下的页面脚本

import { createMenuTemplate } from './renderer/menu'

const observer = new MutationObserver(
  () => {
    createMenuTemplate()
      .then(NativeContextMenu.show)
      .catch(console.error)
  },
)

observer.observe(document.body, {
  childList: true,
})

const style = document.createElement('style')
style.textContent = `
  .q-context-menu__mixed-type {
    display: none !important;
  }`
document.head.appendChild(style)
