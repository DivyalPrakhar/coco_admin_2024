import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ChartPage } from './ChartPage';
import { getSchoolsByDistrict, getXIIExamResult, getAllDistrict } from '../../redux/reducers/xExamResult/index';

export function XIIExamResult(props) {
    const query = new URLSearchParams(props.location.search);
    const district = query.get('district');
    const schoolId = query.get('schoolId');
    const [ printSchoolDetail, setPrintSchoolDetail ] = useState({ name: null, code: null });
    const dispatch = useDispatch();
    const examReducer = useSelector( s => s.xExamResult );
    const { getXExamResultStatus, getAllDistrictStatus } = examReducer;

    const getExamData = (d, sclId) => {
        dispatch(getXIIExamResult({ districtName: d.toUpperCase(), schoolId: sclId }));
    }

    const getSchoolByDistrict = (d) => {
        dispatch(getSchoolsByDistrict({ districtName:d.toUpperCase() }))
    }

    useEffect( () => {
        dispatch(getAllDistrict());
    },[])

    useEffect(() => {
        if(!district || !schoolId) return;
        document.querySelector('.hide-print').classList.remove('hide-print')
        const scCode = schoolId.split('(')[1].split(')')[0];
        const scName = schoolId.split('(')[1].split(')')[1].substring(1);
        setPrintSchoolDetail({ name: scName, code: scCode });
        getExamData(district,scCode)
    }, [district, schoolId])


    return (
        <div style={{ minHeight: '100vh', background: 'white', paddingLeft: '20px' }}>
            <ChartPage 
            getAllDistrictStatus={getAllDistrictStatus}
            allDistricts={examReducer.districts} 
            printSchoolName={printSchoolDetail.name} 
            printSchoolCode={printSchoolDetail.code} 
            printChoosenSchool={schoolId}
            isPrint={district && schoolId} 
            data={examReducer.data} 
            allSchools={examReducer.districtSchools} 
            getXExamResultStatus={getXExamResultStatus} 
            getSchoolByDistrict={getSchoolByDistrict} 
            getExamData={getExamData}/>
        </div>
    )
}
