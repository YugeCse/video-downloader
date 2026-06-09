import { sendToContentScript } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import { MSG_GET_ASSET_URL } from "~constanst/global-constants"
import type { AssetUrlInfo } from "~types/globals"

console.log(`后台进程运行中...`)

const storage = new Storage()

/** 保存的链接信息 */
const saveUrls: Array<AssetUrlInfo> = []

/** 是否有一样的URL */
const isContains = (tabId: number | null, url: string | null): boolean =>
  saveUrls.indexOf({ sourceTabId: tabId, url: url }) != -1

/** 请求的链接筛选器 */
const webRequestFilter = { urls: ["<all_urls>"] }

/** 请求详情的处理器方法 */
const webHandler = (details: chrome.webRequest.WebRequestBodyDetails) => {
  let reqUrl = details.url
  let reqTabId = details.tabId
  const filterExts = ["mp4", "m3u8"]
  const regex = new RegExp(`\\.(${filterExts.join("|")})(\\?.*)?$`, "i")
  if (regex.test(reqUrl) && !isContains(reqTabId, reqUrl)) {
    saveUrls.push({ url: reqUrl, sourceTabId: reqTabId })
  }
  storage.set("asset_urls", saveUrls)
  sendToContentScript({ name: MSG_GET_ASSET_URL, body: saveUrls })
}

chrome.webRequest.onBeforeRequest.addListener(webHandler, webRequestFilter)

export {}
