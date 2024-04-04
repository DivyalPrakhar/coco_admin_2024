import { Modal, Table } from 'antd'
import Text from 'antd/lib/typography/Text';
import update from 'immutability-helper';
import React, { useCallback, useState } from 'react'
import { useRef } from 'react';
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash'

export const SubjectOrderingModal = ({visible, closeModal, allSubjects, selectedSubjects, submit}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)

    let [subjects, setSubjects] = useState(selectedSubjects)

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
          const dragRow = subjects[dragIndex];
          setSubjects(
            update(subjects, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [subjects],
    );

    const _submit = () => {
        submit(subjects.map((sub, i) => ({...sub, order:++i})))
    }
    
    return(
        <Modal title='Subjects Ordering' width={1100} visible={visible} onOk={_submit} onCancel={closeModal}>
            <div>* drag and drop subject </div><br/>
            <DndProvider manager={manager.current.dragDropManager}>
              <Table bordered size='small' components={components} pagination={false} dataSource={_.filter(subjects,s => s.subjectRefId)}
                  onRow={(record, index) => ({
                      index,
                      moveRow,
                  })}
              >
                  <Table.Column title={<b>Subject</b>} dataIndex="subjectRefId" key="subjectRefId" 
                    render={id => 
                      <Text>{_.findIndex(allSubjects, d => d._id == id) != -1 ? _.find(allSubjects, d => d._id == id).name?.en : null}</Text>
                    }
                  />
                  <Table.Column title={<b>Types</b>} dataIndex="questionTypeGroup" key="questionTypeGroup" 
                    render={types => 
                      <div>{_.join(_.compact(types.map(d => d.type)), ', ')}</div>
                    }
                  />
              </Table>
            </DndProvider>
        </Modal>
    )
}