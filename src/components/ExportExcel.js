import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react'
import XLSX from 'xlsx';

export const ExportExcel = ({filename, data, title, button, size, type}) => {

    return(
        <div>
            {button || <Button shape='round' type={type || null} size={size}  onClick={() => exportFile(data, filename)} icon={<DownloadOutlined/>} >{title || 'Export Excel'}</Button>}
        </div>
    )
}

export const exportFile = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "report");
    XLSX.writeFile(wb, filename ? `${filename}.xlsx` : 'Report.xlsx')
};