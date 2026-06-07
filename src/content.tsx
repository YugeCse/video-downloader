import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { MSG_GET_ASSET_URL } from "~constanst/global-constants"
import type { AssetUrlInfo, GetActiveTabsMessageInfo } from "~globals"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  run_at: "document_idle" as const
}

/**
 * Generates a style element with adjusted CSS to work correctly within a Shadow DOM.
 *
 * Tailwind CSS relies on `rem` units, which are based on the root font size (typically defined on the <html>
 * or <body> element). However, in a Shadow DOM (as used by Plasmo), there is no native root element, so the
 * rem values would reference the actual page's root font size—often leading to sizing inconsistencies.
 *
 * To address this, we:
 * 1. Replace the `:root` selector with `:host(plasmo-csui)` to properly scope the styles within the Shadow DOM.
 * 2. Convert all `rem` units to pixel values using a fixed base font size, ensuring consistent styling
 *    regardless of the host page's font size.
 */
export const getStyle = (): HTMLStyleElement => {
  const baseFontSize = 16

  let updatedCssText = cssText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixelsValue = parseFloat(remValue) * baseFontSize

    return `${pixelsValue}px`
  })

  const styleElement = document.createElement("style")

  styleElement.textContent = updatedCssText

  return styleElement
}

const PlasmoOverlay = () => {
  const [activeTabId, setActiveTabId] = useState<number | null>(null)
  const [targetUrls, setTargetUrls] = useState<Array<AssetUrlInfo>>([])
  const getActiveTabInformation = async () => {
    let resp = (await sendToBackground({
      name: "active-tab"
    })) as GetActiveTabsMessageInfo
    let activeTabs = resp.activeTabs
    if (activeTabs == null || activeTabs.length == 0) {
      return //没有获取到当前激活的Tab信息，直接返回
    }
    setTargetUrls([]) //清空数据源
    setActiveTabId(activeTabs[0].id) //设计当前的 TabId
  }
  const getAssetUrlsInformation = () => {
    chrome.runtime.onMessage.addListener((msg, _, __) => {
      if (msg.name == MSG_GET_ASSET_URL) {
        let targetUrls = msg.body as Array<AssetUrlInfo>
        if (targetUrls == null || targetUrls.length == 0) {
          return //没有获取到数据URL，直接返回
        }
        setTargetUrls(
          targetUrls.filter((item) => item.sourceTabId == activeTabId)
        ) //设置获取到的数据源
      }
    })
  }
  useEffect(() => {
    getActiveTabInformation() //获取当前激活的Tab的相关信息
    getAssetUrlsInformation() //筛选当前Tab中的资源路径URL
  })
  return (
    <div className="plasmo-w-[300px] plasmo-z-50 plasmo-flex plasmo-flex-row plasmo-items-center plasmo-fixed plasmo-top-32 plasmo-right-0 plasmo-bg-black plasmo-overflow-hidden plasmo-rounded-xl">
      <div className="plasmo-w-1 plasmo-h-10 plasmo-bg-blue-400 plasmo-rounded-xl plasmo-mx-1"></div>
      <ul className="plasmo-flex-1 plasmo-flex plasmo-flex-col plasmo-w-[300px] plasmo-h-60 plasmo-overflow-x-hidden plasmo-overflow-y-auto">
        {targetUrls.map((item, index) => (
          <li
            key={index}
            className="plasmo-text-wrap plasmo-text-white plasmo-px-3 plasmo-py-3 plasmo-border-b plasmo-border-white">
            {item.url}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PlasmoOverlay
