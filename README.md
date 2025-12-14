<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1yqtWFwcsZDY2smL9zEctyGg0L6sBt8UK

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
<img width="1333" height="760" alt="image" src="https://github.com/user-attachments/assets/37617656-b90f-4ff3-93b7-88701fbc2482" />
Gemini 打包网页技巧

检查以下项目: 1. 把网页重构成不用打包的单个 html 文件 2. 如果需要 api_key，提供输入窗口，而不是用环境变量 3. 如果用到数据库，暂时去掉数据库，用本地存储
