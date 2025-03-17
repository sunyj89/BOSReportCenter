/**
 * 格式化数字，保留2位小数
 * @param value 要格式化的数字
 * @returns 格式化后的数字字符串
 */
export const formatNumber = (value: any): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * 格式化货币，保留2位小数，添加人民币符号
 * @param value 要格式化的金额
 * @returns 格式化后的金额字符串
 */
export const formatCurrency = (value: any): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  
  return num.toLocaleString('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * 格式化百分比，保留2位小数，添加百分号
 * @param value 要格式化的百分比值（如0.1表示10%）
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: any): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  
  const num = Number(value);
  if (isNaN(num)) {
    return '-';
  }
  
  return num.toLocaleString('zh-CN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * 格式化日期，转为YYYY-MM-DD格式
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string): string => {
  if (!date) {
    return '-';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * 格式化日期时间，转为YYYY-MM-DD HH:mm:ss格式
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: Date | string): string => {
  if (!date) {
    return '-';
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * 格式化日期范围，转为YYYY-MM-DD ~ YYYY-MM-DD格式
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 格式化后的日期范围字符串
 */
export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
};

/**
 * 解析日期范围字符串，返回开始和结束日期
 * @param dateRangeStr 日期范围字符串，格式为"YYYY-MM-DD ~ YYYY-MM-DD"
 * @returns 包含开始和结束日期的数组
 */
export const parseDateRange = (dateRangeStr: string): [Date, Date] => {
  const [startStr, endStr] = dateRangeStr.split('~').map(d => d.trim());
  return [new Date(startStr), new Date(endStr)];
}; 