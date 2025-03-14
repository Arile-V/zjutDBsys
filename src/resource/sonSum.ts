class sonSum {//复合元素单元
    Name: string;
    sum: number;
    mainWeight: number;
    sonList: string[];
    numList: number[];
    weightList: number[];
    canUpdate: boolean;
    weightSum: number;
    constructor(name:string) {
        this.Name = name
        this.sum = 0
        this.mainWeight = 0
        this.sonList = []
        this.numList = []
        this.weightList = []
        this.canUpdate = false
        this.weightSum = 0
    }
    addSon(name:string,num:number,weight:number) {
        this.sonList.push(name)
        this.numList.push(num)
        this.weightList.push(weight)
        this.weightSum += weight
        this.sum += weight*num
        if(this.weightSum == 1) {
            this.canUpdate = true
        }
    }
    delSon(name:string) {
        let index = this.sonList.indexOf(name)
        if (index != -1) {
            this.sum -= this.weightList[index]*this.numList[index]
            this.weightSum -= this.weightList[index]
            this.canUpdate = false
            this.sonList.splice(index,1)
            this.numList.splice(index,1)
            this.weightList.splice(index,1)
        }else{
            alert("没有这个子元素")
        }
    }
    getSum() {
        return this.sum
    }
    getName() {
        return this.Name
    }
    setName(name:string) {
        this.Name = name
    }
    getMainWeight() {
        return this.mainWeight
    }
    setMainWeight(weight:number) {
        this.mainWeight = weight
    }
    getSonList() {
        return this.sonList
    }

    isCanUpdate() {
        return this.canUpdate
    }
}

export default sonSum