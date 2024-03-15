import { ipcRenderer, contextBridge } from 'electron'
import { handleContextMenuCommand } from './renderer/menu'
import { type MenuItemOptionWithParentLabel, type INativeContextMenu } from './all/NativeContextMenu'

const obj: INativeContextMenu = {
  show: (menuOptions: MenuItemOptionWithParentLabel[]) => {
    ipcRenderer.send('native-context-menu', menuOptions)
  },
}

contextBridge.exposeInMainWorld('NativeContextMenu', obj)

ipcRenderer.on('context-menu-command', (e, parentLabel: string | undefined, command: string) => {
  handleContextMenuCommand(parentLabel, command).catch(console.error)
})
