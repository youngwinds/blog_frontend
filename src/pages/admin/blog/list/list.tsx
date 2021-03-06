import React, { useState, useCallback, useEffect } from "react";
import { Button, notification, Space, Table, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useAntdTable } from "ahooks";

import { deleteArticleById, getAllArticles } from "../../../../api/blog";

export function List({ activeKey, setActiveKey, setEditorName, setArticleId }: any) {
  const refresh = useCallback(async () => {
    const res = await getAllArticles();
    return { total: res.data.length, list: res.data.reverse() };
  }, []);

  const { tableProps, search } = useAntdTable(refresh, {
    defaultPageSize: 10,
  });

  const { submit } = search;

  const deleteHandler = async (id: string) => {
    const res = await deleteArticleById({ id });
    submit();
    notification.success({ message: res.message });
  };

  useEffect(() => {
    submit();
  }, [activeKey])
  const [columns] = useState<any[]>([
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    // {
    //   title: "作者",
    //   dataIndex: "author",
    //   key: "author",
    // },
    {
      title: "介绍",
      dataIndex: "introduce",
      key: "introduce",
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      render: (row: any) => {
        if (row)
          return row.name
        else return '无'
      }
    },
    // {
    //   title: "图表",
    //   dataIndex: "coverInfo",
    //   key: "coverInfo",
    // },
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
            <Button shape="circle" type="primary" icon={<EditOutlined />} onClick={() => {
              setActiveKey('editor')
              setEditorName("修改文章")
              setArticleId(d.id);
            }}>

            </Button>
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
    <Table rowKey={(d) => d.id} columns={columns} {...tableProps} bordered />
  );
}
