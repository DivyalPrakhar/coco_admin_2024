import { Image, Modal, Table } from 'antd'
import update from 'immutability-helper';
import React, { useCallback, useState } from 'react'
import { useRef } from 'react';
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash'
import { STATUS } from '../../Constants';
import Text from 'antd/lib/typography/Text';
import { useSelector } from 'react-redux';

export const OrderTestPromoModal = ({visible, closeModal, submit}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)

    const {websiteData, addWebsiteDataStatus, allTestOffers} = useSelector(state => ({
      websiteData: state.website.websiteData,
      allTestOffers: state.website.websiteData?.testOffers,
      addWebsiteDataStatus:state.website.addWebsiteDataStatus
    }))

    let [testOffers, setTestOffers] = useState(allTestOffers?.length ? _.filter(allTestOffers,o => !o.html) : [])
  
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
          const dragRow = testOffers[dragIndex];
          setTestOffers(
            update(testOffers, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
              ],
            }),
          );
        },
        [testOffers],
    );

    const _submit = () => {
      let data = testOffers.map(d => _.omit(d,'_id'))
      let htmlData = allTestOffers?.length && _.findIndex(allTestOffers,o => o.html) !== -1 ? _.find(allTestOffers,o => o.html) : null
      data = htmlData ? [...data, htmlData] : data
      submit(data.map((d, i) => ({...d, order:++i})))
    }

    
    return(
        <Modal title='Test Promos Ordering' width={'80%'} confirmLoading={addWebsiteDataStatus === STATUS.FETCHING} visible={visible} onOk={_submit} onCancel={closeModal}
          okText='Save'
        >
          <div style={{fontWeight:'bold', marginBottom:'10px'}}>
            <Text> *Drag and drop rows to change order</Text>
          </div>
          <DndProvider manager={manager.current.dragDropManager}>
              <Table bordered size='small' components={components} pagination={false} dataSource={testOffers}
                  onRow={(record, index) => ({index, moveRow})}
              >
                <Table.Column title={<b>Order</b>} render={(d, obj, indx) => ++indx} />
                <Table.Column title={<b>Title</b>} dataIndex="title" />
                <Table.Column title={<b>Description</b>} dataIndex="description" render={d => d.length > 200 ? d.substring(1, 200)+'...' : d} />
                <Table.Column title={<b>Image</b>} dataIndex="imageUrl" render={e => <Image src={e} width='100px'/>}/>
                <Table.Column title={<b>URL</b>} dataIndex="link" key="link" />
              </Table>
          </DndProvider>
        </Modal>
    )
}