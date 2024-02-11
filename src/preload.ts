import { ipcRenderer, contextBridge } from 'electron';

export interface MenuItemOptionWithParentLabel extends Electron.MenuItemConstructorOptions {
	parentLabel: string[],
	submenu?: MenuItemOptionWithParentLabel[],
}


function createMenuItemTemplate(menuItem: Element, index: number, array: Array<Element>, parentLabel: string[] = []): MenuItemOptionWithParentLabel | null {
	switch (menuItem.role) {
		case "separator":
			return { type: "separator", parentLabel: parentLabel }
		case "menuitem":
			let text = getLabelText(menuItem)
			if (text === null) return null
			return {
				label: text,
				type: "normal",
				enabled: menuItem.hasAttribute("disabled") ? false : true,
				parentLabel: parentLabel
			}
		case "sub-menu":
			return createSubMenuTemplate(menuItem)
	}
	return null;
}

function getLabelText(menuItem: Element): string | null {
	let label = menuItem.querySelector<HTMLElement>(".q-context-menu-item__text")
	if (label != null) {
		return label.innerText
	}
	return null
}

function createSubMenuTemplate(menuItem: Element, parentLabel: string[] = []): MenuItemOptionWithParentLabel | null {
	menuItem.dispatchEvent(new MouseEvent("mouseenter"))
	let text = getLabelText(menuItem)
	if (text === null) return null
	let submenu = menuItem.querySelector<HTMLElement>(".q-context-sub-menu__container")
	if (submenu != null) {
		return {
			label: text,
			submenu: createMenuTemplate(submenu.children, [...parentLabel, text]),
			type: "submenu",
			parentLabel: parentLabel
		}
	}
	return null
}


function createMenuTemplate(menu: HTMLCollection | undefined = undefined, parentLabel: string[] = []): MenuItemOptionWithParentLabel[] {
	menu = menu ?? document.querySelector("div.q-context-menu")?.children
	if (menu == null) return []
	let re = Array.from(menu)
		.map((menuItem: Element, index: number, array: Array<Element>) => createMenuItemTemplate(menuItem, index, array, parentLabel))
		.filter((value) => value !== null)
	return re as MenuItemOptionWithParentLabel[]
}

contextBridge.exposeInMainWorld("NativeContextMenu",
	{
		show: () => {
			ipcRenderer.send('native-context-menu', createMenuTemplate())
		},
	})

ipcRenderer.on('context-menu-command', (e, parentLabel: string[], command: string) => {
	let menu = document.querySelector("div.q-context-menu")
	if (!menu) return
	let item = Array.from(menu.children).find((item) => item.querySelector<HTMLElement>(".q-context-menu-item__text")?.innerText === command)
	console.log(item)
	if (item instanceof HTMLElement) {
		item.click()
	}
})