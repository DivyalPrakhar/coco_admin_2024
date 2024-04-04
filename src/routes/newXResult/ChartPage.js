import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Row, Col, Table, Button, Select, Spin } from 'antd';
import { Column, Bar } from '@ant-design/plots';
import { printHelper, PRINT_TYPE, STATUS } from '../../Constants';
import _, { first, result } from 'lodash'
import { ROUTES } from '../../Constants/Routes';
import { BaseURL, BaseURL_WEB } from '../../BaseUrl';
import { Input } from '@chakra-ui/react';
const { Option } = Select;

const SUB_MAX_MARKS = 100;
const SUBJECTS = [ 'ALL', 'HINDI', 'ENGLISH', 'SCIENCE', 'SOC.SCIENCE', 'MATHEMATICS', 'SANSKRIT']

const getSchoolCode = (s) => {
    if(!s) return '';
    return s.split('(')[1].split(')')[0];
}

const getSchoolName = (s) => {
    if(!s) return '';
    return s.split('(')[1].split(')')[1].substring(1);
}

export function ChartPage(props) {
    const { getXExamResultStatus, allSchools, data, printSchoolName, printSchoolCode, allDistricts, printChoosenSchool, isPrint } = props
    const [ firstRollNo, setFirstRollNo ] = useState();
    const [ endRollNo, setEndRollNo ] = useState();
    const choosenSchool = data && data.length ? data[0]['CENT_NAME'] : ''
    const schoolName = getSchoolName(choosenSchool);
    const schoolCode = getSchoolCode(choosenSchool)

    let basicData = _.map(data , d => {
        let basic =  {
        "rollNo": d['ROLL_NO'],
        "name": d["CAN_NAME"],
        "fname": d["FNAME"],
        "mname": d["MNAME"],
        "school": d["CENT_NAME"],
        "totMarks": parseFloat((d["TOT_MARKS"] || 0)),
        'percentage': d['PER'] || 0,
        "result": d["result"]
        }
        let key = '';
        for(var i=6; i > 0; i--) {
            key = d['SC' + i]
            basic[key] = parseFloat(parseFloat((d['SC' + i + 'TT']?.replace(/\D/g, '') || 0)).toFixed(2));
        }
        return basic;
    })

    console.log("basicData",basicData)
    const studentDistribution = useMemo( () => { 
        return [];
    },[data])

    const tableData = useMemo ( () => {
        let data1 =  _.map(_.orderBy(basicData, 'totMarks', 'desc'), (d, ind) => ({ name: d.name, marks: d.totMarks, percentage: d.percentage, rank: ind+1, roll: d.rollNo }))
        return _.take(data1, 10)
    },[basicData])


    const subjectPerformanceAnalysisData = useMemo( () => { 
       return [];
    },[])

    const schoolAvgComparisonData = useMemo( () => {
        return [];    
    },[]);

    const printPaper = () => {
        const url = window.location.origin + ROUTES.PRINT_X_COMPARE_RESULT + "?" + `start=${firstRollNo}&end=${endRollNo}`;
        window.open(url, '_blank')
    }

    const getExamResult = () => {
        props?.getExamData(firstRollNo, endRollNo)
    }

    let perRange = [
        {'ul': '100', 'll': '100'},
        {'ul': '100', 'll': '95'},
        {'ul': '95', 'll': '90'},
        {'ul': '90', 'll': '80'},
        {'ul': '80', 'll': '70'},
        {'ul': '70', 'll': '60'},
        {'ul': '60', 'll': '50'},
        {'ul': '50', 'll': '40'},
        {'ul': '40', 'll': '33'},
        {'ul': '33', 'll': '0'},
    ]

    function getPercentRangeCount(ul, ll) {
        let filtered= _.filter(basicData, d => ll  == ul ?  parseFloat(d.percentage) >= parseFloat(ll) :  parseFloat(d.percentage) >= parseFloat(ll) && parseFloat(d.percentage) < parseFloat(ul))
        return filtered.length
    }

    function getPercentRangeSubjectCount(ul, ll, key) {
        let filtered = _.filter(basicData, d =>{ const per =( d[key] * 100) / SUB_MAX_MARKS; 
        if(ll == ul)
            return parseFloat(per) >= parseFloat(ll)
        return parseFloat(per) >= parseFloat(ll) && parseFloat(per) < parseFloat(ul)
     })
        return filtered.length
    }
    let perObj = _.map(perRange, ( d) => {
        let key = d.ul == d.ll ? d.ll : d.ul + '-' + d.ll
        let count = getPercentRangeCount(d.ul, d.ll)
        return ({ value: count, range: key, name: 'Number of Students' })
    })

    const subjectAvgCompare = _.map(SUBJECTS, (s) => {
        let value = _.meanBy(basicData, function(o) { if(s === 'ALL') return o.totMarks; return o[s]; });
        value = s === 'ALL' ? ( value * 100) / (SUB_MAX_MARKS * 6) : value;
        return ({ name: s, value: value });
    } )

    
    const singleSubjectAvgCompare1 = _.reduce([ 'HINDI', 'ENGLISH', 'SCIENCE'], (res, s) => {
        if(s === 'ALL') return res;
        let perObj =  _.map(perRange, (d) => {
            let key = d.ul == d.ll ? d.ll : d.ul + '-' + d.ll
            let count = getPercentRangeSubjectCount(d.ul, d.ll, s)
            return ({ value: count, range: key, name: 'Number of Students' })
        })
     
       res[s] = perObj
       return res

    }, {} )
    const singleSubjectAvgCompare2 = _.reduce([ 'SOC.SCIENCE', 'MATHEMATICS', 'SANSKRIT'], (res, s) => {
        if(s === 'ALL') return res;
        let perObj =  _.map(perRange, (d) => {
            let key = d.ul == d.ll ? d.ll : d.ul + '-' + d.ll
            let count = getPercentRangeSubjectCount(d.ul, d.ll, s)
            return ({ value: count, range: key, name: 'Number of Students' })
        })
     
       res[s] = perObj
       return res

    }, {} )
    
    // console.log("subjectAvgCompare ", singleSubjectAvgCompare)
    return (
        <div style={{ background: 'white', minWidth: '780px' }}>
            {
                !props.isPrint &&
                <div style={{ padding: '20px 5px'}}>
                    <div style={{ padding: '20px 5px', display: 'flex', alignItems: 'flex-end' }}>
                        
                    <div style={{ marginRight: '10px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Start Roll No.</div>
                            <Input type='number' value={firstRollNo} onChange={(e) => setFirstRollNo(e.target.value)}/>
                        </div>
                        <div style={{ marginRight: '10px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>End Roll No.</div>
                            <Input type='number' value={endRollNo} onChange={(e) => setEndRollNo(e.target.value)}/>
                        </div>
                        <div>
                            <Button type="primary" onClick={getExamResult}>Fetch</Button>
                        </div>
                            
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        {
                            <Button onClick={printPaper}>Print</Button>
                        }
                    </div>
                </div>
            }
            <div>
                { 
                    getXExamResultStatus === STATUS.SUCCESS || true ?
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
                                        <TopStudentTable student={tableData}/>
                                        <HeaderContainer text={'Picture represents top 10 students of your school'} />
                                        <div style={{ marginTop: '20px', marginBottom: '10px' }}>
                                            <HeaderContainer text={'Overall student performance analysis'} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ padding: '0px 15px' }}>
                                                <div style={{ border: '1px solid #ff2e17', padding: '10px', maxWidth: '720px'}}>
                                                    <StudentAccrossPercentage data={perObj}/>
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
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '95vh' }}>
                                    <div>
                                        <div>
                                            <HeaderContainer2 text='(School Total and Subjectwise Average  Chart)' />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ padding: '0px 15px' }}>
                                                <div style={{ marginTop: '30px',padding: '10px', border: '1px solid #ff2e17', paddingBottom: '20px', maxWidth: '720px', minWidth: '720px' }}>
                                                    <div>
                                                        <SchoolAverageComparison data={subjectAvgCompare}/>
                                                    </div>
                                                </div>
                                                <div style={{ background: '#ff2e17', color: 'white', textAlign: 'center', fontSize: '18px' }}>
                                                Graph shows the avg subjectwise percentage of students.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <SchoollogFooter isPrint={isPrint}/>
                                    </div>
                                </div>
                            </div>

                            <div style={{ minHeight: '100vh', pageBreakAfter: 'always', fontFamily: 'serif', padding: '10px', border: '1px solid black' }}>
                                <HeaderContainer2 text='HINDI, ENGLISH, SCIENCE, SOC.SCIENCE, MATHEMATICS, SANSKRIT performance analysis' />
                                <div style={{ marginTop: '60px' }}>
                                {/* <div style={{ display: 'flex', marginBottom: '40px' }}> 
                                    <div style={{ display:'flex', alignItems:'center', marginRight: '20px' }}> <div style={{ width: '12px', height:'12px', background: '#3274a1', marginRight: '5px' }}></div><div>District Wise</div></div>
                                    <div style={{ display:'flex', alignItems:'center' }}> <div style={{ width: '12px', height:'12px', background: '#e1812c', marginRight: '5px' }}></div><div>{schoolName}</div> </div>
                                </div> */
                                //sub === 'SCIENCE' && 'always' 
                                }
                                    <Row justify='center' gutter={16}>
                                        {
                                            _.map(singleSubjectAvgCompare1, (data,sub) => {
                                                return (
                                                    <Col key={sub} span={24} style={{ display: 'flex', justifyContent: 'center', maxWidth: '720px'}}>
                                                        <div style={{ marginBottom: '50px', width: '100%' }}>
                                                            <SingleSubjectResult subject={sub} data={data}/>
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
                                <HeaderContainer2 text='HINDI, ENGLISH, SCIENCE, SOC.SCIENCE, MATHEMATICS, SANSKRIT performance analysis' />
                                <div style={{ marginTop: '60px' }}>
                                {/* <div style={{ display: 'flex', marginBottom: '40px' }}> 
                                    <div style={{ display:'flex', alignItems:'center', marginRight: '20px' }}> <div style={{ width: '12px', height:'12px', background: '#3274a1', marginRight: '5px' }}></div><div>District Wise</div></div>
                                    <div style={{ display:'flex', alignItems:'center' }}> <div style={{ width: '12px', height:'12px', background: '#e1812c', marginRight: '5px' }}></div><div>{schoolName}</div> </div>
                                </div> */
                                //sub === 'SCIENCE' && 'always' 
                                }
                                    <Row justify='center' gutter={16}>
                                        {
                                            _.map(singleSubjectAvgCompare2, (data,sub) => {
                                                return (
                                                    <Col key={sub} span={24} style={{ display: 'flex', justifyContent: 'center', maxWidth: '720px'}}>
                                                        <div style={{ marginBottom: '50px', width: '100%' }}>
                                                            <SingleSubjectResult subject={sub} data={data}/>
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
                    <StudentAccrossPercentage legend={false} data={data} height={200} xAxisFontSize={8} labelFontSize={8} />
                </div>
            </div>
        </div>
    )
}

function TopStudentTable({ student }) {
    const topStudentTableColumn = [
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Student Name</div>,
            dataIndex: 'name',
            key: 'name',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Roll No</div>,
            dataIndex: 'roll',
            key: 'roll',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Marks</div>,
            dataIndex: 'marks',
            key: 'marks',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Percentage</div>,
            dataIndex: 'percentage',
            key: 'percentage',
            render: text => <div style={{ textAlign: 'center', fontSize: '12px' }}>{text}</div>,
        },
        {
            title: <div style={{ textAlign: 'center', fontSize: '12px' }}>Rank</div>,
            dataIndex: 'rank',
            key: 'rank',
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

function SchoolAverageComparison({ data = [] }){


    const percentageRange = [ 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 ]

    const colors = [ '#3174a1', '#e1812b', '#3a923b', '#bf3d3d','#9172af', '#835a53', '#d584be' ]
    // const colors = ['#48BB78', '#A0AEC0'];
    const GraphRow = ({ percentage, index}) => {
        const curColor = colors[index];
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
                _.map(data, (sub, i) => {
                    return (
                        <Row key={i}>
                            <Col span={12} style={{ textAlign:'right', paddingTop:'5px' }}>
                               { sub.name } 
                            </Col>
                            <Col span={12} style={{ paddingLeft : '20px' }}>
                                <GraphRow percentage={sub.value} index={i}/>
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

function StudentAccrossPercentage({ height = 250, labelFontSize = 15, xAxisFontSize = 15, width = 720, data = [], legend = true }) {
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
                text: 'total count of students',
                position: 'center',
                style: {
                    fontSize: labelFontSize,
                }
            }
        }
    };
    return (<Column {...config} />);
}

