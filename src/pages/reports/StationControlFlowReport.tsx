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
  Typography,
  Select,
  Checkbox,
  Divider,
  message,
  Tag
} from 'antd';
import { SearchOutlined, ReloadOutlined, SettingOutlined, ExportOutlined } from '@ant-design/icons';
import type { TreeSelectProps } from 'antd/es/tree-select';
import type { ColumnsType } from 'antd/es/table';
import { 
  StationControlFlowData, 
  StationControlFlowColumnVisibility, 
  ControlFlowFilterConditions 
} from '../../types/reportTypes';
import {
  loadStationControlFlowData,
  filterDataByStationIds,
  filterDataByBranchIds,
  filterDataByServiceAreaIds,
  filterDataByDateRange,
  filterDataBySettlementStatus,
  filterDataByControlStatus,
  filterDataByOilName,
  getAllOilNames,
  getAllSettlementStatuses,
  getAllControlStatuses,
  applyFilters
} from '../../services/stationControlFlowService';
import { formatCurrency, formatNumber } from '../../utils/formatUtils';
import { orgData } from '../../utils/orgData';
import { exportStationSalesDetailToExcel } from '../../utils/exportUtils';

const { RangePicker } = DatePicker;
const { SHOW_PARENT } = TreeSelect;
const { Title, Text } = Typography;
const { Option } = Select;

