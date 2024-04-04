import React, { useState } from 'react'
import { useEffect } from 'react';
import { PRINT_TYPE } from '../Constants';
import { TestPaperPrint } from '../routes/ManageTests/TestPaperPrint';
import { ResultDataTable } from '../routes/ManageTests/ResultReportTable';
import {AnswerKeyTable} from '../routes/AnswerKeys/AnswerKeyTable';
import { bilingualText } from '../utils/FileHelper';
import { LoadingModal } from './LoadingModal';
import { TopicReview } from '../routes/SurveyReport';
import DiscritptiveAnswer from '../routes/SurveyReport/DiscritptiveAnswer';
import PaymentReceipt from '../routes/StudentProfile/PaymentRecipt';
import IdCardPrint from '../routes/StudentProfile/IdCard';
import { TutionFeesReceipt } from '../routes/StudentProfile/BatchPayment';

export const GenPrint = (props) => {
    let [loading, setLoading] = useState(false)
    useEffect(() => {
        window.focus();
        setLoading(true)
        document.title = props.data.test?.name ? bilingualText(props.data.test.name) : props.type === PRINT_TYPE.PRINT_PAYMENT_RECEIPT ? "Payment Receipt" : PRINT_TYPE.PRINT_ID_CARD ? "Id Card" : PRINT_TYPE.PRINT_TUTIONFESS_RECEIPT? "Tution Fees Receipt" : 'Question Paper'
        setTimeout(() => {setLoading(false); window.print()}, props.data.timeout || 200);
    }, [])
    return(
        <div>
            {props.type == PRINT_TYPE.TEST_PAPER ? 
                <TestPaperPrint {...props.data}/>
            : props.type == PRINT_TYPE.STUDENTS_RESULT_TABLE ? 
                <ResultDataTable data={props.data}/>
            : props.type == PRINT_TYPE.TEST_ANSWER_KEY ? 
                <AnswerKeyTable {...props.data}/>
            : props.type == PRINT_TYPE.PRINT_SURVEY_REPORT ?
              <TopicReview { ...props.data }/>
            : props.type === PRINT_TYPE.PRINT_SURVEY_DISCRIPTIVE_ANSWER ?
              <DiscritptiveAnswer {...props.data}/>
            : props.type === PRINT_TYPE.PRINT_PAYMENT_RECEIPT ?
                <>
                    <PaymentReceipt course={props.data.course} currentStudent={props.data.currentStudent} offlinePaymentDetails={props.data.offlinePaymentDetails}/>
                    <br />
                    <PaymentReceipt course={props.data.course} currentStudent={props.data.currentStudent} offlinePaymentDetails={props.data.offlinePaymentDetails}/>
                </>            
            :props.type === PRINT_TYPE.PRINT_ID_CARD ?
                <IdCardPrint currentStudent={props.data.currentStudent} assignedBatch={props.data.assignedBatch} allCenterList={props.data.allCenterList} studentBatchData={props.data.studentBatchData} />
            : props.type === PRINT_TYPE.PRINT_TUTIONFESS_RECEIPT ?
                <>
                    <TutionFeesReceipt collectedPayment={props.data.collectedPayment} currentStudent={props.data.currentStudent} allOfflineCourses={props.data.allOfflineCourses} allCenterList={props.data.allCenterList} batch={props.data.batch} />
                    <TutionFeesReceipt collectedPayment={props.data.collectedPayment} currentStudent={props.data.currentStudent} allOfflineCourses={props.data.allOfflineCourses} allCenterList={props.data.allCenterList} batch={props.data.batch} />
                </> 
            : null}
            {loading ? <LoadingModal text={'Printing...'} visible={loading}/> : null}
        </div>
    )
}