import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ChartPage } from './ChartPage';
import { getSchoolsByDistrict, getAllDistrict, getXExamDResultData } from '../../redux/reducers/xExamResult/index';

export function XCompareResult(props) {
    const query = new URLSearchParams(props.location.search);
    const start = query.get('start');
    const end = query.get('end');
    const [ printSchoolDetail, setPrintSchoolDetail ] = useState({ name: null, code: null });
    const dispatch = useDispatch();
    const examReducer = useSelector( s => s.xExamResult );
    const { getXExamResultStatus, getAllDistrictStatus } = examReducer;

    const getExamData = (s, e) => {
        dispatch(getXExamDResultData({ start: s, end: e }));
    }

    const getSchoolByDistrict = (d) => {
        dispatch(getSchoolsByDistrict({ districtName:d.toUpperCase() }))
    }

    useEffect(() => {
        document.querySelector('.hide-print').classList.remove('hide-print')
        if(!start || !end) return;
        getExamData(start,end)
    }, [start, end])

    console.log("stt",start,end)
    return (
        <div style={{ minHeight: '100vh', background: 'white', paddingLeft: '20px' }}>
            <ChartPage 
            getAllDistrictStatus={getAllDistrictStatus}
            allDistricts={examReducer.districts} 
            printSchoolName={printSchoolDetail.name} 
            printSchoolCode={printSchoolDetail.code} 
            isPrint={start && end} 
            data={examReducer.XExamCompareData || []} 
            allSchools={examReducer.districtSchools} 
            getXExamResultStatus={getXExamResultStatus} 
            getSchoolByDistrict={getSchoolByDistrict} 
            getExamData={getExamData}/>
        </div>
    )
}