// 油站管控流水报表组件
const StationControlFlowReport: React.FC = () => {
  // 状态定义
  const [data, setData] = useState<StationControlFlowData[]>([]);
  const [filteredData, setFilteredData] = useState<StationControlFlowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [oilNames, setOilNames] = useState<string[]>([]);
  const [settlementStatuses, setSettlementStatuses] = useState<string[]>([]);
  const [controlStatuses, setControlStatuses] = useState<string[]>([]);
  const [filters, setFilters] = useState<{
    stationIds?: string[];
    branchIds?: string[];
    serviceAreaIds?: string[];
    dateRange?: [string, string];
    settlementStatus?: string;
    controlStatus?: string;
    oilName?: string;
  }>({});
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [visibleColumns, setVisibleColumns] = useState<StationControlFlowColumnVisibility>({
    // 默认所有可配置字段都可见
    gunHangTime: true,
    controlUploadTime: true,
    oilMachineNo: true,
    oilGunNo: true,
    machineFlowNo: true,
    oilName: true,
    quantity: true,
    unitPrice: true,
    controlAmount: true,
    pumpMeterValue: true,
    settlementTime: true,
    settlementStatus: true,
    shiftName: true,
    orderNo: true,
    paymentNo: true,
    paymentMethod: true,
    controlCardType: true,
    controlCardNo: true,
    controlCardFaceNo: true,
    controlCardBalance: true,
    oilOperator: true,
    controlStatus: true
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
      // 加载管控流水数据
      const controlFlowData = loadStationControlFlowData();
      setData(controlFlowData);
      setFilteredData(controlFlowData);
      
      // 加载下拉选项数据
      setOilNames(getAllOilNames(controlFlowData));
      setSettlementStatuses(getAllSettlementStatuses(controlFlowData));
      setControlStatuses(getAllControlStatuses(controlFlowData));
      
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
    
    const filtered = applyFilters(data, filters as ControlFlowFilterConditions);
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
            if (dataIndex && item[dataIndex as keyof StationControlFlowData] !== undefined) {
              let value = item[dataIndex as keyof StationControlFlowData];
              
              // 对特殊类型的值进行格式化
              if (typeof value === 'number') {
                if (['unitPrice', 'controlAmount', 'controlCardBalance'].includes(dataIndex)) {
                  value = formatCurrency(value as number);
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
      exportStationSalesDetailToExcel(exportData, '油站管控流水表');
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败');
    }
  };
  
  // 获取表格列定义
  const getColumns = (): ColumnsType<StationControlFlowData> => {
    // 固定列（始终显示）
    const fixedColumns: ColumnsType<StationControlFlowData> = [
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
        title: '管控流水号',
        dataIndex: 'controlFlowNo',
        key: 'controlFlowNo',
        fixed: 'left',
        width: 150,
        sorter: (a, b) => a.controlFlowNo.localeCompare(b.controlFlowNo)
      }
    ];
    
    // 可配置列（根据visibleColumns显示或隐藏）
    const configurableColumns: ColumnsType<StationControlFlowData> = [
      {
        title: '挂枪时间',
        dataIndex: 'gunHangTime',
        key: 'gunHangTime',
        width: 150,
        sorter: (a, b) => new Date(a.gunHangTime).getTime() - new Date(b.gunHangTime).getTime(),
        hidden: !visibleColumns.gunHangTime
      },
      {
        title: '管控上传时间',
        dataIndex: 'controlUploadTime',
        key: 'controlUploadTime',
        width: 150,
        sorter: (a, b) => new Date(a.controlUploadTime).getTime() - new Date(b.controlUploadTime).getTime(),
        hidden: !visibleColumns.controlUploadTime
      },
      {
        title: '油机号',
        dataIndex: 'oilMachineNo',
        key: 'oilMachineNo',
        width: 100,
        sorter: (a, b) => a.oilMachineNo.localeCompare(b.oilMachineNo),
        hidden: !visibleColumns.oilMachineNo
      },
      {
        title: '油枪号',
        dataIndex: 'oilGunNo',
        key: 'oilGunNo',
        width: 100,
        sorter: (a, b) => a.oilGunNo.localeCompare(b.oilGunNo),
        hidden: !visibleColumns.oilGunNo
      },
      {
        title: '机出流水号',
        dataIndex: 'machineFlowNo',
        key: 'machineFlowNo',
        width: 150,
        sorter: (a, b) => a.machineFlowNo.localeCompare(b.machineFlowNo),
        hidden: !visibleColumns.machineFlowNo
      },
      {
        title: '油品名称',
        dataIndex: 'oilName',
        key: 'oilName',
        width: 120,
        sorter: (a, b) => a.oilName.localeCompare(b.oilName),
        render: (text) => <Tag color={text.includes('柴油') ? 'green' : 'blue'}>{text}</Tag>,
        hidden: !visibleColumns.oilName
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
        title: '管控金额',
        dataIndex: 'controlAmount',
        key: 'controlAmount',
        width: 120,
        sorter: (a, b) => a.controlAmount - b.controlAmount,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.controlAmount
      },
      {
        title: '泵码数',
        dataIndex: 'pumpMeterValue',
        key: 'pumpMeterValue',
        width: 120,
        sorter: (a, b) => a.pumpMeterValue - b.pumpMeterValue,
        render: (text) => formatNumber(text),
        hidden: !visibleColumns.pumpMeterValue
      },
      {
        title: '结算时间',
        dataIndex: 'settlementTime',
        key: 'settlementTime',
        width: 150,
        sorter: (a, b) => new Date(a.settlementTime).getTime() - new Date(b.settlementTime).getTime(),
        hidden: !visibleColumns.settlementTime
      },
      {
        title: '结算状态',
        dataIndex: 'settlementStatus',
        key: 'settlementStatus',
        width: 100,
        sorter: (a, b) => a.settlementStatus.localeCompare(b.settlementStatus),
        render: (text) => (
          <Tag color={text === '已结算' ? 'green' : 'orange'}>{text}</Tag>
        ),
        hidden: !visibleColumns.settlementStatus
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
        title: '订单流水号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 150,
        sorter: (a, b) => a.orderNo.localeCompare(b.orderNo),
        hidden: !visibleColumns.orderNo
      },
      {
        title: '支付单号',
        dataIndex: 'paymentNo',
        key: 'paymentNo',
        width: 150,
        sorter: (a, b) => a.paymentNo.localeCompare(b.paymentNo),
        hidden: !visibleColumns.paymentNo
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
        title: '管控卡类型',
        dataIndex: 'controlCardType',
        key: 'controlCardType',
        width: 120,
        sorter: (a, b) => a.controlCardType.localeCompare(b.controlCardType),
        hidden: !visibleColumns.controlCardType
      },
      {
        title: '管控卡号',
        dataIndex: 'controlCardNo',
        key: 'controlCardNo',
        width: 150,
        sorter: (a, b) => a.controlCardNo.localeCompare(b.controlCardNo),
        hidden: !visibleColumns.controlCardNo
      },
      {
        title: '管控卡面卡号',
        dataIndex: 'controlCardFaceNo',
        key: 'controlCardFaceNo',
        width: 150,
        sorter: (a, b) => a.controlCardFaceNo.localeCompare(b.controlCardFaceNo),
        hidden: !visibleColumns.controlCardFaceNo
      },
      {
        title: '管控卡余额',
        dataIndex: 'controlCardBalance',
        key: 'controlCardBalance',
        width: 120,
        sorter: (a, b) => a.controlCardBalance - b.controlCardBalance,
        render: (text) => formatCurrency(text),
        hidden: !visibleColumns.controlCardBalance
      },
      {
        title: '加油员',
        dataIndex: 'oilOperator',
        key: 'oilOperator',
        width: 100,
        sorter: (a, b) => a.oilOperator.localeCompare(b.oilOperator),
        hidden: !visibleColumns.oilOperator
      },
      {
        title: '管控状态',
        dataIndex: 'controlStatus',
        key: 'controlStatus',
        width: 100,
        sorter: (a, b) => a.controlStatus.localeCompare(b.controlStatus),
        render: (text) => (
          <Tag color={text === '正常' ? 'green' : 'red'}>{text}</Tag>
        ),
        hidden: !visibleColumns.controlStatus
      }
    ];
    
    // 过滤掉隐藏的列
    const visibleConfigurableColumns = configurableColumns.filter(column => !column.hidden);
    
    // 合并固定列和可配置列
    return [...fixedColumns, ...visibleConfigurableColumns];
  };
  
  // 渲染组件
  return (
    <div className="station-control-flow-report">
      <Card>
        <Title level={4}>油站管控流水</Title>
        
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
            <Col span={8}>
              <Form.Item label="油品名称">
                <Select
                  value={filters.oilName}
                  placeholder="请选择油品名称"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value) => {
                    setFilters(prev => ({
                      ...prev,
                      oilName: value
                    }));
                  }}
                >
                  {oilNames.map(name => (
                    <Option key={name} value={name}>{name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="结算状态">
                <Select
                  value={filters.settlementStatus}
                  placeholder="请选择结算状态"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value) => {
                    setFilters(prev => ({
                      ...prev,
                      settlementStatus: value
                    }));
                  }}
                >
                  {settlementStatuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="管控状态">
                <Select
                  value={filters.controlStatus}
                  placeholder="请选择管控状态"
                  style={{ width: '100%' }}
                  allowClear
                  onChange={(value) => {
                    setFilters(prev => ({
                      ...prev,
                      controlStatus: value
                    }));
                  }}
                >
                  {controlStatuses.map(status => (
                    <Option key={status} value={status}>{status}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right', marginTop: 30 }}>
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
            rowKey="controlFlowNo"
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
              选择需要显示的列，固定列（分公司、服务区、油站名称、管控流水号）始终显示
            </Typography.Paragraph>
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>时间信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.gunHangTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, gunHangTime: e.target.checked})}
                  >
                    挂枪时间
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlUploadTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlUploadTime: e.target.checked})}
                  >
                    管控上传时间
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.settlementTime}
                    onChange={(e) => setVisibleColumns({...visibleColumns, settlementTime: e.target.checked})}
                  >
                    结算时间
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>设备信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.oilMachineNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, oilMachineNo: e.target.checked})}
                  >
                    油机号
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
                    checked={visibleColumns.machineFlowNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, machineFlowNo: e.target.checked})}
                  >
                    机出流水号
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.pumpMeterValue}
                    onChange={(e) => setVisibleColumns({...visibleColumns, pumpMeterValue: e.target.checked})}
                  >
                    泵码数
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
                    checked={visibleColumns.oilName}
                    onChange={(e) => setVisibleColumns({...visibleColumns, oilName: e.target.checked})}
                  >
                    油品名称
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.quantity}
                    onChange={(e) => setVisibleColumns({...visibleColumns, quantity: e.target.checked})}
                  >
                    数量
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.unitPrice}
                    onChange={(e) => setVisibleColumns({...visibleColumns, unitPrice: e.target.checked})}
                  >
                    单价
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlAmount}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlAmount: e.target.checked})}
                  >
                    管控金额
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>订单信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.orderNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, orderNo: e.target.checked})}
                  >
                    订单流水号
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.paymentNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, paymentNo: e.target.checked})}
                  >
                    支付单号
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
                    checked={visibleColumns.settlementStatus}
                    onChange={(e) => setVisibleColumns({...visibleColumns, settlementStatus: e.target.checked})}
                  >
                    结算状态
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlStatus}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlStatus: e.target.checked})}
                  >
                    管控状态
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div className="column-settings-group">
              <Typography.Title level={5}>卡信息</Typography.Title>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlCardType}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlCardType: e.target.checked})}
                  >
                    管控卡类型
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlCardNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlCardNo: e.target.checked})}
                  >
                    管控卡号
                  </Checkbox>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlCardFaceNo}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlCardFaceNo: e.target.checked})}
                  >
                    管控卡面卡号
                  </Checkbox>
                </Col>
                <Col span={12}>
                  <Checkbox
                    checked={visibleColumns.controlCardBalance}
                    onChange={(e) => setVisibleColumns({...visibleColumns, controlCardBalance: e.target.checked})}
                  >
                    管控卡余额
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
                    checked={visibleColumns.oilOperator}
                    onChange={(e) => setVisibleColumns({...visibleColumns, oilOperator: e.target.checked})}
                  >
                    加油员
                  </Checkbox>
                </Col>
              </Row>
            </div>
            
            <Divider />
            
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => {
                  // 全选
                  const allSelected = {} as StationControlFlowColumnVisibility;
                  Object.keys(visibleColumns).forEach(key => {
                    allSelected[key as keyof StationControlFlowColumnVisibility] = true;
                  });
                  setVisibleColumns(allSelected);
                }}
              >
                全选
              </Button>
              <Button 
                onClick={() => {
                  // 全不选
                  const noneSelected = {} as StationControlFlowColumnVisibility;
                  Object.keys(visibleColumns).forEach(key => {
                    noneSelected[key as keyof StationControlFlowColumnVisibility] = false;
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

export default StationControlFlowReport; 