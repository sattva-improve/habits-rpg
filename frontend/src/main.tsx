import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
import App from "./App";
import "./styles/tailwind.css";
import outputs from "../../amplify_outputs.json";

// Amplifyの設定
Amplify.configure(outputs);

createRoot(document.getElementById("root")!).render(<App />);
