import goodsInventoryData from '../data/goodsInventoryData.json';
import { 
  getStationIdsByBranchId, 
  getStationIdsByServiceAreaId 
} from '../utils/orgData';

// 定义商品进销存数据类型
export interface AmountData {
  quantity?: number;
  retailAmountWithTax: number;
  retailAmountWithoutTax: number;
  costAmountWithTax: number;
  costAmountWithoutTax: number;
  retailPriceWithTax?: number;
}

export interface GoodsInventoryItem {
  id: string;
  name: string;
  barcode: string;
  category1: string;
  category2: string;
  taxRate: number;
  initialInventory: AmountData;
  purchase: AmountData;
  sales: AmountData;
  inventory: AmountData;
  selfUse: AmountData;
  salesReturn: AmountData;
  supplierReturn: AmountData;
  transferIn: AmountData;
  transferOut: AmountData;
  inventoryChange: AmountData;
  costAdjustment: {
    costAmountWithTax: number;
    costAmountWithoutTax: number;
  };
  priceAdjustment: {
    retailAmountWithTax: number;
    retailAmountWithoutTax: number;
  };
  finalInventory: AmountData;
}

// 定义过滤条件类型
export interface GoodsInventoryFilter {
  startDate?: string;
  endDate?: string;
  branchIds?: string[];
  serviceAreaIds?: string[];
  stationIds?: string[];
  goodsName?: string;
  barcode?: string;
  category1?: string;
  category2?: string;
}

// 加载商品进销存数据
export const loadGoodsInventoryData = (): GoodsInventoryItem[] => {
  return goodsInventoryData as GoodsInventoryItem[];
};

// 获取所有一级分类
export const getCategory1Options = (): string[] => {
  const categorySet = new Set<string>();
  goodsInventoryData.forEach((item: any) => {
    categorySet.add(item.category1);
  });
  return Array.from(categorySet);
};

// 获取所有二级分类
export const getCategory2Options = (category1?: string): string[] => {
  const categorySet = new Set<string>();
  goodsInventoryData.forEach((item: any) => {
    if (!category1 || item.category1 === category1) {
      categorySet.add(item.category2);
    }
  });
  return Array.from(categorySet);
};

// 根据条件过滤商品进销存数据
export const filterGoodsInventoryData = (
  data: GoodsInventoryItem[],
  filter: GoodsInventoryFilter
): GoodsInventoryItem[] => {
  return data.filter(item => {
    // 按商品名称过滤
    if (filter.goodsName && filter.goodsName.trim() !== '') {
      if (!item.name.includes(filter.goodsName.trim())) {
        return false;
      }
    }
    
    // 按商品条码过滤
    if (filter.barcode && filter.barcode.trim() !== '') {
      if (!item.barcode.includes(filter.barcode.trim())) {
        return false;
      }
    }
    
    // 按一级分类过滤
    if (filter.category1 && filter.category1 !== '全部') {
      if (item.category1 !== filter.category1) {
        return false;
      }
    }
    
    // 按二级分类过滤
    if (filter.category2 && filter.category2 !== '全部') {
      if (item.category2 !== filter.category2) {
        return false;
      }
    }
    
    return true;
  });
};

