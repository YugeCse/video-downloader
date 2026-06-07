export interface AssetUrlInfo {
    url: string;
    sourceTabId: number?;
}

export interface GetActiveTabsMessageInfo {
    activeTabs: Array<chrome.tabs.Tab>
}