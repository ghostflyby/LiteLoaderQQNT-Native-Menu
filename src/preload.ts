import { ipcRenderer, contextBridge } from 'electron'
import { createMenuTemplate, handleContextMenuCommand } from './preload/menu'

contextBridge.exposeInMainWorld('NativeContextMenu',
  {
    show: () => {
      createMenuTemplate()
        .then((template) => { ipcRenderer.send('native-context-menu', template) })
        .catch(console.error)
    },
  })

ipcRenderer.on('context-menu-command', (e, parentLabel: string | undefined, command: string) => {
  handleContextMenuCommand(parentLabel, command).catch(console.error)
})
