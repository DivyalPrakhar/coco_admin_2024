import { Button, Modal, Table, Tag } from 'antd'
import React from 'react'
import { useHistory } from 'react-router'
import { bilingualText } from '../../utils/FileHelper'

export const QuestionUsageModal = ({visible, closeModal, question}) => {
    const history = useHistory()

    const handleVisit = (id) => {
        history.push(`/update-test/${id}/4`)
    }

    return(
        <Modal title='Question Usage' footer={false} width={1000} visible={visible} onCancel={closeModal}  >
            <Table dataSource={question.tests} pagination={false}>
                <Table.Column title='Test Name' render={d => bilingualText(d.testId.name)}></Table.Column>
                <Table.Column title='Ready' render={d => d.testId.testReady ? <Tag color='green'>Ready</Tag> : <Tag color='red'>Not Ready</Tag>}></Table.Column>
                <Table.Column title='Started' render={d => d.testId.testStared ? <Tag color='green'>Started</Tag> : <Tag color='red'>Not Started</Tag>}></Table.Column>
                <Table.Column title='Result Published' render={d => d.testId.resultPublished ? <Tag color='green'>Published</Tag> : <Tag color='red'>Not Published</Tag>}></Table.Column>
                <Table.Column title='Action' render={d => <Button size='small' onClick={() => handleVisit(d.testId._id)}>Visit</Button>}></Table.Column>
            </Table>
        </Modal>
    )
}