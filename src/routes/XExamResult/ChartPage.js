import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, Table, Button, Select, Spin } from 'antd';
import { Column, Bar } from '@ant-design/plots';
import { printHelper, PRINT_TYPE, STATUS } from '../../Constants';
import _ from 'lodash'
import { ROUTES } from '../../Constants/Routes';
import { BaseURL, BaseURL_WEB } from '../../BaseUrl';
const { Option } = Select;
const SUBJECTS = [ { title:'HINDI', key: 'HINDI'}, { title:'ENGLISH', key:'ENGLISH' }, { title:'SANSKRIT', key: 'SANSKRIT' }, { title: 'SCIENCE', key: 'SANSKRIT' }, { title: 'MATHEMATICS', key: 'MATHEMATICS' }, { title: 'SOCIAL SCIENCE', key: 'SOCSCIENCE' } ]

const getSchoolCode = (s) => {
    if(!s) return '';
    return s.split('(')[1].split(')')[0];
}

const getSchoolName = (s) => {
    if(!s) return '';
    return s.split('(')[1].split(')')[1].substring(1);
}

export function ChartPage(props) {
    const { getXExamResultStatus, allSchools, data, printSchoolName, printSchoolCode, allDistricts, printChoosenSchool, getAllDistrictStatus, getSchoolByDistrictStatus, isPrint } = props
    const [district, setDistrict] = useState({});
    const [choosenSchool, setChoosenSchool] = useState(printChoosenSchool);
    const schoolName = printSchoolName ? printSchoolName : choosenSchool ? getSchoolName(choosenSchool) : '';
    const schoolCode = printSchoolCode ? printSchoolCode : choosenSchool ? getSchoolCode(choosenSchool) : '';

    const studentDistribution = useMemo( () => { 
        let schoolData = [];
        let districtData = [];
        if(data.percentGroupBySchool){
            const schoolTotalStudents = _.sumBy(data.percentGroupBySchool, 'count');
            schoolData = _.map( data.percentGroupBySchool, s => {
                return ({
                    name: schoolName,
                    range: s._id + "%",
                    value: parseFloat(parseFloat((s.count / schoolTotalStudents) * 100).toFixed(2))
                })
            } )
        }
        if(data.percentGroupByDistrict){
            const districtTotalStudents = _.sumBy(data.percentGroupByDistrict, 'count');
            districtData = _.map( data.percentGroupByDistrict, s => {
                return ({
                    name: 'District Wise',
                    range: s._id + "%",
                    value: parseFloat(parseFloat((s.count / districtTotalStudents) * 100).toFixed(2))
                })
            } )
        }
        return _.orderBy(_.concat(districtData, schoolData,
            {
                name: '',
                value: 100
            }),['range']);
    },[data.percentGroupByDistrict, data.percentGroupBySchool])



    const subjectPerformanceAnalysisData = useMemo( () => { 
        let schoolData = [];
        let districtData = [];
        if(data.subjectWisePercentGroupOfSchool){
                schoolData = _.map(SUBJECTS, sub => {
                const schoolTotalStudent = _.sumBy(data.subjectWisePercentGroupOfSchool[sub.key], 'count');
                const subjectData = _.map( data.subjectWisePercentGroupOfSchool[sub.key], s => {
                    return ({
                        name: schoolName,
                        range: s._id + "%",
                        value: parseFloat(parseFloat((s.count / schoolTotalStudent) * 100).toFixed(2))
                    })
                })
                return { subject: sub.key , data:subjectData };
            })
        }
        if(data.subjectWisePercentGroupOfDistrict){
            districtData = _.map(SUBJECTS, sub => {
            const districtTotalStudents = _.sumBy(data.subjectWisePercentGroupOfDistrict[sub.key], 'count');
            const districtSubjectData = _.map( data.subjectWisePercentGroupOfDistrict[sub.key], s => {
                    return ({
                        name: 'District Wise',
                        range: s._id + "%",
                        value: parseFloat(parseFloat((s.count / districtTotalStudents) * 100).toFixed(2))
                    })
                } )
            return { subject: sub.key ,data:districtSubjectData }
            })
        }
        return _.orderBy(_.concat(districtData, schoolData),['range']);
    },[data.subjectWisePercentGroupOfDistrict, data.subjectWisePercentGroupOfSchool])

    const schoolAvgComparisonData = useMemo( () => {
        if(!data.avgPercentOfSchoolsOfDistrict) return [];
        const avgData = _.filter(data.avgPercentOfSchoolsOfDistrict, s => s?.avgPer?.$numberDecimal);
        let sortData = _.orderBy(avgData, 'avgPer.$numberDecimal', 'desc')
        const schoolIndex = _.findIndex(sortData, s => s._id === choosenSchool )
        const maxSchools = sortData.slice(schoolIndex - 3, schoolIndex);
        const lowSchools = sortData.slice(schoolIndex, schoolIndex + 4);
        return _.concat(_.map(_.concat(maxSchools, lowSchools), s => ({ school: getSchoolName(s._id), value: parseFloat(s.avgPer.$numberDecimal) })), [])
    },[data.avgPercentOfSchoolsOfDistrict]);

    const printPaper = () => {
        const url = window.location.origin + ROUTES.PRINT_X_EXAM_RESULT + "?" + `district=${district.toUpperCase()}&schoolId=${choosenSchool}`;
        window.open(url, '_blank')
    }

    const handleDistrictChange = (v) => {
        setDistrict(v);
        setChoosenSchool('')
        props.getSchoolByDistrict(v);
    }

    const handleStateChange = (v) => {
        setChoosenSchool(v)
    }

    const getExamResult = () => {
        if (!district || !choosenSchool) return null;
        props?.getExamData(district, getSchoolCode(choosenSchool))
    }
      
    return (
        <div style={{ background: 'white' }}>
            {
                !props.isPrint &&
                <div style={{ padding: '20px 5px'}}>
                    <div style={{ padding: '20px 5px', display: 'flex', alignItems: 'flex-end' }}>
                        <div style={{ marginRight: '10px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Select district</div>
                            <div>
                                <Select style={{ width: 150 }} onChange={handleDistrictChange}>
                                    { 
                                        getAllDistrictStatus === STATUS.FETCHING ?
                                            <option>Loading...</option>
                                        :
                                        allDistricts.map( d => <Option key={d._id} value={d._id}>{d._id}</Option> )
                                    }
                                </Select>
                            </div>
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Select school</div>
                            <div>
                                <Select value={choosenSchool} style={{ width: 250 }} filterOption={ (e, option) => option.value.toLowerCase().indexOf(e.toLowerCase()) !== -1  } showSearch={true} onChange={handleStateChange}>
                                    <Option value="">Select School</Option>
                                    {
                                        getSchoolByDistrictStatus === STATUS.FETCHING ?
                                            <option>Loading...</option>
                                        :
                                        allSchools.map( s => <Option key={s._id} value={s._id}>{s._id}</Option> )
                                    }
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Button type="primary" onClick={getExamResult}>Fetch</Button>
                        </div>
                            
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        {
                            getXExamResultStatus === STATUS.SUCCESS ?
                                <Button onClick={printPaper}>Print</Button>
                            : null
                        }
                    </div>
                </div>
            }
            <div>
                { 
                    getXExamResultStatus === STATUS.SUCCESS ?
                        <div>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100vh', pageBreakAfter:'always', fontFamily: 'serif', padding: '10px', border: '1px solid black' }}>
                                <div>
                                    <div style={{ color: '#1e6941', fontSize: "22px", fontWeight: 'bold', textAlign: 'center' }}>{schoolName}</div>
                                    <Row justify='center' style={{ margin: '7px 0px' }}>
                                        <Col span={18}>
                                            <div style={{ background: '#1e6941', color: 'white', fontSize: "15px", fontWeight: 'bold', textAlign: 'center' }}>(School Code - {schoolCode})</div>
                                        </Col>
                                    </Row>
                                    <Row justify='center' style={{ margin: '7px 0px' }}>
                                        <Col span={7}>
                                            <img style={{ width: '100%' }} src="/images/schoollogIcon.PNG" />
                                        </Col>
                                    </Row>
                                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c2e35', textAlign: 'center', lineHeight: '10px' }}>Xth Result Analysis</div>
                                    <Row justify='center' style={{ margin: '13px 0px' }}>
                                        <Col span={12}>
                                            <div style={{ fontSize: '25px', fontWeight: 'bold', color: '#2c2e35', textAlign: 'center', background: '#00b9f2', color: 'white', borderLeft: '10px solid red', borderRight: '10px solid red', lineHeight: '35px', marginTop: '10px' }}>Top 10 Students</div>
                                        </Col>
                                    </Row>
                                    <div style={{ padding: '0px 10px', }}>
                                        <TopStudentTable student={data.toppersList}/>
                                        <HeaderContainer text={'Picture represents top 10 students of your school with State and District rank'} />
                                        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                                            <HeaderContainer text={'Overall student performance analysis(District wise)'} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ padding: '0px 15px' }}>
                                                <div style={{ border: '1px solid #ff2e17', padding: '10px'}}>
                                                    <StudentAccrossPercentage data={studentDistribution}/>
                                                </div>
                                                <div style={{ background: '#ff2e17', color: 'white', textAlign: 'center', fontSize: '18px' }}>
                                                    Picture represent the distribution of student accorss percentage ranges
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '10px' }}>
                                    <SchoollogFooter isPrint={isPrint} />
                                </div>
                            </div>
                            <div style={{ minHeight: '100vh', pageBreakAfter: 'always', fontFamily: 'serif', padding: '10px', border: '1px solid black' }}>
                                <HeaderContainer2 text='Hindi, English, Sanskrit, Science, Mathematics, Social science performance analysis(district wise)' />
                                <div style={{ marginTop: '20px' }}>
                                <div style={{ display: 'flex', marginBottom: '40px' }}> 
                                    <div style={{ display:'flex', alignItems:'center', marginRight: '20px' }}> <div style={{ width: '12px', height:'12px', background: '#3274a1', marginRight: '5px' }}></div><div>District Wise</div></div>
                                    <div style={{ display:'flex', alignItems:'center' }}> <div style={{ width: '12px', height:'12px', background: '#e1812c', marginRight: '5px' }}></div><div>{schoolName}</div> </div>
                                </div>
                                    <Row justify='center' gutter={16}>
                                        {
                                            _.map(SUBJECTS, (sub, i) => {
                                                const subjectData = _.orderBy(_.flatMap(_.filter(subjectPerformanceAnalysisData, s => s.subject === sub.key ).map( s => s.data)), 'range');
                                                if(!data.subjectWisePercentGroupOfSchool || !data?.subjectWisePercentGroupOfSchool[sub.key]) return;
                                                return (
                                                    <Col key={sub.key} span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <div style={{ marginBottom: i < 4 && '50px', width: '330px' }}>
                                                            <SingleSubjectResult subject={sub.title} data={subjectData}/>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </div> 
                                {/* <div>
                                    <HeaderContainer2 text='District wise Xth comparison' />
                                </div> 
                                <div>
                                    <StudentAccrossPercentage />
                                </div> */}
                                    <div>
                                        <SchoollogFooter isPrint={isPrint}/>
                                    </div>
                            </div>
                            <div style={{ minHeight: '100vh', pageBreakAfter: 'always', fontFamily: 'serif', padding: '10px', border: '1px solid black' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '95vh' }}>
                                    <div>
                                        <div>
                                            <HeaderContainer2 text='(School Average Comparison Chart)' />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ padding: '0px 15px' }}>
                                                <div style={{ marginTop: '30px',padding: '10px', border: '1px solid #ff2e17', paddingBottom: '20px', minWidth: '670px' }}>
                                                    <div>
                                                        <SchoolAverageComparison curSchool={ getSchoolName(choosenSchool) } data={schoolAvgComparisonData}/>
                                                    </div>
                                                </div>
                                                <div style={{ background: '#ff2e17', color: 'white', textAlign: 'center', fontSize: '18px' }}>
                                                Graph compare the school with { schoolAvgComparisonData.length } closest schools on basic of average marks.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <SchoollogFooter isPrint={isPrint}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    : 
                        getXExamResultStatus === STATUS.FETCHING &&
                        <Spin tip="loading.." />
                }
            </div>
        </div>
    )
}

