const templates = {
    blank: "",
    resume: `# {{name}}
{{email}} | {{phone}}
{{#if company}}Currently at {{company}}{{/if}}

## Professional Experience
{{#each experiences}}
**{{title}}** at {{company}} ({{startDate}} - {{endDate}})
- {{description}}
{{/each}}

{{#if skills.length}}
## Skills
{{#each skills}}
- {{this}}
{{/each}}
{{/if}}

{{#if education}}
## Education
{{education}}
{{/if}}`,

    cover_letter: `{{formatDate today}}

{{#if recruiter.name}}{{recruiter.name}}{{else}}Dear Hiring Manager{{/if}},
{{#if company}}{{company}}{{/if}}

Dear {{#if recruiter.name}}{{recruiter.name}}{{else}}Hiring Manager{{/if}},

I am writing to express my interest in the {{position}} position at {{company}}. With my background in {{#each skills}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}, I believe I would be a valuable addition to your team.

{{#if experience}}{{experience}}{{else}}My experience includes working with various technologies and delivering high-quality solutions.{{/if}}

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to {{company}}'s continued success.

Sincerely,
{{name}}`,

    invoice: `# INVOICE

**Invoice #:** {{invoiceNumber}}
**Date:** {{formatDate date}}
**Due Date:** {{formatDate dueDate}}

---

**Bill To:**
{{client.name}}
{{client.address}}
{{client.email}}

**From:**
{{name}}
{{email}}
{{phone}}

---

## Items
{{#each items}}
{{description}} - {{currency price}} x {{quantity}} = {{currency (multiply price quantity)}}
{{/each}}

---
**Subtotal:** {{currency subtotal}}
{{#if tax}}**Tax:** {{currency tax}}{{/if}}
**Total:** {{currency total}}

---
Payment due within 30 days. Thank you for your business!`,

    business_letter: `{{formatDate today}}

{{recipient.name}}
{{recipient.title}}
{{recipient.company}}
{{recipient.address}}

Dear {{recipient.name}},

{{content}}

{{#if closing}}{{closing}}{{else}}Best regards{{/if}},

{{name}}
{{title}}
{{company}}
{{email}}
{{phone}}`,
};
