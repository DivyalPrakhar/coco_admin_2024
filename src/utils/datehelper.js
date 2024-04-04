import dayjs from 'dayjs'

export const toServerDate = (date) => {
    
    return dayjs(date).format("YYYY-MM-DD")
} 




export const TimeOptions = [
    {time:"12:00 AM"},
    {time:"12:30 AM"},
    {time:"01:00 AM"},
    {time:"01:30 AM"},
    {time:"02:00 AM"},
    {time:"02:30 AM"},
    {time:"03:00 AM"},
    {time:"03:30 AM"},
    {time:"04:00 AM"},
    {time:"04:30 AM"},
    {time:"05:00 AM"},
    {time:"05:30 AM"},
    {time:"06:00 AM"},
    {time:"06:30 AM"},  
    {time:"07:00 AM"},
    {time:"07:30 AM"},
    {time:"08:00 AM"},
    {time:"08:30 AM"},
    {time:"09:00 AM"},
    {time:"09:30 AM"},
    {time:"10:00 AM"},
    {time:"10:30 AM"},
    {time:"11:00 AM"},
    {time:"11:30 AM"},
    {time:"12:00 PM"},
    {time:"12:30 PM"},
    {time:"01:00 PM"},
    {time:"01:30 PM"},
    {time:"02:00 PM"},
    {time:"02:30 PM"},
    {time:"03:00 PM"},
    {time:"03:30 PM"},
    {time:"04:00 PM"},
    {time:"04:30 PM"},
    {time:"05:00 PM"},
    {time:"05:30 PM"},
    {time:"06:00 PM"},
    {time:"06:30 PM"},  
    {time:"07:00 PM"},
    {time:"07:30 PM"},
    {time:"08:00 PM"},
    {time:"08:30 PM"},
    {time:"09:00 PM"},
    {time:"09:30 PM"},
    {time:"10:00 PM"},
    {time:"10:30 PM"},
    {time:"11:00 PM"},
    {time:"11:30 PM"},
    
  ]