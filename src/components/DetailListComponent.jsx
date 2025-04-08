import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import AgGridTable from "../../components/common/AgGridTable";

const DetailListComponent = ({ listData, setListData, columns, addAction, removeAction, modalComponent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState([]);

  const loadAvailableItems = async () => {
    try {
      const data = await addAction.fetchAvailable();
      setAvailableItems(data);
    } catch {
      message.error("Failed to load available items.");
    }
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          loadAvailableItems();
        }}
        className="add-button"
      >
        {addAction.label}
      </Button>

      <AgGridTable
        rowData={listData}
        columnDefs={[
          ...columns,
          {
            headerName: "Actions",
            field: "actions",
            width: 140,
            cellRenderer: (params) => (
              <Popconfirm
                title={`Are you sure to remove this ${removeAction.itemName}?`}
                onConfirm={async () => {
                  await removeAction.func(params.data.id);
                  setListData((prev) => prev.filter((item) => item.id !== params.data.id));
                }}
              >
                <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
            ),
          },
        ]}
      />

      {modalComponent({ isOpen: isModalOpen, onClose: () => setIsModalOpen(false), availableItems, setListData })}
    </>
  );
};

export default DetailListComponent;
