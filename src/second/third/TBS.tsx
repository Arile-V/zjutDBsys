import React, { useEffect } from "react";
import SumUp from "./SumUp";


interface TBSProps {
    htmlPages: string[];
    jsonList: any[];
    headers: any[][];
    refreshKey: number;
}


function TBS(props: TBSProps) {
    const [currentIndex, setCurrentIndex] = React.useState(-1);
    const showPreviousPage = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };


    const showThis = () => {
        // setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setCurrentIndex((prevIndex) => 0);
    };

    React.useEffect(() => {
        // 当refreshKey变化时，执行某些操作
        setCurrentIndex((prevIndex) => 0);
        console.log('ChildComponent re-rendered due to refreshKey change');
      }, [props.refreshKey]);

    useEffect(() => {
        if (currentIndex === -1) {
            showThis();
        }
    })

    const showNextPage = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, props.htmlPages.length - 1));
    };
    return(
        <>
        <SumUp jsonListRaw={props.jsonList} headersRaw={props.headers} currentIndex={currentIndex}/>
        <br/>
        <hr/>
        <button onClick={showPreviousPage}>上一页</button>
        <button onClick={showThis}>预览</button>
        <button onClick={showNextPage}>下一页</button>
        <div dangerouslySetInnerHTML={{ __html: props.htmlPages[currentIndex] }} />
        <br/>
        <hr/>
        </>
    )
}

export default TBS;