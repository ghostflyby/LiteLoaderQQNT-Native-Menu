interface INativeContextMenu {
  show: (template: MenuItemOptionInRenderer[]) => void
}
declare global {
  const NativeContextMenu: INativeContextMenu
}

export interface MenuItemOptionWithParentLabel extends Electron.MenuItemConstructorOptions {
  parentLabel?: string
  submenu?: MenuItemOptionWithParentLabel[]
}

export interface MenuItemOptionInRenderer extends MenuItemOptionWithParentLabel {
  click?: undefined
}
