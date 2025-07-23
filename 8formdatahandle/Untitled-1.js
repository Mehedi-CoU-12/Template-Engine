{
    "name": "John", 
    "skills": ["ts", "js"]
}


const schema = {
    name: "string",
    "skills": "string[]"
}


{
    first_name: {{name?}},
    mySkills: [{{@each skills}}"{{this}}",{{/each}}]
}
