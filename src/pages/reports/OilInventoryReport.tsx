import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  TreeSelect, 
  DatePicker, 
  Button, 
  Table, 
  Space,
  Row,
  Col,
  Drawer,
  Descriptions,
  Typography,
  Select,
  Tabs,
  Checkbox,
  Divider,
  message,
  Tag,
  Tooltip
} from 'antd';
import { DownloadOutlined, SearchOutlined, ReloadOutlined, SettingOutlined, ExportOutlined, FilterOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { TreeSelectProps } from 'antd/es/tree-select';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { 
  CombinedReportData, 
  ColumnVisibility, 
  FilterConditions 
} from '../../types/reportTypes';
import {
  loadCombinedData,
  filterDataByStationIds,
  filterDataByBranchIds,
  filterDataByServiceAreaIds,
  filterDataByOilNames,
  filterDataByDateRange,
  getAllOilNames
} from '../../services/reportDataService';
import { formatCurrency, formatNumber, formatDateRange } from '../../utils/formatUtils';
import { orgData } from '../../utils/orgData';
import { exportToExcel } from '../../utils/exportUtils';

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

// 修改组件实现
const OilInventoryReport: React.FC = () => {
  // 状态定义
  const [combinedData, setCombinedData] = useState<CombinedReportData[]>([]);
  const [filteredData, setFilteredData] = useState<CombinedReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [oilNames, setOilNames] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    stationIds?: string[];
    branchIds?: string[];
    serviceAreaIds?: string[];
    oilName?: string;
    dateRange?: [string, string];
  }>({});
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('initial');
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    // 期初数据列
    initialV20Liters: true,
    initialPrice: true,
    initialAmount: true,
    quantityTons: true,
    quantityRealSendV20Liters: true,
    quantityRealReceiveV20Liters: true,
    oilTaxIncludedAmount: true,
    oilTaxExcludedAmount: true,
    freightTaxIncluded: true,
    freightTaxExcluded: true,
    totalTaxIncluded: true,
    totalTaxExcluded: true,
    priceTaxIncluded: true,
    priceTaxExcluded: true,
    
    // 销售数据列
    outboundV20Liters: true,
    outboundVtLiters: true,
    expectedSalesAmount: true,
    cashAmount: true,
    wechatAmount: true,
    alipayAmount: true,
    creditCardAmount: true,
    otherAmount: true,
    actualSalesAmount: true,
    salesDifference: true,
    expectedSalesAmountWithTax: true,
    actualSalesAmountWithTax: true,
    cashPayment: true,
    oilCardPayment: true,
    wechatPayment: true,
    alipayPayment: true,
    cloudPayment: true,
    bankCardPayment: true,
    transferPayment: true,
    selfUsedWithTax: true,
    selfUsedWithoutTax: true,
    returnPayment: true,
    
    // 期末数据列
    bookV20Liters: true,
    actualV20Liters: true,
    differenceV20Liters: true,
    bookAmount: true,
    actualAmount: true,
    differenceAmount: true,
  });

  // 加载数据
  useEffect(() => {
    setLoading(true);
    try {
      const data = loadCombinedData();
      setCombinedData(data);
      setFilteredData(data);
      setOilNames(getAllOilNames());
    } catch (error) {
      message.error('加载数据失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 过滤数据
  useEffect(() => {
    if (combinedData.length > 0) {
      let filtered = [...combinedData];
      
      // 按分公司ID过滤
      if (filters.branchIds && filters.branchIds.length > 0) {
        filtered = filterDataByBranchIds(filtered, filters.branchIds);
      }
      
      // 按服务区ID过滤
      if (filters.serviceAreaIds && filters.serviceAreaIds.length > 0) {
        filtered = filterDataByServiceAreaIds(filtered, filters.serviceAreaIds);
      }
      
      // 按油站ID过滤
      if (filters.stationIds && filters.stationIds.length > 0) {
        filtered = filterDataByStationIds(filtered, filters.stationIds);
      }
      
      // 按油品名称过滤
      if (filters.oilName) {
        filtered = filterDataByOilNames(filtered, [filters.oilName]);
      }
      
      // 按日期范围过滤
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        filtered = filterDataByDateRange(filtered, filters.dateRange[0], filters.dateRange[1]);
      }
      
      setFilteredData(filtered);
    }
  }, [combinedData, filters]);

  // 基础列定义（所有数据类型共有）
  const baseColumns: ColumnsType<CombinedReportData> = [
    {
      title: '分公司',
      dataIndex: 'branchName',
      key: 'branchName',
      fixed: 'left',
      width: 120,
      sorter: (a, b) => (a.branchName || '').localeCompare(b.branchName || ''),
    },
    {
      title: '服务区',
      dataIndex: 'serviceAreaName',
      key: 'serviceAreaName',
      fixed: 'left',
      width: 120,
      sorter: (a, b) => (a.serviceAreaName || '').localeCompare(b.serviceAreaName || ''),
    },
    {
      title: '油站名称',
      dataIndex: 'stationName',
      key: 'stationName',
      fixed: 'left',
      width: 120,
      sorter: (a, b) => a.stationName.localeCompare(b.stationName),
    },
    {
      title: '油品名称',
      dataIndex: 'oilName',
      key: 'oilName',
      fixed: 'left',
      width: 120,
      sorter: (a, b) => a.oilName.localeCompare(b.oilName),
    },
    {
      title: '日期范围',
      dataIndex: 'dateRange',
      key: 'dateRange',
      fixed: 'left',
      width: 180,
      sorter: (a, b) => a.dateRange.localeCompare(b.dateRange),
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      key: 'dataType',
      fixed: 'left',
      width: 100,
      render: (text) => {
        const typeMap = {
          initial: { text: '期初数据', color: 'blue' },
          sales: { text: '销售数据', color: 'green' },
          final: { text: '期末数据', color: 'orange' },
        };
        const type = typeMap[text as keyof typeof typeMap];
        return <Tag color={type.color}>{type.text}</Tag>;
      },
    },
  ];

  // 期初数据列定义
  const initialColumns: ColumnsType<CombinedReportData> = [
    {
      title: '期初库存(V20升)',
      dataIndex: 'initialV20Liters',
      key: 'initialV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.initialV20Liters || 0) - (b.initialV20Liters || 0),
    },
    {
      title: '数量(吨)',
      dataIndex: 'quantityTons',
      key: 'quantityTons',
      width: 120,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.quantityTons || 0) - (b.quantityTons || 0),
    },
    {
      title: '数量(实发V20,升)',
      dataIndex: 'quantityRealSendV20Liters',
      key: 'quantityRealSendV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.quantityRealSendV20Liters || 0) - (b.quantityRealSendV20Liters || 0),
    },
    {
      title: '数量(实收V20,升)',
      dataIndex: 'quantityRealReceiveV20Liters',
      key: 'quantityRealReceiveV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.quantityRealReceiveV20Liters || 0) - (b.quantityRealReceiveV20Liters || 0),
    },
    {
      title: '油品含税金额(元)',
      dataIndex: 'oilTaxIncludedAmount',
      key: 'oilTaxIncludedAmount',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.oilTaxIncludedAmount || 0) - (b.oilTaxIncludedAmount || 0),
    },
    {
      title: '不含税金额(元)',
      dataIndex: 'oilTaxExcludedAmount',
      key: 'oilTaxExcludedAmount',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.oilTaxExcludedAmount || 0) - (b.oilTaxExcludedAmount || 0),
    },
    {
      title: '运费含税(元)',
      dataIndex: 'freightTaxIncluded',
      key: 'freightTaxIncluded',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.freightTaxIncluded || 0) - (b.freightTaxIncluded || 0),
    },
    {
      title: '不含税运费(元)',
      dataIndex: 'freightTaxExcluded',
      key: 'freightTaxExcluded',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.freightTaxExcluded || 0) - (b.freightTaxExcluded || 0),
    },
    {
      title: '含税购油+含税运费合计(元)',
      dataIndex: 'totalTaxIncluded',
      key: 'totalTaxIncluded',
      width: 200,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.totalTaxIncluded || 0) - (b.totalTaxIncluded || 0),
    },
    {
      title: '不含税购油+不含税运费合计(元)',
      dataIndex: 'totalTaxExcluded',
      key: 'totalTaxExcluded',
      width: 220,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.totalTaxExcluded || 0) - (b.totalTaxExcluded || 0),
    },
    {
      title: '含税单价(元)',
      dataIndex: 'priceTaxIncluded',
      key: 'priceTaxIncluded',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.priceTaxIncluded || 0) - (b.priceTaxIncluded || 0),
    },
    {
      title: '不含税单价(元)',
      dataIndex: 'priceTaxExcluded',
      key: 'priceTaxExcluded',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.priceTaxExcluded || 0) - (b.priceTaxExcluded || 0),
    },
    {
      title: '期初单价(元/升)',
      dataIndex: 'initialPrice',
      key: 'initialPrice',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.initialPrice || 0) - (b.initialPrice || 0),
    },
    {
      title: '期初金额(元)',
      dataIndex: 'initialAmount',
      key: 'initialAmount',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.initialAmount || 0) - (b.initialAmount || 0),
    },
  ];

  // 销售数据列定义
  const salesColumns: ColumnsType<CombinedReportData> = [
    {
      title: '出库量(V20升)',
      dataIndex: 'outboundV20Liters',
      key: 'outboundV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.outboundV20Liters || 0) - (b.outboundV20Liters || 0),
    },
    {
      title: '出库总数量(Vt升)',
      dataIndex: 'outboundVtLiters',
      key: 'outboundVtLiters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.outboundVtLiters || 0) - (b.outboundVtLiters || 0),
    },
    {
      title: '应收销售金额(元)',
      dataIndex: 'expectedSalesAmountWithTax',
      key: 'expectedSalesAmountWithTax',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.expectedSalesAmountWithTax || 0) - (b.expectedSalesAmountWithTax || 0),
    },
    {
      title: (
        <span>
          实收销售金额(元)
          <Tooltip title="计算公式：现金 + 加油卡 + 微信支付 + 支付宝 + 云闪付 + 银行卡">
            <QuestionCircleOutlined style={{ marginLeft: 5 }} />
          </Tooltip>
        </span>
      ),
      dataIndex: 'actualSalesAmountWithTax',
      key: 'actualSalesAmountWithTax',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.actualSalesAmountWithTax || 0) - (b.actualSalesAmountWithTax || 0),
    },
    {
      title: '现金',
      dataIndex: 'cashPayment',
      key: 'cashPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.cashPayment || 0) - (b.cashPayment || 0),
    },
    {
      title: '加油卡',
      dataIndex: 'oilCardPayment',
      key: 'oilCardPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.oilCardPayment || 0) - (b.oilCardPayment || 0),
    },
    {
      title: '微信支付',
      dataIndex: 'wechatPayment',
      key: 'wechatPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.wechatPayment || 0) - (b.wechatPayment || 0),
    },
    {
      title: '支付宝',
      dataIndex: 'alipayPayment',
      key: 'alipayPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.alipayPayment || 0) - (b.alipayPayment || 0),
    },
    {
      title: '云闪付',
      dataIndex: 'cloudPayment',
      key: 'cloudPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.cloudPayment || 0) - (b.cloudPayment || 0),
    },
    {
      title: '银行卡-标记',
      dataIndex: 'bankCardPayment',
      key: 'bankCardPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.bankCardPayment || 0) - (b.bankCardPayment || 0),
    },
    {
      title: '转结成本金额',
      dataIndex: 'transferPayment',
      key: 'transferPayment',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.transferPayment || 0) - (b.transferPayment || 0),
    },
    {
      title: '自用(升)',
      dataIndex: 'selfUsedWithTax',
      key: 'selfUsedWithTax',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.selfUsedWithTax || 0) - (b.selfUsedWithTax || 0),
    },
    {
      title: '自用不含税金额',
      dataIndex: 'selfUsedWithoutTax',
      key: 'selfUsedWithoutTax',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.selfUsedWithoutTax || 0) - (b.selfUsedWithoutTax || 0),
    },
    {
      title: '回灌油(升)',
      dataIndex: 'returnPayment',
      key: 'returnPayment',
      width: 120,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.returnPayment || 0) - (b.returnPayment || 0),
    },
  ];

  // 期末数据列定义
  const finalColumns: ColumnsType<CombinedReportData> = [
    {
      title: '账面库存(V20升)',
      dataIndex: 'bookV20Liters',
      key: 'bookV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.bookV20Liters || 0) - (b.bookV20Liters || 0),
    },
    {
      title: '实际库存(V20升)',
      dataIndex: 'actualV20Liters',
      key: 'actualV20Liters',
      width: 150,
      render: (text) => formatNumber(text),
      sorter: (a, b) => (a.actualV20Liters || 0) - (b.actualV20Liters || 0),
    },
    {
      title: '库存差异(V20升)',
      dataIndex: 'differenceV20Liters',
      key: 'differenceV20Liters',
      width: 150,
      render: (text) => {
        const value = Number(text);
        return (
          <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : 'inherit' }}>
            {formatNumber(text)}
          </span>
        );
      },
      sorter: (a, b) => (a.differenceV20Liters || 0) - (b.differenceV20Liters || 0),
    },
    {
      title: '账面金额(元)',
      dataIndex: 'bookAmount',
      key: 'bookAmount',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.bookAmount || 0) - (b.bookAmount || 0),
    },
    {
      title: '实际金额(元)',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
      width: 150,
      render: (text) => formatCurrency(text),
      sorter: (a, b) => (a.actualAmount || 0) - (b.actualAmount || 0),
    },
    {
      title: '金额差异(元)',
      dataIndex: 'differenceAmount',
      key: 'differenceAmount',
      width: 150,
      render: (text) => {
        const value = Number(text);
        return (
          <span style={{ color: value > 0 ? 'green' : value < 0 ? 'red' : 'inherit' }}>
            {formatCurrency(text)}
          </span>
        );
      },
      sorter: (a, b) => (a.differenceAmount || 0) - (b.differenceAmount || 0),
    },
  ];

  // 根据数据类型和可见性过滤列
  const getFilteredColumns = (dataType: string): ColumnsType<CombinedReportData> => {
    let typeColumns: ColumnsType<CombinedReportData> = [];
    
    if (dataType === 'initial') {
      typeColumns = initialColumns.filter(col => {
        if ('dataIndex' in col) {
          const dataIndex = col.dataIndex as string;
          return visibleColumns[dataIndex as keyof ColumnVisibility];
        }
        return true;
      });
    } else if (dataType === 'sales') {
      typeColumns = salesColumns.filter(col => {
        if ('dataIndex' in col) {
          const dataIndex = col.dataIndex as string;
          return visibleColumns[dataIndex as keyof ColumnVisibility];
        }
        return true;
      });
    } else if (dataType === 'final') {
      typeColumns = finalColumns.filter(col => {
        if ('dataIndex' in col) {
          const dataIndex = col.dataIndex as string;
          return visibleColumns[dataIndex as keyof ColumnVisibility];
        }
        return true;
      });
    }
    
    return [...baseColumns, ...typeColumns];
  };

  // 获取当前数据类型的数据
  const getDataByType = (dataType: string) => {
    return filteredData.filter(item => item.dataType === dataType);
  };

  // 计算汇总行
  const getSummary = (dataType: string) => {
    const data = getDataByType(dataType);
    
    if (data.length === 0) return null;
    
    const summary: any = {
      key: 'summary',
      stationName: '合计',
      branchName: '',
      serviceAreaName: '',
      oilName: '',
      dateRange: '',
      dataType: dataType,
    };
    
    if (dataType === 'initial') {
      summary.initialV20Liters = data.reduce((sum, item) => sum + (item.initialV20Liters || 0), 0);
      summary.initialAmount = data.reduce((sum, item) => sum + (item.initialAmount || 0), 0);
      // 新增字段汇总
      summary.quantityTons = data.reduce((sum, item) => sum + (item.quantityTons || 0), 0);
      summary.quantityRealSendV20Liters = data.reduce((sum, item) => sum + (item.quantityRealSendV20Liters || 0), 0);
      summary.quantityRealReceiveV20Liters = data.reduce((sum, item) => sum + (item.quantityRealReceiveV20Liters || 0), 0);
      summary.oilTaxIncludedAmount = data.reduce((sum, item) => sum + (item.oilTaxIncludedAmount || 0), 0);
      summary.oilTaxExcludedAmount = data.reduce((sum, item) => sum + (item.oilTaxExcludedAmount || 0), 0);
      summary.freightTaxIncluded = data.reduce((sum, item) => sum + (item.freightTaxIncluded || 0), 0);
      summary.freightTaxExcluded = data.reduce((sum, item) => sum + (item.freightTaxExcluded || 0), 0);
      summary.totalTaxIncluded = data.reduce((sum, item) => sum + (item.totalTaxIncluded || 0), 0);
      summary.totalTaxExcluded = data.reduce((sum, item) => sum + (item.totalTaxExcluded || 0), 0);
      // 单价不需要汇总
    } else if (dataType === 'sales') {
      summary.outboundV20Liters = data.reduce((sum, item) => sum + (item.outboundV20Liters || 0), 0);
      summary.expectedSalesAmount = data.reduce((sum, item) => sum + (item.expectedSalesAmount || 0), 0);
      summary.cashAmount = data.reduce((sum, item) => sum + (item.cashAmount || 0), 0);
      summary.wechatAmount = data.reduce((sum, item) => sum + (item.wechatAmount || 0), 0);
      summary.alipayAmount = data.reduce((sum, item) => sum + (item.alipayAmount || 0), 0);
      summary.creditCardAmount = data.reduce((sum, item) => sum + (item.creditCardAmount || 0), 0);
      summary.otherAmount = data.reduce((sum, item) => sum + (item.otherAmount || 0), 0);
      summary.actualSalesAmount = data.reduce((sum, item) => sum + (item.actualSalesAmount || 0), 0);
      summary.salesDifference = data.reduce((sum, item) => sum + (item.salesDifference || 0), 0);
      // 新增字段汇总
      summary.outboundVtLiters = data.reduce((sum, item) => sum + (item.outboundVtLiters || 0), 0);
      summary.expectedSalesAmountWithTax = data.reduce((sum, item) => sum + (item.expectedSalesAmountWithTax || 0), 0);
      summary.actualSalesAmountWithTax = data.reduce((sum, item) => sum + (item.actualSalesAmountWithTax || 0), 0);
      summary.cashPayment = data.reduce((sum, item) => sum + (item.cashPayment || 0), 0);
      summary.oilCardPayment = data.reduce((sum, item) => sum + (item.oilCardPayment || 0), 0);
      summary.wechatPayment = data.reduce((sum, item) => sum + (item.wechatPayment || 0), 0);
      summary.alipayPayment = data.reduce((sum, item) => sum + (item.alipayPayment || 0), 0);
      summary.cloudPayment = data.reduce((sum, item) => sum + (item.cloudPayment || 0), 0);
      summary.bankCardPayment = data.reduce((sum, item) => sum + (item.bankCardPayment || 0), 0);
      summary.transferPayment = data.reduce((sum, item) => sum + (item.transferPayment || 0), 0);
      summary.selfUsedWithTax = data.reduce((sum, item) => sum + (item.selfUsedWithTax || 0), 0);
      summary.selfUsedWithoutTax = data.reduce((sum, item) => sum + (item.selfUsedWithoutTax || 0), 0);
      summary.returnPayment = data.reduce((sum, item) => sum + (item.returnPayment || 0), 0);
    } else if (dataType === 'final') {
      summary.bookV20Liters = data.reduce((sum, item) => sum + (item.bookV20Liters || 0), 0);
      summary.actualV20Liters = data.reduce((sum, item) => sum + (item.actualV20Liters || 0), 0);
      summary.differenceV20Liters = data.reduce((sum, item) => sum + (item.differenceV20Liters || 0), 0);
      summary.bookAmount = data.reduce((sum, item) => sum + (item.bookAmount || 0), 0);
      summary.actualAmount = data.reduce((sum, item) => sum + (item.actualAmount || 0), 0);
      summary.differenceAmount = data.reduce((sum, item) => sum + (item.differenceAmount || 0), 0);
    }
    
    return summary;
  };

  // 处理过滤条件变化
  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理树选择变化
  const handleTreeSelectChange = (value: any) => {
    // 根据选中的节点类型，更新不同的过滤条件
    const branchIds: string[] = [];
    const serviceAreaIds: string[] = [];
    const stationIds: string[] = [];
    
    if (Array.isArray(value)) {
      value.forEach((id: string) => {
        if (id.startsWith('branch-')) {
          branchIds.push(id);
        } else if (id.startsWith('service-area-')) {
          serviceAreaIds.push(id);
        } else if (id.startsWith('station-')) {
          stationIds.push(id);
        }
      });
    }
    
    setFilters(prev => ({
      ...prev,
      branchIds,
      serviceAreaIds,
      stationIds,
    }));
  };

  // 处理列可见性变化
  const handleColumnVisibilityChange = (field: keyof ColumnVisibility, checked: boolean) => {
    setVisibleColumns(prev => ({
      ...prev,
      [field]: checked,
    }));
  };

  // 处理分类列全选/全不选
  const handleSelectAllColumns = (type: 'initial' | 'sales' | 'final', checked: boolean) => {
    setVisibleColumns(prev => {
      const newState = { ...prev };
      
      if (type === 'initial') {
        // 期初数据列
        newState.initialV20Liters = checked;
        newState.initialPrice = checked;
        newState.initialAmount = checked;
        newState.quantityTons = checked;
        newState.quantityRealSendV20Liters = checked;
        newState.quantityRealReceiveV20Liters = checked;
        newState.oilTaxIncludedAmount = checked;
        newState.oilTaxExcludedAmount = checked;
        newState.freightTaxIncluded = checked;
        newState.freightTaxExcluded = checked;
        newState.totalTaxIncluded = checked;
        newState.totalTaxExcluded = checked;
        newState.priceTaxIncluded = checked;
        newState.priceTaxExcluded = checked;
      } else if (type === 'sales') {
        // 销售数据列 - 只更新UI中显示的设置选项
        newState.outboundV20Liters = checked;
        newState.outboundVtLiters = checked;
        newState.expectedSalesAmountWithTax = checked;
        newState.actualSalesAmountWithTax = checked;
        newState.cashPayment = checked;
        newState.oilCardPayment = checked;
        newState.wechatPayment = checked;
        newState.alipayPayment = checked;
        newState.cloudPayment = checked;
        newState.bankCardPayment = checked;
        newState.transferPayment = checked;
        newState.selfUsedWithTax = checked;
        newState.selfUsedWithoutTax = checked;
        newState.returnPayment = checked;
      } else if (type === 'final') {
        // 期末数据列
        newState.bookV20Liters = checked;
        newState.actualV20Liters = checked;
        newState.differenceV20Liters = checked;
        newState.bookAmount = checked;
        newState.actualAmount = checked;
        newState.differenceAmount = checked;
      }
      
      return newState;
    });
  };

  // 检查分类是否全部选中
  const isAllSelected = (type: 'initial' | 'sales' | 'final'): boolean => {
    if (type === 'initial') {
      return visibleColumns.initialV20Liters && 
             visibleColumns.initialPrice && 
             visibleColumns.initialAmount &&
             visibleColumns.quantityTons &&
             visibleColumns.quantityRealSendV20Liters &&
             visibleColumns.quantityRealReceiveV20Liters &&
             visibleColumns.oilTaxIncludedAmount &&
             visibleColumns.oilTaxExcludedAmount &&
             visibleColumns.freightTaxIncluded &&
             visibleColumns.freightTaxExcluded &&
             visibleColumns.totalTaxIncluded &&
             visibleColumns.totalTaxExcluded &&
             visibleColumns.priceTaxIncluded &&
             visibleColumns.priceTaxExcluded;
    } else if (type === 'sales') {
      // 只检查UI中显示的设置选项
      return visibleColumns.outboundV20Liters && 
             visibleColumns.outboundVtLiters &&
             visibleColumns.expectedSalesAmountWithTax &&
             visibleColumns.actualSalesAmountWithTax &&
             visibleColumns.cashPayment &&
             visibleColumns.oilCardPayment &&
             visibleColumns.wechatPayment &&
             visibleColumns.alipayPayment &&
             visibleColumns.cloudPayment &&
             visibleColumns.bankCardPayment &&
             visibleColumns.transferPayment &&
             visibleColumns.selfUsedWithTax &&
             visibleColumns.selfUsedWithoutTax &&
             visibleColumns.returnPayment;
    } else if (type === 'final') {
      return visibleColumns.bookV20Liters && 
             visibleColumns.actualV20Liters && 
             visibleColumns.differenceV20Liters && 
             visibleColumns.bookAmount && 
             visibleColumns.actualAmount && 
             visibleColumns.differenceAmount;
    }
    return false;
  };

  // 检查分类是否部分选中
  const isPartiallySelected = (type: 'initial' | 'sales' | 'final'): boolean => {
    if (type === 'initial') {
      const selected = [
        visibleColumns.initialV20Liters,
        visibleColumns.initialPrice,
        visibleColumns.initialAmount,
        visibleColumns.quantityTons,
        visibleColumns.quantityRealSendV20Liters,
        visibleColumns.quantityRealReceiveV20Liters,
        visibleColumns.oilTaxIncludedAmount,
        visibleColumns.oilTaxExcludedAmount,
        visibleColumns.freightTaxIncluded,
        visibleColumns.freightTaxExcluded,
        visibleColumns.totalTaxIncluded,
        visibleColumns.totalTaxExcluded,
        visibleColumns.priceTaxIncluded,
        visibleColumns.priceTaxExcluded
      ];
      return selected.some(Boolean) && !selected.every(Boolean);
    } else if (type === 'sales') {
      // 只检查UI中显示的设置选项
      const selected = [
        visibleColumns.outboundV20Liters,
        visibleColumns.outboundVtLiters,
        visibleColumns.expectedSalesAmountWithTax,
        visibleColumns.actualSalesAmountWithTax,
        visibleColumns.cashPayment,
        visibleColumns.oilCardPayment,
        visibleColumns.wechatPayment,
        visibleColumns.alipayPayment,
        visibleColumns.cloudPayment,
        visibleColumns.bankCardPayment,
        visibleColumns.transferPayment,
        visibleColumns.selfUsedWithTax,
        visibleColumns.selfUsedWithoutTax,
        visibleColumns.returnPayment
      ];
      return selected.some(Boolean) && !selected.every(Boolean);
    } else if (type === 'final') {
      const selected = [
        visibleColumns.bookV20Liters,
        visibleColumns.actualV20Liters,
        visibleColumns.differenceV20Liters,
        visibleColumns.bookAmount,
        visibleColumns.actualAmount,
        visibleColumns.differenceAmount
      ];
      return selected.some(Boolean) && !selected.every(Boolean);
    }
    return false;
  };

  // 导出报表
  const handleExport = () => {
    try {
      // 导出所有数据（期初、销售、期末）
      exportToExcel(filteredData, visibleColumns, '油品进销存报表');
      message.success('报表导出成功');
    } catch (error) {
      console.error('导出报表失败:', error);
      message.error('报表导出失败');
    }
  };

  // 重置过滤条件
  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="oil-inventory-report">
      <Card
        title={<Title level={4}>油品进销存报表</Title>}
        extra={
          <Space>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setSettingsVisible(true)}
            >
              列设置
            </Button>
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出报表
            </Button>
          </Space>
        }
      >
        {/* 过滤条件 */}
        <div className="filter-section" style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={5}>
              <TreeSelect
                placeholder="选择油站"
                style={{ width: '100%' }}
                allowClear
                treeData={orgData}
                treeCheckable={true}
                showCheckedStrategy={SHOW_PARENT}
                treeDefaultExpandAll
                value={[
                  ...(filters.branchIds || []),
                  ...(filters.serviceAreaIds || []),
                  ...(filters.stationIds || [])
                ]}
                onChange={handleTreeSelectChange}
                treeNodeFilterProp="title"
                showSearch
                maxTagCount={3}
                maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}...`}
              />
            </Col>
            <Col span={5}>
              <Select
                placeholder="选择油品"
                style={{ width: '100%' }}
                allowClear
                value={filters.oilName}
                onChange={(value) => handleFilterChange('oilName', value)}
              >
                {getAllOilNames().map(name => (
                  <Option key={name} value={name}>{name}</Option>
                ))}
              </Select>
            </Col>
            <Col span={8}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    const startDate = dates[0].format('YYYY-MM-DD');
                    const endDate = dates[1].format('YYYY-MM-DD');
                    handleFilterChange('dateRange', [startDate, endDate]);
                  } else {
                    handleFilterChange('dateRange', undefined);
                  }
                }}
              />
            </Col>
            <Col span={6}>
              <Space>
                <Button
                  type="primary"
                  icon={<FilterOutlined />}
                >
                  筛选
                </Button>
                <Button onClick={handleResetFilters}>重置</Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 数据类型选择 */}
        <div className="tab-section" style={{ marginBottom: 16 }}>
          <Space size="large">
            <Button
              type={activeTab === 'initial' ? 'primary' : 'default'}
              onClick={() => setActiveTab('initial')}
            >
              期初数据
            </Button>
            <Button
              type={activeTab === 'sales' ? 'primary' : 'default'}
              onClick={() => setActiveTab('sales')}
            >
              销售数据
            </Button>
            <Button
              type={activeTab === 'final' ? 'primary' : 'default'}
              onClick={() => setActiveTab('final')}
            >
              期末数据
            </Button>
          </Space>
        </div>

        {/* 数据表格 */}
        <Table
          columns={getFilteredColumns(activeTab)}
          dataSource={[...getDataByType(activeTab), getSummary(activeTab)].filter(Boolean)}
          rowKey="key"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          summary={() => null} // 使用自定义汇总行
        />
      </Card>

      {/* 列设置抽屉 */}
      <Drawer
        title="列设置"
        placement="right"
        onClose={() => setSettingsVisible(false)}
        open={settingsVisible}
        width={300}
      >
        <div style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <Divider orientation="left">期初数据列</Divider>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Checkbox
              checked={isAllSelected('initial')}
              indeterminate={isPartiallySelected('initial')}
              onChange={(e) => handleSelectAllColumns('initial', e.target.checked)}
            >
              全选
            </Checkbox>
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleSelectAllColumns('initial', false)}
            >
              全不选
            </Button>
          </div>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.initialV20Liters}
                onChange={(e) => handleColumnVisibilityChange('initialV20Liters', e.target.checked)}
              >
                期初库存(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.quantityTons}
                onChange={(e) => handleColumnVisibilityChange('quantityTons', e.target.checked)}
              >
                期初吨数(吨)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.quantityRealSendV20Liters}
                onChange={(e) => handleColumnVisibilityChange('quantityRealSendV20Liters', e.target.checked)}
              >
                实际发送量(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.quantityRealReceiveV20Liters}
                onChange={(e) => handleColumnVisibilityChange('quantityRealReceiveV20Liters', e.target.checked)}
              >
                实际接收量(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.oilTaxIncludedAmount}
                onChange={(e) => handleColumnVisibilityChange('oilTaxIncludedAmount', e.target.checked)}
              >
                含税金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.oilTaxExcludedAmount}
                onChange={(e) => handleColumnVisibilityChange('oilTaxExcludedAmount', e.target.checked)}
              >
                不含税金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.freightTaxIncluded}
                onChange={(e) => handleColumnVisibilityChange('freightTaxIncluded', e.target.checked)}
              >
                含运费金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.freightTaxExcluded}
                onChange={(e) => handleColumnVisibilityChange('freightTaxExcluded', e.target.checked)}
              >
                不含运费金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.totalTaxIncluded}
                onChange={(e) => handleColumnVisibilityChange('totalTaxIncluded', e.target.checked)}
              >
                含税总额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.totalTaxExcluded}
                onChange={(e) => handleColumnVisibilityChange('totalTaxExcluded', e.target.checked)}
              >
                不含税总额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.priceTaxIncluded}
                onChange={(e) => handleColumnVisibilityChange('priceTaxIncluded', e.target.checked)}
              >
                含税单价(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.priceTaxExcluded}
                onChange={(e) => handleColumnVisibilityChange('priceTaxExcluded', e.target.checked)}
              >
                不含税单价(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.initialPrice}
                onChange={(e) => handleColumnVisibilityChange('initialPrice', e.target.checked)}
              >
                期初单价(元/升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.initialAmount}
                onChange={(e) => handleColumnVisibilityChange('initialAmount', e.target.checked)}
              >
                期初金额(元)
              </Checkbox>
            </Col>
          </Row>

          <Divider orientation="left">销售数据列</Divider>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Checkbox
              checked={isAllSelected('sales')}
              indeterminate={isPartiallySelected('sales')}
              onChange={(e) => handleSelectAllColumns('sales', e.target.checked)}
            >
              全选
            </Checkbox>
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleSelectAllColumns('sales', false)}
            >
              全不选
            </Button>
          </div>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.outboundV20Liters}
                onChange={(e) => handleColumnVisibilityChange('outboundV20Liters', e.target.checked)}
              >
                出库量(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.outboundVtLiters}
                onChange={(e) => handleColumnVisibilityChange('outboundVtLiters', e.target.checked)}
              >
                出库总数量(Vt升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.expectedSalesAmountWithTax}
                onChange={(e) => handleColumnVisibilityChange('expectedSalesAmountWithTax', e.target.checked)}
              >
                应收销售金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.actualSalesAmountWithTax}
                onChange={(e) => handleColumnVisibilityChange('actualSalesAmountWithTax', e.target.checked)}
              >
                实收销售金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.cashPayment}
                onChange={(e) => handleColumnVisibilityChange('cashPayment', e.target.checked)}
              >
                现金
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.oilCardPayment}
                onChange={(e) => handleColumnVisibilityChange('oilCardPayment', e.target.checked)}
              >
                加油卡
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.wechatPayment}
                onChange={(e) => handleColumnVisibilityChange('wechatPayment', e.target.checked)}
              >
                微信支付
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.alipayPayment}
                onChange={(e) => handleColumnVisibilityChange('alipayPayment', e.target.checked)}
              >
                支付宝
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.cloudPayment}
                onChange={(e) => handleColumnVisibilityChange('cloudPayment', e.target.checked)}
              >
                云闪付
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.bankCardPayment}
                onChange={(e) => handleColumnVisibilityChange('bankCardPayment', e.target.checked)}
              >
                银行卡-标记
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.transferPayment}
                onChange={(e) => handleColumnVisibilityChange('transferPayment', e.target.checked)}
              >
                转结成本金额
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.selfUsedWithTax}
                onChange={(e) => handleColumnVisibilityChange('selfUsedWithTax', e.target.checked)}
              >
                自用(升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.selfUsedWithoutTax}
                onChange={(e) => handleColumnVisibilityChange('selfUsedWithoutTax', e.target.checked)}
              >
                自用不含税金额
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.returnPayment}
                onChange={(e) => handleColumnVisibilityChange('returnPayment', e.target.checked)}
              >
                回灌油(升)
              </Checkbox>
            </Col>
          </Row>

          <Divider orientation="left">期末数据列</Divider>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Checkbox
              checked={isAllSelected('final')}
              indeterminate={isPartiallySelected('final')}
              onChange={(e) => handleSelectAllColumns('final', e.target.checked)}
            >
              全选
            </Checkbox>
            <Button 
              type="link" 
              size="small" 
              onClick={() => handleSelectAllColumns('final', false)}
            >
              全不选
            </Button>
          </div>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.bookV20Liters}
                onChange={(e) => handleColumnVisibilityChange('bookV20Liters', e.target.checked)}
              >
                账面库存(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.actualV20Liters}
                onChange={(e) => handleColumnVisibilityChange('actualV20Liters', e.target.checked)}
              >
                实际库存(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.differenceV20Liters}
                onChange={(e) => handleColumnVisibilityChange('differenceV20Liters', e.target.checked)}
              >
                库存差异(V20升)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.bookAmount}
                onChange={(e) => handleColumnVisibilityChange('bookAmount', e.target.checked)}
              >
                账面金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.actualAmount}
                onChange={(e) => handleColumnVisibilityChange('actualAmount', e.target.checked)}
              >
                实际金额(元)
              </Checkbox>
            </Col>
            <Col span={24}>
              <Checkbox
                checked={visibleColumns.differenceAmount}
                onChange={(e) => handleColumnVisibilityChange('differenceAmount', e.target.checked)}
              >
                金额差异(元)
              </Checkbox>
            </Col>
          </Row>
        </div>
      </Drawer>
    </div>
  );
};

export default OilInventoryReport; 