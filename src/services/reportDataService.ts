import { 
  InitialInventoryData, 
  SalesData, 
  FinalInventoryData, 
  CombinedReportData 
} from '../types/reportTypes';
import reportData from '../data/reportData.json';
import { formatDateRange } from '../utils/formatUtils';
import { 
  getAllStationNames as getStationNames, 
  getStationMap, 
  getStationNameById, 
  getStationHierarchy,
  getStationIdsByBranchId,
  getStationIdsByServiceAreaId,
  orgData, 
  oilTypes 
} from '../utils/orgData';

// 解析日期范围字符串
const parseDateRange = (dateRange: string): { startDate: string; endDate: string } => {
  const [startDate, endDate] = dateRange.split(' ~ ');
  return { startDate, endDate };
};

// 加载初始库存数据
export const loadInitialInventoryData = (): InitialInventoryData[] => {
  return reportData.initialInventoryData.map(item => {
    const stationName = getStationNameById(item.stationName) || item.stationName;
    const hierarchy = getStationHierarchy(item.stationName);
    
    // 生成模拟数据
    const initialV20Liters = item.initialV20Liters;
    const initialPrice = item.initialPrice;
    const initialAmount = item.initialAmount;
    
    // 计算模拟数据
    const quantityTons = +(initialV20Liters * 0.00072).toFixed(2); // 假设1V20升约等于0.72kg
    const quantityRealSendV20Liters = +(initialV20Liters * 1.02).toFixed(2); // 实发量略大于库存量
    const quantityRealReceiveV20Liters = +(initialV20Liters * 0.99).toFixed(2); // 实收量略小于库存量
    
    const oilTaxIncludedAmount = +(initialAmount * 1.13).toFixed(2); // 含税金额
    const oilTaxExcludedAmount = +(initialAmount).toFixed(2); // 不含税金额
    
    const freightTaxIncluded = +(initialAmount * 0.05).toFixed(2); // 运费含税
    const freightTaxExcluded = +(initialAmount * 0.04).toFixed(2); // 运费不含税
    
    const totalTaxIncluded = +(oilTaxIncludedAmount + freightTaxIncluded).toFixed(2); // 含税总额
    const totalTaxExcluded = +(oilTaxExcludedAmount + freightTaxExcluded).toFixed(2); // 不含税总额
    
    const priceTaxIncluded = +(oilTaxIncludedAmount / initialV20Liters).toFixed(2); // 含税单价
    const priceTaxExcluded = +(oilTaxExcludedAmount / initialV20Liters).toFixed(2); // 不含税单价
    
    return {
      ...item,
      stationName,
      stationId: item.stationName,
      branchName: hierarchy.branchName,
      serviceAreaName: hierarchy.serviceAreaName,
      // 添加新字段
      quantityTons,
      quantityRealSendV20Liters,
      quantityRealReceiveV20Liters,
      oilTaxIncludedAmount,
      oilTaxExcludedAmount,
      freightTaxIncluded,
      freightTaxExcluded,
      totalTaxIncluded,
      totalTaxExcluded,
      priceTaxIncluded,
      priceTaxExcluded
    };
  });
};

