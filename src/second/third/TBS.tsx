import React, { useEffect } from "react";
import SumUp from "./SumUp";
import NewSum from "./newSum";


interface TBSProps {
    htmlPages: string[];
    jsonList: any[];
    headers: any[][];
    refreshKey: number;
    howTo: number;
}


function TBS(props: TBSProps) {
    const [currentIndex, setCurrentIndex] = React.useState(-1);
    const showPreviousPage = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };



    React.useEffect(() => {
        // 当refreshKey变化时，执行某些操作
        setCurrentIndex((prevIndex) => 0);
        console.log('ChildComponent re-rendered due to refreshKey change');
      }, [props.refreshKey]);



    const showNextPage = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, props.htmlPages.length - 1));
    };
    if(props.refreshKey >= 3 && props.howTo === 1){
        console.log(props.refreshKey)
        return(
            <>
            <br/>
            <hr/>
            <NewSum jsonListRaw={props.jsonList} headersRaw={props.headers} currentIndex={currentIndex} howTo={props.howTo}/>
            <br/>
            <hr/>
            <button onClick={showPreviousPage}>上一页</button>
            <button onClick={showNextPage}>下一页</button>
            <div dangerouslySetInnerHTML={{ __html: props.htmlPages[currentIndex] }} />
            <br/>
            <hr/>
            </>
        )
    }
    else if(props.refreshKey >= 3 && props.howTo === 2){
        return(
            <>
            <br/>
            <hr/>
            <SumUp jsonListRaw={props.jsonList} headersRaw={props.headers} currentIndex={currentIndex} />
            <br/>
            <hr/>
            <button onClick={showPreviousPage}>上一页</button>
            <button onClick={showNextPage}>下一页</button>
            <div dangerouslySetInnerHTML={{ __html: props.htmlPages[currentIndex] }} />
            <br/>
            <hr/>
            </>
        )
    }
    else{
        return(
            <>
            </>
        )
    }
}

export default TBS;