import * as XLSX from 'xlsx';
import TBS from './third/TBS';
import SumUp from './third/SumUp';
import React from 'react';

function FileInput(){
    let htmlPages: string[] = [];
    let jsonList: any[] = []; // 存放html页面的数组
    let headers: any[][] = [];
    return(
        <>
            <div className="file-input">
                
                    <label htmlFor="file">上传文件</label>
                    <input type="file" id="file" accept=".xls,.xlsx" />
                    <button onClick={(a) => {
                        a.preventDefault();
                        const fileInput = document.getElementById('file') as HTMLInputElement;
                        const file = fileInput.files?.[0];
                        if (file) {
                           let fileReader = new FileReader();
                            fileReader.onload = function (e) {
                                let workbook = XLSX.read(e.target?.result, {type: 'binary'});
                                var sheetName = workbook.SheetNames; // 获取第一个sheet的名字
                                sheetName.forEach((name) => {
                                    var worksheet = workbook.Sheets[name]; // 读取第一个sheet数据
                                    var jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // 转换成json
                                    var htmlData = XLSX.utils.sheet_to_html(worksheet); 
                                    htmlPages.push(htmlData);
                                    jsonList.push(jsonData);
                                    headers.push(jsonData[0] as any[]);
                                    console.log(jsonData);
                                    console.log(htmlData);
                                })
                            }
                            fileReader.readAsArrayBuffer(file);
                        }
                        fileInput.value = ''
                    }}>上传</button>
                <TBS htmlPages={htmlPages} jsonList={jsonList} headers={headers}/>
            </div>
        </>
    )
}

export default FileInput;