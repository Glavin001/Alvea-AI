# Alvea - Revolutionizing User Interaction with AI

| 👉 [**Demo Video** 🎥](https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?sid=1205e6cf-7e68-49e5-9ac7-4136abd5926a) |
| --- |
| [<img width="2042" alt="image" src="https://github.com/Glavin001/Alvea-AI/assets/1885333/fad5833e-951b-4361-b5b1-c04477726fe9">](https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=142&sid=163c6712-15d4-42f2-898b-165903617bdb) |

| About Alvea | 🥇 1st Place Winning Team |
| --- | --- |
| **Alvea is an innovative application designed to enhance productivity and user experience by leveraging generative user interfaces.**<br/><br/>Developed during [Generative UI hackathon](https://partiful.com/e/1antxX3cgLArJFGRNKg4) at [AGI House SF](https://agihouse.ai/), Alvea addresses the limitations of existing AI chat applications by offering dynamic, just-in-time user interfaces that adapt to the user's tasks and needs. | <img width="1136" alt="image" src="https://github.com/Glavin001/Alvea-AI/assets/1885333/c3a9287f-e17e-4889-b30c-2b2c57934a22"> |

## The Problem

Existing AI chat apps, while boosting productivity, fall short in delivering optimal collaborative and informational experiences due to their reliance on text-based communication.

## Our Solution

Alvea emerges as a solution to this problem by integrating AI to develop dynamically rendering user interfaces that are interactive and tailored to the user's current task.

### Key Features

<!-- - **Dynamic User Interfaces:** Unlike static interfaces, Alvea's UIs are interactive and adapt based on the input, providing a more efficient way to convey information and extract user preferences.
- **Visual Components:** Alvea incorporates appropriate visual components for task accomplishment, allowing for a collaboration between the AI and the user that surpasses traditional text-based interactions.
- **Customized Experience:** Focused on delivering the best customer experience, Alvea enables language models to visualize and communicate in the most effective way for every task. -->

| Feature | Description | Alvea🌟 | Perplexity Copilot | ChatGPT | Specialized Task Apps |
|---------|-------------|-------|---------------------|---------|-----------------------|
| Natural Language Understanding & Response Generation | Effectively understands and generates human-like text responses to user queries. | ✅ | ✅ | ✅ | ❌ |
| Personalized Experience | Tailors experiences based on individual user preferences and tasks. | ✅ | ✅ | ✅ | ❌ |
| Interactive UIs | Offers engaging and adaptable interfaces tailored to user tasks. | ✅ | ✅ | ❌ | ✅ |
| Efficient Data Collection | Streamlines data collection through forms and interactive elements. | ✅ | ✅ | ❌ | ✅ |
| Advanced Visualization & Outcome Previewing | Utilizes complex visuals and previews of outcomes for enhanced comprehension and decision-making. | ✅ | ❌ | ❌ | ✅ |
| Just-in-Time User Interfaces | Generates UI components precisely when needed for the task. | ✅ | 🔶<br/>* Forms only | ❌ | ❌ |


### Example Use Cases

These are the example tasks demonstrated during the hackathon to showcase how Alvea's just-in-time user interfaces can be used to enhance user experiences.

<table>
  <tr>
    <th>
        <a href="https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=182&sid=30184ea9-2e78-4efd-99ce-c04de60fcf6e">
        Trip Planning
        </a>
    </th>
    <th colspan="2">
        <a href="https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=243&sid=aa4fd1d2-5907-4195-a7df-b4ae55e893f4">
        Home Theater Setup
        </a>
    </th>
  </tr>
  <tr>
    <td>
    <strong>Task:</strong>
    <blockquote>"I want to plan a trip to lake tahoe for 2"</blockquote>
    <br/><br/>
    Alvea streamlines trip planning by combining interactive forms for inputting travel preferences with a visual map component, showcasing destinations and points of interest with markers for an intuitive planning experience.
    </td>
    <td colspan="2">
    <strong>Task:</strong>
    <blockquote>"I'm trying to plan my new home theater room, 5.1.2 dolby atmos. Where should I put my speakers?"</blockquote>
    <br/>
    For home theater enthusiasts, Alvea captures room specifications through a simple form and employs AI code generation to show a 3D visualization of the room, enabling users to virtually place speakers and optimize their audio setup with precision and ease.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=182&sid=30184ea9-2e78-4efd-99ce-c04de60fcf6e">
        <img width="2045" alt="image" src="https://github.com/Glavin001/Alvea-AI/assets/1885333/452271f0-2a52-403e-b5f4-6c27c9d678aa">
      </a>
    </td>
    <td>
        <a href="https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=243&sid=aa4fd1d2-5907-4195-a7df-b4ae55e893f4">
            <img width="384" alt="image" src="https://github.com/Glavin001/Alvea-AI/assets/1885333/6afcd6f9-8fd2-43e3-acff-3f0f9a43afa7">
        </a>
    </td>
    <td>
        <a href="https://www.loom.com/share/0d057eabb1bb430d8902bf7fdc1f3911?t=243&sid=aa4fd1d2-5907-4195-a7df-b4ae55e893f4">
            <img width="1449" alt="image" src="https://github.com/Glavin001/Alvea-AI/assets/1885333/6c76ce47-4ca6-4372-80ec-4a4581ff1b15">
        </a>
    </td>
  </tr>
</table>


## How to use

To run the example locally you need to:

1. Sign up at [OpenAI's Developer Platform](https://platform.openai.com/signup).
2. Go to [OpenAI's dashboard](https://platform.openai.com/account/api-keys) and create an API KEY.
3. Set the required OpenAI environment variable as the token value as shown [the example env file](./.env.local.example) but in a new file called `.env.local`
4. `pnpm install` to install the required dependencies.
5. `pnpm dev` to launch the development server.

## Built with

- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js](https://nextjs.org/)
- [OpenAI](https://openai.com)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React JSON Schema Form](https://github.com/rjsf-team/react-jsonschema-form)
- [Leaflet](https://leafletjs.com/)

## Learn More

To learn more about OpenAI, Next.js, and the Vercel AI SDK take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [OpenAI Documentation](https://platform.openai.com/docs) - learn about OpenAI features and API.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
