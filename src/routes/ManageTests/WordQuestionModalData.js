import { Modal, Input, Row, Col, Button, Alert, Divider } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { STATUS } from "../../Constants";
import {
  resetAddNewTestQuestion,
  wordQuestionUploadAction,
} from "../../redux/reducers/test";
import { AddQuestions } from "../ManageQuestions/AddQuestion";
import { QuestionTypeNames } from "../../utils/QuestionTypeHelper";
import _ from "lodash";

export const WordQuestionModalData = ({
  visible,
  closeModal,
  subject,
  currentTest,
}) => {
  const dispatch = useDispatch();
  const [enState, setEnState] = useState();
  const [hnState, setHnState] = useState();

  const { defaultSyllabus, wordQuestionUploadStatus } = useSelector(
    (state) => ({
      defaultSyllabus: state.lmsConfig.defaultData,
      wordQuestionUploadStatus: state.test?.wordQuestionUploadStatus,
    })
  );

  useEffect(() => {
    dispatch(resetAddNewTestQuestion());
    return () => {
      dispatch(resetAddNewTestQuestion());
    };
  }, [dispatch]);

  const uploadWordQuestion = () => {
    // console.log('enState')
    let formData = new FormData();
    formData.append("testId", currentTest._id);
    formData.append("subjectId", subject.subjectRefId._id);
    if (enState) {
      formData.append("upload", enState);
    }
    dispatch(wordQuestionUploadAction(formData));
  };

  useEffect(() => {
    if (wordQuestionUploadStatus === STATUS.SUCCESS) {
      closeModal();
    }
  }, [closeModal, wordQuestionUploadStatus]);

  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={1400}
      onCancel={closeModal}
      title={<b>Upload Question</b>}
      footer={null}
    >
      <div>
        <Alert
          message={
            <div>
              <b>Question Document Upload Instructions</b>
              <br />
              <ul>
                <li>
                  Use the exact format given in <i>Sample Document</i>
                </li>
                <li>
                  {"Use Question Type from below " +
                    _.filter(
                      QuestionTypeNames,
                      (d) =>
                        d.type != "paragraph_scq" && d.type != "paragraph_mcq"
                    ).length +
                    " types only:"}
                  <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {_.chain(QuestionTypeNames)
                      .filter(
                        (d) =>
                          d.type != "paragraph_scq" && d.type != "paragraph_mcq"
                      )
                      .map((s, i) => (
                        <div style={{ flex: "1 1 200px" }}>
                          <span style={{ margin: "5px" }}>{i + 1}.</span>
                          <span>
                            {s.type == "Integer"
                              ? "Integer (Numerical)"
                              : s.type}
                          </span>
                        </div>
                      ))
                      .value()}
                  </div>
                </li>
                <li>
                  Use "Integer" for range between two numbers. For example, if
                  answer is between 1 and 4, write 1,4 in answer section.
                </li>
              </ul>
            </div>
          }
          type="success"
        />
        <br />
        <Divider plain>UPLOAD WORD FILE</Divider>
        <Row>
          <Col span={24}>
            <div>
              <div>Select Questions Word File</div>
              <Input
                onChange={(e) => setEnState(e.target.files[0])}
                type="file"
                accept="application/msword, .doc, .docx, .odt"
              />
            </div>
            <b>Download Doc Sample: </b>
            <a
              href={currentTest.testOption?.bilingual ? "/sample_files/BilingualQueDoc.doc" : "/sample_files/EngQuestionsDoc.doc"}
              download={currentTest.testOption?.bilingual ? 'BilingualQueDoc.doc' :"QuestionsDocSample.doc"}
            >
              Download
            </a>
          </Col>
          {/*currentTest.testOption && currentTest.testOption.bilingual ?
                        <Col span={12}>
                            <div>
                                <div>Select Hindi Questions Word File</div>
                                <Input onChange={(e) => setHnState(e.target.files[0])} type='file' accept="application/msword, .doc, .docx, .odt" /> 
                            </div>
                            <b>Download Hindi Doc Sample: </b> <a href='/sample_files/hindiQuestionsDoc.doc' download='HindiQuestionsDocSample.doc'>Download</a>
                            <br/>*Hindi Kruti dev font preferred
                        </Col>
                    : null*/}
        </Row>
        <br />
        <br />
        <Row>
          <Col span={24}>
            <Button
              type="primary"
              loading={wordQuestionUploadStatus === STATUS.FETCHING}
              block
              onClick={() => uploadWordQuestion()}
            >
              Upload
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};
