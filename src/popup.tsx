import { useEffect, useState } from "react"

import "~style.css"

import { Storage, type StorageWatchCallback } from "@plasmohq/storage"

import type { AssetUrlInfo } from "~types/globals"
import { getFileIcon } from "~utils/file_ext"
import {
  getBasename,
  getBasenameWithoutExt,
  getExtName
} from "~utils/uri-utils"

const storage = new Storage()

function IndexPopup() {
  const [assetUrls, setAssetUrls] = useState<AssetUrlInfo[]>([])
  useEffect(() => {
    storage.get<AssetUrlInfo[]>("ASSET_URLS").then((v) => {
      if (v != undefined) setAssetUrls(v)
    })
    const storageCallback: Record<string, StorageWatchCallback> = {
      asset_urls: (change, _) => {
        setAssetUrls(change.newValue ?? [])
      }
    }
    storage.watch(storageCallback)
    return () => {
      storage.unwatch(storageCallback)
    }
  })
  return (
    <div className="plasmo-flex plasmo-flex-col plasmo-items-center plasmo-justify-start plasmo-w-80 plasmo-h-30 plasmo-overflow-hidden">
      <ul className="plasmo-w-full plasmo-flex-1 plasmo-flex plasmo-flex-col plasmo-overflow-x-hidden plasmo-overflow-y-auto">
        {assetUrls.map((item, index) => (
          <li
            key={index}
            data-url={item.url}
            title={getBasename(item.url)}
            className="plasmo-flex plasmo-flex-row plasmo-items-center plasmo-px-3 plasmo-py-2 plasmo-border-b plasmo-border-b-gray-200 hover:plasmo-cursor-pointer hover:plasmo-bg-gray-100">
            <img
              className="plasmo-size-5 plasmo-mr-2"
              src={getFileIcon(getExtName(item.url))}
            />
            <span className="plasmo-flex-1 plasmo-text-black plasmo-overflow-hidden plasmo-text-wrap plasmo-text-ellipsis plasmo-line-clamp-2 plasmo-text-[14px]">
              {getBasenameWithoutExt(item.url)}
            </span>
            <button className="plasmo-border plasmo-rounded-lg plasmo-px-3 plasmo-py-1 hover:plasmo-bg-gray-200 plasmo-text-black active:plasmo-bg-gray-400">
              下载
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IndexPopup
