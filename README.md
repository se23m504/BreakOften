# BreakOften

BreakOften is a cutting-edge web application designed to help users combat computer vision syndrome by encouraging regular breaks. Built with Svelte, BreakOften offers a seamless and customizable user experience to ensure you maintain a healthy balance between work and rest.

## Why BreakOften?

In today's digital age, prolonged screen time is inevitable. BreakOften is your personal wellness assistant, ensuring you take necessary breaks to rest your eyes and maintain productivity. Whether you're a student, professional, or avid gamer, BreakOften is tailored to fit your lifestyle.

## Features

- **Frequent mini breaks**: Receive reminders for short breaks every 20 minutes and 20 seconds to rest your eyes.
- **Long breaks**: After three mini breaks, enjoy a longer 5-minute break to recharge fully.
- **Flexibility**: Skip or postpone breaks according to your needs without disrupting your workflow.
- **Customization**: Personalize your break schedule and settings. Logged-in users have their preferences saved in their profile, while others can use `localStorage`.
- **Alerts**: Get notified with sound and visual alerts to ensure you never miss a break.
- **Integration with Prisma and Supabase**: Secure user authentication and storage of user-defined variables like timer settings.
- **Theming**: Choose from dark or light mode.
- **Fun extras**: Enjoy a touch of culture with Shakespeare quotes on your profile page!

## Getting started

Follow these steps to set up BreakOften on your local machine:

1. **Clone the repository**: 
    ```bash
    git clone https://github.com/se23m504/BreakOften.git
    cd BreakOften
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup environment variables**:

    Create a `.env` file with your `DATABASE_URL`. You can start by copying the example file and then modify it:

    ```bash
    cp .env.example .env
    ```

4. **Set up database**:
    
    Push the Prisma schema to Supabase:

    ```bash
    npx prisma db push
    ```

5. **Run the development server**:
    
    Start the server and open your browser:

    ```bash
    npm run dev -- --open
    ```
