import { ipcRenderer, contextBridge } from 'electron'
import { createMenuTemplate, handleContextMenuCommand } from './preload/menu'
import { type INativeContextMenu } from './all/NativeContextMenu'

const obj: INativeContextMenu = {
  show: () => {
    createMenuTemplate()
      .then((template) => { ipcRenderer.send('native-context-menu', template) })
      .catch(console.error)
  },
}

contextBridge.exposeInMainWorld('NativeContextMenu', obj)

ipcRenderer.on('context-menu-command', (e, parentLabel: string | undefined, command: string) => {
  handleContextMenuCommand(parentLabel, command).catch(console.error)
})
