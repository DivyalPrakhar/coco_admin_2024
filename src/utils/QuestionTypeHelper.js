import memoizeOne from "memoize-one"
import _ from 'lodash'
// import { SESSION_STORAGE_KEYS } from "./StorageHelper"

export const QuestionTypes = {
                                MCQ:{type:'MCQ', shortName:'MCQ', longName:'Multiple Choice Question'},
                                SCQ:{type:'SCQ', shortName:'SCQ', longName:'Single Choice Question'},
                                Integer:{type:'Integer', shortName:'Numerical', longName:'Numerical'},
                                // Descriptive:{type:'Descriptive', shortName:'Descriptive', longName:'Descriptive'},
                                paragraph_mcq:{type:'paragraph_mcq', shortName:'Paragraph MCQ', longName:'Paragraph MCQ'},
                                paragraph_scq:{type:'paragraph_scq', shortName:'Paragraph SCQ', longName:'Paragraph SCQ'},
                                //mtc_mcq:{type:'mtc_mcq', shortName:'MTC-MCQ', longName:'MTC-MCQ'},
                                // mtc_scq:{type:'mtc_scq', shortName:'MTC-SCQ', longName:'MTC-SCQ'},    
                                // short:{type: "short", shortName: "Short", longName: "Short"},
                                // long:{type: "long", shortName: "Long", longName: "Long"},
                                // very_short:{type: "very_short", shortName: "Very Short", longName: "Very Short"},
                                // very_long:{type: "very_long", shortName: "Very Long", longName: "Very Long"},
                                //true_false:{type: "true_false", shortName: "True False", longName: "True False"},
                                //fill_in_the_blanks:{type: "fill_in_the_blanks", shortName: "Fill in the blanks", longName: "Fill in the blanks"},
                                //assertion_and_reason:{type: "assertion_and_reason", shortName: "Assertion and Reason", longName: 'Assertion and Reason'},
                            }

export const QuestionTypeNames = [
                                {id: 1, type:'SCQ', shortName:'SCQ', longName:'Single Choice Question'},
                                {id: 2, type:'MCQ', shortName:'MCQ', longName:'Multiple Choice Question'},
                                {id: 3, type:'Integer', shortName:'Numerical', longName:'Numerical'},
                                {id: 4, type:'paragraph_scq', shortName:'Paragraph SCQ', longName:'Paragraph SCQ'},
                                {id: 5, type:'paragraph_mcq', shortName:'Paragraph MCQ', longName:'Paragraph MCQ'},
                                // {id: 6, type:'Descriptive', shortName:'Descriptive', longName:'Descriptive'},
                                //{id: 7, type:'mtc_scq', shortName:'MTC-SCQ', longName:'MTC-SCQ'},    
                                // {id: 8, type:'mtc_mcq', shortName:'MTC-MCQ', longName:'MTC-MCQ'},
                                // {id: 9, type: "very_short", shortName: "Very Short", longName: "Very Short"},
                                // {id: 10, type: "short", shortName: "Short", longName: "Short"},
                                // {id: 11, type: "long", shortName: "Long", longName: "Long"},
                                // {id: 12, type: "very_long", shortName: "Very Long", longName: "Very Long"},
                                //{id: 13, type: "true_false", shortName: "True False", longName: "True False"},
                                //{id: 14, type: "fill_in_the_blanks", shortName: "Fill in the blanks", longName: "Fill in the blanks"},
                                //{id: 15, type: "assertion_and_reason", shortName: "Assertion and Reason", longName: 'Assertion and Reason'},
                            ]

