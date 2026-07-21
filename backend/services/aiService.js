const groq = require("../utils/groqClient.js");
import { detectIntent } from "./intentDetector.js";
import { getData } from "./queryService.js";
import { buildPrompt } from "./promptBuilder.js";

export async function askAI(question) {

     console.log("Question:", question);

    const intent = detectIntent(question);

    console.log("Detected Intent:", intent);

    if (intent === "GENERAL") {

        const completion = await groq.chat.completions.create({

            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "system",
                    content:
                        "You are the AI assistant of FieldHub."
                },
                {
                    role: "user",
                    content: question
                }
            ]

        });

        return completion.choices[0].message.content;

    }

    const databaseData = await getData(intent);

    const prompt = buildPrompt(question, databaseData);

    const completion = await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        messages: [
             {
                role: "system",
                content:
                    "You are the AI assistant of FieldHub. Answer ONLY using the supplied database information."
            },
            {
                role: "user",
                content: prompt
            }
        ]

    });

    return completion.choices[0].message.content;

}

