import icFileM3u8 from "data-base64:../../assets/ic_file_m3u8.svg"
import icFileMp4 from "data-base64:../../assets/ic_file_mp4.svg"

const FileExts = {
  mp4: icFileMp4,
  m3u8: icFileM3u8
}

const getFileIcon = (ext: string) => {
  if (ext.toLowerCase() === "mp4") {
    return FileExts.mp4
  } else if (ext.toLowerCase() === "m3u8") {
    return FileExts.m3u8
  }
  return null
}

export { FileExts, getFileIcon }
