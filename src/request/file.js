import { get,post } from "./http";

// 左侧菜单选择的为 全部 时，根据路径，获取文件列表
export const getFileListByPath = (p) => get("/file/getfilelist", p);

// 左侧菜单选择的为 除全部以外 的类型时，根据类型，获取文件列表
export const getFileListByType = (p) => get("/file/selectfilebyfiletype", p);

//创建文件夹或者文件
export const createFile = (p) => post("/file/createfile",p);

// 获取存储空间已占用大小
export const getFileStorage = (p) => get("/filetransfer/getstorage", p);

// 获取文件夹列表 树状结构
export const getFileTree = (p) => get('/file/getfiletree', p)

// 单文件操作接口
// 文件删除
export const deleteFile = (p) => post('/file/deletefile', p)

// 文件移动
export const moveFile = (p) => post('/file/movefile', p)

// 文件重命名
export const renameFile = (p) => post('/file/renamefile', p)