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
    var HoleSonSum: sonSum[] = [];
    var MaxFS: number[] = [];
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
        HoleSonSum.push(SonSum);
        SonSum = new sonSum("");
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
                                                let worksheet = workbook.Sheets[name]; // 获取第一个sheet的数据
                                                let jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {header: 1}); // 将sheet数据转换为json                               
                                                for(let i = 2 ; i < jsonData.length && jsonData[i][0] != "总计" ; i++){
                                                    SonSum.setName(jsonData[i][0]);
                                                    let left = jsonData[0].indexOf("考核环节及成绩");
                                                    let right = jsonData[0].indexOf("总评成绩");
                                                    
                                                    for(let j = left ; j < right ; j++){
                                                        let littleSum = 0;
                                                        for(let k = left ; k < right ; k++){
                                                            littleSum += jsonData[i][k];
                                                        }
                                                        SonSum.addSon(jsonData[1][j]
                                                            ,sumData(jsonList[0].indexOf(jsonData[1][j]),true)
                                                            ,jsonData[i][j]/littleSum);
                                                        
                                                    }
                                                    MaxFS.push(jsonData[i][jsonData[0].indexOf("总评成绩")]);
                                                    SonSum.setMainWeight(jsonData[i][jsonData[0].indexOf("总评成绩")]/100);
                                                    ComplexPlusIntoSum();
                    
                                                }
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

                    
                    //let Sons:string[] = []
                    //Sons.push("课程目标");
                    //for(let i = 0;i<SonSumList.length;i++){
                    //    Sons.push(SonSumList[i]);
                    //}
                    //jsonData.push(Sons);


                    //let SonWeight:string[] = []
                    //for(let i = 0;i<SonSumWeightList.length;i++){
                    //    SonWeight.push(SonSumWeightList[i].toString());
                    //}
                    //jsonData.push(SonWeight);
                    //let SonSum:string[] = []
                    //for(let i = 0;i<SonSums.length;i++){
                    //    SonSum.push(SonSums[i].toString());
                    //}
                    //jsonData.push(SonSum);

                    //
                    let heads:string[] = [];
                    heads.push("课程目标")    
                    let MainWeights:string[] = [];
                    MainWeights.push("分目标达成度");
                    let sons:string[] = [] ;
                    sons.push("考核方式");
                    let littleWeight:string[] = [];
                    littleWeight.push("占分目标比重");
                    let numList: string[] = [];
                    numList.push("全体平均分");
                    let littleMaxFS:string[] = [];
                    littleMaxFS.push(" 分目标满分");
                    let thing = 0 ;
                    HoleSonSum.forEach((item) => {
                        heads.push(item.getName());
                        MainWeights.push(item.getSum().toString());

                        for(let i = 0;i<item.getSonList().length;i++){
                            
                            if(item.weightList[i] == 0){
                                continue;
                            }
                            if(i >= 1){
                                heads.push(" ");
                                MainWeights.push(" ");
                            }
                            sons.push(item.getSonList()[i]);
                            littleWeight.push(item.weightList[i].toString());
                            console.log("新函数")
                            console.log((sumData(jsonList[0].indexOf(item.getSonList()[i]),false)*(MaxFS[thing]/100)*item.weightList[i]).toString())
                            numList.push((sumData(jsonList[0].indexOf(item.getSonList()[i]),false)*(MaxFS[thing]/100)*item.weightList[i]).toString());
                            littleMaxFS.push(((MaxFS[thing])*item.weightList[i]).toString());
                        }
                        
                        thing++;
                    })
                    jsonData.push(heads);
                    jsonData.push(sons);
                    jsonData.push(littleWeight);
                    jsonData.push(numList);
                    jsonData.push(littleMaxFS);
                    jsonData.push(MainWeights);

                    let head:string[] = [];
                    head.push("总体达成度");
                    head.push(sum.toString());
                    jsonData.push(head);

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