export const template = {
    name: "{{name}}",
    age: "{{age}}",
    city: "{{city}}",
    contact: {
        email: "{{email}}",
        phone: "{{phone}}",
        address: {
            street: "{{street}}",
            zip: "{{zip}}",
            full: "{{name}} lives at {{street}}, {{city}} - {{zip}}",
        },
    },
    skills: ["{{skill1}}", "{{skill2}}", "{{skill3}}"],
    education: {
        university: "{{university}}",
        degree: "{{degree}}",
        year: "{{year}}",
        summary:
            "{{name}} earned a {{degree}} from {{university}} in {{year}}.",
    },
};