function Dot() {
    return (
        <span style={{ width: '10px', height: '10px', display: 'inline-block', borderRadius: '50%', background: 'black' }}></span>
    )
}

function HeaderContainer({ text }) {
    return (
        <div style={{ fontSize: '18px', paddingLeft: '5px', fontWeight: 'bold', color: 'white', background: '#00b9f2', borderLeft: '10px solid #005782' }}>{text}</div>
    )
}

function HeaderContainer2({ text }) {
    return (
        <div style={{ lineHeight: '28px', marginTop: '10px', borderTop: '3px solid #ad5212', borderBottom: '3px solid #ad5212', background: '#e8711e', textAlign: 'center', color: 'white', fontSize: '22px', fontWeight: 'bold' }}>
            {text}
        </div>
    )
}
function SchoollogFooter({ isPrint }) {
    // position: isPrint && 'fixed', bottom: '0px', width: '100%' 
    return (
        <div style={{ marginTop: '10px'}}>
            <Row justify='center' style={{ margin: '7px 0px' }}>
                <Col span={8} style={{ borderBottom: '2px solid #02d7ff' }}>
                    <img style={{ width: '100%' }} src="/images/schoollogIcon.PNG" />
                </Col>
            </Row>
            <div style={{ fontSize: '18px', textAlign: 'center' }}>
                <div><Dot /> School management software <Dot /> School learning online software</div>
                <div>For more detailed analysis get in touch with us at <b>8448443326</b></div>
            </div>
        </div>
    )
}

