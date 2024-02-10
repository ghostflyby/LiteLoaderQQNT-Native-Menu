// 运行在 Electron 渲染进程 下的页面脚本
window.addEventListener("contextmenu", (e) => {
    NativeContextMenu.show()
    LiteLoader.config
}, {
    passive: false
})
