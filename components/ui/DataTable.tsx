'use client';

import React, { useState } from 'react';
import { Table, Input, Space, Button, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { TableProps, TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';

interface DataTableProps<T> extends Omit<TableProps<T>, 'onChange'> {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onRefresh?: () => void;
  showSearch?: boolean;
  showRefresh?: boolean;
  loading?: boolean;
  extraActions?: React.ReactNode;
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => void;
}

export default function DataTable<T extends object>({
  searchPlaceholder = 'Search...',
  onSearch,
  onRefresh,
  showSearch = true,
  showRefresh = true,
  loading = false,
  extraActions,
  onTableChange,
  ...tableProps
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleTableChange: TableProps<T>['onChange'] = (pagination, filters, sorter) => {
    onTableChange?.(pagination, filters, sorter);
  };

  return (
    <div>
      <div style={{ 
        marginBottom: 16, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        <Space wrap>
          {showSearch && (
            <Input.Search
              placeholder={searchPlaceholder}
              allowClear
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            />
          )}
          {showRefresh && (
            <Tooltip title="Refresh">
              <Button 
                icon={<ReloadOutlined />} 
                onClick={onRefresh}
                loading={loading}
              />
            </Tooltip>
          )}
        </Space>
        
        {extraActions && (
          <Space wrap>
            {extraActions}
          </Space>
        )}
      </div>
      
      <Table<T>
        {...tableProps}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 'max-content' }}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSizeOptions: ['10', '20', '50', '100'],
          ...tableProps.pagination,
        }}
        style={{
          background: '#fff',
          borderRadius: 8,
          ...tableProps.style,
        }}
      />
    </div>
  );
}