function SingleSubjectResult({ subject, data }) {
    return (
        <div>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-32px', transform: 'translateX(-50%)', left: '50%', fontSize: '22px', fontWeight: 'bold', background: 'linear-gradient(180deg, rgb(255, 125, 36) 50%, transparent 50%)', color: 'white', width: 'fit-content', minWidth: '140px', textAlign: 'center', minHeight: '65px', borderRadius: '50px', padding: '14px', paddingTop: '0px' }}>
                    <div>{subject}</div>
                </div>
                <div style={{ border: '1px solid #e8711e', zIndex: 10, padding: '5px' }}>
                    <StudentAccrossPercentage legend={false} data={data} height={200} xAxisFontSize={8} width={400} labelFontSize={8} />
                </div>
            </div>
        </div>
    )
}

function TopStudentTable({ student }) {
    const topStudentTableColumn = [
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Student Name</div>,
            dataIndex: 'studentName',
            key: 'studentName',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Marks Obtained</div>,
            dataIndex: 'marksObtained',
            key: 'marksObtained',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>% Obtained</div>,
            dataIndex: 'percentObtained',
            key: 'percentObtained',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>State Rank</div>,
            dataIndex: 'stateRank',
            key: 'stateRank',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>District Rank</div>,
            dataIndex: 'districtRank',
            key: 'districtRank',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>School Rank</div>,
            dataIndex: 'schoolRank',
            key: 'schoolRank',
            render: text => <div style={{ textAlign: 'center' }}>{text}</div>,
        },
    ]

    const EditableCell = ({
        children,
        ...restProps
    }) => {

        return (
            <td {...restProps} style={{ padding: '0px' }}>
                {children}
            </td>
        )
    }

    const EditableColumnCell = ({
        children,
        ...restProps
    }) => {

        return (
            <th {...restProps} style={{ padding: '0px' }}>
                {children}
            </th>
        )
    }

    return (
        <div>
            <Table style={{ border: '1px solid #00b9f2' }} components={{
                body: {
                    cell: EditableCell,
                },
                header: {
                    cell: EditableColumnCell
                }
            }} columns={topStudentTableColumn} dataSource={student} pagination={false} />
        </div>
    )
}

