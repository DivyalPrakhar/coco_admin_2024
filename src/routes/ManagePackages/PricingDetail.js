import { CheckCircleOutlined, CheckOutlined, ClockCircleOutlined, EditOutlined, PlusOutlined, VerticalLeftOutlined } from '@ant-design/icons';
import { Alert, AlertIcon } from '@chakra-ui/react';
import { Button, Card, Checkbox, Col, Divider, Form, Input, Modal, Row, Select, Space, Tabs, Tag, Tooltip } from 'antd'
import Text from "antd/lib/typography/Text";
import _ from 'lodash';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { STATUS } from '../../Constants';
import { ErrorMessage } from '../../Constants/CommonAlerts';
import { removePkgSubscriptionAction, updatePackageAction } from '../../redux/reducers/packages';
import { MultipleNotifiction } from './MultipleNotificationTags';

const { Option } = Select;
const LANGUAGES = [{
    title: 'English',
    value: 'english'
}, {
    title: 'Hindi',
    value: 'hindi'
}, {
    title: 'Bilingual',
    value: 'bilingual'
}
]
const DURATION_TYPE = {
    "d": "Days",
    "w": "Weeks",
    "m": "Months",
    "y": "Years"
}

const COLORS = { hindi: "green", english: 'blue', bilingual: 'orange' }

const getDurationValue = (d) => {
    return d?.slice(0, d.length - 1)
}

const getDurationType = (d) => {
    return DURATION_TYPE[d?.slice(d.length - 1)]
}

const getDurationTypeValue = (d) => {
    return d?.slice(d.length - 1);
}

export function PricingDetail(props) {
    const [curPricingMode, setCurPricingMode] = useState('1');

    const { currentPackage } = useSelector(state => ({
        currentPackage: state.packages.currentPackage
    }))


    useEffect(() => {
        if (currentPackage.priceMode === 'sub')
            setCurPricingMode('2')
        else
            setCurPricingMode('1')
    }, [currentPackage])

    return (
        <div style={{ minHeight: '500px' }}>
            <div style={{ marginBottom: '15px' }}>
                <Text style={{ fontWeight: "bold", fontSize: "18px" }}>Package Subscriptions</Text>
            </div>
            <Tabs isLazy activeKey={curPricingMode} onChange={setCurPricingMode}>
                <Tabs.TabPane tab={<div style={{ fontSize: '16px', textAlign: 'center', padding: '3px', width: '50%' }}>Pricing Mode</div>} key="1">
                    <PricingMode />
                </Tabs.TabPane>
                <Tabs.TabPane tab={<div style={{ fontSize: '16px', textAlign: 'center', padding: '3px', width: '50%' }}>Subscription Mode</div>} key="2">
                    <SuscriptionMode />
                </Tabs.TabPane>
            </Tabs>

        </div>
    )
}

