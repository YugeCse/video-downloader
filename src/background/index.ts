import { sendToContentScript } from "@plasmohq/messaging"

import { MSG_GET_ASSET_URL } from "~constanst/global-constants"
import type { AssetUrlInfo } from "~globals"

console.log(`后台进程运行中...`)

/** 保存的链接信息 */
const saveUrls: Array<AssetUrlInfo> = []

/** 是否有一样的URL */
const isContains = (tabId?: number, url?: string): boolean =>
  saveUrls.indexOf({ sourceTabId: tabId, url: url }) != -1

/** 请求的链接筛选器 */
const webRequestFilter = { urls: ["<all_urls>"] }

/** 请求详情的处理器方法 */
const webHandler = (details: chrome.webRequest.WebResponseDetails) => {
  let reqUrl = details.url
  let reqTabId = details.tabId
  const filterExts = ["mp4", "m3u8"]
  const regex = new RegExp(`\\.(${filterExts.join("|")})(\\?.*)?$`, "i")
  if (regex.test(reqUrl) && !isContains(reqTabId, reqUrl)) {
    saveUrls.push({ url: reqUrl, sourceTabId: reqTabId })
  }
  sendToContentScript({ name: MSG_GET_ASSET_URL, body: saveUrls })
}

chrome.webRequest.onCompleted.addListener(webHandler, webRequestFilter)

export {}
