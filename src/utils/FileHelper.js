import XLSX from 'xlsx'
import _ from 'lodash';
import { Tag } from 'antd';
import Text from 'antd/lib/typography/Text';
import { useLocation } from 'react-router-dom';

export const isPDF = (mime) => {
  return mime === "application/pdf";
};

export const createBlob = async (base64Data) => {
  let blobfile = await fetch(`${base64Data}`);
  blobfile = await blobfile.blob();
//   console.log("blob", blobfile);
  return blobfile;
};

export const sheetToJSON = (files, onSave) => {

  var selectedFile = files[0]
  let jsonObject
  if(selectedFile){
    let finaldata =[]

      var fileReader = new FileReader()
      fileReader.onload = (e) => {
          var data = e.target.result
          var workbook = XLSX.read(data, {type:'binary'})
        
          workbook.SheetNames.forEach(sheet => {
              let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet], {raw: false, defval: ''})
              onSave(rowObject)
          })
      }
      fileReader.readAsBinaryString(selectedFile)

    }
}

export const checkHtml = strng => {    
  var a = document.createElement('div');
  a.innerHTML = strng;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType == 1) return true; 
  }

  return false
}

export const bilingualText = (obj) =>
  !obj
    ? ""
    : `${obj.en || ""}${obj.en && obj.hn ? " / " : ""}${obj.hn || ""}`;

    
export const setRecentlyUsedTags = (tags) => {
  if(tags.length > 0){
    let currentData = localStorage.getItem('recentTags') ? JSON.parse(localStorage.getItem('recentTags')) : []
    let currentTags = [...tags]
    let newData = []

    // if(currentData.length < 8){
    //   newData = _.uniqBy(_.concat(currentData, _.slice(currentData, 0, (8 - currentData.length))), '_id')
    // }else{
    //   newData = _.slice(currentTags, 0, 8)
    // }

    newData = _.slice(currentTags, 0, 8)

    localStorage.setItem('recentTags', JSON.stringify(newData))
  }
}

export const getRecentlyUsedTags = () => {
  return localStorage.getItem('recentTags') ? JSON.parse(localStorage.getItem('recentTags')) : []
}

export const checkOptionsData = (options, type) => {
  let added = false
  
  let data = options.forEach((item, index, arr) => {
    if(item.en != '' || item.hn != ''){
      added = true
    }  
  })
  return added
}

export const expiryCheck = (start, end) => {
  let currentDate = new Date()
  let startDate = new Date(start)
  let endDate = new Date(end)
  let started = (startDate - currentDate) <= 0
  let expired = (endDate - currentDate) <= 0
  let daysLeftToExpire = started && !expired ? Math.round(Math.abs(endDate.getTime() - currentDate.getTime())/(1000*3600*24)) : 0
  let daysLeftToStart = !started ? Math.round(Math.abs(startDate.getTime() - currentDate.getTime())/(1000*3600*24)) : 0
  
  return daysLeftToStart ? 
      <span color='orange'>{'start in ' + daysLeftToStart + ' days'}</span> 
        : daysLeftToExpire ? <span color='green'>{'expire in '+daysLeftToExpire + ' days' }</span>
          : <span color='red'>expired</span>
}

export const renderMathTex = (id) => {
  window.renderMathInElement(document.getElementById(id || "math-tex-id", {
      delimiters: [
          { left: "$", right: "$", display: true }
      ]
  })); 
}
var COUNTING_ARRAY = [
  '',
  'one ',
  'two ',
  'three ',
  'four ',
  'five ',
  'six ',
  'seven ',
  'eight ',
  'nine ',
  'ten ',
  'eleven ',
  'twelve ',
  'thirteen ',
  'fourteen ',
  'fifteen ',
  'sixteen ',
  'seventeen ',
  'eighteen ',
  'nineteen ',
];
var COUNRING_TEN_ARRAY = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

export const amountToWords = (num) => {
  num = Number(num);
  if ((num = num.toString()).length > 9) return 'overflow';
  if (num === '0') return 'ZERO';
  let n = ('000000000' + num)
    .substr(-9)
    .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  var str = '';
  str +=
    n[1] != 0
      ? (COUNTING_ARRAY[Number(n[1])] ||
          COUNRING_TEN_ARRAY[n[1][0]] + ' ' + COUNTING_ARRAY[n[1][1]]) +
        'crore '
      : '';
  str +=
    n[2] != 0
      ? (COUNTING_ARRAY[Number(n[2])] ||
          COUNRING_TEN_ARRAY[n[2][0]] + ' ' + COUNTING_ARRAY[n[2][1]]) + 'lakh '
      : '';
  str +=
    n[3] != 0
      ? (COUNTING_ARRAY[Number(n[3])] ||
          COUNRING_TEN_ARRAY[n[3][0]] + ' ' + COUNTING_ARRAY[n[3][1]]) +
        'thousand '
      : '';
  str +=
    n[4] != 0
      ? (COUNTING_ARRAY[Number(n[4])] ||
          COUNRING_TEN_ARRAY[n[4][0]] + ' ' + COUNTING_ARRAY[n[4][1]]) +
        'hundred '
      : '';
  str +=
    n[5] != 0
      ? (str != '' ? 'and ' : '') +
        (COUNTING_ARRAY[Number(n[5])] ||
          COUNRING_TEN_ARRAY[n[5][0]] + ' ' + COUNTING_ARRAY[n[5][1]]) +
        ''
      : '';
  return str.toUpperCase();
};


export function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}