// 将商品进销存数据导出为CSV并下载
export const exportGoodsInventoryToCSV = (data: GoodsInventoryItem[]): void => {
  // 准备导出数据
  const exportData: any[] = [];
  
  // 遍历每个商品
  data.forEach(item => {
    exportData.push({
      '商品名称': item.name,
      '商品条码': item.barcode,
      '一级分类': item.category1,
      '二级分类': item.category2,
      '税率': item.taxRate,
      
      '期初数量': item.initialInventory.quantity,
      '期初零售金额(含税)': item.initialInventory.retailAmountWithTax,
      '期初零售金额(不含税)': item.initialInventory.retailAmountWithoutTax,
      '期初成本金额(含税)': item.initialInventory.costAmountWithTax,
      '期初成本金额(不含税)': item.initialInventory.costAmountWithoutTax,
      
      '采购入库数量': item.purchase.quantity,
      '采购入库零售金额(含税)': item.purchase.retailAmountWithTax,
      '采购入库零售金额(不含税)': item.purchase.retailAmountWithoutTax,
      '采购入库成本金额(含税)': item.purchase.costAmountWithTax,
      '采购入库成本金额(不含税)': item.purchase.costAmountWithoutTax,
      
      '销售数量': item.sales.quantity,
      '销售零售金额(含税)': item.sales.retailAmountWithTax,
      '销售零售金额(不含税)': item.sales.retailAmountWithoutTax,
      '销售成本金额(含税)': item.sales.costAmountWithTax,
      '销售成本金额(不含税)': item.sales.costAmountWithoutTax,
      
      '盘点数量': item.inventory.quantity,
      '盘点零售金额(含税)': item.inventory.retailAmountWithTax,
      '盘点零售金额(不含税)': item.inventory.retailAmountWithoutTax,
      '盘点成本金额(含税)': item.inventory.costAmountWithTax,
      '盘点成本金额(不含税)': item.inventory.costAmountWithoutTax,
      
      '自用数量': item.selfUse.quantity,
      '自用零售金额(含税)': item.selfUse.retailAmountWithTax,
      '自用零售金额(不含税)': item.selfUse.retailAmountWithoutTax,
      '自用成本金额(含税)': item.selfUse.costAmountWithTax,
      '自用成本金额(不含税)': item.selfUse.costAmountWithoutTax,
      
      '销售退货数量': item.salesReturn.quantity,
      '销售退货零售金额(含税)': item.salesReturn.retailAmountWithTax,
      '销售退货零售金额(不含税)': item.salesReturn.retailAmountWithoutTax,
      '销售退货成本金额(含税)': item.salesReturn.costAmountWithTax,
      '销售退货成本金额(不含税)': item.salesReturn.costAmountWithoutTax,
      
      '供应商退货数量': item.supplierReturn.quantity,
      '供应商退货零售金额(含税)': item.supplierReturn.retailAmountWithTax,
      '供应商退货零售金额(不含税)': item.supplierReturn.retailAmountWithoutTax,
      '供应商退货成本金额(含税)': item.supplierReturn.costAmountWithTax,
      '供应商退货成本金额(不含税)': item.supplierReturn.costAmountWithoutTax,
      
      '调拨入库数量': item.transferIn.quantity,
      '调拨入库零售金额(含税)': item.transferIn.retailAmountWithTax,
      '调拨入库零售金额(不含税)': item.transferIn.retailAmountWithoutTax,
      '调拨入库成本金额(含税)': item.transferIn.costAmountWithTax,
      '调拨入库成本金额(不含税)': item.transferIn.costAmountWithoutTax,
      
      '调拨出库数量': item.transferOut.quantity,
      '调拨出库零售金额(含税)': item.transferOut.retailAmountWithTax,
      '调拨出库零售金额(不含税)': item.transferOut.retailAmountWithoutTax,
      '调拨出库成本金额(含税)': item.transferOut.costAmountWithTax,
      '调拨出库成本金额(不含税)': item.transferOut.costAmountWithoutTax,
      
      '库存变动数量': item.inventoryChange.quantity,
      '库存变动零售金额(含税)': item.inventoryChange.retailAmountWithTax,
      '库存变动零售金额(不含税)': item.inventoryChange.retailAmountWithoutTax,
      '库存变动成本金额(含税)': item.inventoryChange.costAmountWithTax,
      '库存变动成本金额(不含税)': item.inventoryChange.costAmountWithoutTax,
      
      '成本调整成本金额(含税)': item.costAdjustment.costAmountWithTax,
      '成本调整成本金额(不含税)': item.costAdjustment.costAmountWithoutTax,
      
      '价格调整零售金额(含税)': item.priceAdjustment.retailAmountWithTax,
      '价格调整零售金额(不含税)': item.priceAdjustment.retailAmountWithoutTax,
      
      '期末数量': item.finalInventory.quantity,
      '期末零售金额(含税)': item.finalInventory.retailAmountWithTax,
      '期末零售金额(不含税)': item.finalInventory.retailAmountWithoutTax,
      '期末成本金额(含税)': item.finalInventory.costAmountWithTax,
      '期末成本金额(不含税)': item.finalInventory.costAmountWithoutTax,
      '期末零售单价(含税)': item.finalInventory.retailPriceWithTax
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
  link.setAttribute('download', '商品进销存报表.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 