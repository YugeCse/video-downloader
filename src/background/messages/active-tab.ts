import "@plasmohq/messaging"

import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { GetActiveTabsMessageInfo } from "~globals"

const handler: PlasmoMessaging.Handler = async (req, resp) => {
  var tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  var msg: GetActiveTabsMessageInfo = { activeTabs: tabs }
  resp.send(msg) //发送数据内容
}

export default handler
