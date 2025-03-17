// 期初库存数据接口
export interface InitialInventoryData {
  stationName: string;
  stationId?: string;
  branchName?: string;
  serviceAreaName?: string;
  oilName: string;
  dateRange: string;
  initialV20Liters: number;
  initialPrice: number;
  initialAmount: number;
  quantityTons: number;
  quantityRealSendV20Liters: number;
  quantityRealReceiveV20Liters: number;
  oilTaxIncludedAmount: number;
  oilTaxExcludedAmount: number;
  freightTaxIncluded: number;
  freightTaxExcluded: number;
  totalTaxIncluded: number;
  totalTaxExcluded: number;
  priceTaxIncluded: number;
  priceTaxExcluded: number;
}

// 销售数据接口
export interface SalesData {
  stationName: string;
  stationId?: string;
  branchName?: string;
  serviceAreaName?: string;
  oilName: string;
  dateRange: string;
  outboundV20Liters: number;
  expectedSalesAmount: number;
  cashAmount: number;
  wechatAmount: number;
  alipayAmount: number;
  creditCardAmount: number;
  otherAmount: number;
  actualSalesAmount: number;
  salesDifference: number;
  outboundVtLiters: number;
  expectedSalesAmountWithTax: number;
  actualSalesAmountWithTax: number;
  cashPayment: number;
  oilCardPayment: number;
  wechatPayment: number;
  alipayPayment: number;
  cloudPayment: number;
  bankCardPayment: number;
  transferPayment: number;
  selfUsedWithTax: number;
  selfUsedWithoutTax: number;
  returnPayment: number;
}

// 期末库存数据接口
export interface FinalInventoryData {
  stationName: string;
  stationId?: string;
  branchName?: string;
  serviceAreaName?: string;
  oilName: string;
  dateRange: string;
  bookV20Liters: number;
  actualV20Liters: number;
  differenceV20Liters: number;
  bookAmount: number;
  actualAmount: number;
  differenceAmount: number;
}

// 合并数据接口
export interface CombinedReportData {
  dataType: 'initial' | 'sales' | 'final';
  stationName: string;
  stationId?: string;
  branchName?: string;
  serviceAreaName?: string;
  oilName: string;
  dateRange: string;
  
  // 初始库存数据字段
  initialV20Liters?: number;
  initialPrice?: number;
  initialAmount?: number;
  quantityTons?: number;
  quantityRealSendV20Liters?: number;
  quantityRealReceiveV20Liters?: number;
  oilTaxIncludedAmount?: number;
  oilTaxExcludedAmount?: number;
  freightTaxIncluded?: number;
  freightTaxExcluded?: number;
  totalTaxIncluded?: number;
  totalTaxExcluded?: number;
  priceTaxIncluded?: number;
  priceTaxExcluded?: number;
  
  // 销售数据字段
  outboundV20Liters?: number;
  expectedSalesAmount?: number;
  cashAmount?: number;
  wechatAmount?: number;
  alipayAmount?: number;
  creditCardAmount?: number;
  otherAmount?: number;
  actualSalesAmount?: number;
  salesDifference?: number;
  outboundVtLiters?: number;
  expectedSalesAmountWithTax?: number;
  actualSalesAmountWithTax?: number;
  cashPayment?: number;
  oilCardPayment?: number;
  wechatPayment?: number;
  alipayPayment?: number;
  cloudPayment?: number;
  bankCardPayment?: number;
  transferPayment?: number;
  selfUsedWithTax?: number;
  selfUsedWithoutTax?: number;
  returnPayment?: number;
  
  // 最终库存数据字段
  bookV20Liters?: number;
  actualV20Liters?: number;
  differenceV20Liters?: number;
  bookAmount?: number;
  actualAmount?: number;
  differenceAmount?: number;
}

// 报表数据接口
export interface ReportData {
  initialInventoryData: InitialInventoryData[];
  salesData: SalesData[];
  finalInventoryData: FinalInventoryData[];
}

