import { Table, Tag } from 'antd'
import _ from 'lodash'

export const AnswerKeyTable = ({questions, subjects, language}) => {
    return(
        <Table id='math-tex-id' dataSource={questions} bordered pagination={false}>
            <Table.Column title='#'
                render={(a, b, indx) => ++indx}
            ></Table.Column>
            <Table.Column title='Id' dataIndex='questionRefId'
                render={d => d.display_id}
            ></Table.Column>
            <Table.Column title='Question' dataIndex='questionRefId'
                render={que => <div dangerouslySetInnerHTML={{__html:que.question[language]}}/>}
            ></Table.Column>
            <Table.Column title='Type' dataIndex='type'
                render={type => <Tag color='blue'>{type.questionType}</Tag>}
            ></Table.Column>
            <Table.Column title='Subject' dataIndex='questionRefId'
                render={que => _.intersectionBy(subjects, que.subjects.map(d => ({_id:d})), '_id').length ?
                    _.join(_.intersectionBy(subjects, que.subjects.map(d => ({_id:d})), '_id').map(d => d.name[language]), ', ')
                    : null
                }
            ></Table.Column>
            <Table.Column title='Answers' dataIndex='questionRefId'
                render={(d, que) => {
                    return que.bonus ? 'bonus' :
                        que.discarded ? 'discarded' :
                        que.questionRefId.options.length ? 
                            que.questionRefId.answer.length && _.intersectionBy(que.questionRefId.options, que.questionRefId.answer.map(a => ({_id:a})), '_id').length ? 
                                _.join(_.intersectionBy(que.questionRefId.options, que.questionRefId.answer.map(a => ({_id:a})), '_id').map(d => d.key? d.key[language] : null), ', ') 
                                : null
                            :
                            <div dangerouslySetInnerHTML={{__html:que.questionRefId.answer?.length ? _.join(que.questionRefId.answer, ', ') : ''}}/>

                }}
            ></Table.Column>
        </Table>
    )
}