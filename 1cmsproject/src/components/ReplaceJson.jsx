import cmsjson from "../cms.json";
import ShowJson from "./ShowJson";

function replace(str, data) {
    let ans = "";
    let i = 0;
    while (i < str.length) {
        if (str.startsWith("{{", i)) {
            let lastIndex = str.indexOf("}}", i);

            if (lastIndex !== -1) {
                let key = str.slice(i + 2, lastIndex);
                ans += data[key] ?? "";
                i = lastIndex + 2;
            } else i++;
        } else {
            ans += str[i];
            i++;
        }
    }

    return ans;
}

function filledWithData(cmsjson, data) {
    if (typeof cmsjson === "string") {
        return replace(cmsjson, data);
    }

    if (Array.isArray(cmsjson)) {
        return cmsjson.map((item) => filledWithData(item, data));
    }

    let finaljosn = {};
    for (let key in cmsjson) {
        finaljosn[key] = filledWithData(cmsjson[key], data);
    }

    return finaljosn;
}

function ReplaceJson() {
    const data = {
        name: "Mehedi",
        age: 24,
        city: "Sylhet",
        email: "mehedi@example.com",
        phone: "01831938910",
        street: "Modina Marget Road",
        zip: "1205",
        skill1: "JavaScript",
        skill2: "React",
        skill3: "Node.js",
        university: "Comilla University, Cumilla",
        degree: "BSc in CSE",
        gradYear: "2025",
    };

    const modifiedJson = filledWithData(cmsjson, data);

    console.log(modifiedJson)

    return (
        <div>
            <ShowJson modifiedJson={modifiedJson} />
        </div>
    );
}

export default ReplaceJson;