// 加载销售数据
export const loadSalesData = (): SalesData[] => {
  return reportData.salesData.map(item => {
    const stationName = getStationNameById(item.stationName) || item.stationName;
    const hierarchy = getStationHierarchy(item.stationName);
    
    // 生成模拟数据
    const outboundV20Liters = item.outboundV20Liters;
    const expectedSalesAmount = item.expectedSalesAmount;
    const actualSalesAmount = item.actualSalesAmount;
    
    // 计算新增字段的模拟数据
    const outboundVtLiters = +(outboundV20Liters * 1.05).toFixed(2); // Vt升略大于V20升
    
    const expectedSalesAmountWithTax = +(expectedSalesAmount * 1.13).toFixed(2); // 含税金额
    const actualSalesAmountWithTax = +(actualSalesAmount * 1.13).toFixed(2); // 实收含税金额
    
    // 支付方式金额
    const cashPayment = +(item.cashAmount * 1.05).toFixed(2); // 现金
    const oilCardPayment = +(expectedSalesAmount * 0.15).toFixed(2); // 加油卡
    const wechatPayment = +(item.wechatAmount * 1.05).toFixed(2); // 微信
    const alipayPayment = +(item.alipayAmount * 1.05).toFixed(2); // 支付宝
    const cloudPayment = +(expectedSalesAmount * 0.05).toFixed(2); // 云闪付
    const bankCardPayment = +(item.creditCardAmount * 1.05).toFixed(2); // 银行卡
    const transferPayment = +(expectedSalesAmount * 0.08).toFixed(2); // 转账
    
    // 确保实收销售金额是各支付方式的总和
    const calculatedActualSalesAmountWithTax = +(
      cashPayment + 
      oilCardPayment + 
      wechatPayment + 
      alipayPayment + 
      cloudPayment + 
      bankCardPayment
    ).toFixed(2);
    
    const selfUsedWithTax = +(expectedSalesAmount * 0.03).toFixed(2); // 自用含税
    const selfUsedWithoutTax = +(selfUsedWithTax / 1.13).toFixed(2); // 自用不含税
    const returnPayment = +(expectedSalesAmount * 0.02).toFixed(2); // 回款
    
    return {
      ...item,
      stationName,
      stationId: item.stationName,
      branchName: hierarchy.branchName,
      serviceAreaName: hierarchy.serviceAreaName,
      // 添加新字段
      outboundVtLiters,
      expectedSalesAmountWithTax,
      actualSalesAmountWithTax: calculatedActualSalesAmountWithTax,
      cashPayment,
      oilCardPayment,
      wechatPayment,
      alipayPayment,
      cloudPayment,
      bankCardPayment,
      transferPayment,
      selfUsedWithTax,
      selfUsedWithoutTax,
      returnPayment,
      salesDifference: item.salesDifference,
    };
  });
};

// 加载最终库存数据
export const loadFinalInventoryData = (): FinalInventoryData[] => {
  return reportData.finalInventoryData.map(item => {
    const stationName = getStationNameById(item.stationName) || item.stationName;
    const hierarchy = getStationHierarchy(item.stationName);
    
    return {
      ...item,
      stationName,
      stationId: item.stationName,
      branchName: hierarchy.branchName,
      serviceAreaName: hierarchy.serviceAreaName
    };
  });
};

// 加载合并数据
export const loadCombinedData = (): CombinedReportData[] => {
  const initialData = loadInitialInventoryData();
  const salesData = loadSalesData();
  const finalData = loadFinalInventoryData();
  
  const combinedData: CombinedReportData[] = [];
  
  // 处理初始库存数据
  initialData.forEach(item => {
    combinedData.push({
      dataType: 'initial',
      stationName: item.stationName,
      stationId: item.stationId,
      branchName: item.branchName,
      serviceAreaName: item.serviceAreaName,
      oilName: item.oilName,
      dateRange: item.dateRange,
      initialV20Liters: item.initialV20Liters,
      initialPrice: item.initialPrice,
      initialAmount: item.initialAmount,
      quantityTons: item.quantityTons,
      quantityRealSendV20Liters: item.quantityRealSendV20Liters,
      quantityRealReceiveV20Liters: item.quantityRealReceiveV20Liters,
      oilTaxIncludedAmount: item.oilTaxIncludedAmount,
      oilTaxExcludedAmount: item.oilTaxExcludedAmount,
      freightTaxIncluded: item.freightTaxIncluded,
      freightTaxExcluded: item.freightTaxExcluded,
      totalTaxIncluded: item.totalTaxIncluded,
      totalTaxExcluded: item.totalTaxExcluded,
      priceTaxIncluded: item.priceTaxIncluded,
      priceTaxExcluded: item.priceTaxExcluded,
    });
  });
  
  // 处理销售数据
  salesData.forEach(item => {
    combinedData.push({
      dataType: 'sales',
      stationName: item.stationName,
      stationId: item.stationId,
      branchName: item.branchName,
      serviceAreaName: item.serviceAreaName,
      oilName: item.oilName,
      dateRange: item.dateRange,
      outboundV20Liters: item.outboundV20Liters,
      expectedSalesAmount: item.expectedSalesAmount,
      cashAmount: item.cashAmount,
      wechatAmount: item.wechatAmount,
      alipayAmount: item.alipayAmount,
      creditCardAmount: item.creditCardAmount,
      otherAmount: item.otherAmount,
      actualSalesAmount: item.actualSalesAmount,
      salesDifference: item.salesDifference,
      outboundVtLiters: item.outboundVtLiters,
      expectedSalesAmountWithTax: item.expectedSalesAmountWithTax,
      actualSalesAmountWithTax: item.actualSalesAmountWithTax,
      cashPayment: item.cashPayment,
      oilCardPayment: item.oilCardPayment,
      wechatPayment: item.wechatPayment,
      alipayPayment: item.alipayPayment,
      cloudPayment: item.cloudPayment,
      bankCardPayment: item.bankCardPayment,
      transferPayment: item.transferPayment,
      selfUsedWithTax: item.selfUsedWithTax,
      selfUsedWithoutTax: item.selfUsedWithoutTax,
      returnPayment: item.returnPayment,
    });
  });
  
  // 处理最终库存数据
  finalData.forEach(item => {
    combinedData.push({
      dataType: 'final',
      stationName: item.stationName,
      stationId: item.stationId,
      branchName: item.branchName,
      serviceAreaName: item.serviceAreaName,
      oilName: item.oilName,
      dateRange: item.dateRange,
      bookV20Liters: item.bookV20Liters,
      actualV20Liters: item.actualV20Liters,
      differenceV20Liters: item.differenceV20Liters,
      bookAmount: item.bookAmount,
      actualAmount: item.actualAmount,
      differenceAmount: item.differenceAmount,
    });
  });
  
  return combinedData;
};

