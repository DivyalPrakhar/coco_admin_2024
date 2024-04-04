import { Image, Modal, Table } from 'antd'
import update from 'immutability-helper';
import React, { useCallback, useState } from 'react'
import { useRef } from 'react';
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash'
import { useSelector } from 'react-redux';
import { STATUS } from '../../Constants';
import Text from 'antd/lib/typography/Text';

export const OrderCarouselData = ({visible, closeModal, submit}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)

    const {websiteData, addWebsiteDataStatus} = useSelector(state => ({
      websiteData: state.website.websiteData,
      addWebsiteDataStatus:state.website.addWebsiteDataStatus
    }))

    let [carousel, setQueTypes] = useState(websiteData.carousel)
  
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
          const dragRow = carousel[dragIndex];
          setQueTypes(
            update(carousel, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [carousel],
    );

    const _submit = () => {
      let data = carousel.map(d => _.omit(d,'_id'))
      submit(data.map((d, i) => ({...d, order:++i})))
    }
    
    return(
        <Modal title='Carousel Ordering' width={800}confirmLoading={addWebsiteDataStatus === STATUS.FETCHING} visible={visible} onOk={_submit} onCancel={closeModal}>
          <div style={{fontWeight:'bold', marginBottom:'10px'}}>
            <Text> *Drag and drop to change order</Text>
          </div>
          <DndProvider manager={manager.current.dragDropManager}>
              <Table bordered size='small' components={components} bordered pagination={false} dataSource={carousel}
                  onRow={(record, index) => ({
                      index,
                      moveRow,
                  })}
              >
                  <Table.Column title={<b>Image</b>} dataIndex="imageUrl" key="imageUrl" 
                    render={e => <Image src={e} width='200px'/>}
                  />
                  <Table.Column title={<b>URL</b>} dataIndex="link" key="link" />
                  {/* <Table.Column title={<b>No. of Questions</b>} dataIndex="noOfQuestions" key="noOfQuestions" />
                  <Table.Column title={<b>Marks (per question)</b>} dataIndex="markingScheme" key="markingScheme" 
                      render={(marking, group, typeIndx) => marking.correct}
                  />
                  <Table.Column title={<b>Negative Marks (per question)</b>} dataIndex="markingScheme" key="negative" 
                      render={(marking, group, typeIndx) =>  marking.incorrect}
                  />
                  <Table.Column title={<b>Partial Marking</b>} dataIndex="partialMarking" key="partialMarking" 
                      render={(partialMarking, group, typeIndx) => partialMarking}
                  /> */}
              </Table>
          </DndProvider>
        </Modal>
    )
}