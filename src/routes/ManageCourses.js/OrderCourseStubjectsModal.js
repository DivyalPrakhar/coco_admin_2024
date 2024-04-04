import { Image, Modal, Table } from 'antd'
import update from 'immutability-helper';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createDndContext, DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubjectsOrderAction } from '../../redux/reducers/courses';
import _ from 'lodash'
import { STATUS } from '../../Constants';

export const OrderModal = ({visible, closeModal, defaultData, course}) => {
    const RNDContext = createDndContext(HTML5Backend);
    const type = 'DragableBodyRow';
    const manager = useRef(RNDContext)
    const dispatch = useDispatch()

    const {subjectOrderStatus} = useSelector(state => ({
      subjectOrderStatus:state.course.subjectOrderStatus
    }))
    
    const [allSubjects, setSubjects] = useState(_.orderBy(defaultData.map(d => ({...d, order:parseInt(d.order)})), ['order'], ['asc']))

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
        body: {row: DragableBodyRow,},
    };
  
    const moveRow = useCallback((dragIndex, hoverIndex) => {
        const dragRow = allSubjects[dragIndex];
        setSubjects(
            update(allSubjects, {
            $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, dragRow],
            ],
            }),
        );}
    ,[allSubjects]);

    const handleSubmit = () => {
      let data = allSubjects.map((s, i) => ({id:s._id, order:++i}))
      data = {courseId:course._id, subjects:data}
      console.log('data', data, allSubjects)
      dispatch(updateSubjectsOrderAction(data))
    }

    return(
        <Modal title='Change Subjects Order' width={1000} visible={visible} confirmLoading={subjectOrderStatus === STATUS.FETCHING} 
          onOk={handleSubmit} onCancel={closeModal}
        >
            <DndProvider manager={manager.current.dragDropManager}>
                <Table bordered size='small' pagination={false} dataSource={allSubjects} components={components} 
                    onRow={(record, index) => ({index, moveRow})}
                >
                    <Table.Column width={60} title='Order' render={(d, obj, indx) => ++indx} />
                    <Table.Column title='Cover' 
                        render= {(d) => (
                            <div style={{ cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                {d.image && <Image src={d.image} style={{objectFit:'cover', width:'60pt', height:'60pt', border:'1px solid #D6DBDF'}} />}
                            </div>
                        )}
                    ></Table.Column>
                    <Table.Column title='name' dataIndex='displayName'></Table.Column>
                    <Table.Column title='Syllabus Template'
                        render={ (d) => (<div>{d?.template?.name ? d.template.name.en : ""}</div>)}
                    ></Table.Column>
                    <Table.Column title='Subject' render={(d) => (d?.subject?.name ? d.subject.name.en : "")}></Table.Column>
                </Table>
            </DndProvider>
        </Modal>
    )
}