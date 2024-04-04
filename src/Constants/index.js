import ReactDOM from 'react-dom'
import { createContext } from "react";
import {
	GenPrint
} from '../components/GenPrint';

export const STATUS = {
	SUCCESS: "SUCCESS",
	NOT_STARTED: "NOT_STARTED",
	FETCHING: "FETCHING",
	FAILED: "FAILED",
}

export const PAYMENT_STATUS = [{
	value: 'Success',
	name: 'SUCCESS',
	color: 'green'
},
{
	value: 'Calcelled',
	name: 'CANCELLED',
	color: 'red'
},
{
	value: 'Failed',
	name: 'FAILED',
	color: 'red'
},
{
	value: 'Processing',
	name: 'PROCESSING',
	color: 'blue'
}
]

export const PRINT_TYPE = {
	TEST_PAPER: 1,
	STUDENTS_RESULT_TABLE: 2,
	TEST_ANSWER_KEY: 3,
	PRINT_SURVEY_REPORT: 4,
	PRINT_SURVEY_DISCRIPTIVE_ANSWER: 5,
	PRINT_PAYMENT_RECEIPT: 6,
	PRINT_ID_CARD: 7,
	PRINT_TUTIONFESS_RECEIPT: 8,
}

export const RoleType = [
	'ADMIN',
	// 'STAFF',
	"SUPPORT_EXECUTIVE",
	'CONTENT_ADMIN',
	'CONTENT_OPERATOR',
	'QA_QC',
	// 'EXECUTIVE',
	// 'STAFF',
	// 'HEAD_STAFF',
	// 'STUDENT',
	// 'LEAD',
	// 'ALUMNI',
	'TEACHER',
	'HEAD_TEACHER',
	'DELIVERY_ACCESS',
	'UNKNOWN',
	'CAREER',
	'BUSINESS_PARTNER',
	"LIVE_CLASS"
	
]
export const ROLES =  {
	SYSADMIN : 'SYSADMIN',
	ADMIN : 'ADMIN',
	QA_QC:'QA_QC',
	CONTENT_ADMIN : 'CONTENT_ADMIN',
	CONTENT_OPERATOR:'CONTENT_OPERATOR',
	EXECUTIVE:'EXECUTIVE',
	STAFF : 'STAFF',
	HEAD_STAFF : 'HEAD_STAFF',
	STUDENT : 'STUDENT',
	SUPPORT_EXECUTIVE:'SUPPORT_EXECUTIVE',
	TEACHER :"TEACHER",
	HEAD_TEACHER:"HEAD_TEACHER",
	LEAD : 'LEAD',
	DELIVERY_ACCESS:"DELIVERY_ACCESS",
	ALUMNI : 'ALUMNI',
	GHOST : 'UNKNOWN',
	CAREER:'CAREER',
	BUSINESS_PARTNER:'BUSINESS_PARTNER',
	LIVE_CLASS: 'LIVE_CLASS'
  }

