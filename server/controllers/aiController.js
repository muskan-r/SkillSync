import { generateAIResponse } from "../services/aiService.js";

export const suggestProjectIdeas = async (req, res) => {
    try {
        const { skills } = req.user;

        if (!skills || skills.length === 0) {
            return res.status(400).json({
                message: "Add some skills to your profile first to get project suggestions",
            });
        }

        const prompt = `A developer has these skills: ${skills.join(", ")}.
Suggest 3 project ideas they could build to learn and showcase these skills.
For each idea, give: a title, a 2-sentence description, and the key skills it would use.
Keep it concise and practical for a student developer. Format as a numbered list.`;

        const aiResponse = await generateAIResponse(prompt);

        res.status(200).json({
            message: "Project ideas generated successfully",
            suggestions: aiResponse,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};

export const reviewProjectDescription = async (req, res) => {
    try {
        const { description } = req.body;

        if (!description || !description.trim()) {
            return res.status(400).json({
                message: "Description is required",
            });
        }

        const prompt = `Review this project description for a developer portfolio:

"${description}"

Give 2-3 short, actionable suggestions to make it clearer and more compelling.
Keep the response concise — a short list, no long paragraphs.`;

        const aiResponse = await generateAIResponse(prompt);

        res.status(200).json({
            message: "Review generated successfully",
            review: aiResponse,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};