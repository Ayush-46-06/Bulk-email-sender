const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.groq_API_key,
});

exports.generateEmail = async (req, res) => {
    try {
        const { prompt, availableTags } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const systemMessage = `You are an expert email marketer and copywriter.
Your task is to generate a professional, engaging, and well-structured email body based on the user's prompt.
You MUST output ONLY HTML code for the email body. Do not include \`\`\`html or any markdown wrappers. Just the raw HTML.
Use standard HTML tags like <b>, <i>, <p>, <br>, <a>, etc., for formatting.
If the user provides available tags (variables), you can use them in the email where appropriate.
Available tags for this campaign: ${availableTags ? availableTags.map(tag => `{{${tag}}}`).join(', ') : 'None'}.
For example, if 'name' is an available tag, use {{name}} to personalize the greeting.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: systemMessage
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "groq/compound",
            temperature: 1,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null,
            compound_custom: {
                tools: {
                    enabled_tools: [
                        "web_search",
                        "code_interpreter",
                        "visit_website"
                    ]
                }
            }
        });

        let generatedHtml = chatCompletion.choices[0]?.message?.content || '';
        
        // Clean up markdown if the AI accidentally includes it
        generatedHtml = generatedHtml.replace(/^```html\n?/, '').replace(/\n?```$/, '').trim();

        res.status(200).json({ html: generatedHtml });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ error: 'Failed to generate email content', details: error.message });
    }
};
