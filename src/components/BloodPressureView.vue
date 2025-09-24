<template>
  <div class="app-container">
    <!-- 1. 新增/编辑血压弹窗 -->
    <div class="modal" v-if="dialogVisible">
      <div class="modal-mask" @click="dialogVisible = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ dialogTitle }}</h3>
          <button class="modal-close" @click="dialogVisible = false">&times;</button>
        </div>
        <div class="modal-body">
          <form class="form-modal" @submit.prevent="dialogOk">
            <div class="form-item">
              <label class="form-label">姓名</label>
              <input 
                type="text" 
                class="form-input" 
                v-model="bloodPressure.name" 
                placeholder="请输入姓名"
                maxlength="20"
                required
              >
            </div>
            <div class="form-item">
              <label class="form-label">身份证号</label>
              <input 
                type="text" 
                class="form-input" 
                v-model="bloodPressure.icn" 
                placeholder="请输入18位身份证号"
                maxlength="18"
                minlength="18"
                pattern="(^\d{18}$)|(^\d{17}(\d|X|x)$)"
                required
              >
            </div>
            <div class="form-item">
              <label class="form-label">血压值</label>
              <div class="number-input-group">
                <button type="button" class="number-btn" @click="bloodPressure.bpv = Math.max(50, bloodPressure.bpv - 1)">-</button>
                <input 
                  type="number" 
                  class="form-input number-input" 
                  v-model="bloodPressure.bpv" 
                  placeholder="正常范围：90-140 mmHg"
                  min="50"
                  max="250"
                  required
                >
                <button type="button" class="number-btn" @click="bloodPressure.bpv = Math.min(250, bloodPressure.bpv + 1)">+</button>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-default" @click="dialogVisible = false">取消</button>
          <button class="btn btn-primary" @click="dialogOk">确定</button>
        </div>
      </div>
    </div>

    <!-- 2. 页面标题区 -->
    <div class="page-header">
      <h2 class="page-title">血压列表</h2>
      <div class="header-divider"></div>
    </div>

    <!-- 3. 搜索区域 -->
    <div class="search-card">
      <form class="search-form" @submit.prevent="handleSearch">
        <div class="search-row">
          <div class="search-item">
            <label class="search-label">姓名</label>
            <input 
              type="text" 
              class="search-input" 
              v-model="searchForm.name" 
              placeholder="请输入姓名"
              @keyup.enter="handleSearch"
            >
          </div>
          <div class="search-item">
            <label class="search-label">身份证号</label>
            <input 
              type="text" 
              class="search-input" 
              v-model="searchForm.icn" 
              placeholder="请输入18位身份证号"
              @keyup.enter="handleSearch"
              maxlength="18"
            >
          </div>
          <div class="search-item">
            <label class="search-label">血压最小值</label>
            <input 
              type="number" 
              class="search-input" 
              v-model="searchForm.minBpv" 
              placeholder="≥ 血压值"
              @keyup.enter="handleSearch"
              min="50"
              max="250"
              step="0.1"
            >
          </div>
          <div class="search-item">
            <label class="search-label">血压最大值</label>
            <input 
              type="number" 
              class="search-input" 
              v-model="searchForm.maxBpv" 
              placeholder="＜ 血压值"
              @keyup.enter="handleSearch"
              min="50"
              max="250"
              step="0.1"
            >
          </div>
        </div>
        <div class="search-row">
          <div class="search-item search-item-wide">
            <label class="search-label">起始修改时间</label>
            <input 
              type="datetime-local" 
              class="search-input" 
              v-model="searchForm.startLastModified" 
              @keyup.enter="handleSearch"
            >
          </div>
          <div class="search-item search-item-wide">
            <label class="search-label">截止修改时间</label>
            <input 
              type="datetime-local" 
              class="search-input" 
              v-model="searchForm.endLastModified" 
              @keyup.enter="handleSearch"
            >
          </div>
        </div>
        <div class="search-btn-group">
          <button type="submit" class="btn btn-search" :disabled="searchLoading">
            <span v-if="searchLoading" class="loading-spinner"></span>
            查 询
          </button>
          <button type="button" class="btn btn-reset" @click="resetSearch">
            重 置
          </button>
        </div>
      </form>
    </div>

    <!-- 4. 分页导航区 -->
    <div class="pagination-bar">
      <button 
        class="btn btn-page" 
        @click="handleSearch('first')" 
        :disabled="pageNo === 1 || pageCount === 0"
      >
        首 页
      </button>
      <button 
        class="btn btn-page" 
        @click="handleSearch('previous')" 
        :disabled="pageNo === 1 || pageCount === 0"
      >
        前一页
      </button>
      <span class="page-info">
        {{ pageNo }} / {{ pageCount || 1 }} 页
      </span>
      <button 
        class="btn btn-page" 
        @click="handleSearch('next')" 
        :disabled="pageNo === pageCount || pageCount === 0"
      >
        后一页
      </button>
      <button 
        class="btn btn-page" 
        @click="handleSearch('last')" 
        :disabled="pageNo === pageCount || pageCount === 0"
      >
        尾 页
      </button>
      <span class="total-count" v-if="totalCount > 0">
        共 {{ totalCount }} 条记录
      </span>
    </div>

    <!-- 5. 血压表格区 -->
    <div class="table-container">
      <!-- 加载状态 -->
      <div class="loading" v-if="tableLoading">
        <div class="loading-spinner"></div>
        <p>正在加载血压数据...</p>
      </div>

      <!-- 空数据状态 -->
      <div class="empty-state" v-else-if="bloodPressures.length === 0 && !tableLoading">
        <div class="empty-icon">📊</div>
        <p>暂无血压记录</p>
      </div>

      <!-- 表格数据 -->
      <table class="data-table" v-else>
        <thead>
          <tr>
            <th class="table-th">姓名</th>
            <th class="table-th">身份证号</th>
            <th class="table-th">血压值</th>
            <th class="table-th">修改时间</th>
            <th class="table-th table-th-action">
              <button class="btn btn-add" @click="handleAdd">
                + 添加
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table-tr" :class="rowIndex % 2 === 0 ? 'tr-even' : 'tr-odd'" v-for="(item, rowIndex) in bloodPressures" :key="item.id">
            <td class="table-td">{{ item.name }}</td>
            <td class="table-td">{{ item.icn }}</td>
            <td class="table-td">
              <span class="bp-tag" :class="getBpClass(item.bpv)">
                {{ item.bpv.toFixed(0) }} mmHg
              </span>
            </td>
            <td class="table-td">{{ formatDateTime(item.lastModified) }}</td>
            <td class="table-td table-td-action">
              <button class="btn btn-edit" @click="handleEdit(rowIndex, item)">
                编辑
              </button>
              <button class="btn btn-delete" @click="handleDelete(rowIndex, item)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, reactive, onMounted } from 'vue';

