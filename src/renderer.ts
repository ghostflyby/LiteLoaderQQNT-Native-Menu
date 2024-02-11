// 运行在 Electron 渲染进程 下的页面脚本
window.addEventListener("contextmenu", (e) => {
    setTimeout(NativeContextMenu.show, 20)
}, {
    passive: false
})
