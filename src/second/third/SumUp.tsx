//import React from "react";
import sonSum from "../../resource/sonSum";
interface Props {
    jsonListRaw: any[];
    headersRaw: any[][];
    currentIndex: number;
}

const SumUp = (Props: Props) => {
    let jsonList = Props.jsonListRaw[Props.currentIndex];
    let headers = Props.headersRaw[Props.currentIndex];
    //主Sum
    let Sum = 0;
    let weightSum = 0;
    let plus="";
    let SonSumList = [];
    //子元素Sum
    let SonSum = new sonSum("");



    function PlusIntoSum(button:number,index: number,name: string,weight?: number) {
        console.log("PlusIntoSum")
        console.log(button,index,name,weight)
        //权重栏弹窗填写
        //index在调用者当中记得求和完成,当前按钮的index是当前列号
        let butt = document.getElementById(`sumUpButton${button}0`) as HTMLButtonElement;
        let redobutt = document.getElementById(`sumUpButton${button}1`) as HTMLButtonElement;
        if(redobutt) {
            redobutt.style.backgroundColor = "";
            redobutt.id = `sumUpButton${button}0`;
            SonSum.delSon(name);
            return;
        }
        if(SonSum.isCanUpdate()){
            alert("此复合组成部分权重已满")
        }
        if(!weight){
            let weight =Number(prompt("请输入权重"));
            if(weight) {
                SonSum.addSon(name,index,weight);//将子元素添加到子元素Sum中
                console.log(SonSum);
                if(butt) {
                    butt.style.backgroundColor= "gray";
                    butt.value = "0";
                    butt.id = `sumUpButton${button}1`;
                }
            }
            else {
                console.log("取消")
                return
            }
        }
        else {
            SonSum.addSon(name,index,weight);//将子元素添加到子元素Sum中
            console.log(SonSum);
        }
        

    }
    function ComplexPlusIntoSum() {
        console.log("ComplexPlusIntoSum")
        let context = document.getElementById("Context") as HTMLInputElement;
        let weight = document.getElementById("Weight") as HTMLInputElement;
        let sumUpButtons = document.getElementById("sumUpButtons");
        console.log(context.value,weight.value,sumUpButtons)
        if(sumUpButtons) {
            if(!SonSum.isCanUpdate()){
                alert("此复合组成部分权重不足")
                return
            }
            if(context.value === "" || weight.value === "") {
                alert("请输入达成度复合组成部分的名称和权重")
                return
            }
            else {
                SonSum.setName(context.value);
                SonSum.setMainWeight(Number(weight.value));
                console.log(SonSum);
                SonSumList.push(SonSum);
                let littleSum = SonSum.getSum()*SonSum.getMainWeight();
                Sum += littleSum;
                console.log(Sum);
                weightSum += SonSum.getMainWeight();
                //setWeightSum(weightSum+SonSum.getMainWeight());//TODO记得写一个根据这个值判断是否提醒的元素
                //SonSum = new sonSum("");
                //sumUpButtons.innerHTML += `<button id="sumUpButton${sumUpButtons.children.length}" onclick=${PlusIntoSum()} value=${sumUpButtons.children.length}>${context.value} ${weight.value}</button>`
                console.log(SonSum.getSonList())
                plus += `<tr><td>课程目标组成：${context.value}</td><td>得分：${littleSum*100}%</td><td>成分：${SonSum.getSonList()}</td><td>权重：${weight.value}</td></tr>`;
                SonSum = new sonSum("");
                //写一个将此复合组成部分的子元素及其权重展示的功能
                let son = document.getElementById("Son");
                if(son) {
                    son.innerHTML = "";
                    headers.forEach((header, index) => {
                        let butt = document.createElement("button");
                        butt.onclick = () => PlusIntoSum(index, sumData(index,true), header);
                        butt.value = String(index);
                        butt.innerHTML = header;
                        butt.id = `sumUpButton${index}0`;
                        if(sumData(index,false)!=0&&header!="学号"&&header!="序号"){
                            son.appendChild(butt);
                        }
                        //Son.innerHTML += `<button id="sumUpButton${index}" onclick={PlusIntoSum(index,sumData(index),header)} value=0>${header}</button>`
                    })
                }
            }
        }
        let SUM = document.getElementById("SUM");
        if(SUM) {
            console.log("SUM")
            SUM.innerHTML = "总达成度："+(Sum*100)+"%";
        }
        let ele = document.getElementById("ele");
        if(ele) {
            console.log("ele")
            ele.innerHTML = plus + `<tr><tb><label htmlFor="Context">课程目标:</label>
            <input id="Context" type="text" placeholder="请输入达成度复合组成部分"></input></tb>
            <tb><label htmlFor="Weight"> 本课程目标权重:</label>
            <input id="Weight" type="text" placeholder="请输入权重"></input></tb>
            </tr>`;;
        }
        console.log(Sum);
        console.log(plus)
        context.value = "";
        weight.value = "";
    }

    function sumDataPercent(jsonList: any[],index?: number,percent?: number){
        //按列求百分比平均数，返回值是按钮，添加到子元素列表当中,写一个组件专门用于调用此函数
        if(index === undefined || percent === undefined) {
            let index = Number(prompt("请输入列号"));
            let percent = Number(prompt("请输入百分比"));
            if(index === undefined || percent === undefined) {
                alert("请输入列号和百分比")
                return;
            }
            else {
                let ret = 0;
                for(let i = 0 ; i<jsonList.length;i++){
                    if(jsonList[i][index].type != Number){
                        continue;
                    }
                    ret += jsonList[i][index];
                }
            }
        }
    }
    function sumData(index: number,Try: boolean){
        let max;
        let maxmize = 1;
        if(Try){
            max = prompt("请输入满分分值,如果取最高分为满分,请输入max,如果不输入,默认满分100");
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
    
    console.log(headers)
    if(headers&&jsonList&&headers.length > 0) {
        let Son = document.getElementById("Son");
        if(Son) {
            Son.innerHTML = "";
            Sum = 0;
            SonSumList = [];
            headers.forEach((header, index) => {
                let butt = document.createElement("button");
                butt.onclick = () => PlusIntoSum(index, sumData(index,true), header);
                butt.value = String(index);
                butt.innerHTML = header;
                butt.id = `sumUpButton${index}0`;
                if(sumData(index,false)!=0&&header!="学号"&&header!="序号"){
                    Son.appendChild(butt);
                }
                //Son.innerHTML += `<button id="sumUpButton${index}" onclick={PlusIntoSum(index,sumData(index),header)} value=0>${header}</button>`
            })
        }
        let SUM = document.getElementById("SUM");
        if(SUM) {
            SUM.innerHTML = "总达成度："+0+"%";
        }
        plus = "";
        let ele = document.getElementById("ele");
        if(ele) {
            ele.innerHTML =  plus + `<tr><tb><label htmlFor="Context">课程目标:</label>
            <input id="Context" type="text" placeholder="请输入达成度复合组成部分"></input></tb>
            <tb><label htmlFor="Weight"> 本课程目标权重:</label>
            <input id="Weight" type="text" placeholder="请输入权重"></input></tb>
            </tr>`;
        }
    }
    return(
        <>
        <div id="sumUp">
            <table>
                <thead><tr><td id="SUM">达成度:{Sum}%</td></tr></thead>
                <tbody id="ele" >{plus}</tbody>
            </table>
            <div id="Son"></div>
            <br></br>
            <button id="sumUpButtons" onClick={()=>ComplexPlusIntoSum()} style={{backgroundColor:"green"}}>上传课程目标</button>
            <hr/>
            <div id="tools"><h3>编辑特殊组成元素</h3>
            <button onClick={()=>sumDataPercent(jsonList)}>增加百分比平均数元素</button>
            </div>
        </div>
        
        </>
    )
}

export default SumUp;