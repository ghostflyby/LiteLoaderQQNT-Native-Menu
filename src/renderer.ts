// 运行在 Electron 渲染进程 下的页面脚本

import { type MenuItemOptionInRenderer } from './NativeContextMenu'

async function createMenuItemTemplate (menuItem: Element, parentLabel: string | undefined): Promise<MenuItemOptionInRenderer | null> {
  const text = getLabelText(menuItem)
  const checked = ((menuItem as any)?.__VUE__?.[0]?.props?.icon === 'tick')
  switch (menuItem.role) {
    case 'separator':
      return { type: 'separator', parentLabel }
    case 'menuitem':
      if (text === null) return null
      return {
        label: text,
        type: checked ? 'checkbox' : 'normal',
        enabled: !menuItem.hasAttribute('disabled'),
        parentLabel,
        checked: checked ? true : undefined
      }
    case 'sub-menu':
      return await createSubMenuTemplate(menuItem)
  }
  return null
}

function getLabelText (menuItem: Element): string | null {
  return menuItem.querySelector<HTMLElement>('.q-context-menu-item__text')?.innerText ?? null
}

async function createSubMenuTemplate (menuItem: Element): Promise<MenuItemOptionInRenderer | null> {
  const text = getLabelText(menuItem)
  await new Promise((resolve) => setTimeout(resolve, 2))
  await (menuItem as any)?.__VUE__?.[0]?.proxy?.showMenu()
  if (text === null) return null
  const submenu = menuItem.querySelector<HTMLElement>('.q-context-sub-menu__container')
  if (submenu != null) {
    return {
      label: text,
      submenu: await createMenuTemplate(submenu.children, text),
      type: 'submenu'
    }
  }
  return null
}

async function createMenuTemplate (menu: HTMLCollection | undefined = undefined, parentLabel: string | undefined = undefined): Promise<MenuItemOptionInRenderer[]> {
  await new Promise((resolve) => setTimeout(resolve, 2))
  menu = menu ?? document.querySelector('.q-context-menu__mixed-type')?.children
  if (menu == null) return []
  const re = Array.from(menu)
    .map(async (menuItem: Element) => await createMenuItemTemplate(menuItem, parentLabel))
  return (await Promise.all(re)).filter((item) => item !== null) as MenuItemOptionInRenderer[]
}

const observer = new MutationObserver(() => {
  createMenuTemplate().then((template) => { NativeContextMenu.show(template) }).catch(console.error)
})

observer.observe(document.body, {
  childList: true
})

const style = document.createElement('style')
style.textContent = `
  .q-context-menu__mixed-type {
    display: none !important;
  }`
document.head.appendChild(style)
