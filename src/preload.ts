import { ipcRenderer, contextBridge } from 'electron';

export interface MenuItemOptionWithParentLabel extends Electron.MenuItemConstructorOptions {
	parentLabel: string[],
	submenu?: MenuItemOptionWithParentLabel[],
}


async function createMenuItemTemplate(menuItem: Element, parentLabel: string[] = []): Promise<MenuItemOptionWithParentLabel | null> {
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
	return menuItem.querySelector<HTMLElement>(".q-context-menu-item__text")?.innerText ?? null
}

async function createSubMenuTemplate(menuItem: Element, parentLabel: string[] = []): Promise<MenuItemOptionWithParentLabel | null> {
	menuItem.dispatchEvent(new MouseEvent("mouseenter"))
	await new Promise((resolve) => setTimeout(resolve, 300))
	let text = getLabelText(menuItem)
	if (text === null) return null
	let submenu = menuItem.querySelector<HTMLElement>(".q-context-sub-menu__container")
	if (submenu != null) {
		return {
			label: text,
			submenu: await createMenuTemplate(submenu.children, [...parentLabel, text]),
			type: "submenu",
			parentLabel: parentLabel
		}
	}
	return null
}


async function createMenuTemplate(menu: HTMLCollection | undefined = undefined, parentLabel: string[] = []): Promise<MenuItemOptionWithParentLabel[]> {
	menu = menu ?? document.querySelector("div.q-context-menu")?.children
	if (menu == null) return []
	let re = Array.from(menu)
		.map((menuItem: Element) => createMenuItemTemplate(menuItem, parentLabel))
	return (await Promise.all(re)).filter((item) => item !== null) as MenuItemOptionWithParentLabel[]
}

contextBridge.exposeInMainWorld("NativeContextMenu",
	{
		show: () => {
			createMenuTemplate().then((templates) => {
				console.log(templates)
				ipcRenderer.send('native-context-menu', templates)
			})
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