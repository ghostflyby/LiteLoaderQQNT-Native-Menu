import { ipcRenderer, contextBridge } from 'electron';
import { MenuItemOptionInRenderer } from './NativeContextMenu';

contextBridge.exposeInMainWorld("NativeContextMenu",
	{
		show: (template: MenuItemOptionInRenderer[]) => {
			console.log(template)
			ipcRenderer.send('native-context-menu', template)
		},
	})

ipcRenderer.on('context-menu-command', (e, parentLabel: string | undefined, command: string) => {
	let menu = document.querySelector("div.q-context-menu")
	if (!menu) return
	if (parentLabel) {
		let item = Array.from(menu.children).find((item) => item.querySelector<HTMLElement>(".q-context-menu-item__text")?.innerText === parentLabel)
		if (item instanceof HTMLElement) {
			item.dispatchEvent(new MouseEvent("mouseenter"))
		}
		menu = item?.querySelector<HTMLElement>(".q-context-sub-menu__container") ?? null
	}
	if (!menu) return
	let item = Array.from(menu.children).find((item) => item.querySelector<HTMLElement>(".q-context-menu-item__text")?.innerText === command)
	console.log(item)
	if (item instanceof HTMLElement) {
		item.click()
	}
})