export const EXAM_DETAILS = [
	// {
	// 	id:1,
	// 	"name": {"en": "JEE Advanced", "hn": ""},
	// 	"totalQuestions": 54,
	// 	"totalTime": 180,
	// 	"maxMarks": 180,
	// 	"instruction":'JEE Main',
	// },
	{
		id: 2,
		"name": {
			"en": "JEE Main",
			"hn": ""
		},
		"value": 'JEE Main',
		"totalQuestions": 90,
		"totalTime": 180,
		"maxMarks": 300,
		"instruction": 'JEE Main'
	},
	{
		id: 3,
		"name": {
			"en": "NEET",
			"hn": ""
		},
		"value": 'NEET',
		"totalQuestions": 180,
		"totalTime": 180,
		"maxMarks": 720,
		"instruction": 'NEET',
	},
	{
		id: 4,
		"name": {
			"en": "NTSE SAT",
			"hn": ""
		},
		"value": 'NTSE SAT',
		"totalQuestions": 100,
		"totalTime": 120,
		"maxMarks": 100,
		"instruction": '',
	},
	{
		id: 5,
		"name": {
			"en": "NSEJS",
			"hn": ""
		},
		"value": 'NSEJS',
		"totalQuestions": 80,
		"totalTime": 120,
		"maxMarks": 80,
		"instruction": '',
	},
	{
		id: 6,
		"name": {
			"en": "NMTC",
			"hn": ""
		},
		"value": 'NMTC',
		"totalQuestions": 30,
		"totalTime": 120,
		"maxMarks": 30,
		"instruction": '',
	},
	{
		id: 7,
		"name": {
			"en": "SOF IMO",
			"hn": ""
		},
		"value": 'SOF IMO',
		"totalQuestions": 50,
		"totalTime": 60,
		"maxMarks": 60,
		"instruction": '',
	},
	{
		id: 8,
		"name": {
			"en": "SOF IEO",
			"hn": ""
		},
		"value": 'SOF IEO',
		"totalQuestions": '',
		"totalTime": '',
		"maxMarks": '',
		"instruction": '',
	},
	{
		id: 9,
		"name": {
			"en": "NSTSE",
			"hn": ""
		},
		"value": 'NSTSE',
		"totalQuestions": 60,
		"totalTime": '',
		"maxMarks": 60,
		"instruction": '',
	},
	{
		id: 10,
		"name": {
			"en": "CLAT",
			"hn": ""
		},
		"value": 'CLAT',
		"maxMarks": 150,
		"totalQuestions": 150,
		"totalTime": 120,
		"instruction": '',
	},
	{
		id: 11,
		"name": {
			"en": "NDA Paper 1",
			"hn": ""
		},
		"value": 'NDA2 Maths',
		"maxMarks": 300,
		"totalQuestions": 120,
		"totalTime": 150,
		"instruction": '',
	},
	{
		id: 12,
		"name": {
			"en": "NDA Paper 2",
			"hn": ""
		},
		"value": 'NDA2 Gen',
		"maxMarks": 600,
		"totalQuestions": 150,
		"totalTime": 150,
		"instruction": '',
	},
	{
		id: 13,
		"name": {
			"en": "Airforce Group X",
			"hn": ""
		},
		"value": 'Air GrpX',
		"maxMarks": 70,
		"totalQuestions": 70,
		"totalTime": 60,
		"instruction": '',
	},
	{
		id: 14,
		"name": {
			"en": "CAT",
			"hn": ""
		},
		"value": 'CAT',
		"maxMarks": 300,
		"totalQuestions": 100,
		"totalTime": 180,
		"instruction": '',
	},
	{
		id: 15,
		"name": {
			"en": "BITSAT",
			"hn": ""
		},
		"value": 'BITSAT',
		"maxMarks": 450,
		"totalQuestions": 150,
		"totalTime": 180,
		"instruction": '',
	},
	{
		id: 16,
		"name": {
			"en": "JEE MAIN New",
			"hn": ""
		},
		"value": 'JEE MAIN New',
		"totalQuestions": 90,
		"totalTime": 180,
		"maxMarks": 300,
		"instruction": ''
	},
]

export const PackageAccessibility = [
	{ title: 'All[Public]', value: 'all' },
	{ title: 'Purchased', value: 'any' },
	{ title: 'Specific Packages', value: 'specific' },
	{ title: 'Share Link', value: 'share_link' },
]

export const printHelper = (type, data) => {
	// document.getElementById('print').innerHTML = '';
	ReactDOM.unmountComponentAtNode(document.getElementById('print'))
	ReactDOM.render(< GenPrint type={
		type
	}
		data={
			data
		}
	/>, document.getElementById('print'));
};

export const ENQUIRY_STATUS = [
	{title:'Pending', value:'pending'},
	{title:'Hold', value:'hold'},
	{title:'Selected', value:'selected'},
	{title:'Rejected', value:'rejected'},
]