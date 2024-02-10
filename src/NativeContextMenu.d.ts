
interface NativeContextMenu {
	show: () => void
}

export global {
	declare var NativeContextMenu: NativeContextMenu
}

