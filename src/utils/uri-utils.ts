const getBasename = (url: string) => {
  try {
    const uri = new URL(url)
    return decodeURIComponent(uri.pathname.split("/").pop()) || ""
  } catch {
    console.log(`处理 URL 链接错误`)
    return ""
  }
}

const getBasenameWithoutExt = (url: string) => {
  const baseName = getBasename(url)
  return baseName !== "" ? baseName.split(".").at(0) : ""
}

const getExtName = (url: string) => {
  const baseName = getBasename(url)
  return baseName !== "" ? baseName.split(".").pop() : ""
}

export { getBasename, getBasenameWithoutExt, getExtName }
