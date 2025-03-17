import { StationSalesDetailData, FilterConditions } from '../types/reportTypes';
import stationSalesDetailData from '../data/stationSalesDetailData.json';
import { getStationHierarchy } from '../utils/orgData';

/**
 * 加载油站销售明细数据
 * @returns 油站销售明细数据数组
 */
export const loadStationSalesDetailData = (): StationSalesDetailData[] => {
  return stationSalesDetailData.stationSalesDetailData.map(item => {
    // 确保数据类型正确
    return {
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      receivableAmount: Number(item.receivableAmount),
      totalDiscountAmount: Number(item.totalDiscountAmount),
      actualAmount: Number(item.actualAmount),
      discountAmount: Number(item.discountAmount),
      couponAmount: Number(item.couponAmount),
      pointsDeductionAmount: Number(item.pointsDeductionAmount),
      pointsUsed: Number(item.pointsUsed),
      costAmount: Number(item.costAmount),
      profit: Number(item.profit),
      salesProfitRate: Number(item.salesProfitRate),
      costProfitRate: Number(item.costProfitRate),
      taxRate: Number(item.taxRate),
      actualAmountExcludingTax: Number(item.actualAmountExcludingTax),
      costAmountExcludingTax: Number(item.costAmountExcludingTax),
      profitExcludingTax: Number(item.profitExcludingTax)
    } as StationSalesDetailData;
  });
};

/**
 * 按油站ID过滤数据
 * @param data 原始数据
 * @param stationIds 油站ID数组
 * @returns 过滤后的数据
 */
export const filterDataByStationIds = (
  data: StationSalesDetailData[],
  stationIds?: string[]
): StationSalesDetailData[] => {
  if (!stationIds || stationIds.length === 0) {
    return data;
  }
  
  return data.filter(item => stationIds.includes(item.stationId || ''));
};

/**
 * 按分公司ID过滤数据
 * @param data 原始数据
 * @param branchIds 分公司ID数组
 * @returns 过滤后的数据
 */
export const filterDataByBranchIds = (
  data: StationSalesDetailData[],
  branchIds?: string[]
): StationSalesDetailData[] => {
  if (!branchIds || branchIds.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    if (!item.stationId) return false;
    
    const hierarchy = getStationHierarchy(item.stationId);
    return hierarchy.branchId ? branchIds.includes(hierarchy.branchId) : false;
  });
};

/**
 * 按服务区ID过滤数据
 * @param data 原始数据
 * @param serviceAreaIds 服务区ID数组
 * @returns 过滤后的数据
 */
export const filterDataByServiceAreaIds = (
  data: StationSalesDetailData[],
  serviceAreaIds?: string[]
): StationSalesDetailData[] => {
  if (!serviceAreaIds || serviceAreaIds.length === 0) {
    return data;
  }
  
  return data.filter(item => {
    if (!item.stationId) return false;
    
    const hierarchy = getStationHierarchy(item.stationId);
    return hierarchy.serviceAreaId ? serviceAreaIds.includes(hierarchy.serviceAreaId) : false;
  });
};

/**
 * 按商品类型过滤数据
 * @param data 原始数据
 * @param productType 商品类型
 * @returns 过滤后的数据
 */
export const filterDataByProductType = (
  data: StationSalesDetailData[],
  productType?: string
): StationSalesDetailData[] => {
  if (!productType) {
    return data;
  }
  
  return data.filter(item => item.productType === productType);
};

/**
 * 按日期范围过滤数据
 * @param data 原始数据
 * @param dateRange 日期范围
 * @returns 过滤后的数据
 */
export const filterDataByDateRange = (
  data: StationSalesDetailData[],
  dateRange?: [string, string]
): StationSalesDetailData[] => {
  if (!dateRange || dateRange.length !== 2) {
    return data;
  }
  
  const [startDate, endDate] = dateRange;
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  
  return data.filter(item => {
    const orderTime = new Date(item.orderTime).getTime();
    return orderTime >= startTime && orderTime <= endTime;
  });
};

/**
 * 获取所有商品类型
 * @returns 商品类型数组
 */
export const getAllProductTypes = (): string[] => {
  const data = loadStationSalesDetailData();
  const productTypes = new Set<string>();
  
  data.forEach(item => {
    if (item.productType) {
      productTypes.add(item.productType);
    }
  });
  
  return Array.from(productTypes);
};

/**
 * 应用所有过滤条件
 * @param data 原始数据
 * @param filters 过滤条件
 * @returns 过滤后的数据
 */
export const applyFilters = (
  data: StationSalesDetailData[],
  filters: FilterConditions
): StationSalesDetailData[] => {
  let filteredData = data;
  
  // 按油站ID过滤
  if (filters.stationIds && filters.stationIds.length > 0) {
    filteredData = filterDataByStationIds(filteredData, filters.stationIds);
  }
  
  // 按分公司ID过滤
  if (filters.branchIds && filters.branchIds.length > 0) {
    filteredData = filterDataByBranchIds(filteredData, filters.branchIds);
  }
  
  // 按服务区ID过滤
  if (filters.serviceAreaIds && filters.serviceAreaIds.length > 0) {
    filteredData = filterDataByServiceAreaIds(filteredData, filters.serviceAreaIds);
  }
  
  // 按日期范围过滤
  if (filters.dateRange && filters.dateRange.length === 2) {
    filteredData = filterDataByDateRange(filteredData, filters.dateRange);
  }
  
  return filteredData;
}; 