export default {
  name: 'BloodPressureView',
  setup() {
    // 响应式数据
    const dialogVisible = ref(false);
    const dialogTitle = ref("添加血压记录");
    const bloodPressure = reactive({
      name: "",
      icn: "",
      bpv: 120  // 默认正常血压值
    });
    const bloodPressures = ref([]);
    const searchForm = reactive({
      name: "",
      icn: "",
      minBpv: "",
      maxBpv: "",
      startLastModified: "",
      endLastModified: ""
    });
    const searchParams = reactive({});
    const pageNo = ref(1);
    const pageSize = ref(10);
    const pageCount = ref(0);
    const totalCount = ref(0);
    const tableLoading = ref(false);
    const searchLoading = ref(false);

    // 生命周期钩子
    onMounted(() => {
      handleSearch();
    });

    // 方法定义
    // 表格行样式：区分正常/低血压/高血压
    const getBpClass = (bpv) => {
      if (bpv < 90) return "bp-low";
      if (bpv <= 140) return "bp-normal";
      return "bp-high";
    };

    // 格式化时间（去除毫秒）
    const formatDateTime = (dateStr) => {
      return dateStr ? dateStr.split('.')[0] : "";
    };

    // 新增血压记录
    const handleAdd = () => {
      // 重置表单数据
      bloodPressure.name = "";
      bloodPressure.icn = "";
      bloodPressure.bpv = 120;
      dialogTitle.value = "添加血压记录";
      dialogVisible.value = true;
    };

    // 编辑血压记录
    const handleEdit = (index, item) => {
      // 深拷贝数据，避免直接修改原数据
      bloodPressure.name = item.name;
      bloodPressure.icn = item.icn;
      bloodPressure.bpv = item.bpv;
      bloodPressure.id = item.id;  // 携带ID用于编辑
      dialogTitle.value = "编辑血压记录";
      dialogVisible.value = true;
    };

    // 弹窗确定按钮（提交表单）
    const dialogOk = () => {
      dialogVisible.value = false;
      const url = dialogTitle.value.includes('添加') 
        ? '/bloodpressure/add' 
        : '/bloodpressure/chg';
      const successMsg = dialogTitle.value.includes('添加') 
        ? '血压记录添加成功' 
        : '血压记录修改成功';

      tableLoading.value = true;
      axios.get(url, { params: bloodPressure })
        .then(response => {
          if (response.status === 200 && response.data.code === 0) {
            showToast(successMsg, "success");
            handleSearch();  // 重新加载数据
          } else {
            showToast("操作失败，请稍后重试", "error");
          }
        })
        .catch(error => {
          console.error("操作失败:", error);
          showToast("网络错误，请稍后重试", "error");
        })
        .finally(() => {
          tableLoading.value = false;
        });
    };

    // 搜索血压数据
    const handleSearch = (act) => {
      searchLoading.value = true;
      tableLoading.value = true;

      // 处理搜索参数（空值置为null）
      searchParams.name = searchForm.name?.trim() || null;
      searchParams.icn = searchForm.icn?.trim() || null;
      searchParams.minBpv = searchForm.minBpv || null;
      searchParams.maxBpv = searchForm.maxBpv || null;
      // 转换时间格式（适配后端需求）
      searchParams.startLastModified = searchForm.startLastModified 
        ? `${searchForm.startLastModified}` 
        : null;
      searchParams.endLastModified = searchForm.endLastModified 
        ? `${searchForm.endLastModified}` 
        : null;
      searchParams.pageSize = pageSize.value;
      searchParams.orderBy = ["id desc"];

      // 1. 先获取总条数，计算总页数
      axios.get('/bloodpressure/count', { params: searchParams })
        .then(res => {
          if (res.data.code === 0) {
            totalCount.value = res.data.data || 0;
            pageCount.value = Math.ceil(totalCount.value / pageSize.value) || 1;

            // 根据操作调整页码
            if (act === 'first') {
              pageNo.value = 1;
            } else if (act === 'previous') {
              pageNo.value = Math.max(1, pageNo.value - 1);
            } else if (act === 'next') {
              pageNo.value = Math.min(pageCount.value, pageNo.value + 1);
            } else if (act === 'last') {
              pageNo.value = pageCount.value;
            }

            // 确保页码在有效范围
            pageNo.value = Math.max(1, Math.min(pageCount.value, pageNo.value));
            searchParams.pageNo = pageNo.value;

            // 2. 获取当前页数据
            return axios.get('/bloodpressure/find', { params: searchParams });
          } else {
            throw new Error("获取总条数失败");
          }
        })
        .then(res => {
          if (res.data.code === 0) {
            bloodPressures.value = res.data.data || [];
          } else {
            bloodPressures.value = [];
            showToast("获取数据失败", "error");
          }
        })
        .catch(error => {
          console.error("搜索失败:", error);
          bloodPressures.value = [];
          showToast("网络错误，请稍后重试", "error");
        })
        .finally(() => {
          searchLoading.value = false;
          tableLoading.value = false;
        });
    };

    // 重置搜索条件
    const resetSearch = () => {
      searchForm.name = "";
      searchForm.icn = "";
      searchForm.minBpv = "";
      searchForm.maxBpv = "";
      searchForm.startLastModified = "";
      searchForm.endLastModified = "";
      pageNo.value = 1;
    };

    // 删除血压记录
    const handleDelete = (index, item) => {
      if (confirm(`此操作将永久删除${item.name}的血压记录，是否继续？`)) {
        tableLoading.value = true;
        axios.get('/bloodpressure/del', { params: { id: item.id } })
          .then(response => {
            if (response.status === 200 && response.data.code === 0) {
              showToast(`成功删除${item.name}的血压记录`, "success");
              handleSearch();  // 重新加载数据
            } else {
              showToast("删除失败，请稍后重试", "error");
            }
          })
          .catch(error => {
            console.error("删除失败:", error);
            showToast("网络错误，请稍后重试", "error");
          })
          .finally(() => {
            tableLoading.value = false;
          });
      }
    };

    // 提示消息（原生实现）
    const showToast = (message, type = "info") => {
      // 创建提示元素
      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      document.body.appendChild(toast);

      // 显示动画
      setTimeout(() => {
        toast.classList.add("toast-show");
      }, 10);

      // 3秒后自动关闭
      setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => {
          document.body.removeChild(toast);
        }, 300);
      }, 3000);
    };

    // 暴露给模板使用的数据和方法
    return {
      dialogVisible,
      dialogTitle,
      bloodPressure,
      bloodPressures,
      searchForm,
      pageNo,
      pageCount,
      totalCount,
      tableLoading,
      searchLoading,
      getBpClass,
      formatDateTime,
      handleAdd,
      handleEdit,
      dialogOk,
      handleSearch,
      resetSearch,
      handleDelete
    };
  }
};
</script>

