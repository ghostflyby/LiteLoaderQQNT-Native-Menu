// 运行在 Electron 渲染进程 下的页面脚本

import { MenuItemOptionInRenderer, NativeContextMenu } from "./NativeContextMenu"

async function createMenuItemTemplate(menuItem: Element, parentLabel: string | undefined): Promise<MenuItemOptionInRenderer | null> {
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
            return await createSubMenuTemplate(menuItem)
    }
    return null;
}

function getLabelText(menuItem: Element): string | null {
    return menuItem.querySelector<HTMLElement>(".q-context-menu-item__text")?.innerText ?? null
}

async function createSubMenuTemplate(menuItem: Element): Promise<MenuItemOptionInRenderer | null> {
    let text = getLabelText(menuItem);
    await (menuItem as any).__VUE__?.[0]?.proxy?.showMenu()
    if (text === null) return null
    let submenu = menuItem.querySelector<HTMLElement>(".q-context-sub-menu__container")
    if (submenu != null) {
        return {
            label: text,
            submenu: await createMenuTemplate(submenu.children, text),
            type: "submenu",
        }
    }
    return null
}


async function createMenuTemplate(menu: HTMLCollection | undefined = undefined, parentLabel: string | undefined = undefined): Promise<MenuItemOptionInRenderer[]> {
    menu = menu ?? document.querySelector("div.q-context-menu")?.children
    if (menu == null) return []
    let re = Array.from(menu)
        .map((menuItem: Element) => createMenuItemTemplate(menuItem, parentLabel))
    return (await Promise.all(re)).filter((item) => item !== null) as MenuItemOptionInRenderer[]
}

const observer = new MutationObserver(() => {
    createMenuTemplate().then((template) =>
        NativeContextMenu.show(template))
})

observer.observe(document.body, {
    childList: true,
})