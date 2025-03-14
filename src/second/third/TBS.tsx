import React from "react";
import SumUp from "./SumUp";


interface TBSProps {
    htmlPages: string[];
    jsonList: any[];
    headers: any[][];
}


function TBS(props: TBSProps) {
    const [htmlPages, setHtmlPages] = React.useState(props.htmlPages);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const showPreviousPage = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const showThis = () => {
        // setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        setCurrentIndex(0);
    }

    const showNextPage = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, htmlPages.length - 1));
    };
    return(
        <>
        <br/>
        <hr/>
        <button onClick={showThis}>预览</button>
        <br/>
        <hr/>
        <SumUp jsonList={props.jsonList[currentIndex]} headers={props.headers[currentIndex]}/>
        <br/>
        <hr/>
        <button onClick={showPreviousPage}>上一页</button>
        <button onClick={showNextPage}>下一页</button>
        <div dangerouslySetInnerHTML={{ __html: htmlPages[currentIndex] }} />
        </>
    )
}

export default TBS;