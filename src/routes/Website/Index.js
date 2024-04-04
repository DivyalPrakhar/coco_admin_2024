import {
  Tooltip,
  Button,
  Card,
  Select,
  Tag,
  Row,
  Col,
  Upload,
  Input,
  Radio,
  Space,
  Tabs,
  Alert,
  Rate,
  Popover,
} from "antd";
import {
  TagTwoTone,
  OrderedListOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { STATUS } from "../../Constants";
import {
  addWebsiteDataAction,
  getWebsiteDataAction,
} from "../../redux/reducers/website";
import { SelectTagsModal } from "../ManagePackages/SelectTagsModal";
import { getPackagesAction } from "../../redux/reducers/packages";
import { BaseURL } from "../../BaseUrl";
import {
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { ImagePreview } from "../../components/ImagePreview";
import { UploadImageBox } from "../../components/UploadImageBox";
import Text from "antd/lib/typography/Text";
import { OrderCarouselData } from "./OrderCarouselData";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Offers } from "./Offers";
import { AppVersion } from "./AppVersion";
import { CoursePromo } from "./CoursePromo";
import { TestPromo } from "./TestPromo";


export const WebsiteData = () => {
  const dispatch = useDispatch();

  const {
    configData,
    instituteId,
    addWebsiteDataStatus,
    getWebsiteDataStatus,
    websiteData,
    packages,
  } = useSelector((state) => ({
    configData: state.lmsConfig,
    instituteId: state.user.user?.staff.institute._id,
    addWebsiteDataStatus: state.website.addWebsiteDataStatus,
    getWebsiteDataStatus: state.website.getWebsiteDataStatus,
    websiteData: state.website.websiteData,
    packages: state.packages,
  }));

  const [tagsModal, openTagsModal] = useState();
  const [selectedTags, setTags] = useState([]);
  const [exams, setExams] = useState([]);
  const [courseExams, changeCourseExams] = useState([]);
  const [testExams, changeTestExams] = useState([]);
  const [carouselData, changeCarouselData] = useState([]);
  const [testimonialsData, changeTestimonialsData] = useState([]);
  const [thumbnail, changeThumbnail] = useState();
  let [deleting, setDeleting] = useState()

  useEffect(() => {
    if (addWebsiteDataStatus == STATUS.SUCCESS && websiteData){
      if(websiteData.carousel)
        changeCarouselData(websiteData.carousel.length ?
          _.map(websiteData.carousel, (cr) => ({
            ..._.omitBy(cr, "_id"),
            id: new Date(),
            added:true,
          })) : []
        )

      if(websiteData.testimonials)
        changeTestimonialsData(websiteData.testimonials.length ?
          _.map(websiteData.testimonials, (cr) => ({
            ..._.omitBy(cr, "_id"),
            added:true,
            id: new Date(),
          })) : []
        )
    }
    
    setDeleting(null)
  }, [addWebsiteDataStatus, websiteData]);

  useEffect(() => {
    if (configData.defaultDataStatus == STATUS.SUCCESS) {
      let defaultData = configData.defaultData;
      setExams(defaultData?.exams);
    }

    dispatch(getPackagesAction());
    dispatch(getWebsiteDataAction({ instituteId }));
  }, [configData.defaultDataStatus]);

  useEffect(() => {
    if (getWebsiteDataStatus == STATUS.SUCCESS && websiteData) {
      setTags(websiteData.landingPageData);
      changeCourseExams(websiteData.courseCategories.map((c) => c._id));
      changeTestExams(websiteData.testSeries.map((t) => t._id));
      if (websiteData?.carousel?.length != 0) {
        changeCarouselData(
          _.map(websiteData.carousel, (cr) => ({
            added:true,
            id: new Date(),
            link: cr?.link,
            package: cr?.package,
            imageUrl: cr?.imageUrl,
            order: cr?.order || 1,
            active: cr?.active,
          }))
        );
      } else {
        addMoreCarousel();
      }
      if (websiteData?.testimonials?.length != 0) {
        changeTestimonialsData(
          _.map(websiteData.testimonials, (cr) => ({
            added:true,
            id: new Date(),
            name: cr?.name,
            rating: cr?.rating,
            image: cr?.image,
            review: cr?.review,
          }))
        );
      } else {
        addMoreTestimonials();
      }
    }
  }, [getWebsiteDataStatus]);

  const _tagsModal = () => {
    openTagsModal(!tagsModal);
  };

  const submitTags = (data) => {
    setTags(data);
  };

  const selectCourseExams = (data) => {
    changeCourseExams(data);
  };

  const selectTestExams = (data) => {
    changeTestExams(data);
  };

  const saveWebsiteData = (carousal, testimonial) => {
    let currentCarousel =
      carousal ||
      _.compact(
        _.map(carouselData, (cr, index) =>
          cr.imageUrl
            ? {
                imageUrl: cr.imageUrl,
                link: cr.link,
                active: cr.active,
                order: cr.order,
              }
            : null
        )
      );
    let currentTestimonials = 
    testimonial ||
    _.compact(
      _.map(testimonialsData, (cr, index) =>
        cr.name
          ? {
              image: cr.image,
              name: cr.name,
              review: cr.review,
              rating: cr.rating,
            }
          : null
      )
    );

    const data = {
      landingPageData: selectedTags,
      courseCategories: courseExams,
      testSeries: testExams,
      instituteId,
      carousel: currentCarousel.map(d => _.omit(d, ['added', 'id'])),
      testimonials: currentTestimonials?.length ? currentTestimonials.map(d => _.omit(d, ['added', 'id'])) : currentTestimonials,
    };


    dispatch(addWebsiteDataAction(data));
  };

  const removeTag = (data) => {
    setTags((tags) => _.differenceBy(tags, [data], "_id"));
  };

  const changeMedia = (e, id) => {
    if (e.fileList.length > 0) {
      let carousel = e.fileList[0].url || e.fileList[0].response?.url;
      if (carousel != undefined) {
        carouselMap(id, "imageUrl", carousel);
      }
    } else {
      carouselMap(id, "imageUrl", "");
    }
  };

  const changeMediaTest = (e, id) => {
    if (e.fileList.length > 0) {
      let testimonial = e.fileList[0].url || e.fileList[0].response?.url;
      if (testimonial != undefined) {
        testimonialMap(id, "image", testimonial);
      }
    } else {
      testimonialMap(id, "image", "");
    }
  };

  const carouselMap = (id, type, data) => {
    let currentData = carouselData;
    let findCr = _.findIndex(currentData, (cr) => cr.id == id);
    if (findCr != -1) {
      currentData[findCr] = Object.assign({}, currentData[findCr], {
        [type]: data,
      });
      changeCarouselData([...currentData]);
    }
  };

  const testimonialMap = (id, type, data) => {
    let currentData = testimonialsData;
    let findCr = _.findIndex(currentData, (cr) => cr.id == id);
    if (findCr != -1) {
      currentData[findCr] = Object.assign({}, currentData[findCr], {
        [type]: data,
      });
      changeTestimonialsData([...currentData]);
    }
  };

  const _previewThumbNail = (e) => {
    let value = e?.response?.url || e.url;
    changeThumbnail(value);
  };

  const addMoreCarousel = () => {
    changeCarouselData(
      _.concat(carouselData, {
        id: new Date(),
        imageUrl: "",
        link: "",
        package: "",
        active: true,
        order: carouselData.length + 1,
      })
    );
  };

  const addMoreTestimonials = () => {
    changeTestimonialsData(
      _.concat(testimonialsData, {
        id: new Date(),
        image: "",
        rating: "",
        review: "",
        name: "",
      })
    );
  };

  const deleteCarousel = (obj) => {
    let data = _.filter(carouselData, (cr) => cr.id != obj.id)
    obj.added ? saveWebsiteData(data) : changeCarouselData(d => _.filter(d, (cr) => cr.id != obj.id))
  };

  const deleteTestimonial = (obj) => {
    let data = _.filter(testimonialsData, (cr) => cr.id != obj.id)
    obj.added ? saveWebsiteData(null, data) : changeTestimonialsData(d => _.filter(d, (cr) => cr.id != obj.id))
  };

  const [orderCarousel, changeCarouselOrder] = useState();

  const _changeCarouselOrder = () => {
    changeCarouselOrder(!orderCarousel);
  };

  const [currentTab, changeTab] = useState('3')
  const handleChangeTab = (tab) => {
    changeTab(tab)
  }

  return (
    <div>
      <CommonPageHeader title="Manage Website" />
      <br />
      <Card loading={getWebsiteDataStatus == STATUS.FETCHING}>
        {getWebsiteDataStatus == STATUS.SUCCESS ? (
          <div>
            <br /><br />
            <Tabs type='card' size='large' onChange={handleChangeTab} activeKey={currentTab}>
              <Tabs.TabPane tab={'Landing Page'} key='3'>
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Landing Page Data
                  </div>
                  <div>
                    {selectedTags.length
                      ? selectedTags.map((t) => (
                          <Tag
                            closable
                            onClose={() => removeTag(t)}
                            style={{ fontSize: "14px", padding: "5px 5px" }}
                            icon={<TagTwoTone />}
                            color="blue"
                          >
                            {t.name}
                          </Tag>
                        ))
                      : null}
                    <Button onClick={_tagsModal}>Select Tags</Button>
                  </div>
                </div>
                <br />
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Course Categories
                  </div>
                  <Select
                    value={courseExams}
                    placeholder="Select Exams"
                    mode="multiple"
                    style={{ minWidth: "400px" }}
                    onChange={selectCourseExams}
                  >
                    {exams.length
                      ? exams.map((e) => (
                          <Select.Option key={e._id} value={e._id}>
                            {e.name.en}
                            {e.name.en && e.name.hn && "/"}
                            {e.name.hn}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </div>
                <br />
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      marginBottom: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    Test Series
                  </div>
                  <Select
                    value={testExams}
                    placeholder="Select Exams"
                    mode="multiple"
                    style={{ minWidth: "400px" }}
                    onChange={selectTestExams}
                  >
                    {exams.length
                      ? exams.map((e) => (
                          <Select.Option key={e._id} value={e._id}>
                            {e.name.en}
                            {e.name.en && e.name.hn && "/"}
                            {e.name.hn}
                          </Select.Option>
                        ))
                      : null}
                  </Select>
                </div>     
              </Tabs.TabPane>
              <Tabs.TabPane tab={'Carousel Data'} key='1'>
                <div style={{padding:'20px'}}>
                  <div
                    style={{
                      fontSize: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                      fontWeight: "bold",
                      width: "100%",
                    }}
                  >
                    Carousel Data
                    <Space>
                      <Button
                        onClick={_changeCarouselOrder}
                        icon={<OrderedListOutlined />}
                      >
                        Change Order
                      </Button>
                      <Button
                        style={{ float: "right" }}
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => addMoreCarousel()}
                      >
                        Add More
                      </Button>
                    </Space>
                  </div>
                  <Alert message={"Recommended Image Ratio: 4:1"} showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/>
                  <br/>
                  <div
                    style={{
                      border: "1px solid #dfdfdf",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {_.map(
                      _.orderBy(carouselData, ["order"], ["asc"]),
                      (cr, index) => (
                        <div key={index}>
                          <Row>
                            <Col sm={4}>Order: {cr.order}</Col>
                            <Col sm={4} xs={24} style={{ paddingRight: "5px" }}>
                              <div>
                                <b>IMAGE:</b>
                              </div>
                              <UploadImageBox disableAlert
                                defaultImg={cr.imageUrl}
                                getImage={(e) => changeMedia(e, cr.id)}
                                onRemove={() => carouselMap(cr.id, "imageUrl", "")}
                              />
                              {/* <Upload
                                                <Col sm={3} xs={24} style={{paddingRight: '5px'}}>
                                                    <div>
                                                        <b>IMAGE</b>&nbsp;&nbsp;
                                                        <Tooltip title='Recommended Image Ratio: 16:9'>
                                                            <ExclamationCircleOutlined style={{color: 'red'}}/>
                                                        </Tooltip>
                                                    </div>
                                                    <Upload
                                                        action= {BaseURL+"app/image"}
                                                        onChange={(e) => changeMedia(e, cr.id)}
                                                        multiple={false}
                                                        listType="picture-list"
                                                        maxCount={1}
                                                        onRemove={() => carouselMap(cr.id, 'imageUrl', '')}
                                                        //disabled={cr?.imageUrl}
                                                        onPreview={_previewThumbNail}
                                                        accept={"image/png, image/jpeg"}
                                                        {...(cr?.imageUrl && {
                                                            defaultFileList : [{ uid: 1, name: cr.imageUrl, status: 'done', url: cr.imageUrl}]
                                                        })}
                                                    >
                                                        <Button icon={<UploadOutlined />}>Upload</Button>
                                                    </Upload> */}
                            </Col>
                            <Col sm={6} xs={24} style={{ marginRight: "10px" }}>
                              <div>
                                <b>LINK:</b>
                              </div>
                              <Input
                                value={cr.link}
                                placeholder="Add Link"
                                style={{ width: "100%" }}
                                onChange={(e) =>
                                  carouselMap(cr.id, "link", e.target.value)
                                }
                              />
                            </Col>
                            {/* <Col sm={6} xs={24} style={{marginRight: '10px'}}>
                                                    <div><b>PACKAGE:</b></div>
                                                    <Select value={cr?.package?._id} placeholder='Select Package' style={{width:'100%'}} onChange={(e) => carouselMap(cr.id, 'package', e)}>
                                                        {packages.packagesList.length ? packages.packagesList.map(e => 
                                                            <Select.Option key={e._id} value={e._id}>{e.name.en}{e.name.en && e.name.hn && '/'}{e.name.hn}</Select.Option>
                                                        ) : null}
                                                    </Select>
                                                </Col> */}
                            <Col sm={5} xs={24} style={{ marginLeft: "20px" }}>
                              <div>
                                <b>ACTIVE:</b>
                              </div>
                              <Radio.Group
                                onChange={(e) =>
                                  carouselMap(cr.id, "active", e.target.value)
                                }
                                value={cr?.active}
                              >
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                              </Radio.Group>
                            </Col>
                            <Col
                              sm={2}
                              xs={24}
                              style={{
                                borderLeft: "1px solid #dfdfdf",
                                padding: "50px 0px 0px 30px",
                              }}
                            >
                              <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => deleteCarousel(cr)}  
                              >
                                Delete
                              </Button>
                            </Col>
                          </Row>
                          {carouselData.length > index + 1 ? (
                            <hr style={{ border: "1px solid #dfdfdf" }} />
                          ) : null}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab={'Testimonials'} key='2'>
                <div style={{padding:'20px'}}>
                  <div
                    style={{
                      fontSize: "16px",
                      marginBottom: "20px",
                      fontWeight: "bold",
                      width: "100%",
                    }}
                  >
                    Testimonials
                    <Button
                      style={{ float: "right" }}
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => addMoreTestimonials()}
                    >
                      Add More
                    </Button>
                  </div>
                  <Alert message={"Recommended Image Ratio: 2:1"} showIcon style={{background: '#e6f7fe', border: '1px solid #92d4fb'}}/><br/>
                  <div
                    style={{
                      border: "1px solid #dfdfdf",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {_.map(testimonialsData, (cr, index) => (
                      <div key={index}>
                        <Row>
                          <Col sm={5} xs={24} style={{ marginRight: "10px" }}>
                            <div>
                              <Text type='danger'>* </Text><b> NAME:</b>
                            </div>
                            <Input
                              value={cr.name}
                              placeholder="Add Name"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                testimonialMap(cr.id, "name", e.target.value)
                              }
                            />
                          </Col>
                          <Col sm={4} xs={24} style={{ marginRight: "10px" }}>
                            <div>
                              <b>RATING:</b>
                            </div>
                            <Rate value={parseFloat(cr.rating)} onChange={e => testimonialMap(cr.id, 'rating', e)} allowHalf/>
                            {/* <Input
                              type='number'
                              value={cr.rating}
                              placeholder="Add Rating"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                testimonialMap(cr.id, "rating", e.target.value)
                              }
                            /> */}
                          </Col>
                          <Col sm={6} xs={24} style={{ marginRight: "10px" }}>
                            {/* <div>
                              <b>REVIEW:</b>
                              <Popover content={'Maximum review length is 250 characters.'}>
                                <AiOutlineInfoCircle style={{color:'blue'}}/>
                              </Popover>
                            </div> */}
                            <Input.TextArea rows={6}
                              value={cr.review}
                              placeholder="Add Review"
                              style={{ width: "100%" }}
                              onChange={(e) =>
                                testimonialMap(cr.id, "review", e.target.value)
                              }
                            />
                          </Col>
                          <Col sm={5} xs={24}>
                            <div>
                                <b>IMAGE:</b>&nbsp;&nbsp;    
                            </div>
                            <UploadImageBox disableAlert
                              defaultImg={cr.image}
                              getImage={(e) => changeMediaTest(e, cr.id)}
                              onRemove={() => testimonialMap(cr.id, "image", "")}
                            />
                            {/* <Upload
                              action={BaseURL + "app/image"}
                              onChange={(e) => changeMediaTest(e, cr.id)}
                              multiple={false}
                              listType="picture-list"
                              maxCount={1}
                              onRemove={() => testimonialMap(cr.id, "image", "")}
                              //disabled={cr?.image}
                              onPreview={_previewThumbNail}
                              accept={"image/png, image/jpeg"}
                              {...(cr?.image && {
                                defaultFileList: [
                                  {
                                    uid: 1,
                                    name: cr.image,
                                    status: "done",
                                    url: cr.image,
                                  },
                                ],
                              })}
                            >
                              <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload> */}
                          </Col>
                          <Col
                            sm={2}
                            xs={24}
                            style={{
                              borderLeft: "1px solid #dfdfdf",
                              padding: "50px 0px 0px 30px",
                            }}
                          >
                            <Button
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => deleteTestimonial(cr)}
                            >
                              Delete
                            </Button>
                          </Col>
                        </Row>
                        {testimonialsData.length > index + 1 ? (
                          <hr style={{ border: "1px solid #dfdfdf" }} />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Offers' key='4'>
                <Offers/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='App Version' key='5'>
                  <AppVersion/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Course Promo' key='6'>
                  <CoursePromo/>
              </Tabs.TabPane>
              <Tabs.TabPane tab='Test Promo' key='7'>
                  <TestPromo/>
              </Tabs.TabPane>
            </Tabs>
            <br />
            {currentTab == 4 || currentTab == 5 || currentTab == 6 || currentTab == 7 ? null :
              <Button
                type="primary" block size='large'
                loading={addWebsiteDataStatus === STATUS.FETCHING}
                onClick={() => saveWebsiteData()}
              >
                Save
              </Button>
            }
          </div>
        ) : null}
      </Card>
      {orderCarousel ? (
        <OrderCarouselData
          visible={orderCarousel}
          submit={saveWebsiteData}
          closeModal={_changeCarouselOrder}
        />
      ) : null}
      {thumbnail ? (
        <ImagePreview
          visible={thumbnail}
          imageUrl={thumbnail}
          closeModal={_previewThumbNail}
        />
      ) : null}
      {tagsModal ? (
        <SelectTagsModal
          selectedData={selectedTags}
          submitTags={submitTags}
          visible={tagsModal}
          closeModal={_tagsModal}
        />
      ) : null}
    </div>
  );
};