// 列可见性设置接口
export interface ColumnVisibility {
  // 期初数据列
  initialV20Liters: boolean;
  initialPrice: boolean;
  initialAmount: boolean;
  quantityTons: boolean;
  quantityRealSendV20Liters: boolean;
  quantityRealReceiveV20Liters: boolean;
  oilTaxIncludedAmount: boolean;
  oilTaxExcludedAmount: boolean;
  freightTaxIncluded: boolean;
  freightTaxExcluded: boolean;
  totalTaxIncluded: boolean;
  totalTaxExcluded: boolean;
  priceTaxIncluded: boolean;
  priceTaxExcluded: boolean;
  
  // 销售数据列 - 在UI中显示的设置选项
  outboundV20Liters: boolean;
  outboundVtLiters: boolean;
  expectedSalesAmountWithTax: boolean;
  actualSalesAmountWithTax: boolean;
  cashPayment: boolean;
  oilCardPayment: boolean;
  wechatPayment: boolean;
  alipayPayment: boolean;
  cloudPayment: boolean;
  bankCardPayment: boolean;
  transferPayment: boolean;
  selfUsedWithTax: boolean;
  selfUsedWithoutTax: boolean;
  returnPayment: boolean;
  
  // 以下字段在UI中不显示设置选项，但在数据结构中需要保留
  expectedSalesAmount?: boolean;
  cashAmount?: boolean;
  wechatAmount?: boolean;
  alipayAmount?: boolean;
  creditCardAmount?: boolean;
  otherAmount?: boolean;
  actualSalesAmount?: boolean;
  salesDifference?: boolean;
  
  // 期末数据列
  bookV20Liters: boolean;
  actualV20Liters: boolean;
  differenceV20Liters: boolean;
  bookAmount: boolean;
  actualAmount: boolean;
  differenceAmount: boolean;
}

// 过滤条件接口
export interface FilterConditions {
  stationIds?: string[];
  branchIds?: string[];
  serviceAreaIds?: string[];
  oilName?: string;
  dateRange?: [string, string];
}

// 表格列定义接口
export interface ColumnDefinition {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: boolean | ((a: any, b: any) => number);
  render?: (text: any, record: any) => React.ReactNode;
  width?: number;
  fixed?: 'left' | 'right';
}

// 油站销售明细表数据接口
export interface StationSalesDetailData {
  // 固定字段
  branchName: string;        // 分公司
  serviceAreaName: string;   // 服务区
  stationName: string;       // 油站名称
  stationId?: string;        // 油站ID
  orderNo: string;           // 订单流水号
  paymentNo: string;         // 支付流水号
  
  // 可配置字段
  transactionType: string;   // 交易类型
  orderTime: string;         // 下单时间
  paymentMethod: string;     // 支付方式
  paymentTime: string;       // 支付时间
  productType: string;       // 商品类型
  productCode: string;       // 商品编号
  productCategory: string;   // 商品类别
  productSubCategory: string; // 商品二级类别
  productName: string;       // 商品名称
  oilGunNo: string;          // 油枪号
  productUnit: string;       // 商品单位
  quantity: number;          // 数量
  unitPrice: number;         // 单价
  receivableAmount: number;  // 应收金额
  totalDiscountAmount: number; // 优惠总金额
  actualAmount: number;      // 实收金额
  discountAmount: number;    // 折扣金额
  couponAmount: number;      // 优惠券金额
  pointsDeductionAmount: number; // 积分抵现金额
  pointsUsed: number;        // 使用积分
  costAmount: number;        // 成本金额
  profit: number;            // 利润
  salesProfitRate: number;   // 销售利润率
  costProfitRate: number;    // 成本利润率
  taxRate: number;           // 税率
  actualAmountExcludingTax: number; // 实收金额（不含税）
  costAmountExcludingTax: number;   // 成本金额（不含税）
  profitExcludingTax: number;       // 利润（不含税）
  shiftName: string;         // 班次名称
  cashier: string;           // 收银员
  memberPhone: string;       // 会员手机号
  orderSource: string;       // 订单来源
  createTime: string;        // 创建时间
}

// 油站销售明细表列可见性设置接口
export interface StationSalesDetailColumnVisibility {
  // 固定字段始终可见，不需要包含在可见性设置中
  
