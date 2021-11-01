import { useState, useCallback } from "react";

import { Button, notification, Table, Tag, Tooltip, Form, Space } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useAntdTable } from "ahooks";

import {
  addCategory,
  deleteCategoryById,
  getAllCategories,
  modifyCategoryById,
} from "../../../api/category";
import { CategoryModal } from "./modal";

export function AdminCategory() {
  const [activeId, setActiveId] = useState<string | null | undefined>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisible = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const openModal = useCallback(
    (id) => {
      toggleVisible();
      setActiveId(id);
    },
    [toggleVisible]
  );

  const refresh = useCallback(async () => {
    const res = await getAllCategories();
    return { total: res.data.length, list: res.data };
  }, []);

  const { tableProps, search } = useAntdTable(refresh, {
    defaultPageSize: 10,
  });

  const { submit } = search;

  const deleteHandler = async (id: string) => {
    const res = await deleteCategoryById({ id });
    submit();
    notification.success({ message: res.message });
  };

  const [columns] = useState<any[]>([
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "分类名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "发布时间",
      key: "createAndUpdateTime",
      render: (d: any) => {
        return (
          <Tooltip
            title={`上次更新于: ${new Date(d.updateAt).toLocaleString()}`}
          >
            <Tag color="blue">{new Date(d.createAt).toLocaleString()}</Tag>
          </Tooltip>
        );
      },
    },
    {
      title: "操作",
      key: "otherOption",
      render: (d: any) => {
        return (
          <Space>
            <Button
              shape="circle"
              type="primary"
              icon={<EditOutlined />}
              onClick={openModal.bind(null, d.id)}
            ></Button>
            <Button
              shape="circle"
              danger
              icon={<DeleteOutlined />}
              onClick={deleteHandler.bind(null, d.id)}
            ></Button>
          </Space>
        );
      },
    },
  ]);

  return (
    <>
      <Form layout="inline" style={{ marginBottom: "12px" }}>
        <Form.Item>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openModal.bind(null, undefined)}
          >
            新增
          </Button>
        </Form.Item>
      </Form>
      <Table rowKey={(d) => d.id} columns={columns} {...tableProps} bordered />
      <CategoryModal
        {...{
          visible,
          onCancel: toggleVisible,
          onAdd: async (values: any) => {
            const res = await modifyCategoryById(values);
            submit();
            toggleVisible();
            notification.success({
              message: res.message,
            });
          },
          onModify: async (values: any) => {
            const res = await addCategory(values);
            submit();
            toggleVisible();
            notification.success({
              message: res.message,
            });
          },
          id: activeId,
        }}
      />
    </>
  );
}
