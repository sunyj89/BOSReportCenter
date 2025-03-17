// 使用全局变量XLSX，而不是导入模块
// import * as XLSX from 'xlsx';
import { CombinedReportData, ColumnVisibility, StationSalesDetailData } from '../types/reportTypes';
import { formatNumber, formatCurrency } from './formatUtils';

// 声明全局XLSX变量
declare const XLSX: any;

/**
 * 获取列标题映射
 * @returns 列标题映射对象
 */
const getColumnTitleMap = (): Record<string, string> => {
  return {
    // 基础列
    branchName: '分公司',
    serviceAreaName: '服务区',
    stationName: '油站名称',
    oilName: '油品名称',
    dateRange: '日期范围',
    
    // 期初数据列
    initialV20Liters: '期初库存(V20升)',
    initialPrice: '期初单价(元/升)',
    initialAmount: '期初金额(元)',
    quantityTons: '数量(吨)',
    quantityRealSendV20Liters: '数量(实发V20,升)',
    quantityRealReceiveV20Liters: '数量(实收V20,升)',
    oilTaxIncludedAmount: '油品含税金额(元)',
    oilTaxExcludedAmount: '不含税金额(元)',
    freightTaxIncluded: '运费含税(元)',
    freightTaxExcluded: '不含税运费(元)',
    totalTaxIncluded: '含税购油+含税运费合计(元)',
    totalTaxExcluded: '不含税购油+不含税运费合计(元)',
    priceTaxIncluded: '含税单价(元)',
    priceTaxExcluded: '不含税单价(元)',
    
    // 销售数据列
    outboundV20Liters: '出库量(V20升)',
    outboundVtLiters: '出库总数量(Vt升)',
    expectedSalesAmount: '应收销售金额(元)',
    expectedSalesAmountWithTax: '应收销售金额(元)(含税)',
    actualSalesAmount: '实收销售金额(元)',
    actualSalesAmountWithTax: '实收销售金额(元)(含税)',
    cashAmount: '现金支付(元)',
    wechatAmount: '微信支付(元)',
    alipayAmount: '支付宝支付(元)',
    creditCardAmount: '信用卡支付(元)',
    otherAmount: '其他支付(元)',
    salesDifference: '销售差异(元)',
    cashPayment: '现金',
    oilCardPayment: '加油卡',
    wechatPayment: '微信支付',
    alipayPayment: '支付宝',
    cloudPayment: '云闪付',
    bankCardPayment: '银行卡-标记',
    transferPayment: '转结成本金额',
    selfUsedWithTax: '自用(升)',
    selfUsedWithoutTax: '自用不含税金额',
    returnPayment: '回灌油(升)',
    
    // 期末数据列
    bookV20Liters: '账面库存(V20升)',
    actualV20Liters: '实际库存(V20升)',
    differenceV20Liters: '库存差异(V20升)',
    bookAmount: '账面金额(元)',
    actualAmount: '实际金额(元)',
    differenceAmount: '金额差异(元)',
  };
};

/**
 * 判断字段是否为货币字段
 * @param key 字段名
 * @returns 是否为货币字段
 */
const isMonetaryField = (key: string): boolean => {
  return key.includes('Amount') || 
         key.includes('Price') || 
         key.includes('Payment') || 
         key.includes('Tax');
};

/**
 * 格式化单元格值
 * @param value 值
 * @param isMonetary 是否为货币值
 * @returns 格式化后的字符串
 */
const formatCellValue = (value: any, isMonetary: boolean): string => {
  if (value === undefined || value === null) {
    return '';
  }
  
  if (typeof value === 'number') {
    if (isMonetary) {
      return formatCurrency(value).replace('¥', ''); // 移除货币符号
    } else {
      return formatNumber(value);
    }
  }
  
  return String(value);
};

/**
 * 导出数据到Excel
 * @param data 要导出的数据
 * @param visibleColumns 可见列设置
 * @param fileName 文件名
 */
export const exportToExcel = (
  data: CombinedReportData[],
  visibleColumns: ColumnVisibility,
  fileName: string = '油品进销存报表'
): void => {
  try {
    // 获取列标题映射
    const columnTitleMap = getColumnTitleMap();
    
    // 按油站、油品和日期分组
    const uniqueKeys = new Set<string>();
    const keyToDataMap: Record<string, {
      base: any,
      data: Record<string, any>
    }> = {};
    
    // 第一步：分组数据
    data.forEach(item => {
      const key = `${item.stationName}_${item.oilName}_${item.dateRange}`;
      uniqueKeys.add(key);
      
      if (!keyToDataMap[key]) {
        keyToDataMap[key] = {
          base: {
            branchName: item.branchName,
            serviceAreaName: item.serviceAreaName,
            stationName: item.stationName,
            oilName: item.oilName,
            dateRange: item.dateRange
          },
          data: {}
        };
      }
      
      // 合并所有字段，不区分数据类型
      Object.entries(item).forEach(([fieldKey, value]) => {
        // 跳过基础字段和数据类型字段
        if (fieldKey !== 'dataType' && 
            fieldKey !== 'branchName' && 
            fieldKey !== 'serviceAreaName' && 
            fieldKey !== 'stationName' && 
            fieldKey !== 'oilName' && 
            fieldKey !== 'dateRange') {
          
          if (value !== undefined) {
            keyToDataMap[key].data[fieldKey] = value;
          }
        }
      });
    });
    
    // 第二步：准备Excel数据
    const excelData: any[] = [];
    
    // 收集所有可见列
    const visibleColumnKeys: string[] = ['branchName', 'serviceAreaName', 'stationName', 'oilName', 'dateRange'];
    
    // 根据可见性设置过滤列
    Object.entries(visibleColumns).forEach(([key, isVisible]) => {
      if (isVisible && !visibleColumnKeys.includes(key)) {
        visibleColumnKeys.push(key);
      }
    });
    
    // 创建表头映射（用于Excel导出）
    const headerMap: Record<string, string> = {};
    
    // 添加所有列标题
    visibleColumnKeys.forEach(key => {
      headerMap[key] = columnTitleMap[key] || key;
    });
    
    // 第三步：合并数据
    uniqueKeys.forEach(key => {
      const groupData = keyToDataMap[key];
      const rowData: Record<string, any> = { ...groupData.base };
      
      // 添加所有数据
      Object.entries(groupData.data).forEach(([fieldKey, value]) => {
        if (visibleColumnKeys.includes(fieldKey)) {
          rowData[fieldKey] = formatCellValue(value, isMonetaryField(fieldKey));
        }
      });
      
      excelData.push(rowData);
    });
    
    // 第四步：创建工作簿和工作表
    const workbook = XLSX.utils.book_new();
    
    // 创建工作表（使用原始字段名）
    const worksheet = XLSX.utils.json_to_sheet(excelData, { header: visibleColumnKeys });
    
    // 替换表头为中文
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    visibleColumnKeys.forEach((key, idx) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: idx });
      worksheet[cellRef] = { t: 's', v: headerMap[key] };
    });
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '油品库存报表');
    
    // 导出工作簿
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('导出Excel失败:', error);
    throw error;
  }
};

/**
 * 导出油站销售明细表数据到Excel
 * @param data 要导出的数据
 * @param fileName 文件名
 */
export const exportStationSalesDetailToExcel = (
  data: Record<string, any>[],
  fileName: string = '油站销售明细表'
): void => {
  try {
    // 第一步：创建工作簿和工作表
    const workbook = XLSX.utils.book_new();
    
    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // 将工作表添加到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '油站销售明细表');
    
    // 导出工作簿
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('导出Excel失败:', error);
    throw error;
  }
}; 