// 根据站点名称获取站点ID
function getStationIdByName(stationName: string): string {
  const stationMap = new Map<string, string>();
  
  // 反向查找，从名称到ID
  const processNode = (node: any) => {
    if (node.children) {
      node.children.forEach(processNode);
    } else if (node.key && node.title) {
      stationMap.set(node.title, node.key);
    }
  };
  
  if (orgData) {
    orgData.forEach(processNode);
  }
  
  return stationMap.get(stationName) || '';
}

// 获取所有油站名称
export const getAllStationNames = (): string[] => {
  return getStationNames();
};

// 获取所有油品名称
export const getAllOilNames = (): string[] => {
  return oilTypes;
};

// 根据日期范围过滤数据
export const filterDataByDateRange = (
  data: CombinedReportData[], 
  startDate: string, 
  endDate: string
): CombinedReportData[] => {
  if (!startDate || !endDate) return data;
  
  return data.filter(item => {
    const { startDate: itemStartDate, endDate: itemEndDate } = parseDateRange(item.dateRange);
    return itemStartDate >= startDate && itemEndDate <= endDate;
  });
};

// 根据油站名称过滤数据
export const filterDataByStationNames = (
  data: CombinedReportData[], 
  stationNames: string[]
): CombinedReportData[] => {
  if (!stationNames || stationNames.length === 0) return data;
  
  return data.filter(item => stationNames.includes(item.stationName));
};

// 根据油站ID过滤数据
export const filterDataByStationIds = (
  data: CombinedReportData[], 
  stationIds: string[]
): CombinedReportData[] => {
  if (!stationIds || stationIds.length === 0) return data;
  
  return data.filter(item => item.stationId && stationIds.includes(item.stationId));
};

// 根据分公司ID过滤数据
export const filterDataByBranchIds = (
  data: CombinedReportData[], 
  branchIds: string[]
): CombinedReportData[] => {
  if (!branchIds || branchIds.length === 0) return data;
  
  // 获取所有选中分公司下的油站ID
  const allStationIds: string[] = [];
  branchIds.forEach(branchId => {
    const stationIds = getStationIdsByBranchId(branchId);
    allStationIds.push(...stationIds);
  });
  
  return filterDataByStationIds(data, allStationIds);
};

// 根据服务区ID过滤数据
export const filterDataByServiceAreaIds = (
  data: CombinedReportData[], 
  serviceAreaIds: string[]
): CombinedReportData[] => {
  if (!serviceAreaIds || serviceAreaIds.length === 0) return data;
  
  // 获取所有选中服务区下的油站ID
  const allStationIds: string[] = [];
  serviceAreaIds.forEach(serviceAreaId => {
    const stationIds = getStationIdsByServiceAreaId(serviceAreaId);
    allStationIds.push(...stationIds);
  });
  
  return filterDataByStationIds(data, allStationIds);
};

// 根据油品名称过滤数据
export const filterDataByOilNames = (
  data: CombinedReportData[], 
  oilNames: string[]
): CombinedReportData[] => {
  if (!oilNames || oilNames.length === 0) return data;
  
  return data.filter(item => oilNames.includes(item.oilName));
}; 