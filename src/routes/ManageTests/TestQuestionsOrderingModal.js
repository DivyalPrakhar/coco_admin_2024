import { Modal, Table } from 'antd'
import update from 'immutability-helper';
import React, { useCallback, useEffect, useState } from 'react'
import { useRef } from 'react';
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash'
import { useDispatch, useSelector } from 'react-redux';
import { changeTestQuesOrderAction, resetChangeTestQuestionsOrder } from '../../redux/reducers/test';
import { STATUS } from '../../Constants';

export const TestQuestionsOrdering = ({visible, closeModal, questionsList, testData, submit}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)
    const dispatch = useDispatch()

    let [questions, setQuestions] = useState(_.orderBy(questionsList, ['order'], ['asc']))

    let {changeOrderStatus} = useSelector((state) => ({
        changeOrderStatus:state.test.questionsOrderStatus
    }))

    useEffect(() => {
        if(changeOrderStatus == STATUS.SUCCESS)
            closeModal()

        return () => {
            dispatch(resetChangeTestQuestionsOrder())
        }

    }, [changeOrderStatus])

    const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
      const ref = useRef();
      const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: monitor => {
          const { index: dragIndex } = monitor.getItem() || {};
          if (dragIndex === index) {
            return {};
          }
          return {
            isOver: monitor.isOver(),
            dropClassName: dragIndex < index ? 'drop-over-downward' : 'drop-over-upward',
          };
        },
        drop: item => {
          moveRow(item.index, index);
        },
      });
      const [, drag] = useDrag({
        item: { type, index },
        collect: monitor => ({
          isDragging: monitor.isDragging(),
        }),
      });
      drop(drag(ref));
      return (
        <tr
          ref={ref}
          className={`${className}${isOver ? dropClassName : ''}`}
          style={{ cursor: 'move', ...style }}
          {...restProps}
        />
      );
    };

    const components = {
        body: {
          row: DragableBodyRow,
        },
    };

    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
          const dragRow = questions[dragIndex];
          setQuestions(
            update(questions, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [questions],
    );

    const _submit = () => {
        let data = {...testData, editedQuestions:questions.map((que, i) => ({questionRefId:que.questionRefId._id, type:que.type.questionGroupId, order:++i}))}
        dispatch(changeTestQuesOrderAction(data))
    }
    
    return(
        <Modal title='Questions Ordering' width={1100} visible={visible} onOk={_submit} confirmLoading={changeOrderStatus == STATUS.FETCHING} onCancel={closeModal}>
            <DndProvider manager={manager.current.dragDropManager}>
                <Table bordered bordered size='small' components={components} bordered pagination={false} dataSource={questions}
                    onRow={(record, index) => ({
                        index,
                        moveRow,
                    })}
                >
                    <Table.Column title={<b>#</b>} dataIndex='index' key='index' render={(d, a, indx) => ++indx}/>
                    <Table.Column title={<b>Question</b>} dataIndex="questionRefId" key="questionRefId"
                        render={que => <div dangerouslySetInnerHTML={{__html:que.question.en}}/>}
                    />
                </Table>
            </DndProvider>
        </Modal>
    )
}