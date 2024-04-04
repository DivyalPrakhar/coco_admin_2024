import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  PictureOutlined,
  SearchOutlined,

} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Row,
  Tabs,
  Tag,
  Table,
  Space,
  Typography,
  Tooltip,
  Image,
  Form,
  Input,
} from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddProductDrawer } from "../../components/AddProductDrawer";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import {
  getAllProductsAction,
  deleteProductAction,
} from "../../redux/reducers/products";

import _, { indexOf, map } from "lodash";
import Modal from "antd/lib/modal/Modal";
import Avatar from "antd/lib/avatar/avatar";
import { Flex } from "@chakra-ui/react";

const { TabPane } = Tabs;
const { Text, Paragraph } = Typography;

export const ManageProducts = () => {
  const dispatch = useDispatch();

  const { configData, productData } = useSelector((state) => ({
    configData: state.lmsConfig,
    productData: state.product,
  }));

  const [addProductDrawer, setAddProductDrawer] = useState(false);
  const [productsList, setProductsList] = useState(null);
  // const dispatch = useDispatch()
  const columnNames = [
    "cover",
    "name",
    "code",
    "description",
    "attachment",
    "type",
    "exams",
    "mode",
    "actions",
  ];
  const productsNames = ["book", "drive", "magazine"];
  const [selectedProduct, setSelectedProduct] = useState({});

  useEffect(() => {
    if (configData.defaultDataStatus === STATUS.SUCCESS) {
      dispatch(getAllProductsAction());
    }
  }, [dispatch, configData.defaultDataStatus]);

  function handleTabChange(key) {}

  function closeDrawer() {
    setAddProductDrawer(false);
  }

  const openDrawer = (data) => {
    setSelectedProduct(data);
    setAddProductDrawer(true);
  };

  const deleteProduct = (data) => {
    dispatch(deleteProductAction({ id: data._id, type: data.type }));
  };

  useEffect(() => {
    if (productData.allProductStatus === STATUS.SUCCESS) {
      setProductsList({
        products: productData.productsData,
      });
    }
  }, [productData?.allProductStatus, productData]);

  const tableActions = {
    openDrawer: openDrawer,
    deleteProduct: deleteProduct,
  };
  return (
    <div>
      <CommonPageHeader
        title="Products"
        extra={
          <Button
            icon={<PlusOutlined />}
            onClick={() => {
              openDrawer({});
            }}
            size="large"
            shape="round"
          >
            Add Product
          </Button>
        }
      />
      <br />
      <Card>
        <Tabs defaultActiveKey="1" onChange={handleTabChange}>
          {/* <TabPane tab="Books" key="1">
                        {
                            productsList
                            ?<DataTable columns={columnNames} data={productsList} type={'BOOK'} actions={tableActions}/>
                            :<p>Data Loading ...</p>
                        }
                    </TabPane>
                    <TabPane tab="Drives" key="2">
                        {
                            productsList
                            ?<DataTable columns={columnNames} data={productsList} type={'DRIVE'} actions={tableActions}/>
                            :<p>Data Loading ...</p>
                        }
                    </TabPane>
                    <TabPane tab="Magazines" key="3">
                        {
                            productsList
                            ?<DataTable columns={columnNames.filter((col)=>(col !== 'exams'))} data={productsList} type={'MAGAZINE'} actions={tableActions}/>
                            :<p>Data Loading ...</p>
                        }
                    </TabPane> */}
          {productsNames.map((prodName, i) => (
            <TabPane
              tab={
                (prodName === "drive" ? "Media " : "") +
                prodName.charAt(0).toUpperCase() +
                prodName.slice(1).toLowerCase() +
                "s"
              }
              key={++i}
            >
              {
                <DataTable
                  columns={
                    prodName === "magazine"
                      ? columnNames
                      : _.filter(
                          columnNames,
                          (c) => c != "mode" && c != "attachment"
                        )
                  }
                  loading={productData.allProductStatus == STATUS.FETCHING}
                  data={productsList}
                  type={prodName.toUpperCase()}
                  actions={tableActions}
                />
              }
            </TabPane>
          ))}
        </Tabs>
      </Card>
      {addProductDrawer ? (
        <AddProductDrawer
          visible={addProductDrawer}
          closeDrawer={closeDrawer}
          defaultSelected={selectedProduct?.type}
          selectedProduct={selectedProduct}
        />
      ) : null}
    </div>
  );
};