<style scoped>
/* 基础样式 */
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

/* 标题样式 */
.page-header {
  margin-bottom: 25px;
}

.page-title {
  font-size: 22px;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.header-divider {
  height: 3px;
  background-color: #3498db;
  border-radius: 3px;
  width: 80px;
}

/* 弹窗样式 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  background-color: white;
  border-radius: 6px;
  width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #e74c3c;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 表单样式 */
.form-modal {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-label {
  width: 80px;
  text-align: right;
  font-weight: 500;
}

.form-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.number-input-group {
  flex: 1;
  display: flex;
  align-items: center;
}

.number-input {
  flex: 1;
  text-align: center;
}

.number-btn {
  width: 30px;
  height: 30px;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.number-btn:hover {
  background-color: #eee;
}

/* 搜索区域样式 */
.search-card {
  background-color: white;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-row {
  display: flex;
  gap: 15px;
}

.search-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-item-wide {
  flex: 2;
}

.search-label {
  width: 100px;
  font-weight: 500;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.search-btn-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-default {
  background-color: #f5f5f5;
  color: #333;
}

.btn-default:hover {
  background-color: #eee;
}

.btn-search {
  background-color: #2ecc71;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-search:hover {
  background-color: #27ae60;
}

.btn-reset {
  background-color: #95a5a6;
  color: white;
}

.btn-reset:hover {
  background-color: #7f8c8d;
}

.btn-page {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  padding: 6px 12px;
}

.btn-page:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-page:hover:not(:disabled) {
  background-color: #e9ecef;
}

.btn-add {
  background-color: #3498db;
  color: white;
  padding: 4px 10px;
  font-size: 13px;
}

.btn-add:hover {
  background-color: #2980b9;
}

.btn-edit {
  background-color: #2ecc71;
  color: white;
  padding: 4px 10px;
  font-size: 13px;
  margin-right: 5px;
}

.btn-edit:hover {
  background-color: #27ae60;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  padding: 4px 10px;
  font-size: 13px;
}

.btn-delete:hover {
  background-color: #c0392b;
}

/* 分页样式 */
.pagination-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
}

.page-info {
  color: #666;
  font-size: 14px;
}

.total-count {
  margin-left: 15px;
  color: #666;
  font-size: 14px;
}

/* 表格样式 */
.table-container {
  margin-top: 10px;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-th {
  padding: 12px 15px;
  text-align: left;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  font-weight: 600;
  color: #2c3e50;
}

.table-td {
  padding: 12px 15px;
  border: 1px solid #e9ecef;
}

.table-tr:hover {
  background-color: #f8f9fa;
}

.tr-even {
  background-color: #f9f9f9;
}

.tr-odd {
  background-color: white;
}

.table-th-action {
  text-align: center;
  width: 180px;
}

.table-td-action {
  display: flex;
  justify-content: center;
}

/* 血压标签样式 */
.bp-tag {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.bp-normal {
  background-color: #eafaf1;
  color: #27ae60;
  border: 1px solid #b8e986;
}

.bp-low {
  background-color: #ebf5fb;
  color: #3498db;
  border: 1px solid #81cfe0;
}

.bp-high {
  background-color: #fdedeb;
  color: #e74c3c;
  border: 1px solid #fdc6bb;
}

/* 加载状态 */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  color: #666;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px 0;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

/* 提示消息样式 */
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s;
  z-index: 9999;
}

.toast-show {
  opacity: 1;
  transform: translateY(0);
}

.toast-success {
  background-color: #2ecc71;
}

.toast-error {
  background-color: #e74c3c;
}

.toast-info {
  background-color: #3498db;
}
</style>
