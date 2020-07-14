export function handleTreeDataOptions(allDataList: Array<any>) {
    let province:Array<any> = [];
    let city:Array<any> = [];
    let region:Array<any> = [];
    let mapNameList:Array<any> = [];
    for (let i = 0; i < allDataList.length; i++) {
        if (/0000$/.test(allDataList[i].code)) {
            province.push({
                label: allDataList[i].name,
                key: allDataList[i].code,
                value: allDataList[i].code,
                isLeaf: false,
                level: 1,
                children: [],
            })
            mapNameList[allDataList[i].code] = allDataList[i].name;
        } else if (/00$/.test(allDataList[i].code)) {
            city.push({
                label: allDataList[i].name,
                key: allDataList[i].code,
                value: allDataList[i].code,
                isLeaf: false,
                level: 2,
                children: []
            })
            mapNameList[allDataList[i].code] = allDataList[i].name;
        } else {
            region.push({
                label: allDataList[i].name,
                key: allDataList[i].code,
                value: allDataList[i].code,
                isLeaf: false,
                level: 3,
                children: []
            })
            mapNameList[allDataList[i].code] = allDataList[i].name;
        }
    }
    for (var list of province) {
        let start = list.key.substring(0, 2)
        for (let obj of city) {
            if (start == obj.key.substring(0, 2)) {
                list.children.push(obj)
            }
        }
    }
    for (var shi of city) {
        let start = shi.key.substring(0, 4)
        for (let obj of region) {
            if (start == obj.key.substring(0, 4)) {
                shi.children.push(obj)
            }
        }

    }
    return province
}
