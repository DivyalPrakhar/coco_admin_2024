import { Divider } from 'antd'
import Text from 'antd/lib/typography/Text'
import Title from 'antd/lib/typography/Title'
import React, {useEffect} from 'react'
import _ from "lodash";
import { answerTypes, QuestionTypes } from '../../utils/QuestionTypeHelper';
import { renderMathTex } from '../../utils/FileHelper';

let availableWidth = 570
let halfPageWidth = availableWidth/2
let centerWidth = 30
let halfbillingual = (halfPageWidth - centerWidth/2)

export const TestPaperPrint = ({test, user, bilingual, showAnswer, showSolution, questionsIndexing, notPrint}) => {

    const checkAnswerType = (type) => {
        return _.findKey(answerTypes,types => _.findIndex(types,t => t == type) != -1)
    }

    const renderFun = () => {
        if(!notPrint){
            setTimeout(()=> renderMathTex('math-tex'), 200)
        }else{
            renderMathTex('math-tex-not-print')
        }
    }

    useEffect(() => {
        renderFun()
    })

    let lastIndex = 0
    let currentTest = test
    let subjects = questionsIndexing && currentTest ?  
                _.orderBy(currentTest.sections, ['order'], ['asc']).map(sec => ({...sec, questionTypeGroup:_.orderBy(sec.questionTypeGroup, ['order'], ['asc']).map(grp => 
                    ({...grp, questions:sec.questions.length ? _.orderBy(_.filter(sec.questions,que => que.type?.questionGroupId == grp._id), ['order'], ['asc']) : []}))})
                ).map(sec => ({...sec, questions:_.flatMap(sec.questionTypeGroup,grp => _.map(grp.questions,(que) => que)).map((que, i) => ({...que, finalSequence:++i}))}))
                .map(sec => ({...sec, questionTypeGroup:sec.questionTypeGroup.map(grp => ({...grp, questions:_.filter(sec.questions,q => q.type?.questionGroupId == grp._id)}))}))
                :
                _.orderBy(currentTest.sections, ['order'], ['asc']).map(sec => ({...sec, questionTypeGroup:_.orderBy(sec.questionTypeGroup, ['order'], ['asc']).map(grp => 
                    ({...grp, questions:sec.questions.length ? _.orderBy(_.filter(sec.questions,que => que.type?.questionGroupId == grp._id), ['order'], ['asc']) : []}))})
                ).map(sec => ({...sec, questions:_.flatMap(sec.questionTypeGroup,grp => _.map(grp.questions,(que) => que)).map((que) => ({...que, finalSequence:++lastIndex}))}))
                .map(sec => ({...sec, questionTypeGroup:sec.questionTypeGroup.map(grp => ({...grp, questions:_.filter(sec.questions,q => q.type?.questionGroupId == grp._id)}))}))
    
    // const subjects = currentTest ? _.orderBy(currentTest.sections, ['order'], ['asc']).map(sec => 
    //         ({...sec,questionTypeGroup:sec.questionTypeGroup.map(grp => { 
    //             let questionsList =  _.orderBy(sec.questions, ['order'], ['asc']).map((q, i) => ({...q, index:++i}))
    //             console.log('ques', questionsList)
    //             return ({...grp, questions:_.filter(questionsList,que => que.type?.questionGroupId === grp._id)})
    //         })})
    //     ) : []

    let singleColumn = bilingual.languages.length === 1 || !bilingual.column
    let questionWidth = bilingual.column ? '50%' : '100%'
    let direction = bilingual.column ? 'row' : 'column'
    return(
            <div style={{width: (availableWidth)+"pt", height:'100%'}} id={notPrint ? 'math-tex-not-print' : "math-tex"} className={'paper-watermark'}>
                <table style={{padding:0, margin:0, width:'100%'}}>
                    <thead>
                        <tr>
                            <td>

                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <TestPaperHeader user={user.user} test={currentTest}/>
                                <Divider style={{margin:'10px'}}/>
                                <div>
                                    <div id='testName' style={{textAlign:'center'}}>
                                        <span style={{padding:'10px', border:'1px solid #AEB6BF', background:'#F8F9F9', borderRadius:'5px'}}>
                                            <Text style={{fontWeight:'bold', fontSize:'18px'}}>{test?.name?.en}</Text>
                                        </span>
                                    </div>
                                    <div id='instructions' style={{padding:'20px 0'}}>
                                        {currentTest && currentTest.instruction && currentTest.instruction && (currentTest.instruction.description.en || currentTest.instruction.description.hn) ? 
                                            <Instructions data={currentTest.instruction}/> : null
                                        }
                                    </div>
                                    <div>
                                        {subjects?.length ?
                                            subjects.map((subj, subjIndx) =>
                                                <div key={subj._id} style={{pageBreakBefore:subjIndx ? 'always' : ''}}>
                                                    <Title style={{textAlign:'center'}} level={3}>{subj.subjectRefId.name.en}</Title>
                                                    {subj.questionTypeGroup.length ? 
                                                        subj.questionTypeGroup.map(grp => 
                                                            
                                                            checkAnswerType(grp.type) == 'multiple' ?
                                                                
                                                                <div key={grp._id} id='group' style={{marginBottom:'40px'}}>
                                                                    <TypeHeading type={grp.type}/>
                                                                    <div>
                                                                        {grp.questions?.length ? 
                                                                            grp.questions.map((que, i) =>
                                                                                <div id='question' key={que._id} className='avoid-breakline' 
                                                                                    style={{margin:'20px 0', display:'flex', flexDirection:direction}}
                                                                                >
                                                                                    {bilingual.languages.map((lang, langIndx) =>
                                                                                        que.questionRefId.question[lang] ?
                                                                                            <div key={langIndx} style={{padding:'10px 0', width:questionWidth}}>
                                                                                                
                                                                                                <Question lang={lang} showAnswer={showAnswer} langIndx={langIndx} singleColumn={singleColumn} que={que}
                                                                                                    questionType={checkAnswerType(grp.type)} showSolution={showSolution}
                                                                                                />
                                                                                                {/* {showSolution && 
                                                                                                    <div style={{display:'flex'}}>
                                                                                                        <div style={{width:singleColumn ? '9%' : '18%', fontWeight:'bold'}}>Sol.</div>
                                                                                                        <div>
                                                                                                            {que.questionRefId.solution ? <Solution lang={lang} solution={que.questionRefId.solution}/> : '-' }
                                                                                                        </div>
                                                                                                    </div>
                                                                                                } */}
                                                                                            </div>
                                                                                        :
                                                                                        null
                                                                                    )} 
                                                                                </div>
                                                                            )
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                </div>

                                                            :

                                                            checkAnswerType(grp.type) == 'descriptive' ?

                                                                <div key={grp._id} id='grp' style={{marginBottom:'40px'}}>
                                                                    <TypeHeading type={grp.type}/>
                                                                    <div>
                                                                        {grp.questions?.length ? 
                                                                            grp.questions.map((que, i) =>
                                                                                <div id='question' key={que._id} className='avoid-breakline' 
                                                                                    style={{margin:'20px 0', display:'flex', flexDirection:direction}}
                                                                                >
                                                                                    {bilingual.languages.map((lang, langIndx) => 
                                                                                        que.questionRefId.question[lang] ?
                                                                                            <div key={langIndx} style={{padding:'10px 0', width:questionWidth}}>
                                                                                                
                                                                                                <Question lang={lang} singleColumn={singleColumn} langIndx={langIndx} que={que}
                                                                                                    questionType={checkAnswerType(grp.type)} showSolution={showSolution}
                                                                                                    showAnswer={showAnswer}
                                                                                                />
                                                                                            </div>
                                                                                            :
                                                                                            null
                                                                                    )} 
                                                                                </div>
                                                                            )
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                </div>
                                                            :

                                                            checkAnswerType(grp.type) == 'number' ?

                                                                <div key={grp._id} id='grp' style={{marginBottom:'40px'}}>
                                                                    <TypeHeading type={grp.type}/>
                                                                    <div>
                                                                        {grp.questions?.length ? 
                                                                            grp.questions.map((que, i) =>
                                                                                <div id='question' key={que._id} className='avoid-breakline' 
                                                                                    style={{margin:'20px 0', display:'flex', flexDirection:direction}}
                                                                                >
                                                                                    {bilingual.languages.map((lang, langIndx) => 
                                                                                        que.questionRefId.question[lang] ?
                                                                                            <div key={langIndx} style={{padding:'10px 0', width:questionWidth}}>
                                                                                                <Question  singleColumn={singleColumn} lang={lang} langIndx={langIndx} que={que}
                                                                                                    questionType={checkAnswerType(grp.type)} showSolution={showSolution} showAnswer={showAnswer}
                                                                                                />
                                                                                            </div>
                                                                                            :
                                                                                            null
                                                                                    )} 
                                                                                </div>
                                                                            )
                                                                            :
                                                                            null
                                                                        }
                                                                    </div>
                                                                </div>

                                                            :

                                                            checkAnswerType(grp.type) == 'paragraph' ?

                                                                <div key={grp._id} id='grp' style={{marginBottom:'40px'}}>
                                                                    <TypeHeading type={grp.type}/>
                                                                    <br/>
                                                                    {_.isEmpty(_.groupBy(grp.questions,q => q.questionRefId.paragraph._id)) ? null :
                                                                        _.map(_.groupBy(grp.questions,q => q.questionRefId.paragraph._id), (dueGrp, i) => 
                                                                            <div key={i}>
                                                                                {singleColumn ? 
                                                                                    <div>
                                                                                        <b>Paragraph</b><br/>
                                                                                        <div dangerouslySetInnerHTML={{__html:dueGrp[0] ? dueGrp[0].questionRefId.paragraph.body.en : '-'}}/>
                                                                                    </div>
                                                                                    :
                                                                                    <div style={{margin:'20px 0', display:'flex', flexDirection:direction}}>
                                                                                        <div style={{width:questionWidth}}>
                                                                                            <b>Paragraph</b><br/>
                                                                                            <div dangerouslySetInnerHTML={{__html:dueGrp[0] ? dueGrp[0].questionRefId.paragraph.body.en : '-'}}/>
                                                                                        </div>
                                                                                        <div style={{width:questionWidth}}>
                                                                                            <b>अनुच्छेद</b><br/>
                                                                                            <div dangerouslySetInnerHTML={{__html:dueGrp[0] ? dueGrp[0].questionRefId.paragraph.body.hn : '-'}}/>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                                {dueGrp.length ?
                                                                                    dueGrp.map((que, indx) => 
                                                                                        <div id='question' key={que._id} className='avoid-breakline' 
                                                                                            style={{margin:'20px 0', display:'flex', flexDirection:direction}}>
                                                                                            {bilingual.languages.map((lang, langIndx) => 
                                                                                                que.questionRefId.question[lang] ?
                                                                                                    <div key={langIndx} style={{padding:'10px 0', width:questionWidth}}>
                                                                                                        <Question singleColumn={singleColumn} lang={lang} langIndx={langIndx} que={que}
                                                                                                            questionType={checkAnswerType(grp.type)} showSolution={showSolution}
                                                                                                            showAnswer={showAnswer}
                                                                                                        />
                                                                                                        
                                                                                                        {/* <div style={{display:'flex'}}>
                                                                                                            <div style={{width:'70px', fontWeight:'bold'}}></div>
                                                                                                            <div>
                                                                                                                {que.questionRefId.options?.length ? <Options showAnswer={showAnswer && que.questionRefId.answer} lang={lang} options={que.questionRefId.options}/> : null }
                                                                                                            </div>
                                                                                                        </div> */}
                                                                                                        {/* {showSolution && 
                                                                                                            <div style={{display:'flex'}}>
                                                                                                                <div style={{width:'70px', fontWeight:'bold'}}>Sol.</div>
                                                                                                                <div>
                                                                                                                    {que.questionRefId.solution ? <Solution lang={lang} solution={que.questionRefId.solution}/> : '-' }
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        } */}
                                                                                                    </div>
                                                                                                    :
                                                                                                    null
                                                                                            )} 
                                                                                        </div>
                                                                                    )
                                                                                    : null
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                </div>
                                                            :
                                                            null
                                                        )
                                                        :
                                                        null
                                                    }
                                                </div>
                                            )
                                            :
                                            null
                                        }
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    )
}

const Instructions = ({data}) => {
    return(
        <div>
            <Text style={{fontWeight:'bold', fontSize:'16px'}}>Instructions</Text>
            <div dangerouslySetInnerHTML={{__html:data.description.en}}/>
            <br/>
            <div dangerouslySetInnerHTML={{__html:data.description.hn}}/>
        </div>
    )
}

const TestPaperHeader = ({user, test}) => {
    return(
        <div id='header' style={{textAlign:'center'}}>
            <Title level={2}>{user?.staff?.institute.name}</Title>
            <div>{user?.staff?.institute.address}</div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
                <div style={{textAlign:'left'}}>
                    {/*<div><b>Date:</b> {}</div>*/}
                    <div><b>Time:</b> {test.totalTime+' min'}</div>
                </div>
                <div>
                    <b>Max. Marks:</b> {test.maxMarks}
                </div>
            </div>
        </div>
    )
}

const Solution = ({solution, lang}) => {
    return(
        <>
            <div dangerouslySetInnerHTML={{__html:solution[lang]}}/>
        </>
    )
}

const Answer = ({answer, lang, singleColumn}) => {
    return(
        <div style={{display:'flex'}}>
            <div style={{width:singleColumn ? '9%' : '18%', fontWeight:'bold'}}>Ans.</div>
            <div style={{width:singleColumn ? '91%' : '82%', flexGrow:1}}>
                <div dangerouslySetInnerHTML={{__html:answer[0]}}/>
                
            </div>
        </div>
    )
}

const Options = ({options, lang, showAnswer}) => {
    return(
        <div style={{display:'flex', flexWrap:'wrap', flexDirection:'column'}}>
            {options.map(opt => 
                <div style={{display:'flex', marginRight:'30px'}} key={opt._id}>
                    <div style={{paddingRight:'10px'}}><b>({_.lowerCase(opt.key[lang])})</b></div>
                    {showAnswer && _.findIndex(showAnswer,d => d == opt._id) != -1 ? 
                        <div style={{border:'1px solid #AEB6BF', borderRadius:'5px', padding:'0 5px' }}><div dangerouslySetInnerHTML={{__html:opt.body[lang]}}/></div>
                        :
                        <div><div dangerouslySetInnerHTML={{__html:opt.body[lang]}}/></div>
                    }
                </div>
            )}
        </div>
    )
} 

const Question = ({que, lang, langIndx, singleColumn, showAnswer, questionType, showSolution}) => {
    return (
        <div>
            <div style={{display:'flex', width:'100%'}}>
                <div style={{width:singleColumn ? '9%' : '18%', fontWeight:'bold'}}>{langIndx == 1 ? null : `Que ${que.finalSequence}.`}</div>
                <div style={{width:singleColumn ? '91%' : '82%', flexGrow:1}}>
                    <div dangerouslySetInnerHTML={{__html:que.questionRefId.question[lang]}}/>
                    {(questionType === 'multiple' || questionType === 'paragraph') && que.questionRefId.options?.length ?
                        <div>
                            <Options showAnswer={showAnswer && que.questionRefId.answer} lang={lang} options={que.questionRefId.options}/>    
                        </div>
                        : null 
                    }
                </div>
            </div>
            {(questionType === 'number' || questionType === 'descriptive') && showAnswer &&
                <Answer singleColumn={singleColumn} answer={que.questionRefId.answer}/>
            }
            {showSolution && 
                <div style={{display:'flex', width:'100%'}}>
                    <div style={{width:singleColumn ? '9%' : '18%', fontWeight:'bold'}}>Sol.</div>
                    <div style={{width:singleColumn ? '91%' : '82%', flexGrow:1}}>
                        {que.questionRefId.solution ? <Solution lang={lang} solution={que.questionRefId.solution}/> : '-' }
                    </div>
                </div>
            }
        </div>
    )
}

const TypeHeading = ({type}) => {
    return(
        <div style={{padding:'5px 10px', borderRadius:'5px', background:'#EAEDED'}}>
            <b>{QuestionTypes[type]?.shortName}</b>
        </div>
    )
}