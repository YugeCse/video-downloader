interface AssetUrlInfo {
    url: string;
    sourceTabId: number?;
}

interface GetActiveTabsMessageInfo {
    activeTabs: Array<chrome.tabs.Tab>
}

export type { AssetUrlInfo, GetActiveTabsMessageInfo};
