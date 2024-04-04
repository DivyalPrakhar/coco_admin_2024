import { Card, Space, Statistic, Typography, Divider } from 'antd'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getDashboardAciton } from '../../redux/reducers/dashboard';
import { STATUS } from '../../Constants';
import { PieCart } from './PieChart';

export const HomeDashboard = () => {
    const dispatch = useDispatch()

    const {dashboardData, getDashboardStatus} = useSelector(state => ({
        dashboardData:state.dashboard.dashboardData,
        getDashboardStatus:state.dashboard.getDashboardStatus
    }))

    useEffect(() => {
        dispatch(getDashboardAciton())
    }, [dispatch])

    return(
        getDashboardStatus === STATUS.FETCHING ?
            <Card loading={getDashboardStatus === STATUS.FETCHING}></Card>
            :getDashboardStatus === STATUS.SUCCESS && dashboardData ?
                <div>
                    <div style={{dispatch:'flex'}}>
                        <TestCard data={dashboardData.testStats}/>
                        <UserCard data={dashboardData.userStats}/>
                    </div>
                    <div style={{display:'flex'}}>
                        <CourseCard data={dashboardData.coursesStats}/>
                        <PackageCard data={dashboardData.packageStats}/>
                    </div>
                </div>
                :
                <Typography.Text>Something went wrong</Typography.Text>
    )
}

const UserCard = ({data}) => {
    return(
        <div style={{padding:10, flexGrow:1}}>
            <Card title='Users'>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <Statistic title='Total Users' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalUsers} />
                    {/* <Statistic title='Total Students' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalStudents}/> */}
                    <Statistic title='Total Enrolled Students' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalEnrolledStudents}/>
                    <Statistic title='New Users Today' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.newUsersToday}/>
                    <Statistic title='Total Users Purchased' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalUserPurchasedToday}/>
                </div>
            </Card>
        </div>
    )
}

const TestCard = ({data}) => {
    return(
        <div style={{padding:10, flexGrow:1}}>
            <Card title='Tests'>
                <div style={{display:'flex', flexWrap:'wrap'}}>
                    <Statistic title='Total Tests' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalTests} />
                    <Statistic title='Total Test Started' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalTestStarted}/>
                    <Statistic title='Total Ready Tests' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalReadyTests}/>
                    <Statistic title='Total Result Published Tests' valueStyle={{fontSize:30}} style={{margin:'0 20px'}} value={data.totalResultPublishedTests}/>
                </div>
            </Card>
        </div>
    )
}

const PackageCard = ({data}) => {
    let chartData = [{type:'Published', value:parseInt(data.totalPublished)}, 
        {type:'Not Published', value:parseInt(data.totalPackages) -parseInt(data.totalPublished)}
    ]
    
    return(
        <div style={{padding:10, flexGrow:1}}>
            <Card title='Packages'>
                <Space size={'large'}>
                    <div style={{padding:'0 5px', borderRight:'1px solid #D6DBDF'}}>
                        <PieCart data={chartData}/>
                    </div>
                    <Divider type='vertical'/>
                    <div style={{padding:20}}>
                        <Statistic title='Total Packages' value={data.totalPackages}/>
                        <br/>
                        <Statistic title='Expiring Today' value={data.expiringToday}/>
                    </div>
                </Space>
            </Card>
        </div>
    )
}

const CourseCard = ({data}) => {
    let chartData = [{type:'Active', value:data.totalActiveCourses}, {type:'Ready', value:data.totalReadyCourses}]
    
    return(
        <div style={{padding:10, flexGrow:1}}>
            <Card title='Courses'>
                <Space size={'large'}>
                    <div style={{padding:'0 5px', borderRight:'1px solid #D6DBDF'}}>
                        <PieCart data={chartData}/>
                    </div>
                    <div style={{padding:20}}>
                        <Statistic title='Total Courses' value={data.totalCourses}/>
                        <br/>
                        <Statistic title='Expiring Today' value={data.expiringToday}/>
                    </div>
                </Space>
            </Card>
        </div>
    )
}

