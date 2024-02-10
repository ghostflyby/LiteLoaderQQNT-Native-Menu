import { BrowserWindow, ipcMain, Menu } from 'electron'
import { MenuItemOptionWithParentLabel } from './preload'

// 创建窗口时触发
module.exports.onBrowserWindowCreated = (window: BrowserWindow) => {
    window.showAllTabs()

}

console.log("[Native Context Menu]: Registering IPC event listener...")
ipcMain.on('native-context-menu', (e, templates: MenuItemOptionWithParentLabel[]) => {

    console.log("[Native Context Menu]: Received IPC event, showing context menu...")
    console.log(templates)
    Menu.buildFromTemplate(templates).popup()
})