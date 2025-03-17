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
  Typography,
  Select
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
  GoodsInventoryItem, 
  GoodsInventoryFilter,
  loadGoodsInventoryData, 
  filterGoodsInventoryData,
  exportGoodsInventoryToCSV,
  getCategory1Options,
  getCategory2Options
} from '../../services/goodsInventoryService';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// 定义表格行数据类型
interface TableRowData extends GoodsInventoryItem {}

// 定义列设置项类型
interface ColumnSettingItem {
  key: string;
  title: string;
  checked: boolean;
  group: string;
  fixed?: boolean; // 是否为固定列，不可在列设置中更改
}

// 定义列分组类型
interface ColumnGroup {
  key: string;
  title: string;
  children: ColumnSettingItem[];
}

const GoodsInventoryReport: React.FC = () => {
  // 状态定义
  const [form] = Form.useForm();
  const [data, setData] = useState<TableRowData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  
  // 列设置状态
  const [columnSettings, setColumnSettings] = useState<ColumnSettingItem[]>([
    // 商品信息 - 不再固定
    { key: 'name', title: '商品名称', checked: true, group: '商品' },
    { key: 'barcode', title: '商品条码', checked: true, group: '商品' },
    { key: 'category1', title: '一级分类', checked: true, group: '商品' },
    { key: 'category2', title: '二级分类', checked: true, group: '商品' },
    { key: 'taxRate', title: '税率', checked: true, group: '商品' },
    
    // 期初
    { key: 'initialInventory.quantity', title: '数量', checked: true, group: '期初' },
    { key: 'initialInventory.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '期初' },
    { key: 'initialInventory.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '期初' },
    { key: 'initialInventory.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '期初' },
    { key: 'initialInventory.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '期初' },
    
    // 采购入库
    { key: 'purchase.quantity', title: '数量', checked: true, group: '采购入库' },
    { key: 'purchase.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '采购入库' },
    { key: 'purchase.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '采购入库' },
    { key: 'purchase.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '采购入库' },
    { key: 'purchase.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '采购入库' },
    
    // 销售
    { key: 'sales.quantity', title: '数量', checked: true, group: '销售' },
    { key: 'sales.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '销售' },
    { key: 'sales.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '销售' },
    { key: 'sales.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '销售' },
    { key: 'sales.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '销售' },
    
    // 盘点
    { key: 'inventory.quantity', title: '数量', checked: true, group: '盘点' },
    { key: 'inventory.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '盘点' },
    { key: 'inventory.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '盘点' },
    { key: 'inventory.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '盘点' },
    { key: 'inventory.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '盘点' },
    
    // 自用
    { key: 'selfUse.quantity', title: '数量', checked: true, group: '自用' },
    { key: 'selfUse.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '自用' },
    { key: 'selfUse.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '自用' },
    { key: 'selfUse.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '自用' },
    { key: 'selfUse.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '自用' },
    
    // 销售退货
    { key: 'salesReturn.quantity', title: '数量', checked: true, group: '销售退货' },
    { key: 'salesReturn.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '销售退货' },
    { key: 'salesReturn.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '销售退货' },
    { key: 'salesReturn.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '销售退货' },
    { key: 'salesReturn.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '销售退货' },
    
    // 供应商退货
    { key: 'supplierReturn.quantity', title: '数量', checked: true, group: '供应商退货' },
    { key: 'supplierReturn.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '供应商退货' },
    { key: 'supplierReturn.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '供应商退货' },
    { key: 'supplierReturn.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '供应商退货' },
    { key: 'supplierReturn.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '供应商退货' },
    
    // 调拨入库
    { key: 'transferIn.quantity', title: '数量', checked: true, group: '调拨入库' },
    { key: 'transferIn.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '调拨入库' },
    { key: 'transferIn.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '调拨入库' },
    { key: 'transferIn.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '调拨入库' },
    { key: 'transferIn.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '调拨入库' },
    
    // 调拨出库
    { key: 'transferOut.quantity', title: '数量', checked: true, group: '调拨出库' },
    { key: 'transferOut.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '调拨出库' },
    { key: 'transferOut.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '调拨出库' },
    { key: 'transferOut.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '调拨出库' },
    { key: 'transferOut.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '调拨出库' },
    
    // 库存变动
    { key: 'inventoryChange.quantity', title: '数量', checked: true, group: '库存变动' },
    { key: 'inventoryChange.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '库存变动' },
    { key: 'inventoryChange.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '库存变动' },
    { key: 'inventoryChange.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '库存变动' },
    { key: 'inventoryChange.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '库存变动' },
    
    // 成本调整
    { key: 'costAdjustment.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '成本调整' },
    { key: 'costAdjustment.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '成本调整' },
    
    // 价格调整
    { key: 'priceAdjustment.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '价格调整' },
    { key: 'priceAdjustment.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '价格调整' },
    
    // 期末
    { key: 'finalInventory.quantity', title: '数量', checked: true, group: '期末' },
    { key: 'finalInventory.retailAmountWithTax', title: '零售金额(含税)', checked: true, group: '期末' },
    { key: 'finalInventory.retailAmountWithoutTax', title: '零售金额(不含税)', checked: true, group: '期末' },
    { key: 'finalInventory.costAmountWithTax', title: '成本金额(含税)', checked: true, group: '期末' },
    { key: 'finalInventory.costAmountWithoutTax', title: '成本金额(不含税)', checked: true, group: '期末' },
    { key: 'finalInventory.retailPriceWithTax', title: '零售单价(含税)', checked: true, group: '期末' }
  ]);

  // 初始化数据
  useEffect(() => {
    loadData();
  }, []);

  // 加载数据
  const loadData = () => {
    setLoading(true);
    try {
      const rawData = loadGoodsInventoryData();
      setData(rawData);
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
      const filter: GoodsInventoryFilter = {
        goodsName: values.goodsName,
        barcode: values.barcode,
        branchIds: [] as string[],
        serviceAreaIds: [] as string[],
        stationIds: [] as string[]
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
      
      const rawData = loadGoodsInventoryData();
      const filteredData = filterGoodsInventoryData(rawData, filter);
      
      setData(filteredData);
    } catch (error) {
      console.error('查询数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    loadData();
  };

  // 导出Excel
  const handleExport = () => {
    try {
      exportGoodsInventoryToCSV(data);
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
    // 可配置列
    const configurableColumns = columnSettings
      .filter(setting => setting.checked)
      .map(setting => {
        // 基础列配置
        const column: any = {
          title: setting.title,
          dataIndex: setting.key,
          key: setting.key,
          ellipsis: true,
          width: 100
        };
        
        // 为数值类型的列添加对齐方式和格式化
        if (setting.key.includes('quantity') || 
            setting.key.includes('Amount') || 
            setting.key.includes('Price')) {
          column.align = 'right';
          column.render = (text: number) => text?.toFixed(2) || '0.00';
        }
        
        // 处理嵌套属性
        if (setting.key.includes('.')) {
          const [parent, child] = setting.key.split('.');
          column.dataIndex = [parent, child];
        }
        
        return column;
      });
    
    // 按分组组织列
    const groupedColumns: any[] = [];
    const groups = Array.from(new Set(configurableColumns.map(col => {
      const key = col.key as string;
      const group = columnSettings.find(setting => setting.key === key)?.group || '';
      return group;
    })));
    
    groups.forEach(group => {
      const groupColumns = configurableColumns.filter(col => {
        const key = col.key as string;
        const colGroup = columnSettings.find(setting => setting.key === key)?.group || '';
        return colGroup === group;
      });
      
      if (groupColumns.length > 0) {
        groupedColumns.push({
          title: group,
          children: groupColumns
        });
      }
    });
    
    return groupedColumns;
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
    <div className="goods-inventory-report">
      <Card>
        <Title level={4}>商品进销存报表</Title>
        
        {/* 过滤表单 */}
        <Form
          form={form}
          layout="horizontal"
        >
          <Row gutter={16}>
            <Col span={6}>
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
            
            <Col span={6}>
              <Form.Item name="goodsName" label="商品名称">
                <Input placeholder="请输入商品名称" />
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item name="barcode" label="商品条码">
                <Input placeholder="请输入商品条码" />
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item name="dateRange" label="日期范围">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
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
            rowKey="id"
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
            选择需要显示的列
          </Typography.Paragraph>
          <Divider />
          
          <div style={{ marginBottom: '16px' }}>
            <Checkbox
              checked={columnSettings.every(setting => setting.checked)}
              indeterminate={
                columnSettings.some(setting => setting.checked) && 
                !columnSettings.every(setting => setting.checked)
              }
              onChange={e => handleSelectAll(e.target.checked)}
            >
              全选
            </Checkbox>
          </div>
          
          {getGroupedColumnSettings().map(group => (
            <div key={group.group} className="column-settings-group">
              <Typography.Title level={5}>
                <Checkbox
                  checked={group.allChecked}
                  indeterminate={group.someChecked && !group.allChecked}
                  onChange={e => handleGroupSelectAll(group.group, e.target.checked)}
                >
                  {group.group}
                </Checkbox>
              </Typography.Title>
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

export default GoodsInventoryReport; 