const PricingMode = () => {
    const [price, setPrice] = useState({ original: null, fake: null })
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch();

    const { currentPackage, updatePackageStatus } = useSelector(state => ({
        currentPackage: state.packages.currentPackage,
        updatePackageStatus: state.packages.updatePackageStatus
    }))

    useEffect(() => {
        setPrice({ fake: currentPackage.fakePrice, price: currentPackage.price })
    }, [currentPackage])

    useEffect(() => {
        if (updatePackageStatus === STATUS.SUCCESS || updatePackageStatus === STATUS.FAILED) {
            setLoading('')
        }
    }, [updatePackageStatus])

    const handleAddSubscription = () => {
        setLoading('update')
        const data = {
            packageId: currentPackage._id,
            price: price.price,
            fakePrice: price.fake,
            priceMode: 'oneTime'
        }
        dispatch(updatePackageAction(data));
    }

    const activeOneTimeMode = () => {
        setLoading('paymentMode')
        const data = {
            packageId: currentPackage._id,
            priceMode: 'oneTime'
        }
        dispatch(updatePackageAction(data));
    }

    const changePrice = (type, value) => {
        setPrice(pre => ({ ...pre, [type]: value }))
    }

    return (
        <div style={{ marginTop: '15px' }}>

            <Form>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="Discounted Price (which user will pay)"
                            name="price"
                            rules={[{ message: 'Please fill in the field.', required: true }]}
                        >
                            <div>
                                <Input
                                    type="number"
                                    value={price.price}
                                    onChange={(e) => changePrice('price', e.target.value)}
                                    placeholder="Discount Price"
                                    //required
                                    prefix="₹"
                                />
                            </div>
                        </Form.Item>
                    </Col>
                    <Col span={10} offset={2}>
                        <Form.Item
                            label="Original Price"
                            name="fakePrice"
                        // initialValue={packageData.fakePrice}
                        >
                            <div>
                                <Input
                                    type="number"
                                    value={price.fake}
                                    onChange={(e) => changePrice('fake', e.target.value)}
                                    placeholder="Original Price"
                                    prefix="₹"
                                />
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                    <Button loading={updatePackageStatus === STATUS.FETCHING && loading === 'update'} onClick={handleAddSubscription} type='primary'>Update</Button>
                    <Button loading={updatePackageStatus === STATUS.FETCHING && loading === 'paymentMode'} disabled={updatePackageStatus === STATUS.FETCHING || currentPackage.priceMode === 'oneTime'} onClick={activeOneTimeMode} style={{ marginLeft: '10px' }}>{currentPackage.priceMode === 'oneTime' ? <CheckOutlined style={{ marginLeft: '5px' }} /> : 'activate'} one time payment mode {currentPackage.priceMode === 'oneTime' && " activated"}</Button>
                </Row>
            </Form>
        </div>
    )
}

