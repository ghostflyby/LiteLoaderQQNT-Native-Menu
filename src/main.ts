import { BrowserWindow, ipcMain, Menu } from 'electron'
import { MenuItemOptionWithParentLabel } from './preload'

// 创建窗口时触发
module.exports.onBrowserWindowCreated = (window: BrowserWindow) => {
    window.showAllTabs()

}

function addClickEvent(templates: MenuItemOptionWithParentLabel[]) {
    for (let template of templates) {
        if (template.submenu) {
            addClickEvent(template.submenu)
        }
        template.click = () => {
            BrowserWindow.getFocusedWindow()?.webContents.send('context-menu-command', template.parentLabel, template.label)
        }
    }
}

console.log("[Native Context Menu]: Registering IPC event listener...")
ipcMain.on('native-context-menu', (e, templates: MenuItemOptionWithParentLabel[]) => {

    console.log("[Native Context Menu]: Received IPC event, showing context menu...")
    console.log(templates)
    addClickEvent(templates)
    const menu = Menu.buildFromTemplate(templates)
    menu.addListener('menu-will-close', () => document.body.click())
    menu.popup()
})