/**
 * @Author: Rodrigo Soares <rodrigo>
 * @Date:   2017-11-17T20:46:17-08:00
 * @Project: Rename It
 * @Last modified time: 2017-12-02T21:22:22-08:00
 */
import WebUI from "sketch-module-web-view"
import rename from "./Rename"
import { findReplace, matchString } from "./FindReplace"
import {
  addRenameHistory,
  addFindHistory,
  addReplaceHistory,
  getHistory,
  clearHistory,
} from "./History"
import { exclamations } from "./Constants"

function hexToNSColor(hex) {
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  const a = 1
  return NSColor.colorWithRed_green_blue_alpha(r, g, b, a)
}

function showUpdatedMessage(count, data) {
  const layerStr = count === 1 ? "Layer" : "Layers"
  data.doc.showMessage(
    `${exclamations[Math.floor(Math.random() * exclamations.length)]} ${count} ${layerStr} renamed.`
  )
}

export default function theUI(context, data, options) {
  const webUI = new WebUI(context, require(`../../resources/webview.html`), {
    identifier: options.indentifier, // to reuse the UI
    x: 0,
    y: 0,
    title: options.title,
    width: options.width,
    height: options.height,
    blurredBackground: false,
    background: hexToNSColor("f7f7f7"),
    onlyShowCloseButton: true,
    hideTitleBar: false,
    shouldKeepAround: true,
    /* eslint-disable */
    frameLoadDelegate: {
      "webView:didCommitLoadForFrame:": function(webView, webFrame) {
        // Redirect
        webUI.eval(`window.redirectTo="${options.redirectTo}"`)

        // the data
        const history = getHistory()
        webUI.eval(`window.data=${JSON.stringify(data)}`)
        webUI.eval(`window.dataHistory=${JSON.stringify(history)}`)
      },
    },
    /* eslint-enable */
    handlers: {
      close: () => {
        webUI.close()
      },
      onClickRename: (o) => {
        const inputData = JSON.parse(o)
        data.selection.forEach((item) => {
          const opts = {
            layerName: item.name,
            currIdx: item.idx,
            width: item.width,
            height: item.height,
            selectionCount: data.selectionCount,
            inputName: inputData.str,
            startsFrom: Number(inputData.startsFrom),
            pageName: data.pageName,
            parentName: item.parentName,
          }
          const layer = data.selection[opts.currIdx].layer
          layer.name = rename(opts)
        })
        addRenameHistory(inputData.str)
        webUI.close()
        showUpdatedMessage(data.selectionCount, data)
        WebUI.clean()
      },
      onClickFindReplace: (o) => {
        const inputData = JSON.parse(o)
        const selData = inputData.searchScope === "page" ? data.allLayers : data.selection
        let totalRenamed = 0
        selData.forEach((item) => {
          const opts = {
            layerName: item.name,
            currIdx: item.idx,
            findText: inputData.findText,
            replaceWith: inputData.replaceText,
            caseSensitive: Boolean(inputData.caseSensitive),
          }
          if (matchString(opts)) {
            const layer = selData[opts.currIdx].layer
            layer.name = findReplace(opts)
            totalRenamed += 1
          }
        })
        addFindHistory(inputData.findText)
        addReplaceHistory(inputData.replaceText)
        webUI.close()
        showUpdatedMessage(totalRenamed, data)
        WebUI.clean()
      },
      onClearHistory: () => {
        clearHistory()
        webUI.close()
        WebUI.clean()
      },
    },
  })

  // Title bar matches background
  webUI.panel.titlebarAppearsTransparent = true
  webUI.panel.titleVisibility = false
}
