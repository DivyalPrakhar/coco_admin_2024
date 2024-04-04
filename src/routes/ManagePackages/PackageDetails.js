import {
  EditOutlined,
  FontSizeOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SelectOutlined,
  CaretRightOutlined,
  CloseOutlined,
  TableOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Popover,
  Radio,
  Row,
  Select,
  Tag,
  Tooltip,
  Upload,
  Modal,
  Image,
  Alert,
  List,
  Space,
  Badge,
  Table,
  Switch,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { CkeditorModal } from "../../components/CkeditorModal";
import { STATUS } from "../../Constants";
import { FormReducer } from "../../utils/FormReducer";
import _, { map } from "lodash";
import {
  addPackageAction,
  updatePackageAction,
} from "../../redux/reducers/packages";
import { checkHtml } from "../../utils/FileHelper";
import { BaseURL } from "../../BaseUrl";
import moment from "moment";
import { SelectTagsModal } from "./SelectTagsModal";
import { AddTagModal } from "../ManageTags/AddTagModal";
import { ImagePreview } from "../../components/ImagePreview";
import { HindiInput } from "../../components/HindiInput";
import { UploadFilesModal } from "./UplodaFilesModal";
import { ExamCompetitionSelector } from "../../components/ExamCompetitionSelector";
import { UploadImageBox } from "../../components/UploadImageBox";
import TextArea from "rc-textarea";
import { EditorModal } from "../../components/EditorModal";
import { ExamCentersModal } from "./ExamCentersModal";
import { Box, RadioGroup } from "@chakra-ui/react";
import { LeadSettingModal } from "./LeadSettingModal";
import { getLiveBatchAction } from "../../redux/reducers/batches";

const PACKAGE_CONTENT_TYPES = [
  { title: "Content", key: "content" },
  { title: "Class", key: "class" },
];

export const PackageDetails = ({
  defaultSyllabus,
  auth,
  updateData,
  params,
  contentTypes,
  websiteContentTypes,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const defaultInput = { en: "", hn: "" };
  const targetYears = [...Array(6)].map((a, b) => new Date().getFullYear() + b);
  const defaultPkgData = {
    name: defaultInput,
    description: defaultInput,
    medium: "english",
    availabilityMode: "online+offline",
    published: 0,
    walletApplicable: false,
    tags: [],
    centers: [],
    terms: defaultInput,
    showAsRelevant: false,
    showOnHome: false,
  };
  const [packageData, dispatchPropertyChange] = useReducer(
    FormReducer,
    defaultPkgData
  );
  const [tagsModal, changeTagsModal] = useState(false);
  const [thumbnail, changeThumbnail] = useState();
  const [compExamModal, compExamChange] = useState(false);

  const {
    packages,
    addTagStatus,
    configData,
    addPackageStatus,
    currentPackage,
    batches,
  } = useSelector((state) => ({
    packages: state.packages,
    addTagStatus: state.packages.addTagStatus,
    configData: state.lmsConfig,
    addPackageStatus: state.packages.addPackageStatus,
    currentPackage: state.packages.currentPackage,
    batches: state.batches,
  }));

  const [showEditor, changeShowEditor] = useState();
  const [formKey, setFormKey] = useState(1);
  const [addTagModal, changeAddTagModal] = useState();
  const [language, changeLanguage] = useState({
    language: "pramukhime:english",
  });
  const [allCenters, setCenters] = useState([]);
  const [smsLinkDetails, setSmsLinkData] = useState({});
  const [leadSettings, openLeadSettings] = useState();

  // const finalSmsLink = useMemo(() => {
  //   if(packageData.smsLink){
  //     let url =  packageData.smsLink.replace("https://","").split(".s3.ap-south-1.amazonaws.com/")
  //     let bucket = url[0]
  //     let path = url[1]

  //     return `https://api.comcompetitioncommunity.com/app/s3?b=${bucket}&p=${path}`
  //   }
  // }, [packageData.smsLink])

  // const [files, changeFiles] = useState();

  useEffect(() => {
    if (packages.updatePackageStatus === STATUS.SUCCESS)
      openLeadSettings(false);
  }, [packages.updatePackageStatus]);

  useEffect(() => {
    let lang = language.language.split(":");
    window.pramukhIME.setLanguage(lang[1], lang[0]);
    window.pramukhIME.addKeyboard("PramukhIndic");
    window.pramukhIME.enable();

    return () => {
      window.pramukhIME.disable();
    };
  }, [language.language]);

  useEffect(() => {
    if (updateData) {
      setFormKey((formKey) => formKey + 1);
      dispatchPropertyChange({ type: "merge", value: updateData });
    } else {
      dispatchPropertyChange({ type: "reset", value: defaultPkgData });
      setFormKey((formKey) => formKey + 1);
    }
  }, [updateData]);

  console.log({ updateData, currentPackage });

  useEffect(() => {
    if (addPackageStatus === STATUS.SUCCESS && currentPackage._id) {
      history.push("/update-package/2/" + currentPackage._id);
    }
  }, [history, addPackageStatus, currentPackage]);

  useEffect(() => {
    setFormKey((f) => f + 1);
  }, [params.id]);

  useEffect(() => {
    if (addTagStatus === STATUS.SUCCESS) {
      let data = [...packageData.tags];
      data = [...data, packages.recentTag];
      dispatchPropertyChange({ type: "tags", value: _.compact(data) });
    }
  }, [addTagStatus, packageData.tags, packages.recentTag]);

  useEffect(() => {
    if (
      packageData.packageContentType === "class") {
      dispatch(getLiveBatchAction({}));
    }
  }, [packageData.packageContentType, dispatch]);

  const addPackage = () => {
    const {
      name,
      exams,
      targetYear,
      slug,
      description,
      files,
      medium,
      published,
      price,
      fakePrice,
      mode,
      priority,
      type,
      startDate,
      endDate,
      carousel,
      tags,
      gst,
      rating,
      thumbnail,
      terms,
      walletApplicable,
      centers,
      altName,
      timetable,
      leadCaptureEnabled,
      leadDisabledDays,
      smsLink,
      smsExamName,
      websiteContentType,
      showAsRelevant,
      showOnHome,
      packageContentType,
      batches,
      availabilityMode,
    } = packageData;
    const data = {
      name,
      thumbnail,
      walletApplicable,
      centers,
      altName,
      leadCaptureEnabled,
      leadDisabledDays,
      description: { en: description.en, hn: description.hn },
      medium,
      published,
      type,
      price: parseFloat(price),
      fakePrice: parseFloat(fakePrice),
      priority,
      mode,
      availabilityMode,
      targetYear,
      exams,
      instituteId: auth.staff.institute._id,
      startDate,
      slug,
      endDate,
      carousel,
      tags: _.compact(_.map(tags, (s) => s?._id)),
      gst,
      files,
      rating: rating,
      terms,
      timetable,
      smsLink,
      smsExamName,
      websiteContentType,
      showAsRelevant,
      showOnHome,
      packageContentType,
      batches: packageContentType === "class" ? batches : [],
      // finalSmsLink:smsLink ? finalSmsLink : ''
    };

    if (updateData)
      dispatch(
        updatePackageAction({ ...data, packageId: packages.currentPackage._id })
      );
    else dispatch(addPackageAction(data));
  };

  const openEditor = (lang) => {
    changeShowEditor(lang);
  };

  const closeModal = () => {
    changeShowEditor(false);
  };

  const openTextEditor = (lang) => {
    if (lang == "hindi")
      dispatchPropertyChange({
        type: "description",
        value: { ...packageData.description, html: false, hn: "" },
      });
    else if (lang == "english")
      dispatchPropertyChange({
        type: "description",
        value: { ...packageData.description, html: false, en: "" },
      });
    // form.setFieldsValue({'description':''})
  };

  const selectExams = (exams) => {
    dispatchPropertyChange({ type: "exams", value: exams });
  };

  const changeTargetYear = (value) => {
    dispatchPropertyChange({ type: "targetYear", value });
  };

  const changeMedium = (value) => {
    dispatchPropertyChange({ type: "medium", value });
  };

  const changeMode = (value) => {
    dispatchPropertyChange({ type: "mode", value });
  };

  const changeAvailabilityMode = (value) => {
    dispatchPropertyChange({ type: "availabilityMode", value });
  };

  const changePrice = (e) => {
    dispatchPropertyChange({ type: "price", value: e.target.value });
  };

  const changeFakePrice = (e) => {
    dispatchPropertyChange({ type: "fakePrice", value: e.target.value });
  };

  const changeGst = (e) => {
    dispatchPropertyChange({ type: "gst", value: e.target.value });
  };

  const changeRating = (e) => {
    dispatchPropertyChange({ type: "rating", value: e.target.value });
  };

  const changePublishStatus = (e) => {
    dispatchPropertyChange({ type: "published", value: e.target.value });
  };

  const handleWallerApplicable = (e) => {
    dispatchPropertyChange({ type: "walletApplicable", value: e.target.value });
  };

  const changePriority = (e) => {
    dispatchPropertyChange({ type: "priority", value: e.target.value });
  };

  const changeDateRange = (e) => {
    let startDate = e[0].format("YYYY-MM-DD");
    let endDate = e[1].format("YYYY-MM-DD");
    dispatchPropertyChange({ type: "startDate", value: startDate });
    dispatchPropertyChange({ type: "endDate", value: endDate });
  };

  // const changeMedia = e => {
  //     if(e.fileList.length > 0 && e.fileList[0].response){
  //         let carousel = e.fileList.map(f=> f.response.url)
  //         dispatchPropertyChange({type:'carousel', value:carousel})
  //     }else{
  //         dispatchPropertyChange({type:'carousel', value:''})
  //     }
  // }

  const changeMedia = (e) => {
    if (e.fileList.length > 0) {
      let carousel = _.map(e.fileList, (f) => {
        return f.url || f.response?.url;
      });
      // let carousel = e.fileList[0].response.url
      //let Data = _.concat(carousel, packageData.carousel)
      dispatchPropertyChange({ type: "carousel", value: carousel });
    } else {
      dispatchPropertyChange({ type: "carousel", value: "" });
    }
  };

  const selectContentType = (e) => {
    dispatchPropertyChange({ type: "type", value: e });
  };

  const selectPackageContentType = (e) => {
    dispatchPropertyChange({ type: "packageContentType", value: e });
  };

  const selectPackageBatch = (e) => {
    dispatchPropertyChange({ type: "batches", value: e });
  };

  const selectTags = (e) => {
    dispatchPropertyChange({ type: "tags", value: e });
  };
  const disabled =
    !_.toString(packageData.targetYear) ||
    !_.toString(packageData.type) ||
    !packageData.name ||
    !_.toString(packageData.price);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const showAddTagModal = () => {
    changeAddTagModal(!addTagModal);
  };

  const changeName = (e, type) => {
    let data = { ...packageData };
    if (type === "hindi")
      dispatchPropertyChange({
        type: "name",
        value: { ...data.name, hn: e.target.value },
      });
    else
      dispatchPropertyChange({
        type: "name",
        value: { ...data.name, en: e.target.value },
      });
  };

  const changeTerms = (e, type) => {
    let data = { ...packageData };
    if (type === "hindi")
      dispatchPropertyChange({
        type: "terms",
        value: { ...data.terms, hn: e.target.value },
      });
    else
      dispatchPropertyChange({
        type: "terms",
        value: { ...data.terms, en: e.target.value },
      });
  };

  const changeDescription = (e, type) => {
    let value = e?.target?.value || e;
    let data = { ...packageData };
    if (type === "hindi")
      dispatchPropertyChange({
        type: "description",
        value: { ...data.description, hn: value },
      });
    else
      dispatchPropertyChange({
        type: "description",
        value: { ...data.description, en: value },
      });
  };

  const handleLanguageChange = (value) => {
    let lang = value.split(":");
    window.pramukhIME.setLanguage(lang[1], lang[0]);
    changeLanguage({ language: value });
  };

  const changeSlug = (e) => {
    dispatchPropertyChange({ type: "slug", value: e.target.value });
  };

  const _previewThumbNail = (e) => {
    let value = e?.response?.url || e.url;
    changeThumbnail(value);
  };

  const _changeFiles = (files) => {
    dispatchPropertyChange({ type: "files", value: files });
  };

  const removeFile = (e) => {
    let data = [...packageData.files];
    _.remove(data, (f) => f.url == e.url || f.url == e.response?.url);
    dispatchPropertyChange({ type: "files", value: data });
  };

  const [filesModal, openFilesModal] = useState();

  const _openFilesModal = () => {
    openFilesModal(!filesModal);
  };

  const removeExam = (id) => {
    let exams = packageData?.exams;
    selectExams(_.filter(exams, (e) => e !== id));
  };

  const getThumbnail = (img) => {
    dispatchPropertyChange({
      type: "thumbnail",
      value: img?.file?.response?.url || "",
    });
  };

  const [centerModal, openCenterModal] = useState();

  const handleCenterModal = () => {
    openCenterModal(!centerModal);
  };

  const handleCenters = (d) => {
    dispatchPropertyChange({ type: "centers", value: d });
  };

  let [file, changeFile] = useState([]);
  let [loading, changeLoading] = useState();

  const _changeFile = (resp) => {
    changeLoading(resp.file.status);
    let data = {};

    if (resp.file.status === "done" && resp.file?.response) {
      data = {
        name: resp.file.name,
        url: resp.file.response?.url,
        type: resp.file.type,
      };
      dispatchPropertyChange({ type: "timetable", value: data });

      // changeFile(data)
    }
  };

  const _removeTimeTable = () => {
    dispatchPropertyChange({ type: "timetable", value: null });
  };

  const changeLeadDays = (e) => {
    dispatchPropertyChange({ type: "leadDisabledDays", value: e.target.value });
  };

  const changeExableLeads = (e) => {
    dispatchPropertyChange({ type: "leadCaptureEnabled", value: e });
  };

  const handleLink = (value, type) => {
    let url = value
      .replace("https://", "")
      .split(".s3.ap-south-1.amazonaws.com/");
    let bucket = url[0];
    let path = url[1];

    setSmsLinkData((d) => ({ ...d, path, bucket }));
  };

  const handleLeadSetting = () => {
    openLeadSettings((d) => !d);
  };

  const handleWebsiteContent = () => {
    dispatchPropertyChange({ type: "websiteContentType", value: "llll" });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", fontSize: "18px" }}>
          Package Details
        </Text>
        {currentPackage?._id ? (
          <Form.Item name="leadCaptureEnabled" label="Enable Lead Caputre">
            <Space>
              <Switch
                checkedChildren="Disable"
                onChange={changeExableLeads}
                unCheckedChildren="Enable"
                checked={packageData.leadCaptureEnabled}
              />
              <Button onClick={handleLeadSetting} type="link" size="small">
                Lead Settings
              </Button>

              {leadSettings ? (
                <LeadSettingModal
                  closeModal={handleLeadSetting}
                  currentPackage={currentPackage}
                  visible={leadSettings}
                />
              ) : null}
            </Space>
          </Form.Item>
        ) : null}
      </div>
      <br />
      <Form onFinish={addPackage} key={formKey} layout="vertical">
        <Text style={{ fontWeight: "semibold", fontSize: "18px" }}>
          Basic Details
        </Text>
        <Box style={{ padding: "10px 10px 0 10px" }}>
          <Row>
            <Col span={10}>
              <Form.Item
                name="termsnameEnglish"
                label="Package Name (English)"
                initialValue={packageData.name?.en}
                rules={[
                  { message: "Please fill in the field.", required: true },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Name"
                  onFocus={() => handleLanguageChange("pramukhime:english")}
                  onChange={(e) => changeName(e, "english")}
                />
                {/* <Input required autoFocus={true} placeholder='package name' onChange={changePkgName}/> */}
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="termsnameHindi"
                label="Package Name (Hindi)"
                initialValue={packageData.name?.hn}
              >
                {/* <Input required autoFocus={true} placeholder='package name' onChange={changePkgName}/> */}
                <Input
                  type="text"
                  placeholder="Name"
                  onFocus={() => handleLanguageChange("pramukhindic:hindi")}
                  onChange={(e) => changeName(e, "hindi")}
                  onBlur={(e) => (
                    changeName(e, "hindi"),
                    handleLanguageChange("pramukhime:english")
                  )}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                name="packageAltName"
                label="Package Name (used for messages and prints)"
                initialValue={packageData.altName}
                rules={[
                  { message: "Please fill in the field.", required: true },
                ]}
              >
                <Input
                  type="text"
                  placeholder="Name"
                  onChange={(e) =>
                    dispatchPropertyChange({
                      type: "altName",
                      value: e.target.value,
                    })
                  }
                />
                {/* <Input required autoFocus={true} placeholder='package name' onChange={changePkgName}/> */}
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="slug"
                label="Slug"
                initialValue={packageData.slug}
              >
                <Input placeholder="Slug" onChange={changeSlug} />
              </Form.Item>
            </Col>
            {/* <Col span={4} offset={2}>
              <Form.Item
                name="leadCaptureEnabled"
                label="Enable Lead Caputre"
              >
                <Switch checkedChildren="Disable" onChange={changeExableLeads} unCheckedChildren="Enable" checked={packageData.leadCaptureEnabled} />
              </Form.Item>
            </Col> */}
            <Col span={5} offset={1}>
              {/* <Form.Item
                name="leadDisabledDays"
                label="Lead Disabled Days"
                initialValue={packageData.leadDisabledDays}
              >
                <Input autoFocus={true} placeholder='Days' type={'number'} onChange={changeLeadDays}/>
              </Form.Item> */}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              {/* <Form.Item
                name="link"
                label="SMS Link"
                initialValue={packageData.smsLink}
              >
                <Input
                  // addonBefore="http://"
                  type="text"
                  placeholder="SMS Link"
                  onChange={e => dispatchPropertyChange({
                    type: "smsLink",
                    value: e.target.value ,
                  })}
                />
              </Form.Item> */}
            </Col>
            <Col span={10} offset={2}>
              {/* <Form.Item
                name="examName"
                label="SMS Exam Name"
                initialValue={packageData.smsExamName}
              >
                <Input
                  type="text"
                  placeholder="SMS Exam Name"
                  onChange={(e) => dispatchPropertyChange({
                    type: "smsExamName",
                    value: e.target.value ,
                  })}
                />
              </Form.Item> */}
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                name="descEnglish"
                label={
                  <div>
                    Description (Web) &nbsp;&nbsp;
                    <Button
                      size="small"
                      onClick={() => openEditor("english")}
                      icon={<FontSizeOutlined />}
                    >
                      Editor
                    </Button>
                    &nbsp;
                    {checkHtml(packageData.description.en) ? (
                      <Button
                        size="small"
                        onClick={() => openTextEditor("english")}
                        icon={<EditOutlined />}
                      >
                        Text
                      </Button>
                    ) : null}
                  </div>
                }
                initialValue={packageData.description.en}
              >
                {checkHtml(packageData.description.en) ? (
                  <Card
                    bodyStyle={{ padding: "10px", cursor: "pointer" }}
                    // onClick={() => openEditor("english")}
                  >
                    <div
                      style={{ overflow: "auto" }}
                      dangerouslySetInnerHTML={{
                        __html: packageData.description.en,
                      }}
                    />
                  </Card>
                ) : (
                  <Input.TextArea
                    placeholder="Description"
                    type="text"
                    onFocus={() => handleLanguageChange("pramukhime:english")}
                    onChange={(e) => changeDescription(e, "english")}
                  />
                )}
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="descHindi"
                label={<div>Description (app)&nbsp;&nbsp;</div>}
                initialValue={packageData.description.hn}
              >
                <Input.TextArea
                  placeholder="Description"
                  type="text"
                  onFocus={() => handleLanguageChange("pramukhime:english")}
                  onChange={(e) => changeDescription(e, "hindi")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Box>
        <Divider />
        <Text style={{ fontWeight: "semibold", fontSize: "18px" }}>
          Exam Configuration
        </Text>
        <Box style={{ padding: "10px 10px 0 10px" }}>
          <Row>
            <Col span={10}>
              <h3>
                <b>
                  Exams{" "}
                  <Button
                    shape="round"
                    type="link"
                    size="large"
                    onClick={() => compExamChange(true)}
                  >
                    Select
                    <CaretRightOutlined />
                  </Button>{" "}
                </b>
              </h3>
              <div style={{ marginTop: "10px" }}>
                <div>
                  {_.map(packageData.exams || [], (exm) => {
                    let currentExams = _.find(
                      configData.defaultData.exams,
                      (e) => e._id == exm
                    );
                    return (
                      <Tag
                        color="blue"
                        key={exm}
                        closable
                        onClose={() => removeExam(exm)}
                      >
                        {currentExams.name.en}
                        {currentExams.name.en && currentExams.name.hn && "/"}
                        {currentExams.name.hn}
                      </Tag>
                    );
                  })}
                </div>
              </div>
              {compExamModal ? (
                <ExamCompetitionSelector
                  modalStatus={compExamModal}
                  closeModal={() => compExamChange(false)}
                  competitionsData={configData.defaultData.competitions}
                  examsData={configData.defaultData.exams}
                  multipleSelect={true}
                  defaultExams={
                    packageData.exams ? _.map(packageData.exams, (s) => s) : []
                  }
                  selectedExamsData={(exams) => (
                    selectExams(exams), compExamChange(false)
                  )}
                />
              ) : null}
              {/*<Form.Item
                label="Exams"
                name="exams"
                initialValue={
                  packageData?.exams ? _.map(packageData?.exams, (s) => s) : []
                }
              >
                <Select
                  placeholder="select exam"
                  mode="multiple"
                  onChange={selectExams}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                  }
                >
                  {defaultSyllabus.exams.length
                    ? defaultSyllabus.exams.map((exam) => (
                        <Select.Option key={exam._id} value={exam._id}>
                          {exam.name.en}
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>*/}
            </Col>
            <Col span={10} offset={2}>
              <Form.Item name="selecttags" label="Select Tags">
                {_.map(packageData.tags, (s) => {
                  return (
                    s && (
                      <Tag
                        key={s._id}
                        style={{
                          fontSize: "14px",
                          padding: "5px 10px",
                          marginTop: "5px",
                        }}
                        color="blue"
                        closable
                        onClose={() =>
                          selectTags(
                            _.filter(
                              packageData.tags,
                              (pack) => pack._id !== s._id
                            )
                          )
                        }
                      >
                        {s.name}
                      </Tag>
                    )
                  );
                })}
                <Tag
                  style={{
                    fontSize: "14px",
                    cursor: "pointer",
                    padding: "5px 10px",
                    marginTop: "5px",
                  }}
                  onClick={() => changeTagsModal(true)}
                >
                  <SelectOutlined /> Select Tags
                </Tag>
                <Tooltip title="Add New Tag">
                  <Button
                    onClick={showAddTagModal}
                    style={{ marginTop: "5px" }}
                    icon={<PlusOutlined />}
                  ></Button>
                </Tooltip>
                {tagsModal ? (
                  <SelectTagsModal
                    selectedData={packageData.tags || []}
                    visible={tagsModal}
                    closeModal={() => changeTagsModal(false)}
                    submitTags={(data) => (
                      selectTags(data), changeTagsModal(false)
                    )}
                  />
                ) : null}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                label="Target Year"
                rules={[
                  { required: true, message: "Please select your country!" },
                ]}
                initialValue={packageData.targetYear}
                name="targetYear"
              >
                <Select
                  placeholder="Target Year"
                  required={true}
                  onChange={changeTargetYear}
                >
                  {targetYears.map((year, i) => (
                    <Select.Option value={year} key={i}>
                      {year}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5} offset={2}>
              <Form.Item
                label="Medium"
                name="medium"
                initialValue={packageData.medium}
              >
                <Select placeholder="Select Medium" onChange={changeMedium}>
                  <Select.Option value="english">English</Select.Option>
                  <Select.Option value="hindi">Hindi</Select.Option>
                  <Select.Option value="bilingual">Bilingual</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={5} style={{ paddingLeft: "4px" }}>
              <Form.Item
                label="Deliverable"
                name="mode"
                initialValue={packageData.mode}
              >
                <Select placeholder="Deliverable" onChange={changeMode}>
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="offline">Offline</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={5} style={{ paddingLeft: "4px" }}>
              <Form.Item
                label="Availability Mode"
                name="availabilityMode"
                initialValue={packageData.availabilityMode}
              >
                <Select
                  placeholder="availabilityMode"
                  onChange={changeAvailabilityMode}
                >
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="offline">Offline</Select.Option>
                  <Select.Option value="online+offline">
                    Online & Offline
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Box>
        <Divider />
        <Text style={{ fontWeight: "semibold", fontSize: "18px" }}>
          Content Configuration
        </Text>
        <Box style={{ padding: "10px 10px 0 10px" }}>
          <Row>
            <Col span={10}>
              <Form.Item
                label="Content Type"
                name="type"
                rules={[
                  { message: "Please fill in the field.", required: true },
                ]}
                initialValue={packageData.type}
              >
                <Select
                  placeholder="Select Content Type"
                  onChange={selectContentType}
                >
                  {contentTypes.map((d) => (
                    <Select.Option key={d.id} value={d.type}>
                      {_.capitalize(d.type)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                label="Website Content Type"
                initialValue={packageData.websiteContentType}
                name="websiteContentType"
              >
                <Select
                  placeholder="Select Website Content Type"
                  onChange={(value) =>
                    dispatchPropertyChange({
                      type: "websiteContentType",
                      value,
                    })
                  }
                >
                  <Select.Option value={undefined}>
                    Select Website Content Type
                  </Select.Option>
                  {websiteContentTypes.map((d) => (
                    <Select.Option key={d.id} value={d.type}>
                      {_.capitalize(d.type)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                label="Package Content Type"
                name="packageContentType"
                initialValue={packageData.packageContentType}
              >
                <Select
                  placeholder="Select Content Type"
                  onChange={selectPackageContentType}
                >
                  {PACKAGE_CONTENT_TYPES.map((d) => (
                    <Select.Option key={d.key} value={d.key}>
                      {_.capitalize(d.title)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {packageData.packageContentType === "class" && (
              <Col span={10} offset={2}>
                <Form.Item
                  label="Select Batch"
                  name="batches"
                  rules={[
                    { message: "Please fill in the field.", required: true },
                  ]}
                  initialValue={packageData.batches}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select batches"
                    onChange={selectPackageBatch}
                  >
                    {map(batches.liveBatches, (b) => (
                      <option key={b._id}>{b.name}</option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            )}
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                name="files"
                label="Files"
                initialValue={packageData.slug}
              >
                <Button onClick={_openFilesModal} icon={<SelectOutlined />}>
                  Select Files
                </Button>
              </Form.Item>
              {packageData.files?.length ? (
                <List
                  bordered
                  size="small"
                  dataSource={packageData.files}
                  renderItem={(file) => {
                    return (
                      <List.Item
                        style={{ cursor: "pointer" }}
                        onClick={() => window.open(file.url)}
                      >
                        <Space>
                          <Text>{file.name}</Text>
                        </Space>
                      </List.Item>
                    );
                  }}
                />
              ) : null}
            </Col>
          </Row>
        </Box>
        <Divider />
        <Text style={{ fontWeight: "semibold", fontSize: "18px" }}>
          Other Configuration
        </Text>
        <Box style={{ padding: "10px 10px 0 10px" }}>
          {/* <Row>
            <Col span={10}>
              <Form.Item
                label="Discounted Price (which user will pay)"
                initialValue={packageData.price}
                name="price"
                rules={[{ message: 'Please fill in the field.', required: true }]}
              >
                <Input
                  type="number"
                  onChange={changePrice}
                  placeholder="Discount Price"
                  //required
                  prefix="₹"
                />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                label="Original Price"
                name="fakePrice"
                initialValue={packageData.fakePrice}
              >
                <Input
                  type="number"
                  onChange={changeFakePrice}
                  placeholder="Original Price"
                  prefix="₹"
                />
              </Form.Item>
            </Col>
          </Row> */}
          <Row>
            <Col span={10}>
              <Form.Item label="Exam Centers">
                <Button onClick={handleCenterModal} icon={<SelectOutlined />}>
                  Select Centers
                </Button>
                <br />
                <br />
                {packageData.centers.length ? (
                  <AllExamCenters allCenters={[...packageData.centers]} />
                ) : null}
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label="Time Table">
                <Space>
                  <Upload
                    showUploadList={false}
                    onChange={_changeFile}
                    action={BaseURL + "app/file"}
                    accept={".pdf"}
                  >
                    <Button
                      loading={loading === "uploading"}
                      load
                      icon={<UploadOutlined />}
                    >
                      {loading === "uploading" ? "loading..." : "Select"}
                    </Button>
                  </Upload>
                  {packageData.timetable?.url ? (
                    <Card
                      bodyStyle={{ padding: 0 }}
                      style={{ border: 0 }}
                      loading={loading === "uploading"}
                    >
                      <Space>
                        <Button
                          icon={<TableOutlined />}
                          onClick={() =>
                            window.open(packageData.timetable?.url, "_blank")
                          }
                        >
                          Open Time Table
                        </Button>
                        <Tooltip title="Remove">
                          <Button
                            danger
                            onClick={() => _removeTimeTable()}
                            icon={<DeleteOutlined />}
                          ></Button>
                        </Tooltip>
                      </Space>
                    </Card>
                  ) : null}
                </Space>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <Form.Item
                label="GST %"
                name="gst"
                initialValue={packageData.gst}
              >
                <Input
                  type="text"
                  onChange={changeGst}
                  min={0}
                  placeholder="GST %"
                />
              </Form.Item>
            </Col>
            <Col span={5} style={{ paddingLeft: "4px" }}>
              <Form.Item
                label="Rating"
                name="rating"
                initialValue={packageData.rating}
              >
                <Input
                  type="decimal"
                  onChange={changeRating}
                  min={0}
                  placeholder="Rating"
                />
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="priority"
                initialValue={packageData.priority}
                label={
                  <div>
                    Priority &nbsp;
                    <Popover
                      content={
                        <p>
                          It decides the order in which students will see the
                          packages.
                          <br />
                          - Higher priority number means earlier in order.
                          <br />
                          - Enter a decimal number between 1 to 9999
                          <br />
                          <br />
                          Eg. <b>Priority 4</b> package will be{" "}
                          <b>shown before priority 5</b> package.
                        </p>
                      }
                    >
                      <a href="#API" style={{ fontSize: "16px" }}>
                        <QuestionCircleOutlined />
                      </a>
                    </Popover>
                  </div>
                }
              >
                <Input
                  type="number"
                  onChange={changePriority}
                  min={0}
                  placeholder="Enter decimal number between 1 to 9999 (eg. 10)"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Space size="large">
                <Form.Item
                  label="Publish"
                  initialValue={packageData.published}
                  name="published"
                >
                  <Radio.Group onChange={changePublishStatus}>
                    <Radio.Button value={1}>Yes</Radio.Button>
                    <Radio.Button value={0}>No</Radio.Button>
                    <Radio.Button value={2}>Coming Soon</Radio.Button>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="Wallet Applicable"
                  initialValue={packageData.walletApplicable}
                  name="walletApplicable"
                >
                  <Radio.Group onChange={handleWallerApplicable}>
                    <Radio.Button value={true}>Yes</Radio.Button>
                    <Radio.Button value={false}>No</Radio.Button>
                  </Radio.Group>
                </Form.Item>
              </Space>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="startAndEndDate"
                label="Sale Start Date & End Date"
                initialValue={[
                  packageData.startDate ? moment(packageData.startDate) : null,
                  packageData.endDate ? moment(packageData.endDate) : null,
                ]}
              >
                <DatePicker.RangePicker onChange={changeDateRange} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={5}>
              <Form.Item
                name="showAsRelevant"
                label="Show as Relevant"
                initialValue={packageData.showAsRelevant}
              >
                <Radio.Group
                  onChange={(e) =>
                    dispatchPropertyChange({
                      type: "showAsRelevant",
                      value: e.target.value,
                    })
                  }
                >
                  <Radio.Button value={true}>Yes</Radio.Button>
                  <Radio.Button value={false}>No</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name="showOnHome"
                label="Show on Home Page"
                initialValue={packageData.showOnHome || false}
              >
                <Radio.Group
                  onChange={(e) =>
                    dispatchPropertyChange({
                      type: "showOnHome",
                      value: e.target.value,
                    })
                  }
                >
                  <Radio.Button value={true}>Yes</Radio.Button>
                  <Radio.Button value={false}>No</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item
                name="termsEnglish"
                label="Terms and conditions (English)"
                initialValue={packageData.terms?.en}
              >
                <Input.TextArea
                  rows={4}
                  type="text"
                  placeholder="Terms and conditions (English)"
                  onFocus={() => handleLanguageChange("pramukhime:english")}
                  onChange={(e) => changeTerms(e, "english")}
                />
                {/* <Input required autoFocus={true} placeholder='package name' onChange={changePkgName}/> */}
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item
                name="termsHindi"
                label="Terms and conditions (Hindi)"
                initialValue={packageData.terms?.hn}
              >
                {/* <Input required autoFocus={true} placeholder='package name' onChange={changePkgName}/> */}
                <Input.TextArea
                  rows={4}
                  type="text"
                  placeholder="Terms and conditions (Hindi)"
                  onFocus={() => handleLanguageChange("pramukhindic:hindi")}
                  onChange={(e) => changeTerms(e, "hindi")}
                  onBlur={(e) => {
                    changeTerms(e, "hindi");
                    handleLanguageChange("pramukhime:english");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={10}>
              <Form.Item label="Carousel">
                <Alert
                  message="Recommended Image Ratio: 16:9"
                  showIcon
                  style={{
                    background: "#e6f7fe",
                    border: "1px solid #92d4fb",
                  }}
                />
                <br />
                <Upload
                  action={BaseURL + "app/image"}
                  onChange={changeMedia}
                  multiple={true}
                  listType="picture-card"
                  onPreview={_previewThumbNail}
                  accept={"image/png, image/jpeg, image/webp"}
                  {...(packageData.carousel?.length && {
                    defaultFileList: _.chain(packageData.carousel)
                      .map((c, i) => {
                        return c && { uid: i, name: c, status: "done", url: c };
                      })
                      .compact()
                      .value(),
                  })}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={10} offset={2}>
              <Form.Item label="Thumbnail">
                <UploadImageBox
                  size="small"
                  ratio="1:1"
                  defaultImg={packageData.thumbnail}
                  getImage={getThumbnail}
                  onRemove={getThumbnail}
                />
              </Form.Item>
            </Col>
          </Row>
        </Box>
        <div style={{ textAlign: "center" }}>
          <Button
            //disabled={disabled}
            size="large"
            htmlType="submit"
            type="primary"
            load
            loading={
              packages.updatePackageStatus === STATUS.FETCHING ||
              packages.addPackageStatus === STATUS.FETCHING
            }
            style={{ width: "100px" }}
          >
            {updateData ? "Update" : "Save"}
          </Button>
        </div>
      </Form>

      {centerModal ? (
        <ExamCentersModal
          visible={centerModal}
          defaultCenters={packageData.centers}
          closeModal={handleCenterModal}
          onSubmit={handleCenters}
        />
      ) : null}
      {addTagModal && (
        <AddTagModal visible={addTagModal} closeModal={showAddTagModal} />
      )}
      {/* {showEditor ? (
        <CkeditorModal
          currentLanguage={showEditor}
          defaultValue={
            showEditor == "english"
              ? packageData.description.en
              : packageData.description.hn
          }
          onSubmit={(e) => changeDescription(e, showEditor)}
          visible={showEditor}
          closeModal={closeModal}
        />
      ) : null} */}

      {showEditor ? (
        <EditorModal
          currentLanguage={showEditor}
          defaultValue={
            showEditor === "english"
              ? packageData.description.en
              : packageData.description.hn
          }
          onSubmit={(e) => changeDescription(e, showEditor)}
          visible={showEditor}
          closeModal={closeModal}
        />
      ) : null}
      {thumbnail ? (
        <ImagePreview
          visible={thumbnail}
          imageUrl={thumbnail}
          closeModal={_previewThumbNail}
        />
      ) : null}
      {filesModal ? (
        <UploadFilesModal
          closeModal={_openFilesModal}
          visible={filesModal}
          getFiles={_changeFiles}
          defaultFiles={packageData.files}
        />
      ) : null}
    </div>
  );
};

const AllExamCenters = ({ allCenters }) => {
  return (
    <Table size="small" pagination={false} dataSource={allCenters}>
      <Table.Column title="Name" dataIndex="name" />
      <Table.Column title="Address" dataIndex="address" />
      <Table.Column title="Code" dataIndex="code" />
    </Table>
  );
};
