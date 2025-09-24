<template>
  <div class="page-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">心率记录管理</h2>
      <div class="title-divider"></div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <div class="modal-backdrop" v-if="dialogVisible">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ dialogTitle }}</h3>
          <button class="close-btn" @click="handleClose">×</button>
        </div>
        <div class="modal-body">
          <form class="form" @submit.prevent="dialogOk">
            <div class="form-group">
              <label class="form-label">姓名:</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="currentRecord.name" 
                required
                placeholder="请输入姓名"
                maxlength="20"
              >
            </div>
            <div class="form-group">
              <label class="form-label">身份证号:</label>
              <input 
                type="text" 
                class="form-control" 
                v-model="currentRecord.icn" 
                required
                placeholder="请输入18位身份证号"
                maxlength="18"
                :disabled="dialogTitle === '编辑心率记录'"
              >
            </div>
            <div class="form-group">
              <label class="form-label">心率值:</label>
              <input 
                type="number" 
                class="form-control" 
                v-model.number="currentRecord.hrv" 
                required
                min="30"
                max="200"
                placeholder="请输入心率值（30-200）"
              >
              <span class="form-hint">正常范围：60-100次/分</span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="dialogOk">确定</button>
        </div>
      </div>
    </div>

    <!-- 搜索区域 -->
    <div class="search-panel">
      <div class="search-card">
        <div class="search-row">
          <div class="search-item">
            <label class="search-label">姓名:</label>
            <input 
              type="text" 
              class="search-input" 
              v-model="searchForm.name" 
              placeholder="请输入姓名"
            >
          </div>
          <div class="search-item">
            <label class="search-label">身份证号:</label>
            <input 
              type="text" 
              class="search-input" 
              v-model="searchForm.icn" 
              placeholder="请输入身份证号"
              maxlength="18"
            >
          </div>
          <div class="search-item">
            <label class="search-label">心率范围:</label>
            <div class="range-inputs">
              <input 
                type="number" 
                class="search-input range-start" 
                v-model.number="searchForm.minHrv" 
                placeholder="≥ 最小值"
                min="30"
              >
              <span class="range-separator">-</span>
              <input 
                type="number" 
                class="search-input range-end" 
                v-model.number="searchForm.maxHrv" 
                placeholder="≤ 最大值"
                max="200"
              >
            </div>
          </div>
        </div>

        <div class="search-row">
          <div class="search-item">
            <label class="search-label">记录时间:</label>
            <div class="range-inputs">
              <input 
                type="datetime-local" 
                class="search-input range-start" 
                v-model="searchForm.startTime"
              >
              <span class="range-separator">至</span>
              <input 
                type="datetime-local" 
                class="search-input range-end" 
                v-model="searchForm.endTime"
              >
            </div>
          </div>
          <div class="search-actions">
            <button class="btn btn-primary" @click="handleSearch">查询</button>
            <button class="btn btn-default" @click="resetSearch">重置</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <div class="table-header">
        <div class="table-title">心率记录列表</div>
        <button class="btn btn-primary" @click="handleAdd">+ 新增记录</button>
      </div>
      
      <!-- 加载状态 -->
      <div class="loading" v-if="loading">
        <div class="spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
      
      <!-- 表格内容 -->
      <table class="data-table" v-else>
        <thead>
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>身份证号</th>
            <th>心率值(次/分)</th>
            <th>状态</th>
            <th>记录时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in records" :key="record.id" :class="index % 2 === 0 ? 'even-row' : 'odd-row'">
            <td>{{ (pageNo - 1) * pageSize + index + 1 }}</td>
            <td>{{ record.name }}</td>
            <td>{{ maskIdCard(record.icn) }}</td>
            <td>{{ record.hrv }}</td>
            <td>
              <span class="status-tag" :class="record.hrv >= 60 && record.hrv <= 100 ? 'normal' : 'abnormal'">
                {{ record.hrv >= 60 && record.hrv <= 100 ? '正常' : '异常' }}
              </span>
            </td>
            <td>{{ formatDateTime(record.lastModified) }}</td>
            <td class="action-buttons">
              <button class="btn btn-sm btn-edit" @click="handleEdit(record)">编辑</button>
              <button class="btn btn-sm btn-delete" @click="handleDelete(record)">删除</button>
            </td>
          </tr>
          <tr v-if="records.length === 0">
            <td colspan="7" class="no-data">暂无记录</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页控件 -->
    <div class="pagination">
      <div class="pagination-info">
        共 {{ totalCount }} 条记录，当前第 {{ pageNo }} / {{ totalPages }} 页
      </div>
      <div class="pagination-controls">
        <button 
          class="btn btn-sm" 
          @click="changePage(1)" 
          :disabled="pageNo === 1"
        >
          首页
        </button>
        <button 
          class="btn btn-sm" 
          @click="changePage(pageNo - 1)" 
          :disabled="pageNo === 1"
        >
          上一页
        </button>
        <button 
          class="btn btn-sm" 
          @click="changePage(pageNo + 1)" 
          :disabled="pageNo >= totalPages"
        >
          下一页
        </button>
        <button 
          class="btn btn-sm" 
          @click="changePage(totalPages)" 
          :disabled="pageNo >= totalPages"
        >
          末页
        </button>
        <div class="page-size-selector">
          每页显示:
          <select v-model="pageSize" @change="handlePageSizeChange">
            <option value="5">5条</option>
            <option value="10">10条</option>
            <option value="20">20条</option>
            <option value="50">50条</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HeartRateView',
  data() {
    return {
      // 数据列表
      records: [],
      totalCount: 0,
      pageNo: 1,
      pageSize: 10,
      
      // 搜索条件
      searchForm: {
        name: '',
        icn: '',
        minHrv: '',
        maxHrv: '',
        startTime: '',
        endTime: ''
      },
      
      // 弹窗相关
      dialogVisible: false,
      dialogTitle: '新增心率记录',
      currentRecord: {
        name: '',
        icn: '',
        hrv: 70
      },
      
      // 状态控制
      loading: false
    };
  },
  computed: {
    // 总页数计算
    totalPages() {
      return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
    }
  },
  mounted() {
    // 页面加载时获取数据
    this.handleSearch();
  },
  methods: {
    // 获取数据列表
    handleSearch() {
      this.loading = true;
      
      // 构建查询参数
      const params = {
        ...this.searchForm,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      
      // 处理空值
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });
      
      // 调用API获取数据
      axios.get('/heartrate/find', { params })
        .then(response => {
          if (response.data.code === 0) {
            this.records = response.data.data || [];
            this.totalCount = response.data.totalCount || 0;
          } else {
            alert('获取数据失败: ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('请求失败:', error);
          alert('网络错误，请稍后重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 重置搜索条件
    resetSearch() {
      this.searchForm = {
        name: '',
        icn: '',
        minHrv: '',
        maxHrv: '',
        startTime: '',
        endTime: ''
      };
      this.pageNo = 1;
      this.handleSearch();
    },
    
    // 页码变更
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.pageNo = page;
      this.handleSearch();
    },
    
    // 每页条数变更
    handlePageSizeChange() {
      this.pageNo = 1; // 重置到第一页
      this.handleSearch();
    },
    
    // 新增记录
    handleAdd() {
      this.currentRecord = {
        name: '',
        icn: '',
        hrv: 70
      };
      this.dialogTitle = '新增心率记录';
      this.dialogVisible = true;
    },
    
    // 编辑记录
    handleEdit(record) {
      this.currentRecord = { ...record };
      this.dialogTitle = '编辑心率记录';
      this.dialogVisible = true;
    },
    
    // 关闭弹窗
    handleClose() {
      if (confirm('确定要关闭吗？未保存的内容将丢失')) {
        this.dialogVisible = false;
      }
    },
    
    // 确认弹窗操作
    dialogOk() {
      // 简单验证
      if (!this.currentRecord.name) {
        alert('请输入姓名');
        return;
      }
      
      if (!this.currentRecord.icn || !/^\d{17}[\dXx]$/.test(this.currentRecord.icn)) {
        alert('请输入有效的18位身份证号');
        return;
      }
      
      if (!this.currentRecord.hrv || this.currentRecord.hrv < 30 || this.currentRecord.hrv > 200) {
        alert('请输入有效的心率值（30-200）');
        return;
      }
      
      // 保存数据
      this.loading = true;
      const url = this.dialogTitle === '新增心率记录' ? '/heartrate/add' : '/heartrate/chg';
      
      axios.get(url, { params: this.currentRecord })
        .then(response => {
          if (response.data.code === 0) {
            alert(this.dialogTitle === '新增心率记录' ? '添加成功' : '修改成功');
            this.dialogVisible = false;
            this.handleSearch();
          } else {
            alert((this.dialogTitle === '新增心率记录' ? '添加失败' : '修改失败') + ': ' + (response.data.msg || '未知错误'));
          }
        })
        .catch(error => {
          console.error('保存失败:', error);
          alert('网络错误，请稍后重试');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    
    // 删除记录
    handleDelete(record) {
      if (confirm(`确定要删除${record.name}的心率记录吗？此操作不可恢复`)) {
        this.loading = true;
        axios.get('/heartrate/del', { params: { id: record.id } })
          .then(response => {
            if (response.data.code === 0) {
              alert('删除成功');
              this.handleSearch();
            } else {
              alert('删除失败: ' + (response.data.msg || '未知错误'));
            }
          })
          .catch(error => {
            console.error('删除失败:', error);
            alert('网络错误，请稍后重试');
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    
    // 格式化日期时间
    formatDateTime(dateTime) {
      if (!dateTime) return '';
      // 假设后端返回的是ISO格式时间，如：2023-10-01T12:30:45.123
      return dateTime.split('.')[0].replace('T', ' ');
    },
    
    // 身份证号脱敏（显示前6位和后4位）
    maskIdCard(icn) {
      if (!icn) return '';
      return icn.substr(0, 6) + '********' + icn.substr(14);
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Microsoft YaHei", sans-serif;
  color: #333;
}

/* 页面标题 */
.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.title-divider {
  height: 2px;
  background-color: #e1e4e8;
}

/* 按钮样式 */
.btn {
  padding: 6px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4285f4;
  color: white;
}

.btn-primary:hover {
  background-color: #3367d6;
}

.btn-default {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-default:hover {
  background-color: #e8e8e8;
}

.btn-sm {
  padding: 3px 8px;
  font-size: 12px;
}

.btn-edit {
  background-color: #34a853;
  color: white;
  margin-right: 5px;
}

.btn-edit:hover {
  background-color: #2d8643;
}

.btn-delete {
  background-color: #ea4335;
  color: white;
}

.btn-delete:hover {
  background-color: #d93025;
}

/* 搜索区域 */
.search-panel {
  margin-bottom: 20px;
}

.search-card {
  background-color: white;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.search-row {
  display: flex;
  margin-bottom: 15px;
  align-items: center;
}

.search-item {
  display: flex;
  align-items: center;
  margin-right: 20px;
  flex: 1;
}

.search-label {
  width: 80px;
  text-align: right;
  margin-right: 10px;
  font-weight: 500;
}

.search-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.search-actions {
  display: flex;
  gap: 10px;
  margin-left: 90px;
}

.range-inputs {
  display: flex;
  align-items: center;
  width: 100%;
}

.range-start {
  margin-right: 5px;
}

.range-end {
  margin-left: 5px;
}

.range-separator {
  margin: 0 5px;
  color: #666;
}

/* 表格样式 */
.table-container {
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.table-title {
  font-weight: 600;
  color: #2c3e50;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e1e4e8;
  background-color: white;
}

.data-table th,
.data-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #e1e4e8;
  border-right: 1px solid #e1e4e8;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
}

.data-table th:last-child,
.data-table td:last-child {
  border-right: none;
}

.even-row {
  background-color: #f9f9f9;
}

.odd-row {
  background-color: white;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 5px;
}

.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.normal {
  background-color: #e6f4ea;
  color: #137333;
}

.status-tag.abnormal {
  background-color: #fce8e6;
  color: #c5221f;
}

.no-data {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #e1e4e8;
}

.pagination-info {
  color: #666;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.page-size-selector {
  margin-left: 10px;
  font-size: 14px;
}

.page-size-selector select {
  padding: 2px 5px;
  margin-left: 5px;
}

/* 弹窗样式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  width: 450px;
  border-radius: 6px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.form-label {
  width: 100px;
  text-align: right;
  margin-right: 10px;
  font-weight: 500;
}

.form-control {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #4285f4;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.form-hint {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #e1e4e8;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4285f4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-text {
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
