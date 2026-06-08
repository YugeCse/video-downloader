import "@plasmohq/messaging"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.Handler = async (_, resp) => {
  var tabs = await chrome.tabs.query({ active: true, currentWindow: true })
  resp.send({ activeTabs: tabs }) //发送数据内容
}

export default handler
