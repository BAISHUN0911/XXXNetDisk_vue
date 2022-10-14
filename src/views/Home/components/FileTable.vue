<template>
  <el-table class="file-table" :data="tableData" height="calc(100vh - 202px)" style="width: 100%" v-loading="loading">
    <!-- 这一列是显示文件类型图标的 -->
    <el-table-column label prop="isDir" width="60" align="center">
      <template slot-scope="scope">
        <img :src="setFileImg(scope.row)" style="width: 30px" />
      </template>
    </el-table-column>

    <el-table-column prop="fileName" label="文件名">
      <template slot-scope="scope">
        <div style="cursor: pointer" @click="handleFileNameClick(scope.row)">
          {{
            scope.row.extendName
              ? `${scope.row.fileName}.${scope.row.extendName}`
              : `${scope.row.fileName}`
          }}
        </div>
      </template>
    </el-table-column>

    <!-- 通过 v-if 来控制 类型 列是否显示 -->
    <el-table-column 
    prop="extendName" 
    label="类型" 
    width="100"
    v-if="selectedColumnList.includes('extendName')"
    >
      <template slot-scope="scope">
        <span>{{scope.row.extendName ? scope.row.extendName : '文件夹'}}</span>
      </template>
    </el-table-column>

    <el-table-column 
    prop="fileSize" 
    label="大小" 
    width="100"
    v-if="selectedColumnList.includes('fileSize')"
    >
      <template slot-scope="scope">
        <span>{{ calculateFileSize(scope.row.fileSize) }}</span>
      </template>
    </el-table-column>

    <el-table-column 
    prop="uploadTime" 
    label="修改日期" 
    width="180"
    v-if="selectedColumnList.includes('uploadTime')"></el-table-column>

    <el-table-column :width="operaColumnIsFold ? 100 : 200">
      <!-- 自定义表格头 -->
      <template slot="header">
        <span>操作</span>
        <i class="el-icon-circle-plus" title="展开" @click="operaColumnIsFold = false"></i>
        <i class="el-icon-remove" title="折叠" @click="operaColumnIsFold = true"></i>
      </template>
      <template slot-scope="scope">
        <!-- 操作列收缩状态下的按钮 通过v-else控制 -->
      <el-dropdown trigger="click" v-if="operaColumnIsFold">
        <!-- 操作列收缩状态下的按钮 -->
        <el-dropdown trigger="click">
          <el-button size="mini">
            操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>

          <el-dropdown-menu slot="dropdown">
            
            <el-dropdown-item @click.native="handleClickDelete(scope.row)"
              >删除</el-dropdown-item>

            <el-dropdown-item @click.native="handleClickMove(scope.row)"
              >移动</el-dropdown-item>

            <el-dropdown-item @click.native="handleClickRename(scope.row)"
              >重命名</el-dropdown-item>

            <el-dropdown-item>
              <a target="_blank" style="display: block; color: inherit">下载</a>
            </el-dropdown-item>

          </el-dropdown-menu>
        </el-dropdown>
      </el-dropdown>
        <!-- 操作列展开状态下的按钮 通过v-if控制 -->
        <div class="opera-unfold" v-else>
        <!-- 操作列展开状态下的按钮 -->
        <div class="opera-unfold">
          <el-button
            type="text"
            size="small"
            @click.native="handleClickDelete(scope.row)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native="handleClickMove(scope.row)"
            >移动
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.native="handleClickRename(scope.row)"
            >重命名
          </el-button>
          <el-button type="text" size="small">
            <a target="_blank" style="display: block; color: inherit">下载</a>
          </el-button>
        </div>
        </div>

       
      </template>  
    </el-table-column>

  </el-table>
</template>

<script>
import { deleteFile } from '@/request/file.js' //  引入接口

