import { 
  StationControlFlowData, 
  ControlFlowFilterConditions 
} from '../types/reportTypes';
import stationControlFlowDataJson from '../data/stationControlFlowData.json';
import { getStationIdsByBranchId, getStationIdsByServiceAreaId } from '../utils/orgData';

/**
 * 加载油站管控流水数据
 * @returns 油站管控流水数据数组
 */
export const loadStationControlFlowData = (): StationControlFlowData[] => {
  try {
    // 从JSON文件加载数据
    const data = stationControlFlowDataJson.stationControlFlowData as StationControlFlowData[];
    
    // 确保数值类型字段正确
    return data.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      controlAmount: Number(item.controlAmount),
      pumpMeterValue: Number(item.pumpMeterValue),
      controlCardBalance: Number(item.controlCardBalance)
    }));
  } catch (error) {
    console.error('加载油站管控流水数据失败:', error);
    return [];
  }
};

/**
 * 根据油站ID过滤数据
 * @param data 原始数据
 * @param stationIds 油站ID数组
 * @returns 过滤后的数据
 */
export const filterDataByStationIds = (
  data: StationControlFlowData[], 
  stationIds: string[]
): StationControlFlowData[] => {
  if (!stationIds || stationIds.length === 0) return data;
  return data.filter(item => stationIds.includes(item.stationId || ''));
};

/**
 * 根据分公司ID过滤数据
 * @param data 原始数据
 * @param branchIds 分公司ID数组
 * @returns 过滤后的数据
 */
export const filterDataByBranchIds = (
  data: StationControlFlowData[], 
  branchIds: string[]
): StationControlFlowData[] => {
  if (!branchIds || branchIds.length === 0) return data;
  
  // 获取所有分公司下的油站ID
  const allStationIds: string[] = [];
  branchIds.forEach(branchId => {
    const stationIds = getStationIdsByBranchId(branchId);
    allStationIds.push(...stationIds);
  });
  
  // 使用油站ID过滤数据
  return filterDataByStationIds(data, allStationIds);
};

/**
 * 根据服务区ID过滤数据
 * @param data 原始数据
 * @param serviceAreaIds 服务区ID数组
 * @returns 过滤后的数据
 */
export const filterDataByServiceAreaIds = (
  data: StationControlFlowData[], 
  serviceAreaIds: string[]
): StationControlFlowData[] => {
  if (!serviceAreaIds || serviceAreaIds.length === 0) return data;
  
  // 获取所有服务区下的油站ID
  const allStationIds: string[] = [];
  serviceAreaIds.forEach(serviceAreaId => {
    const stationIds = getStationIdsByServiceAreaId(serviceAreaId);
    allStationIds.push(...stationIds);
  });
  
  // 使用油站ID过滤数据
  return filterDataByStationIds(data, allStationIds);
};

/**
 * 根据日期范围过滤数据
 * @param data 原始数据
 * @param dateRange 日期范围 [开始日期, 结束日期]
 * @returns 过滤后的数据
 */
export const filterDataByDateRange = (
  data: StationControlFlowData[], 
  dateRange: [string, string]
): StationControlFlowData[] => {
  if (!dateRange || dateRange.length !== 2) return data;
  
  const [startDate, endDate] = dateRange;
  if (!startDate || !endDate) return data;
  
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1; // 结束日期的最后一毫秒
  
  return data.filter(item => {
    const gunHangTimestamp = new Date(item.gunHangTime).getTime();
    return gunHangTimestamp >= startTimestamp && gunHangTimestamp <= endTimestamp;
  });
};

/**
 * 根据结算状态过滤数据
 * @param data 原始数据
 * @param settlementStatus 结算状态
 * @returns 过滤后的数据
 */
export const filterDataBySettlementStatus = (
  data: StationControlFlowData[], 
  settlementStatus: string
): StationControlFlowData[] => {
  if (!settlementStatus) return data;
  return data.filter(item => item.settlementStatus === settlementStatus);
};

/**
 * 根据管控状态过滤数据
 * @param data 原始数据
 * @param controlStatus 管控状态
 * @returns 过滤后的数据
 */
export const filterDataByControlStatus = (
  data: StationControlFlowData[], 
  controlStatus: string
): StationControlFlowData[] => {
  if (!controlStatus) return data;
  return data.filter(item => item.controlStatus === controlStatus);
};

/**
 * 根据油品名称过滤数据
 * @param data 原始数据
 * @param oilName 油品名称
 * @returns 过滤后的数据
 */
export const filterDataByOilName = (
  data: StationControlFlowData[], 
  oilName: string
): StationControlFlowData[] => {
  if (!oilName) return data;
  return data.filter(item => item.oilName === oilName);
};

/**
 * 获取所有油品名称
 * @param data 原始数据
 * @returns 油品名称数组
 */
export const getAllOilNames = (data: StationControlFlowData[] = []): string[] => {
  const oilNames = new Set<string>();
  data.forEach(item => {
    if (item.oilName) {
      oilNames.add(item.oilName);
    }
  });
  return Array.from(oilNames);
};

/**
 * 获取所有结算状态
 * @param data 原始数据
 * @returns 结算状态数组
 */
export const getAllSettlementStatuses = (data: StationControlFlowData[] = []): string[] => {
  const statuses = new Set<string>();
  data.forEach(item => {
    if (item.settlementStatus) {
      statuses.add(item.settlementStatus);
    }
  });
  return Array.from(statuses);
};

/**
 * 获取所有管控状态
 * @param data 原始数据
 * @returns 管控状态数组
 */
export const getAllControlStatuses = (data: StationControlFlowData[] = []): string[] => {
  const statuses = new Set<string>();
  data.forEach(item => {
    if (item.controlStatus) {
      statuses.add(item.controlStatus);
    }
  });
  return Array.from(statuses);
};

/**
 * 应用所有过滤条件
 * @param data 原始数据
 * @param filters 过滤条件
 * @returns 过滤后的数据
 */
export const applyFilters = (
  data: StationControlFlowData[], 
  filters: ControlFlowFilterConditions
): StationControlFlowData[] => {
  let filteredData = [...data];
  
  // 应用各种过滤条件
  if (filters.stationIds && filters.stationIds.length > 0) {
    filteredData = filterDataByStationIds(filteredData, filters.stationIds);
  }
  
  if (filters.branchIds && filters.branchIds.length > 0) {
    filteredData = filterDataByBranchIds(filteredData, filters.branchIds);
  }
  
  if (filters.serviceAreaIds && filters.serviceAreaIds.length > 0) {
    filteredData = filterDataByServiceAreaIds(filteredData, filters.serviceAreaIds);
  }
  
  if (filters.dateRange) {
    filteredData = filterDataByDateRange(filteredData, filters.dateRange);
  }
  
  if (filters.settlementStatus) {
    filteredData = filterDataBySettlementStatus(filteredData, filters.settlementStatus);
  }
  
  if (filters.controlStatus) {
    filteredData = filterDataByControlStatus(filteredData, filters.controlStatus);
  }
  
  if (filters.oilName) {
    filteredData = filterDataByOilName(filteredData, filters.oilName);
  }
  
  return filteredData;
}; 