const SuscriptionMode = (props) => {
    const [showSuscriptionModal, setShowSuscriptionModal] = useState(null);
    const [showTrialModal, setShowTrialModal] = useState(false);
    const dispatch = useDispatch();
    const [subscriptionnotification, setSubscriptionNotification] = useState([])
    const [trialnotification, setTrialNotification] = useState(0)
    const [registrationFee, setRegistrationFee] = useState(0)

    const { currentPackage, removePckSubStatus, updatePackageStatus } = useSelector(state => ({
        currentPackage: state.packages.currentPackage,
        removePckSubStatus: state.packages.removePckSubStatus,
        updatePackageStatus: state.packages.updatePackageStatus
    }))


    const handleAddSubscription = (newSubData, updateData, removeSubscription) => {
        const data = {
            packageId: currentPackage._id,
            subscriptions: newSubData,
            subscriptionsUpdate: updateData,
            priceMode: 'sub'
        }
        if (updateData.length > 0 || newSubData.length > 0)
            dispatch(updatePackageAction(data));
        if (removeSubscription?.length > 0) {
            handleRemveSubscriptions(removeSubscription)
        }
        setShowSuscriptionModal(null);
    }

    const handleRemveSubscriptions = (subIds) => {
        dispatch(removePkgSubscriptionAction({ packageId: currentPackage._id, subscriptionIds: subIds }))
    }
    const changePackageRenewable = (value) => {
        dispatch(updatePackageAction({ packageId: currentPackage._id, renewable: value }));
    }

    const activeateSubscriptionMode = () => {
        const data = {
            packageId: currentPackage._id,
            priceMode: 'sub'
        }
        dispatch(updatePackageAction(data));
    }

    const handleNotificationData = () => {
        const data = {
            packageId: currentPackage._id,
            subNotificationDays: subscriptionnotification,
            trialNotificationDays: trialnotification,
            priceMode: 'sub'
        }
        dispatch(updatePackageAction(data));
    }

    useEffect(() => {
        if (currentPackage.subNotificationDays)
            setSubscriptionNotification(currentPackage.subNotificationDays)
        if (currentPackage.trialNotificationDays)
            setTrialNotification(currentPackage.trialNotificationDays)

        setRegistrationFee(currentPackage.subRegistrationFee || 0)
    }, [currentPackage])

    const addRegistrationFee = () => {
        const amount = parseInt(registrationFee)
        if (!registrationFee || (registrationFee && Number.isInteger(amount)))
            dispatch(updatePackageAction({ packageId: currentPackage._id, subRegistrationFee: amount || 0 }));
        else
            ErrorMessage('please provide valid amount')
    }

    return (
        <div>
            <Row style={{ justifyContent: 'space-between' }}>
                <div style={{ width: 300 }}>
                    <Form.Item label='Registration Fees for Subscription'>
                        <Space>
                            <Input value={registrationFee} prefix={'₹'} placeholder='amount' onChange={(e) => setRegistrationFee(e.target.value)} />
                            <Button loading={updatePackageStatus === STATUS.FETCHING} onClick={addRegistrationFee}>Add</Button>
                        </Space>
                    </Form.Item>
                </div>
                <Col>
                    <Button disabled={updatePackageStatus === STATUS.FETCHING || currentPackage.priceMode === 'sub'} onClick={activeateSubscriptionMode} style={{ marginRight: '10px' }}>{currentPackage.priceMode === 'sub' ? <CheckOutlined style={{ marginLeft: '5px' }} /> : 'activate'} subscription mode {currentPackage.priceMode === 'sub' && " activated"}</Button>
                    <Button type='primary' style={{ marginRight: '10px' }} onClick={() => setShowTrialModal(true)}>{currentPackage.trial ? "Edit " : 'Add '} trial</Button>
                    <Button type='primary' disabled={removePckSubStatus === STATUS.FETCHING} onClick={() => setShowSuscriptionModal([])}>Add subscription</Button>
                </Col>
            </Row>
            <div style={{ backgroundColor: 'whitesmoke', margin: '20px 0px', padding: '20px' }}>
                <div>Package Notification Setting</div>
                <Row style={{ margin: '10px 0px', justifyContent: "space-between", alignItems: 'center' }}>

                    <Col gutter={6} style={{ width: '35%' }}>
                        <div>Notification (Package Subscription)</div>
                        <Row gutter={6} style={{ alignItems: 'center' }}>
                            <MultipleNotifiction setPackageNotification={(e) => { setSubscriptionNotification(e) }} DefaultTags={currentPackage.subNotificationDays} />
                        </Row>

                    </Col>

                    <Col gutter={6} style={{ width: '35%' }}>
                        <div>Notification (Package Trial)</div>
                        <Row gutter={6} style={{ alignItems: 'center' }}>
                            <MultipleNotifiction setPackageNotification={setTrialNotification} DefaultTags={currentPackage.trialNotificationDays} />
                        </Row>
                    </Col>

                    <Button type='primary' style={{ marginRight: '10px' }} onClick={handleNotificationData}>Save</Button>
                </Row>
            </div>
            <Form layout="vertical">
                {
                    currentPackage.trial &&
                    <div style={{ border: '2px solid whitesmoke', background: '#fafafa', padding: '8px 10px', marginTop: '10px' }}>
                        <div>

                            <div style={{ margin: '10px 0px' }}>
                                <Row>
                                    <Col>Package trial duration</Col>
                                    <div style={{ marginLeft: '5px' }}>{
                                        currentPackage.trial.active ?
                                            <Tag color='green'>Active</Tag>
                                            :
                                            <Tag color='orange'>Inactive</Tag>
                                    }</div>
                                </Row>
                            </div>
                            <Input
                                value={currentPackage.trial?.durationString && getDurationValue(currentPackage.trial.durationString) + " " + getDurationType(currentPackage.trial.durationString)}
                                disabled={true}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            {
                                _.map(currentPackage.trial.lang, (v, k) => v && (<Tag key={v} style={{ marginRight: '10px' }}>{_.upperFirst(k)}</Tag>))
                            }
                        </div>
                    </div>
                }
                <div style={{ marginTop: '10px' }}>
                    <Form.Item
                        name='renewable'
                    >
                        <>
                            <Checkbox checked={currentPackage.renewable} onChange={(e) => changePackageRenewable(e.target.checked)}>is Renewable</Checkbox>
                        </>
                    </Form.Item>
                </div>
                {
                    currentPackage?.subscriptions?.length > 0 &&
                    <div>
                        <div style={{ fontWeight: 'bold', fontSize: '20px' }}>Package Subscriptions</div>
                        <Divider />
                        {_.map(_.groupBy(currentPackage?.subscriptions, 'durationString'), (subscriptions, key) => {
                            return (
                                <div key={key} style={{ background: 'white', paddingRight: '18px' }}>
                                    <Row style={{ padding: '20px 0px', paddingBottom: '10px', justifyContent: 'space-between' }}>
                                        <Col span={7}>
                                            <Row style={{ flexDirection: 'column', height: '100%' }}>
                                                <div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{getDurationValue(subscriptions[0].durationString) + " " + getDurationType(subscriptions[0].durationString)}</div>
                                                </div>
                                                <div>
                                                    <Button type="primary" style={{ marginTop: '10px' }} onClick={() => setShowSuscriptionModal(subscriptions)}>Edit</Button>
                                                    <Button style={{ marginLeft: '5px' }} onClick={() => handleRemveSubscriptions(_.map(subscriptions, s => s._id))}>Remove</Button>
                                                </div>
                                            </Row>
                                        </Col>
                                        {
                                            _.map(_.groupBy(subscriptions, 'mode'), subscription => (
                                                <Col key={subscription[0].mode} span={7}>
                                                    <Card title={subscription[0].mode} bordered={false}>
                                                        <div>
                                                            {
                                                                _.map(subscription, sub => (
                                                                    <Row style={{ fontSize: '18px' }}>
                                                                        <Col><div style={{ fontWeight: 'bold', marginRight: '5px' }}>₹{sub.price}</div></Col>
                                                                        {sub.fakePrice && <Col><div style={{ color: '#6a6f73', marginRight: '10px' }}><s>₹{sub.fakePrice}</s></div></Col>}
                                                                        <Col><Tag color={COLORS[sub.lang]}>{_.upperFirst(sub.lang)}</Tag></Col>
                                                                        <Col style={{ marginLeft: '5px' }}><Tag>{sub.active ? "Acitve" : "Inactive"}</Tag></Col>
                                                                    </Row>
                                                                ))
                                                            }
                                                        </div>
                                                    </Card>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                    <Divider />
                                </div>
                            )
                        })}
                    </div>
                }
                {
                    showTrialModal &&
                    <EditTrialModal handleCancel={() => setShowTrialModal(false)} currentPackage={currentPackage} />
                }
                {
                    showSuscriptionModal && <AddSubscriptionModal handleAddSubscription={handleAddSubscription} showSuscriptionModal={showSuscriptionModal} handleCancel={() => setShowSuscriptionModal(null)} />
                }
            </Form >
        </div >)
}

const EditTrialModal = ({ handleCancel, currentPackage }) => {
    const [trialDuration, setTrialDuration] = useState('');
    const [lang, setLang] = useState({});
    const [durationType, setDurationType] = useState('d');
    const [active, setActive] = useState(true);
    const dispatch = useDispatch();
    const handleOk = () => {
        const data = {
            packageId: currentPackage._id,
            trial: {
                durationString: trialDuration + durationType,
                lang,
                active
            }
        }
        dispatch(updatePackageAction(data));
        handleCancel();
    }

    const handleChangeLang = (l, check) => {
        setLang(pre => ({ ...pre, [l]: check }))
    }

    useEffect(() => {
        if (currentPackage.trial) {
            if (currentPackage.trial.durationString) {
                setTrialDuration(getDurationValue(currentPackage.trial.durationString))
                setDurationType(getDurationTypeValue(currentPackage.trial.durationString))
            }
            setLang(currentPackage.trial.lang);
            setActive(currentPackage.trial.active)
        }
    }, [currentPackage])

    return (
        <Modal title="Edit trial" visible={true} onOk={handleOk} onCancel={handleCancel}>
            <div style={{ marginBottom: '5px' }}>Duration</div>
            <Input value={trialDuration} onChange={(e) => setTrialDuration(e.target.value)} placeholder='trial duration' addonBefore={<SelectDuration durationType={durationType} setDurationType={setDurationType} />} />
            <div style={{ marginTop: '20px' }}>trial present in languages</div>
            <div style={{ marginTop: '5px' }}>
                <Checkbox checked={lang['hindi']} onChange={(e) => handleChangeLang('hindi', e.target.checked)}>in Hindi</Checkbox>
                <Checkbox checked={lang['english']} onChange={(e) => handleChangeLang('english', e.target.checked)} style={{ marginRight: '10px' }}>in English</Checkbox>
                <Checkbox checked={lang['bilingual']} onChange={(e) => handleChangeLang('bilingual', e.target.checked)} style={{ marginRight: '10px' }}>in Bilingual</Checkbox>
            </div>
            <div style={{ marginTop: '15px' }}>
                <Checkbox checked={active} onChange={(e) => setActive(e.target.checked)}>is active</Checkbox>
            </div>
        </Modal>
    )
}

const AddSubscriptionModal = ({ handleCancel, handleAddSubscription, showSuscriptionModal }) => {
    const MODES = ['online', 'offline'];
    const [mode, setMode] = useState([]);
    const [lang, setLang] = useState([]);
    const [duration, setDuration] = useState('');
    const [durationType, setDurationType] = useState('d')
    useEffect(() => {
        setLang(showSuscriptionModal);
        setMode(_.uniq(_.map(showSuscriptionModal, s => s.mode)))
        if (showSuscriptionModal?.length > 0) {
            setDuration(getDurationValue(showSuscriptionModal[0].durationString))
            setDurationType(getDurationTypeValue(showSuscriptionModal[0].durationString))
        }

    }, [showSuscriptionModal])

    const handleOk = () => {
        let subData = [];
        _.forEach(mode, m => {
            const allLangSub = _.filter(lang, l => l.mode === m);

            const data = _.map(allLangSub, filterLang => {
                const prevData = _.find(showSuscriptionModal, d => d.mode === m && d.lang === filterLang.lang);
                return ({
                    "active": filterLang.active,
                    "price": filterLang.price,
                    "fakePrice": filterLang.fakePrice,
                    "lang": filterLang.lang,
                    "mode": m,
                    "durationString": duration + durationType,
                    "subscriptionId": prevData?._id
                })
            }
            );
            subData = [...subData, ...data]
        })

        let changeData = _.filter(subData, s => {
            const prevData = _.find(showSuscriptionModal, d => d.mode === s.mode && d.lang === s.lang);
            if (!prevData) return true;
            return prevData.price === s.price && prevData.fakePrice === s.fakePrice && prevData.active === s.active ? false : true;
        });
        const notValidSubscriptions = _.find(changeData, d => !d.fakePrice)
        if (notValidSubscriptions) {
            return (<Alert type='error' message='error' descrsiption='Discount Price could not be empty' />)
        }
        let removeSubscription = _.filter(showSuscriptionModal, s => !_.find(subData, sd => sd.mode === s.mode && sd.lang === s.lang));
        handleAddSubscription(_.filter(changeData, s => !s.subscriptionId), _.filter(changeData, s => s.subscriptionId), _.map(removeSubscription, s => s._id));
    }
    const changeMode = (m) => {
        if (isModeOn(m)) {
            setMode(_.filter(mode, md => md !== m))
        } else {
            setMode([...mode, m]);
        }
    }

    const changeLanguage = (m, l) => {
        if (isLangSelected(m, l)) {
            setLang(_.filter(lang, la => la.mode !== m || la.lang !== l))
        } else {
            let preData = _.find(showSuscriptionModal, s => s.mode === m && s.lang === l);
            setLang([...lang, preData ? preData : { mode: m, lang: l, active: true }])
        }
        // console.log("mmmddm",, lang)
    }

    const changeAmount = (type, value, m, l) => {
        setLang(_.map(lang, la => la.mode === m && la.lang === l ? { ...la, [type]: value } : la))
    }

    const getAmount = (amtType, m, l) => {
        const fLang = _.find(lang, la => la.mode === m && la.lang === l);
        if (!fLang) return null;
        return fLang[amtType];
    }

    const isLangSelected = (m, l) => {
        return _.find(lang, la => la.mode === m && la.lang === l) ? true : false;
    }

    const isModeOn = (m) => {
        return _.find(mode, md => md === m) ? true : false;
    }

    const isActive = (m, l) => {
        return _.find(lang, la => la.mode === m && la.lang === l) ? _.find(lang, la => la.mode === m && la.lang === l)?.active : true;
    }
    return (
        <Modal title="Add subscription" visible={true} onOk={handleOk} onCancel={handleCancel}>
            <div>
                <div style={{ marginBottom: '10px' }}>
                    <Form layout="vertical">
                        <Form.Item
                            name="duration"
                            label="Duration(days)"
                            required
                        >
                            <>
                                <Input
                                    type="number"
                                    addonBefore={<SelectDuration durationType={durationType} setDurationType={setDurationType} disabled={showSuscriptionModal?.length > 0} />}
                                    value={duration}
                                    disabled={showSuscriptionModal?.length > 0}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                            </>
                        </Form.Item>
                        <Form.Item
                            label="Mode"
                        >
                            {
                                _.map(MODES, m => {
                                    return (
                                        <div>
                                            <div><Checkbox checked={isModeOn(m)} onChange={() => changeMode(m)}>{m}</Checkbox></div>
                                            {
                                                isModeOn(m) &&
                                                <div style={{ paddingLeft: '10px', marginBottom: '5px', marginLeft: '5px', marginTop: '10px', borderLeft: '2px solid #2566e8' }}>
                                                    <Row>
                                                        {_.map(LANGUAGES, l => {
                                                            const isCurActive = isActive(m, l.value);
                                                            return (
                                                                <Col key={l.value} span={12} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                                                    <div>
                                                                        <Checkbox checked={isLangSelected(m, l.value)} onChange={() => changeLanguage(m, l.value)}>{l.title}</Checkbox>
                                                                    </div>
                                                                    {
                                                                        isLangSelected(m, l.value) &&
                                                                        <div style={{ marginTop: '10px' }}>
                                                                            <div>
                                                                                <Tooltip placement="bottom" title="Original price">
                                                                                    <Input addonBefore="₹" type='number' value={getAmount('fakePrice', m, l.value)} onChange={(e) => changeAmount('fakePrice', e.target.value, m, l.value)} placeholder='Original price' />
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div style={{ marginBottom: '10px' }}>
                                                                                <Tooltip placement="bottom" title="Discounted price">
                                                                                    <Input addonBefore="₹" type='number' value={getAmount('price', m, l.value)} onChange={(e) => changeAmount('price', e.target.value, m, l.value)} placeholder='Discounted price' />
                                                                                </Tooltip>
                                                                            </div>
                                                                            <div style={{ marginTop: '5px' }}>
                                                                                <Button type={isCurActive && "primary"} onClick={() => changeAmount("active", !isCurActive, m, l.value)} size="small">
                                                                                    {isCurActive ? "Active" : 'Inactive'}
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </Col>
                                                            )
                                                        }
                                                        )
                                                        }
                                                    </Row>
                                                </div>
                                            }
                                        </div>)
                                })
                            }
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}

const SelectDuration = ({ durationType, setDurationType, disabled }) => {
    return (
        <Select disabled={disabled} value={durationType} onChange={e => { setDurationType(e); }} className="select-after">
            {
                _.map(DURATION_TYPE, (v, k) =>
                    <Option key={k} value={k}>{v}</Option>)
            }
        </Select>
    );
}
