import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  DatePicker, 
  TreeSelect, 
  Input, 
  Button, 
  Table, 
  Space, 
  Drawer, 
  Checkbox, 
  Divider,
  Row,
  Col,
  Typography
} from 'antd';
import { 
  SearchOutlined, 
  ReloadOutlined, 
  SettingOutlined, 
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { orgData } from '../../utils/orgData';
import { 
  GoodsTransfer, 
  GoodsTransferItem, 
  loadGoodsTransferData, 
  filterGoodsTransferData,
  exportGoodsTransferToExcel,
  GoodsTransferFilter
} from '../../services/goodsTransferService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// 定义表格行数据类型
interface TableRowData {
  key: string;
  transferName: string;
  transferNo: string;
  orgAndStation: string;
  outWarehouse: string;
  inWarehouse: string;
  barcode: string;
  goodsName: string;
  specification: string;
  unit: string;
  transferQuantity: number;
  receivedQuantity: number;
  purchasePrice: number;
  purchaseAmount: number;
  salePrice: number;
  saleAmount: number;
  creator: string;
  createTime: string;
}

// 定义列设置项类型
interface ColumnSettingItem {
  key: string;
  title: string;
  checked: boolean;
  group: string;
  fixed?: boolean; // 是否为固定列，不可在列设置中更改
}

const GoodsTransferReport: React.FC = () => {
  // 状态定义
  const [form] = Form.useForm();
  const [data, setData] = useState<TableRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [columnSettings, setColumnSettings] = useState<ColumnSettingItem[]>([
    { key: 'transferName', title: '调拨单名称', checked: true, group: '基本信息', fixed: true },
    { key: 'transferNo', title: '调拨单编号', checked: true, group: '基本信息', fixed: true },
    { key: 'orgAndStation', title: '机构和油站', checked: true, group: '基本信息' },
    { key: 'outWarehouse', title: '出库仓库', checked: true, group: '仓库信息' },
    { key: 'inWarehouse', title: '入库仓库', checked: true, group: '仓库信息' },
    { key: 'barcode', title: '商品条码', checked: true, group: '商品信息' },
    { key: 'goodsName', title: '商品名称', checked: true, group: '商品信息' },
    { key: 'specification', title: '规格', checked: true, group: '商品信息' },
    { key: 'unit', title: '单位', checked: true, group: '商品信息' },
    { key: 'transferQuantity', title: '调拨数量', checked: true, group: '数量信息' },
    { key: 'receivedQuantity', title: '接收数量', checked: true, group: '数量信息' },
    { key: 'purchasePrice', title: '进价', checked: true, group: '价格信息' },
    { key: 'purchaseAmount', title: '进价金额', checked: true, group: '价格信息' },
    { key: 'salePrice', title: '销售价', checked: true, group: '价格信息' },
    { key: 'saleAmount', title: '销售金额', checked: true, group: '价格信息' },
    { key: 'creator', title: '创建人', checked: true, group: '创建信息' },
    { key: 'createTime', title: '创建时间', checked: true, group: '创建信息' },
  ]);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    try {
      const rawData = loadGoodsTransferData();
      const tableData: TableRowData[] = [];
      
      rawData.forEach(transfer => {
        transfer.items.forEach((item, index) => {
          tableData.push({
            key: `${transfer.id}-${index}`,
            transferName: transfer.name,
            transferNo: transfer.transferNo,
            orgAndStation: `${transfer.orgName} / ${transfer.stationName}`,
            outWarehouse: transfer.outWarehouseName,
            inWarehouse: transfer.inWarehouseName,
            barcode: item.barcode,
            goodsName: item.goodsName,
            specification: item.specification,
            unit: item.unit,
            transferQuantity: item.transferQuantity,
            receivedQuantity: item.receivedQuantity,
            purchasePrice: item.purchasePrice,
            purchaseAmount: item.purchaseAmount,
            salePrice: item.salePrice,
            saleAmount: item.saleAmount,
            creator: transfer.creator,
            createTime: transfer.createTime
          });
        });
      });
      
      setData(tableData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理查询
  const handleSearch = () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const filter: GoodsTransferFilter = {
        startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
        branchIds: [] as string[],
        serviceAreaIds: [] as string[],
        stationIds: [] as string[],
        transferNo: values.transferNo
      };
      
      // 处理组织机构选择
      if (values.orgIds) {
        values.orgIds.forEach((id: string) => {
          if (id.startsWith('branch-')) {
            filter.branchIds!.push(id);
          } else if (id.startsWith('service-area-')) {
            filter.serviceAreaIds!.push(id);
          } else if (id.startsWith('station-')) {
            filter.stationIds!.push(id);
          }
        });
      }
      
      const rawData = loadGoodsTransferData();
      const filteredData = filterGoodsTransferData(rawData, filter);
      const tableData: TableRowData[] = [];
      
      filteredData.forEach(transfer => {
        transfer.items.forEach((item, index) => {
          tableData.push({
            key: `${transfer.id}-${index}`,
            transferName: transfer.name,
            transferNo: transfer.transferNo,
            orgAndStation: `${transfer.orgName} / ${transfer.stationName}`,
            outWarehouse: transfer.outWarehouseName,
            inWarehouse: transfer.inWarehouseName,
            barcode: item.barcode,
            goodsName: item.goodsName,
            specification: item.specification,
            unit: item.unit,
            transferQuantity: item.transferQuantity,
            receivedQuantity: item.receivedQuantity,
            purchasePrice: item.purchasePrice,
            purchaseAmount: item.purchaseAmount,
            salePrice: item.salePrice,
            saleAmount: item.saleAmount,
            creator: transfer.creator,
            createTime: transfer.createTime
          });
        });
      });
      
      setData(tableData);
    } catch (error) {
      console.error('查询数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
  };

  // 导出Excel
  const handleExport = () => {
    try {
      const values = form.getFieldsValue();
      const filter: GoodsTransferFilter = {
        startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
        branchIds: [] as string[],
        serviceAreaIds: [] as string[],
        stationIds: [] as string[],
        transferNo: values.transferNo
      };
      
      // 处理组织机构选择
      if (values.orgIds) {
        values.orgIds.forEach((id: string) => {
          if (id.startsWith('branch-')) {
            filter.branchIds!.push(id);
          } else if (id.startsWith('service-area-')) {
            filter.serviceAreaIds!.push(id);
          } else if (id.startsWith('station-')) {
            filter.stationIds!.push(id);
          }
        });
      }
      
      const rawData = loadGoodsTransferData();
      const filteredData = filterGoodsTransferData(rawData, filter);
      
      exportGoodsTransferToExcel(filteredData);
    } catch (error) {
      console.error('导出数据失败:', error);
    }
  };

  // 处理列设置变更
  const handleColumnSettingChange = (key: string, checked: boolean) => {
    setColumnSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.key === key && !setting.fixed ? { ...setting, checked } : setting
      )
    );
  };

  // 全选/取消全选某个分组的列
  const handleGroupSelectAll = (group: string, checked: boolean) => {
    setColumnSettings(prevSettings => 
      prevSettings.map(setting => 
        setting.group === group && !setting.fixed ? { ...setting, checked } : setting
      )
    );
  };

  // 全选所有列
  const handleSelectAll = (checked: boolean) => {
    setColumnSettings(prevSettings => 
      prevSettings.map(setting => 
        !setting.fixed ? { ...setting, checked } : setting
      )
    );
  };

  // 获取表格列配置
  const getColumns = (): ColumnsType<TableRowData> => {
    // 固定列
    const fixedColumns = columnSettings
      .filter(setting => setting.fixed)
      .map(setting => ({
        title: setting.title,
        dataIndex: setting.key,
        key: setting.key,
        ellipsis: true,
        fixed: 'left' as const
      }));
    
    // 可配置列
    const configurableColumns = columnSettings
      .filter(setting => !setting.fixed && setting.checked)
      .map(setting => {
        // 基础列配置
        const column: any = {
          title: setting.title,
          dataIndex: setting.key,
          key: setting.key,
          ellipsis: true,
        };
        
        // 为数值类型的列添加对齐方式和格式化
        if (['transferQuantity', 'receivedQuantity', 'purchasePrice', 'purchaseAmount', 'salePrice', 'saleAmount'].includes(setting.key)) {
          column.align = 'right';
          column.render = (text: number) => text.toFixed(2);
        }
        
        return column;
      });
    
    return [...fixedColumns, ...configurableColumns];
  };

  // 获取分组的列设置项
  const getGroupedColumnSettings = () => {
    const groups = Array.from(new Set(columnSettings.filter(setting => !setting.fixed).map(setting => setting.group)));
    return groups.map(group => {
      const groupSettings = columnSettings.filter(setting => !setting.fixed && setting.group === group);
      const allChecked = groupSettings.every(setting => setting.checked);
      const someChecked = groupSettings.some(setting => setting.checked);
      
      return {
        group,
        settings: groupSettings,
        allChecked,
        someChecked
      };
    });
  };

  return (
    <div className="goods-transfer-report">
      <Card>
        <Title level={4}>商品调拨入库表</Title>
        
        {/* 过滤表单 */}
        <Form
          form={form}
          layout="horizontal"
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="orgIds" label="组织机构">
                <TreeSelect
                  treeData={orgData}
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_PARENT}
                  placeholder="请选择组织机构"
                  style={{ width: '100%' }}
                  treeNodeFilterProp="title"
                  maxTagCount={2}
                />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item name="transferNo" label="调拨单编号">
                <Input placeholder="请输入调拨单编号" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={handleReset}
                >
                  重置
                </Button>
                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  onClick={handleSearch}
                >
                  查询
                </Button>
                <Button 
                  icon={<SettingOutlined />} 
                  onClick={() => setDrawerVisible(true)}
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
        
        {/* 数据表格 */}
        <div style={{ marginTop: 16 }}>
          <Table
            columns={getColumns()}
            dataSource={data}
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条记录`,
              defaultPageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100']
            }}
            size="small"
            bordered
          />
        </div>
      </Card>
      
      {/* 列设置抽屉 */}
      <Drawer
        title="列设置"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={360}
      >
        <div className="column-settings">
          <Typography.Title level={5}>可配置列显示设置</Typography.Title>
          <Typography.Paragraph type="secondary">
            选择需要显示的列，固定列（调拨单名称、调拨单编号）始终显示
          </Typography.Paragraph>
          <Divider />
          
          <div style={{ marginBottom: '16px' }}>
            <Checkbox
              checked={columnSettings.filter(setting => !setting.fixed).every(setting => setting.checked)}
              indeterminate={
                columnSettings.filter(setting => !setting.fixed).some(setting => setting.checked) && 
                !columnSettings.filter(setting => !setting.fixed).every(setting => setting.checked)
              }
              onChange={e => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          
          {getGroupedColumnSettings().map(group => (
            <div key={group.group} className="column-settings-group">
              <Typography.Title level={5}>{group.group}</Typography.Title>
              <div>
                {group.settings.map(setting => (
                  <Row key={setting.key}>
                    <Col span={24}>
                      <Checkbox
                        checked={setting.checked}
                        onChange={e => handleColumnSettingChange(setting.key, e.target.checked)}
                      >
                        {setting.title}
                      </Checkbox>
                    </Col>
                  </Row>
                ))}
              </div>
              <Divider />
            </div>
          ))}
          
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              onClick={() => handleSelectAll(true)}
            >
              全选
            </Button>
            <Button 
              onClick={() => handleSelectAll(false)}
            >
              全不选
            </Button>
            <Button 
              type="primary"
              onClick={() => setDrawerVisible(false)}
            >
              确定
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default GoodsTransferReport; 