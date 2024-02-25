import { BrowserWindow, ipcMain, Menu } from 'electron'
import type { MenuItemOptionWithParentLabel } from './NativeContextMenu'

// 创建窗口时触发
module.exports.onBrowserWindowCreated = (window: BrowserWindow) => {

}

function addClickEvent (templates: MenuItemOptionWithParentLabel[]): void {
  for (const template of templates) {
    if (template.submenu != null) {
      addClickEvent(template.submenu)
    }
    template.click = () => {
      BrowserWindow.getFocusedWindow()?.webContents.send('context-menu-command', template.parentLabel, template.label)
    }
  }
}

console.log('[Native Context Menu]: Registering IPC event listener...')
ipcMain.on('native-context-menu', (e, templates: MenuItemOptionWithParentLabel[]) => {
  console.log('[Native Context Menu]: Received IPC event, showing context menu...')
  console.log(templates)
  if (templates.length === 0) return
  addClickEvent(templates)
  const menu = Menu.buildFromTemplate(templates)
  menu.addListener('menu-will-close', () => { document.body.click() })
  menu.popup()
})