  // 可配置字段
  transactionType: boolean;   // 交易类型
  orderTime: boolean;         // 下单时间
  paymentMethod: boolean;     // 支付方式
  paymentTime: boolean;       // 支付时间
  paymentNo: boolean;         // 支付流水号
  productType: boolean;       // 商品类型
  productCode: boolean;       // 商品编号
  productCategory: boolean;   // 商品类别
  productSubCategory: boolean; // 商品二级类别
  productName: boolean;       // 商品名称
  oilGunNo: boolean;          // 油枪号
  productUnit: boolean;       // 商品单位
  quantity: boolean;          // 数量
  unitPrice: boolean;         // 单价
  receivableAmount: boolean;  // 应收金额
  totalDiscountAmount: boolean; // 优惠总金额
  actualAmount: boolean;      // 实收金额
  discountAmount: boolean;    // 折扣金额
  couponAmount: boolean;      // 优惠券金额
  pointsDeductionAmount: boolean; // 积分抵现金额
  pointsUsed: boolean;        // 使用积分
  costAmount: boolean;        // 成本金额
  profit: boolean;            // 利润
  salesProfitRate: boolean;   // 销售利润率
  costProfitRate: boolean;    // 成本利润率
  taxRate: boolean;           // 税率
  actualAmountExcludingTax: boolean; // 实收金额（不含税）
  costAmountExcludingTax: boolean;   // 成本金额（不含税）
  profitExcludingTax: boolean;       // 利润（不含税）
  shiftName: boolean;         // 班次名称
  cashier: boolean;           // 收银员
  memberPhone: boolean;       // 会员手机号
  orderSource: boolean;       // 订单来源
  createTime: boolean;        // 创建时间
}

// 油站管控流水表数据接口
export interface StationControlFlowData {
  // 固定字段
  branchName: string;        // 分公司
  serviceAreaName: string;   // 服务区
  stationName: string;       // 油站名称
  stationId?: string;        // 油站ID
  controlFlowNo: string;     // 管控流水号
  
  // 可配置字段
  gunHangTime: string;       // 挂枪时间
  controlUploadTime: string; // 管控上传时间
  oilMachineNo: string;      // 油机号
  oilGunNo: string;          // 油枪号
  machineFlowNo: string;     // 机出流水号
  oilName: string;           // 油品名称
  quantity: number;          // 数量
  unitPrice: number;         // 单价
  controlAmount: number;     // 管控金额
  pumpMeterValue: number;    // 泵码数
  settlementTime: string;    // 结算时间
  settlementStatus: string;  // 结算状态
  shiftName: string;         // 班次名称
  orderNo: string;           // 订单流水号
  paymentNo: string;         // 支付单号
  paymentMethod: string;     // 支付方式
  controlCardType: string;   // 管控卡类型
  controlCardNo: string;     // 管控卡号
  controlCardFaceNo: string; // 管控卡面卡号
  controlCardBalance: number;// 管控卡余额
  oilOperator: string;       // 加油员
  controlStatus: string;     // 管控状态
}

// 油站管控流水表列可见性设置接口
export interface StationControlFlowColumnVisibility {
  // 可配置字段
  gunHangTime: boolean;       // 挂枪时间
  controlUploadTime: boolean; // 管控上传时间
  oilMachineNo: boolean;      // 油机号
  oilGunNo: boolean;          // 油枪号
  machineFlowNo: boolean;     // 机出流水号
  oilName: boolean;           // 油品名称
  quantity: boolean;          // 数量
  unitPrice: boolean;         // 单价
  controlAmount: boolean;     // 管控金额
  pumpMeterValue: boolean;    // 泵码数
  settlementTime: boolean;    // 结算时间
  settlementStatus: boolean;  // 结算状态
  shiftName: boolean;         // 班次名称
  orderNo: boolean;           // 订单流水号
  paymentNo: boolean;         // 支付单号
  paymentMethod: boolean;     // 支付方式
  controlCardType: boolean;   // 管控卡类型
  controlCardNo: boolean;     // 管控卡号
  controlCardFaceNo: boolean; // 管控卡面卡号
  controlCardBalance: boolean;// 管控卡余额
  oilOperator: boolean;       // 加油员
  controlStatus: boolean;     // 管控状态
}

// 过滤条件接口（扩展）
export interface ControlFlowFilterConditions {
  stationIds?: string[];
  branchIds?: string[];
  serviceAreaIds?: string[];
  dateRange?: [string, string];
  settlementStatus?: string;
  controlStatus?: string;
  oilName?: string;
} 