import React, { useMemo } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

const EnergyDataTable = ({ 
  data, 
  columns, 
  isMobile, 
  isSystemUser, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const tableColumns = useMemo(() => [
    {
      accessorKey: "type",
      header: "Loại năng lượng",
      size: isMobile ? 100 : 150,
    },
    {
      accessorKey: "info.device_name",
      header: "Tên thiết bị",
      size: isMobile ? 150 : 200,
    },
    {
      accessorKey: "info.status",
      header: "Trạng thái",
      size: isMobile ? 100 : 120,
      Cell: ({ cell }) => (
        <span
          style={{
            color: cell.getValue() === "Active" ? "#4caf50" : "#9e9e9e",
            fontWeight: 500,
          }}
        >
          {cell.getValue() === "Active" ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      header: "Thao tác",
      size: isMobile ? 100 : 150,
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Tooltip title="Xem chi tiết">
            <IconButton
              size={isMobile ? "small" : "medium"}
              onClick={() => onView(row.original)}
            >
              <FaEye color="green" />
            </IconButton>
          </Tooltip>
          {isSystemUser && (
            <>
              <Tooltip title="Chỉnh sửa">
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={() => onEdit(row.original)}
                >
                  <FaEdit color="blue" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Xóa">
                <IconButton
                  size={isMobile ? "small" : "medium"}
                  onClick={() => onDelete(row.original.id, row.original.type)}
                >
                  <FaTrash color="red" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ], [isMobile, isSystemUser, onView, onEdit, onDelete]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs overflow-hidden">
      <MaterialReactTable
        columns={tableColumns}
        data={data}
        enableSorting
        enableFilters
        muiTableContainerProps={{
          sx: {
            maxHeight: isMobile ? "auto" : "calc(100vh - 320px)",
          },
        }}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "none",
            backgroundColor: "transparent",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: "background.default",
            color: "text.primary",
            fontWeight: 600,
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            borderBottom: "1px solid",
            borderColor: "divider",
          },
        }}
      />
    </div>
  );
};

export default EnergyDataTable;