const DataTable = ({ columns, data, type, actions, loading }) => {
  let searchInput = useRef();
  const [productModal, setProductModal] = useState({
    visible: false,
    data: null,
  });

  const { deleteProductStatus } = useSelector((state) => ({
    deleteProductStatus: state.product.deleteProductStatus,
  }));

  const productTableColumns = columns.map((col) => {
    return {
      title: col.charAt(0).toUpperCase() + col.slice(1),
      dataIndex: col.toLowerCase(),
      key: col.toLowerCase(),

    }
  });

  // productTableColumns[columns.indexOf('name')].sorter = (a,b)=>{
  //     return a<b ? -1 : (a>b ? 1 : 0)
  // }

  productTableColumns[columns.indexOf("cover")].render = (data) => {
    let props = { src: data };
    return data ? (
      <Image
        style={{
          borderRadius: "50%",
          width: "60px",
          cursor: "pointer",
          height: "60px",
          border: "1px solid #444",
        }}
        size={50}
        {...props}
      />
    ) : (
      <PictureOutlined
        style={{
          fontSize: "30px",
          background: "#444",
          color: "white",
          borderRadius: "50%",
          padding: "10px",
        }}
      />
    );
  };
  productTableColumns[columns.indexOf("type")].render = (type) => (
    <Tag>{type}</Tag>
  );
  if (type === "MAGAZINE") {
    productTableColumns[columns.indexOf("mode")].render = (data) => (
      <div>
        <Tag>{data?.mode}</Tag>
        {/* {data?.content.length ?
                    <Tag onClick={() => window.open(data.content[0].url)} style={{marginTop: '4px', cursor: 'pointer'}}>Attachment</Tag>
                : null} */}
      </div>
    );
  }
  productTableColumns[columns.indexOf("description")].ellipsis = true;
  productTableColumns[columns.indexOf("actions")].render = (pData) => {
    return (
      <Space size="middle">
        <Tooltip title="Edit">
          <Button
            type="default"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              actions.openDrawer(pData);
            }}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <Button
            type="default"
            shape="circle"
            loading={deleteProductStatus === STATUS.FETCHING}
            danger
            icon={<DeleteOutlined />}
            onClick={() => actions.deleteProduct(pData)}
          />
        </Tooltip>
      </Space>
    );
  };

  if (columns.includes("exams")) {
    productTableColumns[columns.indexOf("exams")].render = (exams) => {
      return (
        <Flex flexWrap={"wrap"}>
          {map(exams, exam => 
            <Flex mr={1} fontSize={"12px"} px={3} my="1" border="1px solid #d9d9d9" w="fit-content" bg="#fafafa" maxW="150px" wordBreak={"break-word"} >{exam?.name.en}</Flex>
          )}
        </Flex>
      )
    };
  }

  if (type === "MAGAZINE")
    productTableColumns[columns.indexOf("attachment")].render = (data) => {
      return data?.length ? (
        <Button
          type="link"
          onClick={() => window.open(data[0].url)}
          style={{ marginTop: "4px", cursor: "pointer" }}
        >
          Attachment
        </Button>
      ) : null;
    };

  const productTableDataSource = data?.products[type]
    ? data.products[type].map((v, i) => {
        let image = v?.media[0]; //? JSON.parse(v?.media[0]) : null

        let data = {
          key: i,
          name: v?.name?.en,
          description: v?.description?.en,
          type: v?.type,
          exams: v?.exams,
          code: v?.code,
          actions: v,
          mode: v,
          attachment: v.content,
          cover: v?.media.length ? v?.media[0].url : null,
        };
        if (image) {
          data.image = image;
        }
        return data;
      })
    : [];

  const handleOnRowClick = (e, data) => {
    if ("tdimgspan".includes(e.target.localName)) {
      setProductModal({ visible: true, data: data });
    }
  };

  const handleOnClose = () => {
    setProductModal({ visible: false, data: null });
  };

  for (let i = 0; i< productTableColumns.length; i++) {
    if( productTableColumns[i].dataIndex === 'name' || productTableColumns[i].dataIndex === 'code') {
      productTableColumns[i].onFilterDropdownVisibleChange = (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      }
      productTableColumns[i].onFilter = (value, record) => (
        record[productTableColumns[i].dataIndex] ? record[productTableColumns[i].dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : ""
      )
    
      productTableColumns[i].filterDropdown = ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Form
            onFinish={() => {
              confirm({ closeDropdown: false });
            }}
          >
            <Input
              ref={(node) => {
                searchInput = node;
              }}
              placeholder={`Search ${"name"}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                htmlType="submit"
                type="primary"
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </Form>
        </div>
      )
      productTableColumns[i].filterIcon = (filtered) => (
        <SearchOutlined
          style={{ fontSize: "18px", color: filtered ? "#1890ff" : undefined }}
        />
      )
    }
  }

  
  // console.log("propsIsCool", columns, productTableDataSource); 
  return (
    <>
      <Table
        columns={productTableColumns}
        dataSource={productTableDataSource}
        bordered
        loading={loading}
      />
      {/* <ProductModal data={productModal.data} onClose={handleOnClose} visible={productModal.visible}/> */}
    </>
  );
};

const ProductModal = ({ data, visible, onClose }) => {
  const handleCloseClick = () => {
    onClose();
  };

  let avatarProps = data?.image
    ? { src: data?.image?.url }
    : { style: { backgroundColor: "#444" }, icon: <PictureOutlined /> };
  return data ? (
    <Modal
      title="Product"
      visible={visible}
      onCancel={handleCloseClick}
      footer={[
        <Button key="back" onClick={handleCloseClick}>
          Close
        </Button>,
      ]}
    >
      <Row>
        <Col span={10}>
          <Avatar size={100} {...avatarProps} />
        </Col>
        <Col span={14}>
          <Space direction="vertical">
            <span>
              Name :<Text strong> {data.name}</Text>
            </span>
            <span>
              Code :<Text strong> {data.code}</Text>
            </span>
            <span>
              Description :{" "}
              <Text>
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 1, expandable: true, symbol: "Show More" }}
                >
                  {" "}
                  {data.description}
                </Paragraph>
              </Text>
            </span>
          </Space>
        </Col>
      </Row>
    </Modal>
  ) : null;
};
