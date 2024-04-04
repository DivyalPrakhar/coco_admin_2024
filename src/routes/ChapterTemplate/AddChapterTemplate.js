import { Button, Card, Input, Row, Col, Tag, Form, Table, Divider, Space, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import _ from "lodash";
import { CommonPageHeader } from "../../components/CommonPageHeader";
import { useHistory } from "react-router-dom";
import { ExamCompetitionSelector } from "../../components/ExamCompetitionSelector";
import {
  addChapterTemplateAction,
  getSyllabusChaptersDataAction,
  getOldChapterTemplateExcelAction,
  resetAddChapterStatus,
} from "../../redux/reducers/Syllabus";

//import { getDefaultDataAction } from "../../redux/reducers/LmsConfig";
import { STATUS } from "../../Constants";

import { sheetToJSON } from "../../utils/FileHelper";
import { ExportExcel } from "../../components/ExportExcel";
import { ListBasechaptersModal } from "../Basechapters/ListBasechapters";
import { useAuthUser } from "../../App/Context";
import { CaretRightOutlined, SelectOutlined } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";

export const AddChapterTemplate = (props) => {
  let history = useHistory();
  const auth = useAuthUser();
  const dispatch = useDispatch();
  const [baseChptersList, changeBaseChapter] = useState(false);

  const { configData, syllabus } = useSelector((s) => ({
    user: s.user,
    configData: s.lmsConfig,
    syllabus: s.syllabus,
  }));

  useEffect(() => {
    if (
      props.match.params.id &&
      syllabus.addChapterTemplateStatus === STATUS.SUCCESS
    ) {
      dispatch(resetAddChapterStatus());
      history.goBack()
    }
  }, [
    dispatch,
    history,
    props.match.params.id,
    syllabus.addChapterTemplateStatus,
  ]);

  useEffect(() => {
    if (props.match.params.id) {
      dispatch(getSyllabusChaptersDataAction({ id: props.match.params.id }));
      dispatch(getOldChapterTemplateExcelAction({ id: props.match.params.id }));
    }

    //dispatch(getDefaultDataAction({ instituteId: auth.staff.institute._id }));
  }, [auth.staff.institute._id, dispatch, props.match.params.id]);

  return (
    <div>
      <CommonPageHeader
        title={
          props.match.params.id
            ? "Edit Chapter Template"
            : "Add Chapter Template"
        }
        extra={
          <Button shape='round' onClick={() => changeBaseChapter(true)} size="large">
            Base Chapters
          </Button>
        }
      />
      <br />
      <Card loading={configData.defaultDataStatus === STATUS.FETCHING}>
        <Row>
          {configData.defaultDataStatus === STATUS.SUCCESS ? (
            <div style={{ width: "100%" }}>
              <Col sm={24}>
                <SelectSyllabusData
                  syllabus={configData.defaultData}
                  addChapterTemplateStatus={syllabus.addChapterTemplateStatus}
                  templateData={syllabus.syllabusChapterData}
                  oldChapterTemplateExcel={syllabus.oldChapterTemplateExcel}
                  getOldChapterTemplateExcelStatus={syllabus.getOldChapterTemplateExcelStatus}
                  params={props.match.params}
                />
              </Col>
            </div>
          ) : null}
        </Row>
        {baseChptersList ? (
          <ListBasechaptersModal
            baseChptersList={baseChptersList}
            closeModal={() => changeBaseChapter(false)}
          />
        ) : null}
      </Card>
    </div>
  );
};

export const SelectSyllabusData = (props) => {
  const auth = useAuthUser();
  const dispatch = useDispatch();
  const [excelData, onSave] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataColumns, setDataColumns] = useState([]);

  // eslint-disable-next-line no-unused-vars
  let [required, setRequired] = useState(0);

  const [stateData, stateDataChange] = useState({});
  const [compExamModal, compExamChange] = useState(false);
  const [requiredColumns, setRequiredColumns] = useState([]);
  const [excelDemoData, changeExcelData] = useState([
    { Name: "", Order: "", Mainbasechapter: "", Basechapters: "" },
  ]);

  const selectItem = (name, newItem) => {
    if (newItem._id === stateData[name]) {
      stateDataChange({ ...stateData, [name]: null });
    } else {
      stateDataChange({ ...stateData, [name]: newItem._id });
    }
  };

  const convertFile = (e) => {
    sheetToJSON(e.target.files, onSave);
  };

  useEffect(() => {
    if (props.addChapterTemplateStatus === STATUS.SUCCESS || !props.params.id) {
      stateDataChange({});
      onSave([])
      setDataSource([])
      setDataColumns([])
      setRequired(0)
      changeExcelData([
        { Name: "", Order: "", Mainbasechapter: "", Basechapters: "" },
      ]);
    }
  }, [props.addChapterTemplateStatus, props.params.id]);

  useEffect(() => {
    if (props.params.id && props.templateData) {
      let templateData = props.templateData;
      stateDataChange({
        ...stateData,
        name: templateData.name ? templateData.name.en : "",
        standardId: templateData.standardId,
        subjectId: templateData.subjectId,
        competitionId: templateData.competitionId,
        examId: templateData.examId,
        id: templateData._id,
      });
    }
  }, [props.params.id, props.templateData]);

  useEffect(() => {
    if (props.params.id && props.getOldChapterTemplateExcelStatus === STATUS.SUCCESS) {
      changeExcelData(props.oldChapterTemplateExcel);
    }
  }, [props.getOldChapterTemplateExcelStatus, props.oldChapterTemplateExcel, props.params.id]);

  useEffect(() => {
    let data = [...excelData]
    let defaultColumns = ['ChapterId', 'Name', 'Order', 'Mainbasechapter', 'Basechapters']
    data = data.map(d => ({ChapterId:d.ChapterId, Name:d.Name, Order:d.Order, Mainbasechapter:d.Mainbasechapter, Basechapters:d.Basechapters}))
    let reqColumns = []

    if (data.length) {
      let columns = _.keys(data[0]).filter(d => _.findIndex(defaultColumns,c => c == d) != -1).map((d) => ({
        title: d,
        dataIndex: d,
        key: d,
      }));

      data.map((d) => _.map(d, (value, key) => (key === 'Name' || key === 'Order' || key === 'Mainbasechapter') && !value ? reqColumns.push(key) : null))
      
      columns = _.chain(columns).map((d, i) =>
        d.title === "Name" || d.title === "Order" || d.title === "Mainbasechapter"
          ? Object.assign(d, {
              render: (tags) => {
                return tags || (
                  <Tag color="red" key={i}>
                    Required
                  </Tag>
                )
              }
            })
          : d
      ).value();

      setDataColumns(columns);
      setRequiredColumns(_.uniq(reqColumns));
      _.forEach(columns, (d) => (d.render ? setRequired(required => required + 1) : null));
      setDataSource(data.map((d, i) => ({ ...d, key: ++i })));
    }
  }, [excelData]);

  const addChapterTemplate = () => {
    let data = {
        ...stateData,
        chapters: excelData?.length ? excelData : null,
        name: { en: stateData.name },
        instituteId: auth.staff.institute._id,
      }
    
      data = _.omitBy(data,d => !d)
    console.log('data', data)
    dispatch(addChapterTemplateAction(data))
  }
  const { CheckableTag } = Tag;
  return (
    <div>
      {/*<div>
        <h3><b>Standard:</b></h3>
        {props.syllabus.standards.map((s, i) => (
          <CheckableTag style={{ border: ".1px solid black" }} key={i} checked={stateData.standardId === s._id} onChange={() => selectItem("standardId", s)}>
            {s.name.en}
          </CheckableTag>
        ))}
      </div>
      <Divider/>*/}
      <div>
        <Form.Item required label={<b>Subject</b>}>
          {props.syllabus.subjects.map((s, i) => (
            <CheckableTag style={{ border: ".1px solid black", margin: '4px'}} key={i} checked={stateData.subjectId === s._id} onChange={() => selectItem("subjectId", s)}>
              {s.name.en}
            </CheckableTag>
          ))}
        </Form.Item>
        <Form.Item label={<b>Competition and Exam</b>}>
          <Space>
            {stateData.competitionId ? 
              <CheckableTag checked={true}>
                {(stateData.competitionId
                  ? _.get(
                      _.find(
                        props.syllabus.competitions,
                        (s) => s._id === stateData.competitionId
                      ),
                      "name.en",
                      ""
                    ) + " | "
                  : "") +
                  _.get(
                    _.find(
                      props.syllabus.exams,
                      (s) => s._id === stateData.examId
                    ),
                    "name.en",
                    ""
                  )}
              </CheckableTag>
              : null
            }
            <Button shape='round' icon={<SelectOutlined />} onClick={() => compExamChange(true)}>Select</Button>
          </Space>
        </Form.Item>
      </div>
      <Divider/>
      <Row style={{ paddingTop: "15px" }}>
        <Col sm={12} style={{ padding: "0px 10px 0px 0px" }}>
          <div style={{ marginBottom: 16 }}>
            
          </div>
        </Col>
      </Row>
      {compExamModal ? (
        <ExamCompetitionSelector
          modalStatus={compExamModal}
          closeModal={() => compExamChange(false)}
          competitionsData={props.syllabus.competitions}
          examsData={props.syllabus.exams}
          multipleSelect={false}
          singleCompetitions={true}
          defaultExams={stateData.examId}
          defaultCompetitions={stateData.competitionId}
          selectedExamsData={(examId, competitionId) => (
            stateDataChange({
              ...stateData,
              examId: examId[0],
              competitionId: competitionId,
            }),
            compExamChange(false)
          )}
        />
      ) : null}
      <Row>
        <Col sm={16}>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
          >
            <Form.Item label='Template Name'>
              <Input
                // addonBefore="Name"
                type="text"
                placeholder="Name"
                defaultValue={stateData.name ? stateData.name : ""}
                value={stateData.name}
                onChange={(e) =>
                  stateDataChange({ ...stateData, name: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label='Download Template'>
              <ExportExcel data={excelDemoData} title='Download' filename="ChapterTemplate" />
            </Form.Item>
            <Form.Item label="Upload Basechapter Excel">
              <Input
                type="file"
                onChange={convertFile}
                accept=".xlsx, .xls, .c.target.filessc.target.files"
              /><br/>
              <Alert style={{fontSize:'12px'}} message={`ADD BASECHAPTER'S UNIQUE CODE IN MAIN-BASECHAPTER AND BASECHAPTER.`} type="warning" showIcon />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col sm={24}>
          {dataSource.length ? (
            <Table
              bordered
              dataSource={dataSource}
              columns={dataColumns}
              pagination={{ position: ["bottomCenter"], hideOnSinglePage:true }}
            />
          ) : null}
        </Col>
      </Row>
      <br/>
      {requiredColumns?.length ? 
        <Alert type='error' showIcon message={'required columns ' + _.join(requiredColumns, ', ')}/>
        :
        null
      }
      <br />
      <div style={{textAlign: 'center'}}>
      {props.params.id || dataSource.length ? 
        <Button type="primary" disabled={!stateData.subjectId || !stateData.name || requiredColumns.length} size='large' shape='round' 
          loading={props.addChapterTemplateStatus === STATUS.FETCHING} onClick={addChapterTemplate}
        >
          {props.params.id ? "Update Template" : "Add Template"}
        </Button>
      : null}
      </div>
      <br />
    </div>
  );
};
