import type { TreeSelectProps } from 'antd';

// 分公司名称
export const branchNames = [
  '赣中分公司', 
  '赣东北分公司', 
  '赣东分公司', 
  '赣东南分公司', 
  '赣南分公司', 
  '赣西南分公司', 
  '赣西分公司', 
  '赣西北分公司'
];

// 组织机构树形数据
export const orgData: TreeSelectProps['treeData'] = [
  {
    title: '江西交投化石能源公司',
    value: 'HQ',
    key: 'HQ',
    children: [
      {
        title: '赣中分公司',
        value: 'branch-1',
        key: 'branch-1',
        children: [
          {
            title: '服务区1',
            value: 'service-area-1-1',
            key: 'service-area-1-1',
            children: [
              {
                title: '油站1-1-1',
                value: 'station-1-1-1',
                key: 'station-1-1-1',
              },
              {
                title: '油站1-1-2',
                value: 'station-1-1-2',
                key: 'station-1-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-1-2',
            key: 'service-area-1-2',
            children: [
              {
                title: '油站1-2-1',
                value: 'station-1-2-1',
                key: 'station-1-2-1',
              },
              {
                title: '油站1-2-2',
                value: 'station-1-2-2',
                key: 'station-1-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣东北分公司',
        value: 'branch-2',
        key: 'branch-2',
        children: [
          {
            title: '服务区1',
            value: 'service-area-2-1',
            key: 'service-area-2-1',
            children: [
              {
                title: '油站2-1-1',
                value: 'station-2-1-1',
                key: 'station-2-1-1',
              },
              {
                title: '油站2-1-2',
                value: 'station-2-1-2',
                key: 'station-2-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-2-2',
            key: 'service-area-2-2',
            children: [
              {
                title: '油站2-2-1',
                value: 'station-2-2-1',
                key: 'station-2-2-1',
              },
              {
                title: '油站2-2-2',
                value: 'station-2-2-2',
                key: 'station-2-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣东分公司',
        value: 'branch-3',
        key: 'branch-3',
        children: [
          {
            title: '服务区1',
            value: 'service-area-3-1',
            key: 'service-area-3-1',
            children: [
              {
                title: '油站3-1-1',
                value: 'station-3-1-1',
                key: 'station-3-1-1',
              },
              {
                title: '油站3-1-2',
                value: 'station-3-1-2',
                key: 'station-3-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-3-2',
            key: 'service-area-3-2',
            children: [
              {
                title: '油站3-2-1',
                value: 'station-3-2-1',
                key: 'station-3-2-1',
              },
              {
                title: '油站3-2-2',
                value: 'station-3-2-2',
                key: 'station-3-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣东南分公司',
        value: 'branch-4',
        key: 'branch-4',
        children: [
          {
            title: '服务区1',
            value: 'service-area-4-1',
            key: 'service-area-4-1',
            children: [
              {
                title: '油站4-1-1',
                value: 'station-4-1-1',
                key: 'station-4-1-1',
              },
              {
                title: '油站4-1-2',
                value: 'station-4-1-2',
                key: 'station-4-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-4-2',
            key: 'service-area-4-2',
            children: [
              {
                title: '油站4-2-1',
                value: 'station-4-2-1',
                key: 'station-4-2-1',
              },
              {
                title: '油站4-2-2',
                value: 'station-4-2-2',
                key: 'station-4-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣南分公司',
        value: 'branch-5',
        key: 'branch-5',
        children: [
          {
            title: '服务区1',
            value: 'service-area-5-1',
            key: 'service-area-5-1',
            children: [
              {
                title: '油站5-1-1',
                value: 'station-5-1-1',
                key: 'station-5-1-1',
              },
              {
                title: '油站5-1-2',
                value: 'station-5-1-2',
                key: 'station-5-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-5-2',
            key: 'service-area-5-2',
            children: [
              {
                title: '油站5-2-1',
                value: 'station-5-2-1',
                key: 'station-5-2-1',
              },
              {
                title: '油站5-2-2',
                value: 'station-5-2-2',
                key: 'station-5-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣西南分公司',
        value: 'branch-6',
        key: 'branch-6',
        children: [
          {
            title: '服务区1',
            value: 'service-area-6-1',
            key: 'service-area-6-1',
            children: [
              {
                title: '油站6-1-1',
                value: 'station-6-1-1',
                key: 'station-6-1-1',
              },
              {
                title: '油站6-1-2',
                value: 'station-6-1-2',
                key: 'station-6-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-6-2',
            key: 'service-area-6-2',
            children: [
              {
                title: '油站6-2-1',
                value: 'station-6-2-1',
                key: 'station-6-2-1',
              },
              {
                title: '油站6-2-2',
                value: 'station-6-2-2',
                key: 'station-6-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣西分公司',
        value: 'branch-7',
        key: 'branch-7',
        children: [
          {
            title: '服务区1',
            value: 'service-area-7-1',
            key: 'service-area-7-1',
            children: [
              {
                title: '油站7-1-1',
                value: 'station-7-1-1',
                key: 'station-7-1-1',
              },
              {
                title: '油站7-1-2',
                value: 'station-7-1-2',
                key: 'station-7-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-7-2',
            key: 'service-area-7-2',
            children: [
              {
                title: '油站7-2-1',
                value: 'station-7-2-1',
                key: 'station-7-2-1',
              },
              {
                title: '油站7-2-2',
                value: 'station-7-2-2',
                key: 'station-7-2-2',
              }
            ]
          }
        ]
      },
      {
        title: '赣西北分公司',
        value: 'branch-8',
        key: 'branch-8',
        children: [
          {
            title: '服务区1',
            value: 'service-area-8-1',
            key: 'service-area-8-1',
            children: [
              {
                title: '油站8-1-1',
                value: 'station-8-1-1',
                key: 'station-8-1-1',
              },
              {
                title: '油站8-1-2',
                value: 'station-8-1-2',
                key: 'station-8-1-2',
              }
            ]
          },
          {
            title: '服务区2',
            value: 'service-area-8-2',
            key: 'service-area-8-2',
            children: [
              {
                title: '油站8-2-1',
                value: 'station-8-2-1',
                key: 'station-8-2-1',
              },
              {
                title: '油站8-2-2',
                value: 'station-8-2-2',
                key: 'station-8-2-2',
              }
            ]
          }
        ]
      }
    ]
  }
];

// 获取随机油站名称的辅助函数
export const getRandomStationName = (): string => {
  const branchIndex = Math.floor(Math.random() * 8) + 1;
  const serviceAreaIndex = Math.floor(Math.random() * 2) + 1;
  const stationIndex = Math.floor(Math.random() * 2) + 1;
  
  return `${branchNames[branchIndex-1]} / 服务区${serviceAreaIndex} / 油站${branchIndex}-${serviceAreaIndex}-${stationIndex}`;
};

// 获取所有油站名称
export const getAllStationNames = (): string[] => {
  const stationNames: string[] = [];
  
  // 遍历组织结构树，提取所有油站名称
  const extractStationNames = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.key.startsWith('station-')) {
        stationNames.push(node.title as string);
      }
      if (node.children && node.children.length > 0) {
        extractStationNames(node.children);
      }
    });
  };
  
  extractStationNames(orgData as any[]);
  return stationNames;
};

// 获取油站名称和ID的映射
export const getStationMap = (): Map<string, string> => {
  const stationMap = new Map<string, string>();
  
  // 遍历组织结构树，提取所有油站名称和ID
  const extractStationMap = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.key.startsWith('station-')) {
        stationMap.set(node.title as string, node.value as string);
      }
      if (node.children && node.children.length > 0) {
        extractStationMap(node.children);
      }
    });
  };
  
  extractStationMap(orgData as any[]);
  return stationMap;
};

// 根据ID获取油站名称
export const getStationNameById = (stationId: string): string | undefined => {
  let stationName: string | undefined;
  
  // 遍历组织结构树，查找匹配的ID
  const findStationName = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.key === stationId) {
        stationName = node.title as string;
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findStationName(node.children)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findStationName(orgData as any[]);
  return stationName;
};

// 获取所有分公司ID
export const getAllBranchIds = (): string[] => {
  const branchIds: string[] = [];
  
  // 遍历组织结构树，提取所有分公司ID
  const extractBranchIds = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.key.startsWith('branch-')) {
        branchIds.push(node.key as string);
      }
      if (node.children && node.children.length > 0) {
        extractBranchIds(node.children);
      }
    });
  };
  
  extractBranchIds(orgData as any[]);
  return branchIds;
};

// 获取所有服务区ID
export const getAllServiceAreaIds = (): string[] => {
  const serviceAreaIds: string[] = [];
  
  // 遍历组织结构树，提取所有服务区ID
  const extractServiceAreaIds = (nodes: any[]) => {
    nodes.forEach(node => {
      if (node.key.startsWith('service-area-')) {
        serviceAreaIds.push(node.key as string);
      }
      if (node.children && node.children.length > 0) {
        extractServiceAreaIds(node.children);
      }
    });
  };
  
  extractServiceAreaIds(orgData as any[]);
  return serviceAreaIds;
};

// 根据油站ID获取其所属分公司和服务区信息
export const getStationHierarchy = (stationId: string): { branchId?: string; branchName?: string; serviceAreaId?: string; serviceAreaName?: string } => {
  const result: { branchId?: string; branchName?: string; serviceAreaId?: string; serviceAreaName?: string } = {};
  
  // 解析油站ID格式 station-{branchIndex}-{serviceAreaIndex}-{stationIndex}
  const parts = stationId.split('-');
  if (parts.length === 4) {
    const branchIndex = parts[1];
    const serviceAreaIndex = parts[2];
    
    // 构造分公司ID和服务区ID
    const branchId = `branch-${branchIndex}`;
    const serviceAreaId = `service-area-${branchIndex}-${serviceAreaIndex}`;
    
    // 查找分公司和服务区名称
    const findNames = (nodes: any[]) => {
      for (const node of nodes) {
        if (node.key === branchId) {
          result.branchId = branchId;
          result.branchName = node.title as string;
        }
        if (node.key === serviceAreaId) {
          result.serviceAreaId = serviceAreaId;
          result.serviceAreaName = node.title as string;
        }
        if (node.children && node.children.length > 0) {
          findNames(node.children);
        }
      }
    };
    
    findNames(orgData as any[]);
  }
  
  return result;
};

// 根据分公司ID获取其下所有油站ID
export const getStationIdsByBranchId = (branchId: string): string[] => {
  const stationIds: string[] = [];
  
  // 遍历组织结构树，查找指定分公司下的所有油站
  const findStations = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.key === branchId) {
        // 找到指定分公司，提取其下所有油站
        const extractStationIds = (children: any[]) => {
          children.forEach(child => {
            if (child.key.startsWith('station-')) {
              stationIds.push(child.key as string);
            }
            if (child.children && child.children.length > 0) {
              extractStationIds(child.children);
            }
          });
        };
        
        if (node.children && node.children.length > 0) {
          extractStationIds(node.children);
        }
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findStations(node.children)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findStations(orgData as any[]);
  return stationIds;
};

// 根据服务区ID获取其下所有油站ID
export const getStationIdsByServiceAreaId = (serviceAreaId: string): string[] => {
  const stationIds: string[] = [];
  
  // 遍历组织结构树，查找指定服务区下的所有油站
  const findStations = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.key === serviceAreaId) {
        // 找到指定服务区，提取其下所有油站
        const extractStationIds = (children: any[]) => {
          children.forEach(child => {
            if (child.key.startsWith('station-')) {
              stationIds.push(child.key as string);
            }
            if (child.children && child.children.length > 0) {
              extractStationIds(child.children);
            }
          });
        };
        
        if (node.children && node.children.length > 0) {
          extractStationIds(node.children);
        }
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (findStations(node.children)) {
          return true;
        }
      }
    }
    return false;
  };
  
  findStations(orgData as any[]);
  return stationIds;
};

// 油品类型
export const oilTypes = ['92#汽油', '95#汽油', '98#汽油', '0#柴油', '尿素'];

// 供应商列表
export const suppliers = [
  '中国石化',
  '中国石油',
  '中国海油',
  '壳牌',
  '埃克森美孚',
  '中化石油',
  '中油BP'
];

// 仓库信息
export interface Warehouse {
  id: string;
  name: string;
  type: 'station' | 'central' | 'regional'; // 油站仓库、中央仓库、区域仓库
  stationId?: string; // 关联的油站ID（如果是油站仓库）
  branchId?: string; // 关联的分公司ID（如果是区域仓库）
}

// 所有仓库列表
export const warehouses: Warehouse[] = [
  // 中央仓库
  { id: 'WH-C-001', name: '江西交投中央仓库', type: 'central' },
  
  // 区域仓库（每个分公司一个）
  { id: 'WH-R-001', name: '赣中分公司仓库', type: 'regional', branchId: 'branch-1' },
  { id: 'WH-R-002', name: '赣东北分公司仓库', type: 'regional', branchId: 'branch-2' },
  { id: 'WH-R-003', name: '赣东分公司仓库', type: 'regional', branchId: 'branch-3' },
  { id: 'WH-R-004', name: '赣东南分公司仓库', type: 'regional', branchId: 'branch-4' },
  { id: 'WH-R-005', name: '赣南分公司仓库', type: 'regional', branchId: 'branch-5' },
  { id: 'WH-R-006', name: '赣西南分公司仓库', type: 'regional', branchId: 'branch-6' },
  { id: 'WH-R-007', name: '赣西分公司仓库', type: 'regional', branchId: 'branch-7' },
  { id: 'WH-R-008', name: '赣西北分公司仓库', type: 'regional', branchId: 'branch-8' },
  
  // 油站仓库（每个油站一个）
  { id: 'WH-S-1-1-1', name: '油站1-1-1仓库', type: 'station', stationId: 'station-1-1-1' },
  { id: 'WH-S-1-1-2', name: '油站1-1-2仓库', type: 'station', stationId: 'station-1-1-2' },
  { id: 'WH-S-1-2-1', name: '油站1-2-1仓库', type: 'station', stationId: 'station-1-2-1' },
  { id: 'WH-S-1-2-2', name: '油站1-2-2仓库', type: 'station', stationId: 'station-1-2-2' },
  
  { id: 'WH-S-2-1-1', name: '油站2-1-1仓库', type: 'station', stationId: 'station-2-1-1' },
  { id: 'WH-S-2-1-2', name: '油站2-1-2仓库', type: 'station', stationId: 'station-2-1-2' },
  { id: 'WH-S-2-2-1', name: '油站2-2-1仓库', type: 'station', stationId: 'station-2-2-1' },
  { id: 'WH-S-2-2-2', name: '油站2-2-2仓库', type: 'station', stationId: 'station-2-2-2' },
  
  { id: 'WH-S-3-1-1', name: '油站3-1-1仓库', type: 'station', stationId: 'station-3-1-1' },
  { id: 'WH-S-3-1-2', name: '油站3-1-2仓库', type: 'station', stationId: 'station-3-1-2' },
  { id: 'WH-S-3-2-1', name: '油站3-2-1仓库', type: 'station', stationId: 'station-3-2-1' },
  { id: 'WH-S-3-2-2', name: '油站3-2-2仓库', type: 'station', stationId: 'station-3-2-2' },
  
  { id: 'WH-S-4-1-1', name: '油站4-1-1仓库', type: 'station', stationId: 'station-4-1-1' },
  { id: 'WH-S-4-1-2', name: '油站4-1-2仓库', type: 'station', stationId: 'station-4-1-2' },
  { id: 'WH-S-4-2-1', name: '油站4-2-1仓库', type: 'station', stationId: 'station-4-2-1' },
  { id: 'WH-S-4-2-2', name: '油站4-2-2仓库', type: 'station', stationId: 'station-4-2-2' },
  
  { id: 'WH-S-5-1-1', name: '油站5-1-1仓库', type: 'station', stationId: 'station-5-1-1' },
  { id: 'WH-S-5-1-2', name: '油站5-1-2仓库', type: 'station', stationId: 'station-5-1-2' },
  { id: 'WH-S-5-2-1', name: '油站5-2-1仓库', type: 'station', stationId: 'station-5-2-1' },
  { id: 'WH-S-5-2-2', name: '油站5-2-2仓库', type: 'station', stationId: 'station-5-2-2' },
  
  { id: 'WH-S-6-1-1', name: '油站6-1-1仓库', type: 'station', stationId: 'station-6-1-1' },
  { id: 'WH-S-6-1-2', name: '油站6-1-2仓库', type: 'station', stationId: 'station-6-1-2' },
  { id: 'WH-S-6-2-1', name: '油站6-2-1仓库', type: 'station', stationId: 'station-6-2-1' },
  { id: 'WH-S-6-2-2', name: '油站6-2-2仓库', type: 'station', stationId: 'station-6-2-2' },
  
  { id: 'WH-S-7-1-1', name: '油站7-1-1仓库', type: 'station', stationId: 'station-7-1-1' },
  { id: 'WH-S-7-1-2', name: '油站7-1-2仓库', type: 'station', stationId: 'station-7-1-2' },
  { id: 'WH-S-7-2-1', name: '油站7-2-1仓库', type: 'station', stationId: 'station-7-2-1' },
  { id: 'WH-S-7-2-2', name: '油站7-2-2仓库', type: 'station', stationId: 'station-7-2-2' },
  
  { id: 'WH-S-8-1-1', name: '油站8-1-1仓库', type: 'station', stationId: 'station-8-1-1' },
  { id: 'WH-S-8-1-2', name: '油站8-1-2仓库', type: 'station', stationId: 'station-8-1-2' },
  { id: 'WH-S-8-2-1', name: '油站8-2-1仓库', type: 'station', stationId: 'station-8-2-1' },
  { id: 'WH-S-8-2-2', name: '油站8-2-2仓库', type: 'station', stationId: 'station-8-2-2' }
];

// 根据油站ID获取对应的仓库
export const getWarehouseByStationId = (stationId: string): Warehouse | undefined => {
  return warehouses.find(warehouse => warehouse.stationId === stationId);
};

// 根据分公司ID获取对应的区域仓库
export const getWarehouseByBranchId = (branchId: string): Warehouse | undefined => {
  return warehouses.find(warehouse => warehouse.branchId === branchId);
};

// 获取所有仓库名称和ID的映射
export const getWarehouseMap = (): Map<string, string> => {
  const warehouseMap = new Map<string, string>();
  warehouses.forEach(warehouse => {
    warehouseMap.set(warehouse.name, warehouse.id);
  });
  return warehouseMap;
}; 