import goodsTransferData from '../data/goodsTransferData.json';
import { 
  getStationIdsByBranchId, 
  getStationIdsByServiceAreaId,
  getStationNameById,
  getWarehouseByStationId,
  getWarehouseByBranchId
} from '../utils/orgData';

// 定义商品调拨单项目类型
export interface GoodsTransferItem {
  barcode: string;
  goodsName: string;
  specification: string;
  unit: string;
  transferQuantity: number;
  receivedQuantity: number;
  purchasePrice: number;
  purchaseAmount: number;
  salePrice: number;
  saleAmount: number;
}

// 定义商品调拨单类型
export interface GoodsTransfer {
  id: string;
  name: string;
  transferNo: string;
  orgId: string;
  orgName: string;
  stationId: string;
  stationName: string;
  outWarehouseId: string;
  outWarehouseName: string;
  inWarehouseId: string;
  inWarehouseName: string;
  items: GoodsTransferItem[];
  auditor: string;
  auditStatus: string;
  creator: string;
  createTime: string;
}

// 定义过滤条件类型
export interface GoodsTransferFilter {
  startDate?: string;
  endDate?: string;
  branchIds?: string[];
  serviceAreaIds?: string[];
  stationIds?: string[];
  transferNo?: string;
}

// 加载商品调拨数据
export const loadGoodsTransferData = (): GoodsTransfer[] => {
  return goodsTransferData as GoodsTransfer[];
};

// 根据条件过滤商品调拨数据
export const filterGoodsTransferData = (
  data: GoodsTransfer[],
  filter: GoodsTransferFilter
): GoodsTransfer[] => {
  return data.filter(item => {
    // 按日期范围过滤
    if (filter.startDate && filter.endDate) {
      const itemDate = new Date(item.createTime);
      const startDate = new Date(filter.startDate);
      const endDate = new Date(filter.endDate);
      endDate.setHours(23, 59, 59, 999); // 设置为当天的最后一毫秒
      
      if (itemDate < startDate || itemDate > endDate) {
        return false;
      }
    }
    
    // 按分公司过滤
    if (filter.branchIds && filter.branchIds.length > 0) {
      // 获取所有选中分公司下的油站ID
      const stationIds: string[] = [];
      filter.branchIds.forEach(branchId => {
        stationIds.push(...getStationIdsByBranchId(branchId));
      });
      
      if (!stationIds.includes(item.stationId)) {
        return false;
      }
    }
    
    // 按服务区过滤
    if (filter.serviceAreaIds && filter.serviceAreaIds.length > 0) {
      // 获取所有选中服务区下的油站ID
      const stationIds: string[] = [];
      filter.serviceAreaIds.forEach(serviceAreaId => {
        stationIds.push(...getStationIdsByServiceAreaId(serviceAreaId));
      });
      
      if (!stationIds.includes(item.stationId)) {
        return false;
      }
    }
    
    // 按油站过滤
    if (filter.stationIds && filter.stationIds.length > 0) {
      if (!filter.stationIds.includes(item.stationId)) {
        return false;
      }
    }
    
    // 按调拨单编号过滤
    if (filter.transferNo && filter.transferNo.trim() !== '') {
      if (!item.transferNo.includes(filter.transferNo.trim())) {
        return false;
      }
    }
    
    return true;
  });
};

// 将商品调拨数据导出为CSV并下载
export const exportGoodsTransferToExcel = (data: GoodsTransfer[]): void => {
  // 准备导出数据
  const exportData: any[] = [];
  
  // 遍历每个调拨单
  data.forEach(transfer => {
    // 遍历调拨单中的每个商品项
    transfer.items.forEach(item => {
      exportData.push({
        '调拨单名称': transfer.name,
        '调拨单编号': transfer.transferNo,
        '机构和油站': `${transfer.orgName} / ${transfer.stationName}`,
        '出库仓库': transfer.outWarehouseName,
        '入库仓库': transfer.inWarehouseName,
        '商品条码': item.barcode,
        '商品名称': item.goodsName,
        '规格': item.specification,
        '单位': item.unit,
        '调拨数量': item.transferQuantity,
        '接收数量': item.receivedQuantity,
        '进价': item.purchasePrice,
        '进价金额': item.purchaseAmount,
        '销售价': item.salePrice,
        '销售金额': item.saleAmount,
        '创建人': transfer.creator,
        '创建时间': transfer.createTime
      });
    });
  });
  
  // 创建CSV内容
  const headers = Object.keys(exportData[0]);
  let csvContent = headers.join(',') + '\n';
  
  exportData.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // 处理包含逗号的字段，用双引号包裹
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value;
    });
    csvContent += values.join(',') + '\n';
  });
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接并触发下载
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', '商品调拨入库表.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 获取所有可能的审核状态
export const getAuditStatusOptions = (): string[] => {
  const statusSet = new Set<string>();
  goodsTransferData.forEach((item: any) => {
    statusSet.add(item.auditStatus);
  });
  return Array.from(statusSet);
}; 