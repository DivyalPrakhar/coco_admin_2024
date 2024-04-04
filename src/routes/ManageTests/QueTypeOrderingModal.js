import { Modal, Table } from 'antd'
import update from 'immutability-helper';
import React, { useCallback, useState } from 'react'
import { useRef } from 'react';
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash'

export const QueTypeOrderingModal = ({visible, closeModal, questionTypes, submit}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)

    let [queTypes, setQueTypes] = useState(questionTypes)

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
          const dragRow = queTypes[dragIndex];
          setQueTypes(
            update(queTypes, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [queTypes],
    );

    const _submit = () => {
        submit(queTypes.map((d, i) => ({...d, order:++i})))
    }
    
    return(
        <Modal title='Question Type Ordering' width={1100} visible={visible} onOk={_submit} onCancel={closeModal}>
            <DndProvider manager={manager.current.dragDropManager}>
                <Table bordered size='small' components={components} bordered pagination={false} dataSource={_.filter(queTypes, d => d.type)}
                    onRow={(record, index) => ({
                        index,
                        moveRow,
                    })}
                >
                    <Table.Column title={<b>Type</b>} dataIndex="type" key="type" />
                    <Table.Column title={<b>No. of Questions</b>} dataIndex="noOfQuestions" key="noOfQuestions" />
                    <Table.Column title={<b>Marks (per question)</b>} dataIndex="markingScheme" key="markingScheme" 
                        render={(marking, group, typeIndx) => marking.correct}
                    />
                    <Table.Column title={<b>Negative Marks (per question)</b>} dataIndex="markingScheme" key="negative" 
                        render={(marking, group, typeIndx) =>  marking.incorrect}
                    />
                    <Table.Column title={<b>Partial Marking</b>} dataIndex="partialMarking" key="partialMarking" 
                        render={(partialMarking, group, typeIndx) => partialMarking}
                    />
                </Table>
            </DndProvider>
        </Modal>
    )
}