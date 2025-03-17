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
  Checkbox,
  Divider,
  message,
  Tag
} from 'antd';
import { DownloadOutlined, SearchOutlined, ReloadOutlined, SettingOutlined, ExportOutlined } from '@ant-design/icons';
import type { TreeSelectProps } from 'antd/es/tree-select';
import type { ColumnsType } from 'antd/es/table';
import { 
  StationSalesDetailData, 
  StationSalesDetailColumnVisibility, 
  FilterConditions 
} from '../../types/reportTypes';
import {
  loadStationSalesDetailData,
  filterDataByStationIds,
  filterDataByBranchIds,
  filterDataByServiceAreaIds,
  filterDataByDateRange,
  filterDataByProductType,
  getAllProductTypes,
  applyFilters
} from '../../services/stationSalesDetailService';
import { formatCurrency, formatNumber } from '../../utils/formatUtils';
import { orgData } from '../../utils/orgData';
import { exportStationSalesDetailToExcel } from '../../utils/exportUtils';

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;
const { Title, Text } = Typography;
const { Option } = Select;

// 油站销售明细表组件
const StationSalesDetailReport: React.FC = () => {
  // 状态定义
  const [data, setData] = useState<StationSalesDetailData[]>([]);
  const [filteredData, setFilteredData] = useState<StationSalesDetailData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    stationIds?: string[];
    branchIds?: string[];
    serviceAreaIds?: string[];
    productType?: string;
    dateRange?: [string, string];
  }>({});
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<StationSalesDetailColumnVisibility>({
    // 默认所有可配置字段都可见
    transactionType: true,
    orderTime: true,
    paymentMethod: true,
    paymentTime: true,
    paymentNo: true,
    productType: true,
    productCode: true,
    productCategory: true,
    productSubCategory: true,
    productName: true,
    oilGunNo: true,
    productUnit: true,
    quantity: true,
    unitPrice: true,
    receivableAmount: true,
    totalDiscountAmount: true,
    actualAmount: true,
    discountAmount: true,
    couponAmount: true,
    pointsDeductionAmount: true,
    pointsUsed: true,
    costAmount: true,
    profit: true,
    salesProfitRate: true,
    costProfitRate: true,
    taxRate: true,
    actualAmountExcludingTax: true,
    costAmountExcludingTax: true,
    profitExcludingTax: true,
    shiftName: true,
    cashier: true,
    memberPhone: true,
    orderSource: true,
    createTime: true
  });
  
  // 加载数据
  useEffect(() => {
    loadData();
  }, []);
  
  // 监听过滤条件变化
  useEffect(() => {
    filterData();
  }, [data, filters]);
  
  // 加载数据方法
  const loadData = async () => {
    setLoading(true);
    try {
      // 加载销售明细数据
      const salesDetailData = loadStationSalesDetailData();
      setData(salesDetailData);
      setFilteredData(salesDetailData);
      
      // 加载商品类型
      const types = getAllProductTypes();
      setProductTypes(types);
      
      message.success('数据加载成功');
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };
  
  // 过滤数据方法
  const filterData = () => {
    if (data.length === 0) return;
    
    const filtered = applyFilters(data, filters as FilterConditions);
    setFilteredData(filtered);
  };
  
  // 重置过滤条件
  const resetFilters = () => {
    setFilters({});
    setFilteredData(data);
  };
  
  // 导出报表
  const handleExport = () => {
    if (filteredData.length === 0) {
      message.warning('没有可导出的数据');
      return;
    }
    
    try {
      // 获取当前可见列
      const columns = getColumns();
      
      // 准备导出数据
      const exportData = filteredData.map(item => {
        const exportItem: Record<string, any> = {};
        
        // 遍历列定义，提取需要导出的字段
        columns.forEach(column => {
          if ('dataIndex' in column) {
            const dataIndex = column.dataIndex as string;
            const title = column.title as string;
            
            // 设置导出项的值
            if (dataIndex && item[dataIndex as keyof StationSalesDetailData] !== undefined) {
              let value = item[dataIndex as keyof StationSalesDetailData];
              
              // 对特殊类型的值进行格式化
              if (typeof value === 'number') {
                if (['unitPrice', 'receivableAmount', 'totalDiscountAmount', 'actualAmount', 
                     'discountAmount', 'couponAmount', 'pointsDeductionAmount', 'costAmount', 
                     'profit', 'actualAmountExcludingTax', 'costAmountExcludingTax', 'profitExcludingTax'].includes(dataIndex)) {
                  value = formatCurrency(value as number);
                } else if (['salesProfitRate', 'costProfitRate', 'taxRate'].includes(dataIndex)) {
                  value = (value as number * 100).toFixed(2) + '%';
                } else {
                  value = formatNumber(value as number);
                }
              }
              
              exportItem[title] = value;
            }
          }
        });
        
        return exportItem;
      });
      
      // 执行导出
      exportStationSalesDetailToExcel(exportData, '油站销售明细表');
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };
  
  // 获取表格列定义
  const getColumns = (): ColumnsType<StationSalesDetailData> => {
    // 固定列（始终显示）
    const fixedColumns: ColumnsType<StationSalesDetailData> = [
      {
        title: '分公司',
        dataIndex: 'branchName',
        key: 'branchName',
        fixed: 'left',
        width: 120,
        sorter: (a, b) => a.branchName.localeCompare(b.branchName)
      },
      {
        title: '服务区',
        dataIndex: 'serviceAreaName',
        key: 'serviceAreaName',
        fixed: 'left',
        width: 120,
        sorter: (a, b) => a.serviceAreaName.localeCompare(b.serviceAreaName)
      },
      {
        title: '油站名称',
        dataIndex: 'stationName',
        key: 'stationName',
        fixed: 'left',
        width: 120,
        sorter: (a, b) => a.stationName.localeCompare(b.stationName)
      },
      {
        title: '订单流水号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        fixed: 'left',
        width: 150,
        sorter: (a, b) => a.orderNo.localeCompare(b.orderNo)
      }
    ];
    
    // 可配置列（根据visibleColumns显示或隐藏）
    const configurableColumns: ColumnsType<StationSalesDetailData> = [
      {
        title: '支付流水号',
        dataIndex: 'paymentNo',
        key: 'paymentNo',
        width: 150,
        sorter: (a, b) => a.paymentNo.localeCompare(b.paymentNo),
        hidden: !visibleColumns.paymentNo
      },
      {
        title: '交易类型',
        dataIndex: 'transactionType',
        key: 'transactionType',
        width: 100,
        sorter: (a, b) => a.transactionType.localeCompare(b.transactionType),
        render: (text) => <Tag color="blue">{text}</Tag>,
        hidden: !visibleColumns.transactionType
      },
      {
        title: '下单时间',
        dataIndex: 'orderTime',
        key: 'orderTime',
        width: 150,
        sorter: (a, b) => new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime(),
        hidden: !visibleColumns.orderTime
      },
      {
        title: '支付方式',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
        width: 100,
        sorter: (a, b) => a.paymentMethod.localeCompare(b.paymentMethod),
        hidden: !visibleColumns.paymentMethod
      },
      {
        title: '支付时间',
        dataIndex: 'paymentTime',
        key: 'paymentTime',
        width: 150,
        sorter: (a, b) => new Date(a.paymentTime).getTime() - new Date(b.paymentTime).getTime(),
        hidden: !visibleColumns.paymentTime
      },
      {
        title: '商品类型',
        dataIndex: 'productType',
        key: 'productType',
        width: 100,
        sorter: (a, b) => a.productType.localeCompare(b.productType),
        render: (text) => <Tag color={text === '油品' ? 'green' : 'orange'}>{text}</Tag>,
        hidden: !visibleColumns.productType
      },
      {
        title: '商品编号',
        dataIndex: 'productCode',
        key: 'productCode',
        width: 100,
        sorter: (a, b) => a.productCode.localeCompare(b.productCode),
        hidden: !visibleColumns.productCode
      },
      {
        title: '商品类别',
        dataIndex: 'productCategory',
        key: 'productCategory',
        width: 100,
        sorter: (a, b) => a.productCategory.localeCompare(b.productCategory),
        hidden: !visibleColumns.productCategory
      },
      {
        title: '商品二级类别',
        dataIndex: 'productSubCategory',
        key: 'productSubCategory',
        width: 120,
        sorter: (a, b) => a.productSubCategory.localeCompare(b.productSubCategory),
        hidden: !visibleColumns.productSubCategory
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 120,
        sorter: (a, b) => a.productName.localeCompare(b.productName),
        hidden: !visibleColumns.productName
      },
      {
        title: '油枪号',
        dataIndex: 'oilGunNo',
        key: 'oilGunNo',
        width: 80,
        sorter: (a, b) => a.oilGunNo.localeCompare(b.oilGunNo),
        hidden: !visibleColumns.oilGunNo
      },
      {
        title: '商品单位',
        dataIndex: 'productUnit',
        key: 'productUnit',
        width: 80,
        sorter: (a, b) => a.productUnit.localeCompare(b.productUnit),
        hidden: !visibleColumns.productUnit
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        sorter: (a, b) => a.quantity - b.quantity,
        render: (text) => formatNumber(text),
        hidden: !visibleColumns.quantity
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 100,
        sorter: (a, b) => a.unitPrice - b.unitPrice,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.unitPrice
      },
      {
        title: '应收金额',
        dataIndex: 'receivableAmount',
        key: 'receivableAmount',
        width: 120,
        sorter: (a, b) => a.receivableAmount - b.receivableAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.receivableAmount
      },
      {
        title: '优惠总金额',
        dataIndex: 'totalDiscountAmount',
        key: 'totalDiscountAmount',
        width: 120,
        sorter: (a, b) => a.totalDiscountAmount - b.totalDiscountAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.totalDiscountAmount
      },
      {
        title: '实收金额',
        dataIndex: 'actualAmount',
        key: 'actualAmount',
        width: 120,
        sorter: (a, b) => a.actualAmount - b.actualAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.actualAmount
      },
      {
        title: '折扣金额',
        dataIndex: 'discountAmount',
        key: 'discountAmount',
        width: 120,
        sorter: (a, b) => a.discountAmount - b.discountAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.discountAmount
      },
      {
        title: '优惠券金额',
        dataIndex: 'couponAmount',
        key: 'couponAmount',
        width: 120,
        sorter: (a, b) => a.couponAmount - b.couponAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.couponAmount
      },
      {
        title: '积分抵现金额',
        dataIndex: 'pointsDeductionAmount',
        key: 'pointsDeductionAmount',
        width: 120,
        sorter: (a, b) => a.pointsDeductionAmount - b.pointsDeductionAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.pointsDeductionAmount
      },
      {
        title: '使用积分',
        dataIndex: 'pointsUsed',
        key: 'pointsUsed',
        width: 100,
        sorter: (a, b) => a.pointsUsed - b.pointsUsed,
        render: (text) => formatNumber(text),
        hidden: !visibleColumns.pointsUsed
      },
      {
        title: '成本金额',
        dataIndex: 'costAmount',
        key: 'costAmount',
        width: 120,
        sorter: (a, b) => a.costAmount - b.costAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.costAmount
      },
      {
        title: '利润',
        dataIndex: 'profit',
        key: 'profit',
        width: 120,
        sorter: (a, b) => a.profit - b.profit,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.profit
      },
      {
        title: '销售利润率',
        dataIndex: 'salesProfitRate',
        key: 'salesProfitRate',
        width: 120,
        sorter: (a, b) => a.salesProfitRate - b.salesProfitRate,
        render: (text) => (text * 100).toFixed(2) + '%',
        hidden: !visibleColumns.salesProfitRate
      },
      {
        title: '成本利润率',
        dataIndex: 'costProfitRate',
        key: 'costProfitRate',
        width: 120,
        sorter: (a, b) => a.costProfitRate - b.costProfitRate,
        render: (text) => (text * 100).toFixed(2) + '%',
        hidden: !visibleColumns.costProfitRate
      },
      {
        title: '税率',
        dataIndex: 'taxRate',
        key: 'taxRate',
        width: 80,
        sorter: (a, b) => a.taxRate - b.taxRate,
        render: (text) => (text * 100).toFixed(0) + '%',
        hidden: !visibleColumns.taxRate
      },
      {
        title: '实收金额(不含税)',
        dataIndex: 'actualAmountExcludingTax',
        key: 'actualAmountExcludingTax',
        width: 150,
        sorter: (a, b) => a.actualAmountExcludingTax - b.actualAmountExcludingTax,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.actualAmountExcludingTax
      },
      {
        title: '成本金额(不含税)',
        dataIndex: 'costAmountExcludingTax',
        key: 'costAmountExcludingTax',
        width: 150,
        sorter: (a, b) => a.costAmountExcludingTax - b.costAmountExcludingTax,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.costAmountExcludingTax
      },
      {
        title: '利润(不含税)',
        dataIndex: 'profitExcludingTax',
        key: 'profitExcludingTax',
        width: 120,
        sorter: (a, b) => a.profitExcludingTax - b.profitExcludingTax,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.profitExcludingTax
      },
      {
        title: '班次名称',
        dataIndex: 'shiftName',
        key: 'shiftName',
        width: 100,
        sorter: (a, b) => a.shiftName.localeCompare(b.shiftName),
        hidden: !visibleColumns.shiftName
      },
      {
        title: '收银员',
        dataIndex: 'cashier',
        key: 'cashier',
        width: 100,
        sorter: (a, b) => a.cashier.localeCompare(b.cashier),
        hidden: !visibleColumns.cashier
      },
      {
        title: '会员手机号',
        dataIndex: 'memberPhone',
        key: 'memberPhone',
        width: 120,
        sorter: (a, b) => a.memberPhone.localeCompare(b.memberPhone),
        hidden: !visibleColumns.memberPhone
      },
      {
        title: '订单来源',
        dataIndex: 'orderSource',
        key: 'orderSource',
        width: 100,
        sorter: (a, b) => a.orderSource.localeCompare(b.orderSource),
        render: (text) => <Tag color={text === 'POS' ? 'cyan' : 'purple'}>{text}</Tag>,
        hidden: !visibleColumns.orderSource
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 150,
        sorter: (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
        hidden: !visibleColumns.createTime
      }
    ];
    
    // 过滤掉隐藏的列
    const visibleConfigurableColumns = configurableColumns.filter(column => !column.hidden);
    
    // 合并固定列和可配置列
    return [...fixedColumns, ...visibleConfigurableColumns];
  };
  
  // 渲染组件
  return (
    <div className="station-sales-detail-report">
      <Card>
        <Title level={4}>油站销售明细表</Title>
        
        {/* 过滤条件表单 */}
        <Form layout="horizontal">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="组织机构">
                <TreeSelect
                  treeData={orgData}
                  value={filters.stationIds || filters.branchIds || filters.serviceAreaIds}
                  treeCheckable
                  showCheckedStrategy={SHOW_PARENT}
                  placeholder="请选择组织机构"
                  style={{ width: '100%' }}
                  onChange={(value) => {
                    // 根据选中的节点类型设置不同的过滤条件
                    const stationIds: string[] = [];
                    const branchIds: string[] = [];
                    const serviceAreaIds: string[] = [];
                    
                    (value as string[]).forEach(id => {
                      if (id.startsWith('station-')) {
                        stationIds.push(id);
                      } else if (id.startsWith('branch-')) {
                        branchIds.push(id);
                      } else if (id.startsWith('service-area-')) {
                        serviceAreaIds.push(id);
                      }
                    });
                    
                    setFilters(prev => ({
                      ...prev,
                      stationIds: stationIds.length > 0 ? stationIds : undefined,
                      branchIds: branchIds.length > 0 ? branchIds : undefined,
                      serviceAreaIds: serviceAreaIds.length > 0 ? serviceAreaIds : undefined
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="商品类型">
                <Select
                  value={filters.productType}
                  placeholder="请选择商品类型"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value) => {
                    setFilters(prev => ({
                      ...prev,
                      productType: value
                    }));
                  }}
                >
                  {productTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="日期范围">
                <RangePicker
                  value={filters.dateRange ? [
                    filters.dateRange[0] ? new Date(filters.dateRange[0]) : null,
                    filters.dateRange[1] ? new Date(filters.dateRange[1]) : null
                  ] as any : undefined}
                  style={{ width: '100%' }}
                  onChange={(dates, dateStrings) => {
                    setFilters(prev => ({
                      ...prev,
                      dateRange: dates ? [dateStrings[0], dateStrings[1]] as [string, string] : undefined
                    }));
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={resetFilters}
                >
                  重置
                </Button>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={filterData}
                >
                  查询
                </Button>
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
                  导出
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
        
        {/* 表格区域 */}
        <div style={{ marginTop: 16 }}>
          <Table
            columns={getColumns()}
            dataSource={filteredData}
            rowKey="orderNo"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              defaultPageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            size="small"
            bordered
          />
        </div>
        
        {/* 列设置抽屉 */}
        <Drawer
          title="列设置"
          placement="right"
          onClose={() => setSettingsVisible(false)}
          visible={settingsVisible}
          width={360}
        >
          <div className="column-settings">
            <Typography.Title level={5}>可配置列显示设置</Typography.Title>
            <Typography.Paragraph type="secondary">
              选择需要显示的列，固定列（分公司、服务区、油站名称、订单流水号）始终显示
            </Typography.Paragraph>
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>基本信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.transactionType}
                    onChange={(e) => setVisibleColumns({...visibleColumns, transactionType: e.target.checked})}
                  >
                    交易类型
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.orderTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, orderTime: e.target.checked})}
                  >
                    下单时间
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.paymentMethod}
                    onChange={(e) => setVisibleColumns({...visibleColumns, paymentMethod: e.target.checked})}
                  >
                    支付方式
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.paymentTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, paymentTime: e.target.checked})}
                  >
                    支付时间
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.paymentNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, paymentNo: e.target.checked})}
                  >
                    支付流水号
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.orderSource}
                    onChange={(e) => setVisibleColumns({...visibleColumns, orderSource: e.target.checked})}
                  >
                    订单来源
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.createTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, createTime: e.target.checked})}
                  >
                    创建时间
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>商品信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productType}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productType: e.target.checked})}
                  >
                    商品类型
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productCode}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productCode: e.target.checked})}
                  >
                    商品编号
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productCategory}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productCategory: e.target.checked})}
                  >
                    商品类别
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productSubCategory}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productSubCategory: e.target.checked})}
                  >
                    商品二级类别
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productName}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productName: e.target.checked})}
                  >
                    商品名称
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.oilGunNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, oilGunNo: e.target.checked})}
                  >
                    油枪号
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.productUnit}
                    onChange={(e) => setVisibleColumns({...visibleColumns, productUnit: e.target.checked})}
                  >
                    商品单位
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>金额信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.quantity}
                    onChange={(e) => setVisibleColumns({...visibleColumns, quantity: e.target.checked})}
                  >
                    数量
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.unitPrice}
                    onChange={(e) => setVisibleColumns({...visibleColumns, unitPrice: e.target.checked})}
                  >
                    单价
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.receivableAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, receivableAmount: e.target.checked})}
                  >
                    应收金额
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.totalDiscountAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, totalDiscountAmount: e.target.checked})}
                  >
                    优惠总金额
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.actualAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, actualAmount: e.target.checked})}
                  >
                    实收金额
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.discountAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, discountAmount: e.target.checked})}
                  >
                    折扣金额
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.couponAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, couponAmount: e.target.checked})}
                  >
                    优惠券金额
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.pointsDeductionAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, pointsDeductionAmount: e.target.checked})}
                  >
                    积分抵现金额
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.pointsUsed}
                    onChange={(e) => setVisibleColumns({...visibleColumns, pointsUsed: e.target.checked})}
                  >
                    使用积分
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>成本利润信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.costAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, costAmount: e.target.checked})}
                  >
                    成本金额
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.profit}
                    onChange={(e) => setVisibleColumns({...visibleColumns, profit: e.target.checked})}
                  >
                    利润
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.salesProfitRate}
                    onChange={(e) => setVisibleColumns({...visibleColumns, salesProfitRate: e.target.checked})}
                  >
                    销售利润率
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.costProfitRate}
                    onChange={(e) => setVisibleColumns({...visibleColumns, costProfitRate: e.target.checked})}
                  >
                    成本利润率
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.taxRate}
                    onChange={(e) => setVisibleColumns({...visibleColumns, taxRate: e.target.checked})}
                  >
                    税率
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.actualAmountExcludingTax}
                    onChange={(e) => setVisibleColumns({...visibleColumns, actualAmountExcludingTax: e.target.checked})}
                  >
                    实收金额(不含税)
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.costAmountExcludingTax}
                    onChange={(e) => setVisibleColumns({...visibleColumns, costAmountExcludingTax: e.target.checked})}
                  >
                    成本金额(不含税)
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.profitExcludingTax}
                    onChange={(e) => setVisibleColumns({...visibleColumns, profitExcludingTax: e.target.checked})}
                  >
                    利润(不含税)
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>其他信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.shiftName}
                    onChange={(e) => setVisibleColumns({...visibleColumns, shiftName: e.target.checked})}
                  >
                    班次名称
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.cashier}
                    onChange={(e) => setVisibleColumns({...visibleColumns, cashier: e.target.checked})}
                  >
                    收银员
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.memberPhone}
                    onChange={(e) => setVisibleColumns({...visibleColumns, memberPhone: e.target.checked})}
                  >
                    会员手机号
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => {
                  // 全选
                  const allSelected = {} as StationSalesDetailColumnVisibility;
                  Object.keys(visibleColumns).forEach(key => {
                    allSelected[key as keyof StationSalesDetailColumnVisibility] = true;
                  });
                  setVisibleColumns(allSelected);
                }}
              >
                全选
              </Button>
              <Button 
                onClick={() => {
                  // 全不选
                  const noneSelected = {} as StationSalesDetailColumnVisibility;
                  Object.keys(visibleColumns).forEach(key => {
                    noneSelected[key as keyof StationSalesDetailColumnVisibility] = false;
                  });
                  setVisibleColumns(noneSelected);
                }}
              >
                全不选
              </Button>
              <Button 
                type="primary"
                onClick={() => setSettingsVisible(false)}
              >
                确定
              </Button>
            </div>
          </div>
        </Drawer>
      </Card>
    </div>
  );
};

export default StationSalesDetailReport; 