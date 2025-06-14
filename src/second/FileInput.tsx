import * as XLSX from 'xlsx';
import TBS from './third/TBS';
import { useEffect, useState } from 'react';


function FileInput(){
    //let htmlPages: string[] = [];
    const [htmlPages, setHtmlPages] = useState<string[]>([]);
    //let jsonList: any[] = []; // 存放html页面的数组
    //let headers: any[][] = [];
    const [jsonList, setjsonList] = useState<any[]>([]);
    const [headers,setheaders ] = useState<any[][]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [howTo, setHowTo] = useState(0);
    useEffect(() => {
        setRefreshKey(prevKey => prevKey + 1);// 当data更新时，更新refreshKey来触发子组件的重新渲染
        let selectElement = document.getElementById('howTo') as HTMLSelectElement;
        if (selectElement) {
            var selectedValue = selectElement.options[selectElement.selectedIndex].value;
            if (selectedValue === '1') {
                setHowTo(1);
            }else{
                setHowTo(1);
            }
        }
        
      }, [htmlPages]);
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
                                    //htmlPages.push(htmlData);
                                    setHtmlPages(prevPages => [...prevPages, htmlData]);
                                    //jsonList.push(jsonData);
                                    setjsonList(prevList => [...prevList, jsonData]);
                                    //headers.push(jsonData[0] as any[]);
                                    setheaders(prevHeaders => [...prevHeaders, jsonData[0] as any[]]);
                                })
                            }
                            fileReader.readAsArrayBuffer(file);
                        }
                        fileInput.value = ''
                    }}>上传</button>
                    <br></br>
                    <label htmlFor="howTo">选择分析方式</label>
                    <select id="howTo">
                        <option value="1">上传分数组成表格</option>
                    </select>
                
                <TBS htmlPages={htmlPages} jsonList={jsonList} headers={headers} refreshKey={refreshKey} howTo={howTo}/>
            </div>
        </>
    )
}

export default FileInput;