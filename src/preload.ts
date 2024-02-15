import { ipcRenderer, contextBridge } from 'electron'
import { type MenuItemOptionInRenderer } from './NativeContextMenu'

contextBridge.exposeInMainWorld('NativeContextMenu',
  {
    show: (template: MenuItemOptionInRenderer[]) => {
      console.log(template)
      ipcRenderer.send('native-context-menu', template)
    }
  })

async function handleContextMenuCommand (parentLabel: string | undefined, command: string): Promise<void> {
  let menu = document.querySelector('div.q-context-menu')
  if (menu == null) return
  if (parentLabel != null) {
    const item = Array.from(menu.children).find((item) => item.querySelector<HTMLElement>('.q-context-menu-item__text')?.innerText === parentLabel)
    if (item instanceof HTMLElement) {
      await (item as any).__VUE__?.[0]?.proxy?.showMenu()
    }
    menu = item?.querySelector<HTMLElement>('.q-context-sub-menu__container') ?? null
  }
  if (menu == null) return
  const item = Array.from(menu.children).find((item) => item.querySelector<HTMLElement>('.q-context-menu-item__text')?.innerText === command)
  console.log(item)
  if (item instanceof HTMLElement) {
    item.click()
  }
}

ipcRenderer.on('context-menu-command', (e, parentLabel: string | undefined, command: string) => {
  handleContextMenuCommand(parentLabel, command).catch(console.error)
})
