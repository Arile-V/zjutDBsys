/**
 * class treeSum
 */
class treeSum {
    List: any[] = [];
    Sumup: number = 0;
    index: number = 0;
    treeSum: treeSum[] = [];
    stack: any[] = [];
    name: string = "";
    constructor(Name: string,Lists?: any[],indexs?: any[],treeSums?: any[]) {
        this.name = Name;
        this.List = [];
        this.Sumup = 0;
        this.treeSum = [];
        this.stack = [];
        if (Lists && indexs && Lists.length == indexs.length) {
            //TODO 这里是将一个表达式字符串解析成树状结构
            for (let i = 0; i < Lists.length; i++) {
                this.Sumup += Lists[i]*indexs[i];
            }
        }
        if (treeSums) {
            treeSums.forEach((treeSum) => {
                this.Sumup += treeSum.Sumup;
            })
        }
    }
}
export default treeSum;