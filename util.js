const hoge = "hoge";

function hello() {
    return "hello";
}

function dateTimeString() {
    let dt = new Date();
    let yyyy = dt.getFullYear();
    let mm = ("00" + (dt.getMonth() + 1)).slice(-2);
    let dd = ("00" + dt.getDate()).slice(-2);
    let hh = ("00" + dt.getHours()).slice(-2);
    let nn = ("00" + dt.getMinutes()).slice(-2);
    let ss = ("00" + dt.getSeconds()).slice(-2);
    return yyyy + "-" + mm + "-" + dd + "--" + hh + "-" + nn + "-" + ss;
}

function methodSetContentItem(itemType) {
    const set = {
        "name": itemType.name,
        "id": itemType.id,
        "password": itemType.password,
        "other1": itemType.other1,
        "other2": itemType.other2,
        "text": itemType.text,
        "tagId": itemType.tagId,
        "tagPassword": itemType.tagPassword,
        "tagOther1": itemType.tagOther1,
        "tagOther2": itemType.tagOther2,
    };
    return set
}

module.exports = {
    dateTimeString,
    methodSetContentItem,
};