export const QuestionTypesStatic = [
    {id: 1, type: "scq", name: "SCQ", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    {id: 2, type: "mcq", name: "MCQ", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    {id: 3, type: "int_type", name: "Integer", defaultSize: []},
    {id: 4, type: "paragraph_scq", name: "paragraph_scq", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    {id: 5, type: "paragraph_mcq", name: "paragraph_mcq", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    // {id: 6, type: "Descriptive", name: "Descriptive", defaultSize: []},
    //{id: 7, type: "mtc_scq", name: "mtc_scq", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    // {id: 8, type: "mtc_mcq", name: "mtc_mcq", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
    // {id: 9, type: "very_short", name: "very_short", defaultSize: []},
    // {id: 10, type: "short", name: "short", defaultSize: []},
    // {id: 11, type: "long", name: "long", defaultSize: []},
    // {id: 12, type: "very_long", name: "very_long", defaultSize: []},
    //{id: 13, type: "true_false", name: "true_false", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}]},
    //{id: 14, type: "fill_in_the_blanks", name: "fill_in_the_blanks", defaultSize: []},
    //{id: 15, type: "assertion_and_reason", name: "assertion_and_reason", defaultSize: [{id: Math.random(), index: 1}, {id: Math.random(), index: 2}, {id: Math.random(), index: 3}, {id: Math.random(), index: 4}]},
]

export const QTConstant = {
    "SCQ": "SCQ", //1
    "MCQ": "MCQ", //2
    "INTEGER": "Integer", //3
    "PARAGRAPH_SCQ": "paragraph_scq", //4
    "PARAGRAPH_MCQ": "paragraph_mcq", //5
    //"MTC_SCQ": "mtc_scq", //7
    // "MTC_MCQ": "mtc_mcq", //8
    // "DESCRIPTIVE": "Descriptive", //6
    // "VERY_SHORT": "very_short", //9 
    // "SHORT": "short", //10 
    // "LONG": "long", //11
    // "VERY_LONG": "very_long", //12
    //"TRUE_FALSE": "true_false", //13
    //"FILL_IN_THE_BLANKS": "fill_in_the_blanks", //14
    //"ASSERTION_AND_REASON": "assertion_and_reason", //15
}

export default function questionTypeName (type, name) {
    return  name ? QuestionTypes[type] ? QuestionTypes[type][name] : type : QuestionTypes[type].shortName
}

export function findQuestionById (id) {
    return _.get(_.find(QuestionTypesStatic, s => s.id == id), 'name', '')  
}

export function findQuestionByName (name) {
    return _.get(_.find(QuestionTypesStatic, s => s.name == name), 'name', '')  
}

// export function checkQuestionVerify(question) {
//     return checkQuestionEditableSchoolId(sessionStorage[SESSION_STORAGE_KEYS.ENCODED_SCHOOL_ID]) ? false : question.slVerified ? true : false 
// }

const checkQuestionEditableSchoolId = memoizeOne((school_id) => {
    school_id = school_id ? atob(school_id) : null
    return school_id == null || school_id == "2YR8JEybyKgkVmNK" || school_id == "P7oAWNEq3dx2v9Y0";// || school_id == "R65qzGLO5gDYvrnN";
})

export function incorrectQuestion(que){
    if(!que.question.en && !que.question.hn){
        Object.assign({}, que, {errors:'no_question'})
    }
    else{
        if(!que.type){
            Object.assign({}, que, {errors:'no_question_type'})
        }
        else if(_.findIndex(QuestionTypesStatic, q => q.name == que.type) == -1){
            Object.assign({}, que, {errors:'wrong_question_type'})
        }
        else{
            if(que.type == 'SCQ' || que.type == 'mtc_scq' || que.type == 'true_false'){
                let errors = ""
                if(que.options.length == 0){
                    errors += 'no_options'
                }
                else if(que.options.length == 1){
                    errors += 'more_options_required'
                }
                
                if(que.answer.length > 1){
                    errors += 'multiple_answers'
                }
                return Object.assign({}, que, {errors})
            }
            else if(que.type == 'MCQ'){
                if(que.options.length == 0){
                    Object.assign({}, que, {errors:'no_options'})
                }
                else if(que.options.length == 1){
                    Object.assign({}, que, {errors:'more_options_required'})
                }
            }
            else if(que.type == 'Integer'){
                if(que.options.length){
                    Object.assign({}, que, {errors:'no_options_required'})
                }
                else if(que.answer.length > 2){
                    Object.assign({}, que, {errors:'integre_type'})
                }
                else if(que.answer.length && !_.isNumber(parseFloat(que.answer[0]))){
                    Object.assign({}, que, {errors:'answer_not_numeric'})
                }
            }
            else if(que.type == 'Descriptive' || que.type == 'very_short' || que.type == 'short' || que.type == 'long' || que.type == 'very_long' || que.type == 'fill_in_the_blanks' ){
                if(que.answer.length > 1){
                    Object.assign({}, que, {errors:'multiple_answers'})
                }
                if(que.options.length){
                    Object.assign({}, que, {errors:'no_options_required'})
                }
            }
        }
    }

    return que

}

export const QUESTION_ERRORS = {
    no_question:'No question',
    no_options:'Options required',
    no_options_required:'Options not required',
    more_options_required:'More options required',
    multiple_answers:'single answer required',
    integre_type:'single answer or range required',
    answer_not_numeric:'Answer is not Number',
    wrong_question_type: 'Question Type is wrong',
    no_question_type: 'Question type required' 
}

export function getTestProgressColor(status) {
    return (
        status == "completed" ? "#9CCC65" :
        status == "in-progress" ? "#E5C71B" :
        "#7D8F98"
    )
}

export const answerTypes = {
    paragraph:['paragraph_mcq', 'paragraph_scq'],
    multiple:['MCQ', 'SCQ', 'mtc_mcq', 'mtc_scq', 'true_false', 'assertion_and_reason'],
    descriptive:['Descriptive', 'short', 'long', 'very_short', 'very_long', 'fill_in_the_blanks'],
    number:['Integer'] 
}

export const findAnswerType = (type) => {
    return _.findKey(answerTypes,types => _.findIndex(types,t => t == type) != -1)
}

export function formatNumberFloatInteger(number, nonNumberValue = '') {
  if(number == null  || number == undefined || number === '') {
    return nonNumberValue
  } 
  return Number.isInteger(parseFloat(number)) ? parseInt(number) : _.round(parseFloat(number), 2)
}

export const colorArray = [
    'magenta', 'blue', 'green', 'red', 'orange', 'geekblue'
]
