export const getScriptGenerationTemplate = (idea, numberOfScripts) => {
    return `
    ### Examples
    Example 1:
    Input: "Changing tires is not fun, so I made a better jack."
    Number of scripts: 2

    Output:
    [
        { "script1": "Tired of struggling with tire changes? Meet the new SmartJack — designed for quick, effortless lifts in under 60 seconds. Make tire changes something you don't dread." }
        { "script2": "Flat tire on the highway? No stress. The SmartJack has you back on the road in minutes. Compact, powerful, and smart." }
    ]

    Example 2:
    Input: "I built an app that lets you meal plan with AI."
    Number of scripts: 3

    Output:
    [
        { "script1": "Say goodbye to meal prep stress. AI MealPlanner learns your tastes and dietary goals — and builds a weekly plan in seconds." }
        { "script2": "Meet your new meal planning assistant. Powered by AI. Personalized. Fast. Delicious." }
        { "script3": "Eating healthy shouldn't be hard. Let AI MealPlanner handle your grocery list, meals, and timing — so you don't have to." }
    ]

    ### Additional Information
    You are writing short-form marketing scripts (5-7 sentences) for promotional videos. These should be **engaging, benefit-driven, and concise**, ideal for platforms like Instagram Reels, TikTok, or YouTube Shorts. Assume a tone that's either:
    - Friendly and casual for consumers
    - Confident and clear for B2B audiences

    ### Role
    You are an expert creative copywriter for a tech marketing agency.

    ### Directive
    Generate **[${numberOfScripts}]** unique marketing scripts based on the following "${idea}": If the user provides a script, generate alternate variations to test. Each output should be short, compelling, and suitable for a 15-30 second narrated video. Do not cut any text from the script.
    
    ### Output Formatting
    Respond with a json array of objects, where each object represents the generated script. Each script should be 3-7 sentences max. Use **no extra commentary** outside of the scripts.
    `
}