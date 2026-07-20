export function buildPrompt(question, data) {

    return `
You are the AI assistant for FieldHub.

Answer ONLY using the database information below.

Database Information:

${data}

Question:

${question}

If the data is unavailable, clearly say so without inventing facts.
`;

}