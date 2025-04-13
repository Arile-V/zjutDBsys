import * as XLSX from 'xlsx';
import sonSum from '../../resource/sonSum';
interface Props {
    jsonListRaw: any[];
    headersRaw: any[][];
    currentIndex: number;
    howTo: number;
}
function NewSum(Props: Props) {
    var jsonList = Props.jsonListRaw[Props.currentIndex];
    var headers = Props.headersRaw[Props.currentIndex];
    var Sum = 0;
    var weightSum = 0;
    var SonSumList:string[] = [];
    var SonSumWeightList:number[] = [];
    var SonSums: number[] = [];
    //子元素Sum
    var SonSum = new sonSum("");
    function sumData(index: number,Try: boolean){
    
        let max;
        let maxmize = 1;
        if(Try){
            //max = prompt("请输入满分分值,如果取最高分为满分,请输入max,如果不输入,默认满分100");
            maxmize = 0;
            if (max === undefined || max === null || max === "") {
                maxmize = 100;
            }
            if(max&&!isNaN(Number(max))){
                maxmize = Number(max);
            }
        }
        if(!Props.headersRaw&&!Props.jsonListRaw){
            console.log("Props.headers&&!Props.jsonList")
            return 0;
        }
        //按列求平均数,在按钮当中调用，作为PlusIntoSum的参数
        let ret = 0;
        if(jsonList.length === 0){
            console.log("Props.jsonList.length === 0")
            return 0;
        }
        for(let i = 0 ; i<jsonList.length;i++){
            if(jsonList[i][index]&&!isNaN(jsonList[i][index])){
                //console.log("Props.jsonList[i][index]"+ret)
                ret +=Number(jsonList[i][index]);
                if(Try){
                    if(max === "max"){
                        if(jsonList[i][index]>maxmize){
                            maxmize = jsonList[i][index];
                        }
                    }
                }
            }
        }
        return ret/jsonList.length/maxmize;
    }


    function ComplexPlusIntoSum() {
        console.log(jsonList);
        console.log("ComplexPlusIntoSum")
        if(!SonSum.isCanUpdate()){
            return
        }
        SonSumList.push(SonSum.getName());
        SonSumWeightList.push(SonSum.getMainWeight());
        SonSums.push(SonSum.getSum());
        let littleSum = SonSum.getSum()*SonSum.getMainWeight();
        Sum += littleSum;
        weightSum += SonSum.getMainWeight();
        console.log(Sum,weightSum,SonSum);
        let Psum = document.getElementById("sum") as HTMLInputElement;
        let text = "课程总达成度: "+(Sum*100).toString()+"%";
        Psum.innerHTML = `<th colspan="${SonSumList.length+1}">${text}</th>`
        let PsumSon = document.getElementById("sumSon") as HTMLInputElement;
        PsumSon.innerHTML = `<td>课程目标名</td>`
        for(let i = 0 ; i<SonSumList.length;i++){
            PsumSon.innerHTML += `<td>${SonSumList[i]}</td>`
        }
        let PsumWeight = document.getElementById("sumWeight") as HTMLInputElement;
        PsumWeight.innerHTML = `<td>权重</td>`
        for(let i = 0 ; i<SonSumWeightList.length;i++){
            PsumWeight.innerHTML += `<td>${SonSumWeightList[i]}</td>`
        }
        let PsumSonSum = document.getElementById("sumSons") as HTMLInputElement;
        PsumSonSum.innerHTML = `<td>子目标达成度</td>`
        for(let i = 0 ; i<SonSums.length;i++){
            PsumSonSum.innerHTML += `<td>${SonSums[i]}</td>`
        }

        SonSum = new sonSum("");
    }

    function findIndex(Context: string){
        for(let i = 0 ; i<headers.length;i++){
            if(headers[i] === Context){
                return i;
            }
        }
        console.log("error")
        return -1;
    }



    return(
        <>
            <input type="file" id='gFile' accept=".xls,.xlsx"></input>
            <button onClick={(a) => {
                                    a.preventDefault();
                                    const fileInput = document.getElementById('gFile') as HTMLInputElement;
                                    const file = fileInput.files?.[0];
                                    if (file) {
                                       let fileReader = new FileReader();
                                        fileReader.onload = function (e) {
                                            let workbook = XLSX.read(e.target?.result, {type: 'binary'});
                                            var sheetName = workbook.SheetNames; // 获取第一个sheet的名字
                                            sheetName.forEach((name) => {
                                                var worksheet = workbook.Sheets[name]; // 读取第一个sheet数据
                                                var jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // 转换成json
                                                //var htmlData = XLSX.utils.sheet_to_html(worksheet);
                                                let context = "";//课程目标
                                                let weight = 0;//本目标权重
                                                let sumSons: string[] = [];
                                                let sonWeight: number[] = [];
                                                for(let i = 0;i<jsonData.length;i++){
                                                    let item = jsonData[i];
                                                    if(item!==undefined&&item!=null){
                                                        console.log(item);
                                                        if((item as string[])[0]==="课程目标/权重"){
                                                            context = (item as string[])[1];
                                                            weight = Number((item as string[])[2]);
                                                            SonSum.setName(context);
                                                            SonSum.setMainWeight(weight);
                                                        }
                                                        if((item as string[])[0]==="组成成分"){
                                                            for(let i = 1;i<(item as string[]).length;i++){
                                                                sumSons.push((item as string[])[i]);
                                                            }
                                                        }
                                                        if((item as string[])[0]==="权重占比"){
                                                            for(let i = 1;i<(item as string[]).length;i++){
                                                                sonWeight.push(Number((item as string[])[i]));
                                                            }
                                                            for(let i = 0;i<sumSons.length;i++){
                                                                let index = findIndex(sumSons[i]);
                                                                if(index===-1){//没有找到
                                                                    alert("表格填写不正确！有课程目标子元素不存在")
                                                                    break;
                                                                }else{
                                                                    let grade = sumData(index,true);
                                                                    if(SonSum.isCanUpdate()){
                                                                        alert("表格填写不正确！有课程目标子元素权重总和超过1")
                                                                        console.log(jsonList);
                                                                        break;
                                                                    }
                                                                    SonSum.addSon(sumSons[i],grade,sonWeight[i]);
                                                                }
                                                            }
                                                            ComplexPlusIntoSum();
                                                            sumSons = [];
                                                            sonWeight = [];
                                                        }
                                                    }
                                                }
                                                //下面写显示逻辑
                                            })
                                        }
                                        fileReader.readAsArrayBuffer(file);
                                    }
                                    fileInput.value = ''
                                }}>分数构成</button>
                <button onClick={(a)=>{ //将Sum/SonsumList/SonsumWeightList/Sonsums导出为xlsx文件
                    a.preventDefault();
                    let sum = Sum;
                    //let jsonData = [["目标达成度"],[sum],["组成成分"],[SonSumList],[sumWeight],[sumSons]];
                    let jsonData:string[][] = [];
                    jsonData.push(["目标达成度"]);
                    jsonData.push([sum.toString()]);
                    jsonData.push(["组成成分"]);
                    jsonData.push(SonSumList);
                    let SonWeight:string[] = []
                    for(let i = 0;i<SonSumWeightList.length;i++){
                        SonWeight.push(SonSumWeightList[i].toString());
                    }
                    jsonData.push(SonWeight);
                    let SonSum:string[] = []
                    for(let i = 0;i<SonSums.length;i++){
                        SonSum.push(SonSums[i].toString());
                    }
                    jsonData.push(SonSum);
                    let worksheet = XLSX.utils.aoa_to_sheet(jsonData);
                    let workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook,worksheet,"Sheet1");
                    XLSX.writeFile(workbook,"分数构成.xlsx");
                }}>结果导出</button>
            <div>
                <table>
                    <tbody>
                    <tr id='sum'></tr>
                    <tr id='sumSon'></tr>
                    <tr id='sumWeight'></tr>
                    <tr id='sumSons'></tr>
                    </tbody>
                </table>
                
            </div>
        </>
    )
}



export default NewSum;