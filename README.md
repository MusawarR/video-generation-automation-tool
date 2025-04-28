## VGAT (Video Generation Automation Tool)
This is a tool designed to assess the feasibility of automating marketing video generation. More specifically, it is designed to check whether automated video creation is possible with just simple prompts and AI, and not only plain video creation but one with effects and timed subtitles.

### The implementation plan is shown in the below image:
![Implementation Plan](https://github.com/user-attachments/assets/befc809a-a2b5-4f87-89b2-6506ee16d2b5)

### How this tool works:
1. The user starts by providing a video idea or a script and with the help of OpenAI, a set number of scripts are generated.
![Step-1](https://github.com/user-attachments/assets/9ad04dac-b75e-4e42-8624-a7aee6d25fc0)
2. Following script generation, users then select voide actors and generate narrations for the selected scripts.
![Step-2](https://github.com/user-attachments/assets/15f5603e-2987-4eea-83bf-78aeb466fcab)
3. Users selected a base image, select a visual style and an optional prompt which are used for generating images.
![Step-3](https://github.com/user-attachments/assets/79109fc5-fe77-4e9a-905a-dbbba3771633)
4. Due to some limitations, this step is manual. The users copy the JSON and paste it into assembler script.
![Step-4a](https://github.com/user-attachments/assets/91b1c84e-4108-4488-8b18-0d1266befd70)
![Step-4b](https://github.com/user-attachments/assets/97f6674e-a0b7-46dc-94f4-2e27333c53fc)
![Step-4c](https://github.com/user-attachments/assets/4deb6cda-e25a-4783-b36a-2dc09e77c546)
5. Before generating videos, users need to put intro and outro videos of their choice.
![Step-5a](https://github.com/user-attachments/assets/0206482a-ba20-4390-a51e-7d5f7cc0f2c6)
![Step-5b](https://github.com/user-attachments/assets/f403c056-ebaf-4580-a8eb-c533cb96a54b)

## Setting up the tool:
1. Clone the repo
2. run **npm install && npm run dev** in command prompt inside the **data-generation** folder.
3. make sure python is installed, then run **pip install requests moviepy** inside the **video-assembly** folder.
4. Add the API keys in VGAT UI and save them

## Improvements
1. Right now the final step of taking data from VGAT UI to the video assembly script is manual, however, this can be easily automated by passing the VGAT UI data to an API which runs the video assembly script and stores the output videos in the cloud, which the user can access later.
2. As of now, the generated videos are very simplistic without any sound effects or any timed subtitles. In the future, such features can be incorporated along with more advanced effects.