function SchoolAverageComparison({ data = [], curSchool }){


    const percentageRange = [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]

    const colors = [ '#3174a1', '#e1812b', '#3a923b', '#bf3d3d','#9172af', '#835a53', '#d584be' ]
    // const colors = ['#48BB78', '#A0AEC0'];
    const GraphRow = ({ percentage, index, isCurSchool}) => {
        const curColor = colors[index];
        // const curColor = isCurSchool ? colors[0] : colors[1];
        return (
            <div style={{ position: 'relative' , height: '100%' ,width: '100%', padding: '5px 0px' , border: '1px solid black', borderBottom: index !== (data.length - 1) ? 'none' : '1px solid', borderTop: index !== 0 ? 'none' : '1px solid' }}>
                <div style={{ position:'relative' ,height: '28px', width: (percentage + "%"), background: curColor, display: 'flex', alignItems:'center' }}>
                    <div style={{ position:'absolute', right: '4px', color:'white', fontWeight:'bold' }}>{ parseFloat(percentage).toFixed(2) + "%" }</div>
                    <div style={{ position: 'absolute', left: '-7px', width: '7px', height: '2px', background: 'black' }}></div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ paddingRight: '20px' }}>
            {
                _.map(data, (school, i) => {
                    return (
                        <Row key={i}>
                            <Col span={12} style={{ textAlign:'right', paddingTop:'5px' }}>
                               { school.school } 
                            </Col>
                            <Col span={12} style={{ paddingLeft : '20px' }}>
                                <GraphRow isCurSchool={ curSchool === school.school } percentage={school.value} index={i}/>
                            </Col>
                        </Row>
                    )
                })
            }
            <Row>
                <Col span={12}></Col>
                <Col span={12} style={{ paddingLeft : '20px', marginTop: '9px' }}>
                    <div style={{ display: 'flex', position:'relative'}}>
                        {
                            _.map( percentageRange, p => {
                                const left = (p - 2) + '%';
                                return (
                                    <div key={p}>
                                        <div style={{ position: 'absolute', left: left, textAlign: 'center', display:'flex', justifyContent:'center' }}>
                                            <div style={{ position:'relative', top : '-10px', width: '2px', height: '5px', left: '5px', background: 'black' }}></div>
                                            <div style={{ fontSize:"12px" }}>{ p + "%" }</div>
                                        </div>
                                    </div>
                                )
                            } )
                        }
                    </div>
                </Col>
            </Row>
        </div>
    )
}

function StudentAccrossPercentage({ height = 250, labelFontSize = 15, xAxisFontSize = 15, width = 660, data = [], legend = true }) {
    const config = {
        data,
        isGroup: true,
        xField: 'range',
        yField: 'value',
        seriesField: 'name',
        height: height,
        width: width,
        dodgePadding: 2,
        animate: false,
        color: ['#3274a1', '#e1812c', 'transparent'],
        label: {
            position: 'top',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        legend:legend,
        xAxis: {
            title: {
                text: 'Distribution of student accross percentage ranges',
                position: 'center',
                style: {
                    fontSize: labelFontSize,
                }
            },
            label: {
                style: {
                    fill: "black",
                    fontSize: xAxisFontSize,
                }
            }
        },
        yAxis: {
            title: {
                text: '% of total appeared students',
                position: 'center',
                style: {
                    fontSize: labelFontSize,
                }
            }
        }
    };
    return (<Column {...config} />);
}