export default {
  name: "FileTable",
  props: {
    // 表格数据，同时需要删除原本在 data( return { } ) 中的 tableData，否则会报错
    tableData: {
      type: Array,
      required: true
    },
    // 表格加载状态
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      operaColumnIsFold: sessionStorage.getItem('operaColumnIsFold') || false, //  表格操作列-是否收缩
      //  文件图片Map映射
      fileImgMap: {
        apk: require('@/assets/image/apk.png'),
        csv: require('@/assets/image/csv.png'),
        doc: require('@/assets/image/doc.png'),
        excel: require('@/assets/image/excel.png'),
        exe: require('@/assets/image/exe.png'),
        fold: require('@/assets/image/fold.png'),
        gif: require('@/assets/image/gif.png'),
        html: require('@/assets/image/html.png'),
        json: require('@/assets/image/json.png'),
        mp3: require('@/assets/image/mp3.png'),
        mp4: require('@/assets/image/mp4.png'),
        other: require('@/assets/image/other.png'),
        pdf: require('@/assets/image/pdf.png'),
        ppt: require('@/assets/image/ppt.png'),
        rar: require('@/assets/image/rar.png'),
        svg: require('@/assets/image/svg.png'),
        txt: require('@/assets/image/txt.png'),
        zip: require('@/assets/image/zip.png')
      },

    };
  },
  watch: {
    // 监听收缩状态变化，存储在sessionStorage中，保证页面刷新时仍然保存设置的状态
    operaColumnIsFold(newValue) {
      sessionStorage.setItem('operaColumnIsFold', newValue)
    }
  },
  created() {
    this.operaColumnIsFold = sessionStorage.getItem('operaColumnIsFold') === 'true' //  读取保存的状态
  },
  methods: {
    //计算文件大小
    calculateFileSize(size) {
        const B = 1024
        const KB = Math.pow(1024, 2)
        const MB = Math.pow(1024, 3)
        const GB = Math.pow(1024, 4)
        if (!size) {
            return '_'
        } else if (size < KB) {
            return (size / B).toFixed(0) + 'KB'
        } else if (size < MB) {
            return (size / KB).toFixed(1) + 'MB'
        } else if (size < GB) {
            return (size / MB).toFixed(2) + 'GB'
        } else {
            return (size / GB).toFixed(3) + 'TB'
        }
    },
    //文件名点击事件
    handleFileNameClick(row) {
      //  若是目录则进入目录
      if (row.isDir) {
        this.$router.push({
          query: {
              filePath: `${row.filePath}${row.fileName}/`,
              fileType: 0
          }
        })
      }
    },
    // 删除按钮 - 点击事件
    handleClickDelete(row) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //确定按钮，点击事件，调用文件接口
          deleteFile(row).then((res) => {
            if(res.success){
              this.$emit('getTableData')  //刷新文件列表
              this.$message({type: 'success',message: '删除成功!'})
            }else{
              this.$message.error(res.message)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 移动按钮 - 点击事件
    handleClickMove(row) {
      console.log("移动", row.fileName);
    },
    // 重命名按钮 - 点击事件
    handleClickRename(row) {
      console.log("重命名", row.fileName);
    },
    //根据文件扩展名设置文件图片
    setFileImg(row) {
      if (!row.extendName) {
        //  文件夹
        return this.fileImgMap.fold
      } else if (['jpg', 'png', 'jpeg'].includes(row.extendName)) {
        // 图片类型，直接显示缩略图
        return this.downloadImgMin(row)
      } else {
        const fileTypeMap = {
          pptx: 'ppt',
          doc: 'word',
          docx: 'doc',
          xls: 'excel',
          xlsx: 'excel'
        }
        //  可以识别文件类型的文件
        return this.fileImgMap[row.extendName] || this.fileImgMap[fileTypeMap[row.extendName]] || this.fileImgMap.other
      }
    },

  },
  computed: {
    // 表格显示列
    selectedColumnList() {
      return this.$store.getters.selectedColumnList
    }
  },
};
</script>

<style lang="stylus" scoped>
  // 表格操作列-表头图标样式调整
  .el-icon-circle-plus, .el-icon-remove {
    margin-left: 8px;
    cursor: pointer;
    font-size: 16px;
  
    &:hover {
      opacity: 0.5;
    }
  }


</style>